import { FC } from "react";

interface SoundcloudIntegrationProps {
  url: {
    artist: string;
    track: string;
  };
}

const SoundcloudIntegration: FC<SoundcloudIntegrationProps> = ({ url }) => {
  const soundcloudEmbedUrl = `https://w.soundcloud.com/player/?url=https://soundcloud.com/${url.artist}/${url.track}`;
  return (
    <iframe
      width="100%"
      height="166"
      scrolling="no"
      frameBorder="no"
      allow="autoplay"
      src={soundcloudEmbedUrl}
      style={{ borderRadius: "12px" }}
    />
  );
};

export default SoundcloudIntegration;
