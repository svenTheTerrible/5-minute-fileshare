package main

import (
	"encoding/json"
	"log"
	"net/http"
	"regexp"
	"strings"
	"sync"

	"github.com/gorilla/websocket"
)

// uuid4Regex matches UUID version 4 strings (lowercase).
var uuid4Regex = regexp.MustCompile(`^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$`)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

// ── Message types ─────────────────────────────────────────────────────────────

type Msg struct {
	Type    string `json:"type"`
	Role    string `json:"role,omitempty"`
	Message string `json:"message,omitempty"`
}

func marshal(m Msg) []byte {
	b, _ := json.Marshal(m)
	return b
}

// ── Client ────────────────────────────────────────────────────────────────────

type Client struct {
	conn   *websocket.Conn
	send   chan []byte
	mu     sync.Mutex
	closed bool
}

func newClient(conn *websocket.Conn) *Client {
	return &Client{conn: conn, send: make(chan []byte, 32)}
}

// trySend enqueues a message, dropping it if the channel is closed or full.
func (c *Client) trySend(msg []byte) {
	c.mu.Lock()
	defer c.mu.Unlock()
	if c.closed {
		return
	}
	select {
	case c.send <- msg:
	default:
		log.Println("warn: send buffer full, dropping message")
	}
}

func (c *Client) close() {
	c.mu.Lock()
	defer c.mu.Unlock()
	if !c.closed {
		c.closed = true
		close(c.send)
	}
}

// ── Session ───────────────────────────────────────────────────────────────────

// A session holds exactly two peer slots. The first peer to join is slot 0
// (becomes initiator), the second is slot 1 (becomes responder).
type Session struct {
	mu    sync.Mutex
	peers [2]*Client
}

// join adds c to the first empty slot. Returns the slot index, or -1 if full.
func (s *Session) join(c *Client) int {
	s.mu.Lock()
	defer s.mu.Unlock()
	for i, p := range s.peers {
		if p == nil {
			s.peers[i] = c
			return i
		}
	}
	return -1
}

// peer returns the other client in the session (may be nil).
func (s *Session) peer(slot int) *Client {
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.peers[1-slot]
}

// leave removes the client at slot and returns (otherPeer, sessionIsNowEmpty).
func (s *Session) leave(slot int) (*Client, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.peers[slot] = nil
	other := s.peers[1-slot]
	return other, other == nil
}

// ── Session registry ──────────────────────────────────────────────────────────

var (
	sessions   = make(map[string]*Session)
	sessionsMu sync.Mutex
)

func mapNewSession(id string) *Session {
	sessionsMu.Lock()
	defer sessionsMu.Unlock()
	if s, ok := sessions[id]; ok {
		return s
	}
	s := &Session{}
	sessions[id] = s
	return s
}

// pruneSession removes the session only if it still points to s (guards against
// a race where a new session was created under the same id after s became empty).
func pruneSession(id string, s *Session) {
	sessionsMu.Lock()
	defer sessionsMu.Unlock()
	if sessions[id] == s {
		delete(sessions, id)
	}
}

// ── WebSocket handler ─────────────────────────────────────────────────────────

func wsHandler(w http.ResponseWriter, r *http.Request) {
	sessionID := strings.ToLower(r.URL.Query().Get("session"))
	if !uuid4Regex.MatchString(sessionID) {
		http.Error(w, "missing or invalid session UUID4", http.StatusBadRequest)
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("upgrade error: %v", err)
		return
	}
	log.Printf("connect    session=%s  addr=%s", sessionID, conn.RemoteAddr())

	c := newClient(conn)
	sess := mapNewSession(sessionID)
	slot := sess.join(c)

	if slot == -1 {
		_ = conn.WriteMessage(websocket.TextMessage, marshal(Msg{Type: "error", Message: "session is full"}))
		_ = conn.Close()
		return
	}

	// Writer goroutine: drain c.send into the WebSocket connection.
	go func() {
		for msg := range c.send {
			if err := conn.WriteMessage(websocket.TextMessage, msg); err != nil {
				log.Printf("write error session=%s: %v", sessionID, err)
				break
			}
		}
		conn.Close()
	}()

	// Notify both peers when the session becomes full.
	// The peer that was already waiting (slot 0) becomes the initiator.
	if peer := sess.peer(slot); peer != nil {
		peer.trySend(marshal(Msg{Type: "ready", Role: "initiator"}))
		c.trySend(marshal(Msg{Type: "ready", Role: "responder"}))
	} else {
		c.trySend(marshal(Msg{Type: "waiting"}))
	}

	// Read loop: relay every message to the other peer as-is.
	for {
		_, data, err := conn.ReadMessage()
		if err != nil {
			break
		}
		if peer := sess.peer(slot); peer != nil {
			peer.trySend(data)
		}
	}

	log.Printf("disconnect session=%s  addr=%s", sessionID, conn.RemoteAddr())

	peer, empty := sess.leave(slot)
	c.close()
	if peer != nil {
		peer.trySend(marshal(Msg{Type: "peer_left"}))
	}
	if empty {
		pruneSession(sessionID, sess)
	}
}

func main() {
	staticFs := http.FileServer(http.Dir("./static/"))
	http.HandleFunc("/ws", wsHandler)
	http.HandleFunc("/health", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
	})
	http.Handle("/", staticFs)

	addr := ":8080"
	log.Printf("signaling server listening on %s", addr)
	log.Fatal(http.ListenAndServe(addr, nil))
}
