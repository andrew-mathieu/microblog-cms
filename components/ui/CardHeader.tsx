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
      <div className={"author flex items-center gap-4"}>
        <img
          src="https://pbs.twimg.com/profile_images/1676765556815347712/c8rE28JU_x96.jpg"
          className={"h-10 w-10 rounded-full object-cover"}
        />
        <div className={"gap flex items-center text-sm"}>
          <span className={"font-semibold"}>Andrew</span>
          <div className={"ml-2 flex gap-2 text-stone-600"}>
            <span>@noonedrewandy</span>
            <span>·</span>
            <span title={formatDate(props.date)}>
              <TimeAgo datetime={props.date} locale="fr" />
            </span>
          </div>
        </div>
      </div>
      <div
        className="card-title flex h-auto overflow-hidden overflow-ellipsis whitespace-pre-line text-xl font-medium"
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
      ></div>
      {renderSpotifyIntegration(props.content as string)}
      {renderSoundcloudIntegration(props.content as string)}
    </div>
  );
};
export default CardHeader;
