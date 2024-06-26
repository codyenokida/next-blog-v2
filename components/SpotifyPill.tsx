"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { convertToEmbedUrl } from "@/utils/helper";

import styles from "./SpotifyPill.module.css";

interface SpotifyPillProps {
  spotifyEmbedLink: string;
}

export default function SpotifyPill({ spotifyEmbedLink }: SpotifyPillProps) {
  const spotifyEmbedRef = useRef(null);
  const [spotifyEmbedLoading, setSpotifyEmbedLoading] = useState<boolean>(true);

  const handleSpotifyOnLoadStart = useCallback(() => {
    setSpotifyEmbedLoading(true);
  }, []);

  const handleSpotifyOnLoad = useCallback(() => {
    setSpotifyEmbedLoading(false);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (spotifyEmbedLoading) setSpotifyEmbedLoading(false);
    }, 750);
  }, [spotifyEmbedLoading]);

  if (!spotifyEmbedLink) {
    return (
      <div className={styles.div}>
        <div className={styles.spotify} ref={spotifyEmbedRef}></div>
      </div>
    );
  }

  return (
    <div className={styles.div}>
      {spotifyEmbedLoading && <div className={styles.skeleton} />}
      <div className={styles.spotify} ref={spotifyEmbedRef}>
        <iframe
          className={styles.iframe}
          src={convertToEmbedUrl(spotifyEmbedLink)}
          width="100%"
          height="80px"
          loading="lazy"
          onLoadStart={handleSpotifyOnLoadStart}
          onLoad={handleSpotifyOnLoad}
          allow="encrypted-media"
        />
      </div>
    </div>
  );
}
