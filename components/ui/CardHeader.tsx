import { marked } from "marked";
import Button from "./Button";
import SpotifyIntegration from "../SpotifyIntegration";
import SoundcloudIntegration from "../SoundcloudIntegration";
import TimeAgo from "timeago-react";
import * as timeago from "timeago.js";
import fr from "timeago.js/lib/lang/fr";
timeago.register("fr", fr);
interface CardHeaderProps {
  content?: string | TrustedHTML;
  date: string;
}

const CardHeader = (props: CardHeaderProps) => {
  const renderer = new marked.Renderer();

  const renderSpotifyIntegration = (content: string) => {
    const spotifyUrlRegex =
      /https?:\/\/open\.spotify\.com\/(?:intl-[a-z]{2}\/)?([^\/?]+)\/([^\/?]+)(?:\?si=[^\s&]+)?/;
    const spotifyUrlMatches = content.match(spotifyUrlRegex);

    if (spotifyUrlMatches && spotifyUrlMatches.length > 1) {
      const spotifyType = spotifyUrlMatches[1];
      const spotifyTrackId = spotifyUrlMatches[2];
      const spotifyEmbedUrl =
        spotifyType === "album"
          ? `https://open.spotify.com/embed/album/${spotifyTrackId}`
          : `https://open.spotify.com/embed/track/${spotifyTrackId}`;
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

  const html = marked(props.content as string);

  const formatDate = (date: string | number) => {
    const dateObject = new Date(date).toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
    return dateObject;
  };

  return (
    <div className={"card-header flex flex-col gap-4"}>
      <div
        className="card-title leading flex h-auto overflow-hidden overflow-ellipsis whitespace-pre-line text-3xl font-medium"
        dangerouslySetInnerHTML={{
          __html: html
            .replace(
              /https?:\/\/open\.spotify\.com\/(?:intl-[a-z]{2}\/)?([^\/?]+)\/([^\/?]+)(?:\?si=[^\s&]+)?/g,
              "",
            )
            .replace(
              /https?:\/\/soundcloud\.com\/([^\/?]+)\/([^\/?]+)(?:\/([^\/?]+))?/g,
              "",
            ),
        }}
      ></div>
      {renderSpotifyIntegration(props.content as string)}
      {renderSoundcloudIntegration(props.content as string)}
    </div>
  );
};
export default CardHeader;
