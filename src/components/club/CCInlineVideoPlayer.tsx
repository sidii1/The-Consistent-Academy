import React, { useEffect, useMemo, useState } from "react";
import ReactPlayer from "react-player";
import { Maximize2, Minimize2 } from "lucide-react";

interface CCInlineVideoPlayerProps {
  url: string;
}

type PlayerSource =
  | { kind: "iframe"; src: string }
  | { kind: "native"; src: string }
  | { kind: "react"; src: string };

const directVideoPattern = /\.(mp4|webm|ogg|ogv|mov|m4v)(\?.*)?$/i;

const getGoogleDriveFileId = (parsedUrl: URL) => {
  const filePathMatch = parsedUrl.pathname.match(/\/file\/d\/([^/]+)/);
  if (filePathMatch?.[1]) return filePathMatch[1];

  const id = parsedUrl.searchParams.get("id");
  return id || "";
};

const getLoomVideoId = (parsedUrl: URL) => {
  const shareMatch = parsedUrl.pathname.match(/\/share\/([^/?]+)/);
  const embedMatch = parsedUrl.pathname.match(/\/embed\/([^/?]+)/);
  return shareMatch?.[1] || embedMatch?.[1] || "";
};

const getPlayerSource = (rawUrl: string): PlayerSource => {
  const trimmedUrl = rawUrl.trim();

  try {
    const parsedUrl = new URL(trimmedUrl);
    const host = parsedUrl.hostname.replace(/^www\./, "");

    if (host === "drive.google.com") {
      const fileId = getGoogleDriveFileId(parsedUrl);
      if (fileId) {
        return {
          kind: "iframe",
          src: `https://drive.google.com/file/d/${fileId}/preview`,
        };
      }
    }

    if (host === "loom.com") {
      const videoId = getLoomVideoId(parsedUrl);
      if (videoId) {
        return {
          kind: "iframe",
          src: `https://www.loom.com/embed/${videoId}`,
        };
      }
    }

    if (directVideoPattern.test(parsedUrl.pathname) || host.endsWith("res.cloudinary.com")) {
      return { kind: "native", src: trimmedUrl };
    }
  } catch {
    return { kind: "react", src: trimmedUrl };
  }

  return { kind: "react", src: trimmedUrl };
};

const CCInlineVideoPlayer: React.FC<CCInlineVideoPlayerProps> = ({ url }) => {
  const [expanded, setExpanded] = useState(false);
  const [hasPlaybackError, setHasPlaybackError] = useState(false);
  const playerSource = useMemo(() => getPlayerSource(url), [url]);

  useEffect(() => {
    setHasPlaybackError(false);
  }, [url]);

  const width = expanded ? "100%" : "240px";
  const height = expanded ? "320px" : "135px";
  const maxWidth = expanded ? "600px" : "240px";

  const mediaStyle: React.CSSProperties = {
    display: "block",
    width: "100%",
    height: "100%",
    border: "none",
    background: "#000",
    objectFit: "contain",
  };

  return (
    <div
      style={{
        position: "relative",
        width,
        maxWidth,
        height,
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "var(--cc-neu-sm)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        marginBottom: "8px",
        marginTop: "4px",
        background: "#000",
      }}
    >
      {hasPlaybackError ? (
        <div
          style={{
            ...mediaStyle,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "12px",
            textAlign: "center",
            color: "white",
            fontSize: "0.72rem",
          }}
        >
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            style={{ color: "white", textDecoration: "underline" }}
          >
            Open video link
          </a>
        </div>
      ) : playerSource.kind === "iframe" ? (
        <iframe
          src={playerSource.src}
          title="Club video"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          style={mediaStyle}
          onError={() => setHasPlaybackError(true)}
        />
      ) : playerSource.kind === "native" ? (
        <video
          src={playerSource.src}
          controls
          playsInline
          preload="metadata"
          style={mediaStyle}
          onError={() => setHasPlaybackError(true)}
        />
      ) : (
        <ReactPlayer
          src={playerSource.src}
          width="100%"
          height="100%"
          controls
          playsInline
          onError={() => setHasPlaybackError(true)}
        />
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setExpanded(!expanded);
        }}
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          background: "rgba(0,0,0,0.6)",
          border: "none",
          borderRadius: "4px",
          color: "white",
          padding: "6px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          backdropFilter: "blur(4px)",
        }}
        title={expanded ? "Shrink Player" : "Expand Player"}
      >
        {expanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
      </button>
    </div>
  );
};

export default CCInlineVideoPlayer;
