import type { FC } from "react";
import type { UseWebRTCFileShare } from "../../hooks/useWebRTCFileShare";
import { PixelNav } from "../../stories/PixelNav";
import { PixelButton } from "../../stories/PixelButton";

interface HeaderBarProps {
  fileshare: UseWebRTCFileShare;
}

export const HeaderBar: FC<HeaderBarProps> = ({ fileshare }) => {
  return (
    <PixelNav
      brand="RTC Fileshare"
      left={
        <PixelButton
          variant="secondary"
          size="sm"
          loading
          style={{ cursor: "auto" }}
        >
          CONNECTED
        </PixelButton>
      }
      right={
        <PixelButton
          variant="danger"
          size="sm"
          onClick={() => fileshare.reset()}
        >
          END
        </PixelButton>
      }
    ></PixelNav>
  );
};
