import { marked } from "marked";
import Button from "./Button";
import SpotifyIntegration from "../SpotifyIntegration";
import SoundcloudIntegration from "../SoundcloudIntegration";

interface CardHeaderProps {
  content: string | TrustedHTML;
}

const CardHeader = (props: CardHeaderProps) => {
  const renderer = new marked.Renderer();

  const renderSpotifyIntegration = (content: string) => {
    const spotifyUrlRegex =
      /https?:\/\/open\.spotify\.com\/(?:intl-[a-z]{2}\/)?track\/([^\/?]+)(?:\?si=[^\s&]+)?/;
    const spotifyUrlMatches = content.match(spotifyUrlRegex);

    if (spotifyUrlMatches && spotifyUrlMatches.length > 1) {
      const spotifyTrackId = spotifyUrlMatches[1];
      const spotifyEmbedUrl = `https://open.spotify.com/embed/track/${spotifyTrackId}`;
      return <SpotifyIntegration url={spotifyEmbedUrl} />;
    }

    return null;
  };

  const renderSoundcloudIntegration = (content: string) => {
    const soundcloudUrlRegex =
      /https?:\/\/soundcloud\.com\/([^\/?]+)\/([^\/?]+)(?:\/([^\/?]+))?/;
    const soundcloudUrlMatches = content.match(soundcloudUrlRegex);

    if (soundcloudUrlMatches) {
      console.log(soundcloudUrlMatches);
      const soundcloudTrackId = soundcloudUrlMatches[1];
      const soundcloudEmbedUrl = `https://w.soundcloud.com/player/?url=${soundcloudTrackId}`;
      return (
        <SoundcloudIntegration
          url={{
            artist: soundcloudUrlMatches[1],
            track: soundcloudUrlMatches[2],
          }}
        />
      );
    }

    return null;
  };

  const html = marked(props.content as string, { renderer });

  return (
    <div className={"card-header flex flex-col gap-4"}>
      <div
        className={
          "card-title overflow-hidden overflow-ellipsis whitespace-pre-wrap text-2xl font-semibold"
        }
      >
        <div
          dangerouslySetInnerHTML={{
            __html: html
              .replace(
                /https?:\/\/open\.spotify\.com\/(?:intl-[a-z]{2}\/)?track\/([^\/?]+)(?:\?si=[^\s&]+)?/g,
                "",
              )
              .replace(
                /https?:\/\/soundcloud\.com\/([^\/?]+)\/([^\/?]+)(?:\/([^\/?]+))?/g,
                "",
              ),
          }}
        />
        {renderSpotifyIntegration(props.content as string)}
        {renderSoundcloudIntegration(props.content as string)}
      </div>
    </div>
  );
};
export default CardHeader;
