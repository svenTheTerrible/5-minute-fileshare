
#build JS
FROM node:25 as frontend-builder
WORKDIR /build
COPY . .
RUN cd /build/frontend && npm install && npm run build
RUN cd /build/frontend && cp -r dist/* /build/backend/static/

#golang server build
FROM golang:1.26.2-alpine3.23 as server-builder
WORKDIR /build
COPY --from=frontend-builder /build/backend .
RUN go get -d -v ./... && go install -v ./...
RUN go build main.go

#golang server productive build
FROM alpine:3.23.3
WORKDIR /server
COPY --from=server-builder /build .
CMD ["./main"]