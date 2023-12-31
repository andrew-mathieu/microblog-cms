import { FC } from "react";
interface SpotifyIntegrationProps {
  url: string;
}

const SpotifyIntegration: FC<SpotifyIntegrationProps> = ({ url }) => {
  const urlType = url.split("/")[4];
  const trackId = url.split("/").pop();
  const spotifyEmbedUrl =
    urlType === "album"
      ? `https://open.spotify.com/embed/album/${trackId}`
      : `https://open.spotify.com/embed/track/${trackId}`;
  return (
    <iframe
      style={{ borderRadius: "12px" }}
      src={spotifyEmbedUrl}
      height="152"
      width={"100%"}
      frameBorder="0"
      allowFullScreen
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    />
  );
};

export default SpotifyIntegration;
