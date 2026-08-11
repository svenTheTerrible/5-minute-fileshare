import { Grid } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { PixelCard } from "../../stories/PixelCard";
import { PixelProgress } from "../../stories/PixelProgress";

export const HeroPageUploadCard: FC = () => {
  const [progress, setProgress] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setProgress((current) => {
        const result = current + Math.round(Math.random() * 5);
        return result > 100 ? 0 : result;
      });
      setSpeed(2 + Math.round(Math.random() * 10) / 10);
    }, 500);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <PixelCard interactive={false}>
      <Grid container>
        <Grid size={4}>CHANNEL</Grid>
        <Grid sx={{ textAlign: "right" }} size={8}>
          OPEN
        </Grid>
        <Grid size={4}>ROUTE</Grid>
        <Grid sx={{ textAlign: "right" }} size={8}>
          DIRECT / NO RELAY
        </Grid>
        <Grid size={4}>LATENCY</Grid>
        <Grid sx={{ textAlign: "right" }} size={8}>
          14 MS
        </Grid>
        <Grid size={4}>QUEUED</Grid>
        <Grid sx={{ textAlign: "right" }} size={8}>
          3 FILES - 412 MB
        </Grid>
      </Grid>
      <PixelProgress
        value={progress}
        footerLeft={`${speed} MB/s`}
        footerRight={`${progress} %`}
      />
    </PixelCard>
  );
};
