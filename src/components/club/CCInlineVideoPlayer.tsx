import React, { useState } from "react";
import ReactPlayer from "react-player";
import { Maximize2, Minimize2 } from "lucide-react";

interface CCInlineVideoPlayerProps {
  url: string;
}

const CCInlineVideoPlayer: React.FC<CCInlineVideoPlayerProps> = ({ url }) => {
  const [expanded, setExpanded] = useState(false);

  const width = expanded ? "100%" : "240px";
  const height = expanded ? "320px" : "135px";
  const maxWidth = expanded ? "600px" : "240px";

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
      {!expanded && (
        <div
          style={{ position: "absolute", inset: 0, zIndex: 5, cursor: "pointer" }}
          onClick={() => setExpanded(true)}
          title="Click to expand"
        />
      )}
      <ReactPlayer
        // @ts-ignore - React 18 types mismatch with react-player
        url={url}
        width="100%"
        height="100%"
        controls={true}
      />
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
