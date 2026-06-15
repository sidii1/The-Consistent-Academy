import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mic2,
  Link2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Send,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { submitCCSpeech, SPEECH_FRAMEWORK, type CCSpeech } from "@/lib/ccClub";
import { toast } from "sonner";

interface CCSpeechTrackerProps {
  uid: string;
  currentLevel: 1 | 2 | 3 | 4;
  speeches: CCSpeech[];
  onSpeechSubmitted: () => void;
}

const STATUS_CONFIG = {
  "Not Started": {
    label: "Not Started",
    chip: "cc-chip-idle",
    icon: <AlertCircle size={11} />,
    color: "var(--cc-text-faint)",
  },
  "Pending Review": {
    label: "Pending Review",
    chip: "cc-chip-pending",
    icon: <Clock size={11} />,
    color: "var(--cc-pending)",
  },
  "Well Done": {
    label: "Well Done",
    chip: "cc-chip-done",
    icon: <CheckCircle2 size={11} />,
    color: "var(--cc-success)",
  },
  Redo: {
    label: "Redo",
    chip: "cc-chip-redo",
    icon: <XCircle size={11} />,
    color: "var(--cc-danger)",
  },
};

interface SpeechCardProps {
  speech: CCSpeech;
  uid: string;
  isActive: boolean;
  onSubmitted: () => void;
}

const SpeechCard: React.FC<SpeechCardProps> = ({ speech, uid, isActive, onSubmitted }) => {
  const [expanded, setExpanded] = useState(false);
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const meta = SPEECH_FRAMEWORK[speech.level][speech.speech_number - 1];
  const statusCfg = STATUS_CONFIG[speech.status];
  const canSubmit = isActive && (speech.status === "Not Started" || speech.status === "Redo");

  const handleSubmit = async () => {
    if (!url.trim()) {
      toast.error("Please paste a valid recording link.");
      return;
    }
    try {
      new URL(url);
    } catch {
      toast.error("Please enter a valid URL (YouTube, Drive, Loom, etc.)");
      return;
    }
    setSubmitting(true);
    try {
      await submitCCSpeech(uid, speech.speech_id, url.trim());
      toast.success("Speech submitted for review! 🎉");
      setUrl("");
      setExpanded(false);
      onSubmitted();
    } catch {
      toast.error("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      layout
      style={{
        borderRadius: "16px",
        background: "var(--cc-surface-inset)",
        boxShadow: "var(--cc-neu-inset-xs)",
        overflow: "hidden",
      }}
    >
      {/* Card header */}
      <button
        type="button"
        onClick={() => canSubmit || speech.status === "Pending Review" ? setExpanded((p) => !p) : undefined}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          cursor: canSubmit ? "pointer" : "default",
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          textAlign: "left",
        }}
      >
        {/* Number badge */}
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "var(--cc-surface-deep)",
            boxShadow: "var(--cc-neu-inset-sm)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontSize: "0.82rem",
            fontWeight: 800,
            color: statusCfg.color,
          }}
        >
          {speech.status === "Well Done" ? (
            <CheckCircle2 size={18} color="var(--cc-success)" />
          ) : (
            `S${speech.speech_number}`
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: "0.88rem",
              fontWeight: 700,
              color:
                speech.status === "Well Done"
                  ? "var(--cc-success)"
                  : "var(--cc-text)",
              marginBottom: "3px",
            }}
          >
            {meta.title}
          </div>
          <p
            style={{
              fontSize: "0.72rem",
              color: "var(--cc-text-muted)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {meta.objective}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
          <span className={`cc-chip ${statusCfg.chip}`}>
            {statusCfg.icon} {statusCfg.label}
          </span>
          {canSubmit && (
            expanded ? <ChevronUp size={15} color="var(--cc-text-faint)" /> : <ChevronDown size={15} color="var(--cc-text-faint)" />
          )}
        </div>
      </button>

      {/* Expand: submission area or evaluator note */}
      <motion.div
        initial={false}
        animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        style={{ overflow: "hidden" }}
      >
        <div
          style={{
            padding: "0 16px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <hr className="cc-divider" style={{ margin: "0 0 6px" }} />

          {/* Example topics */}
          <div>
            <p style={{ fontSize: "0.72rem", color: "var(--cc-text-faint)", marginBottom: "6px", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              Example Topics
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {meta.examples.map((ex) => (
                <span
                  key={ex}
                  style={{
                    fontSize: "0.72rem",
                    padding: "4px 10px",
                    borderRadius: "999px",
                    background: "var(--cc-surface-deep)",
                    boxShadow: "var(--cc-neu-inset-xs)",
                    color: "var(--cc-accent-bright)",
                  }}
                >
                  "{ex}"
                </span>
              ))}
            </div>
          </div>

          {/* Evaluator note if Redo */}
          {speech.status === "Redo" && speech.evaluator_notes && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                background: "var(--cc-surface-deep)",
                boxShadow: "var(--cc-neu-inset-xs)",
              }}
            >
              <p style={{ fontSize: "0.72rem", color: "var(--cc-danger)", fontWeight: 600, marginBottom: "4px" }}>
                Evaluator Feedback:
              </p>
              <p style={{ fontSize: "0.78rem", color: "var(--cc-text-muted)" }}>{speech.evaluator_notes}</p>
            </div>
          )}

          {speech.status === "Pending Review" && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--cc-pending)", fontSize: "0.78rem" }}>
              <Clock size={14} />
              Your submission is under review by the TCA team.
            </div>
          )}

          {/* Link submission (Not Started or Redo) */}
          {canSubmit && (
            <div style={{ display: "flex", gap: "8px" }}>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  background: "var(--cc-surface-deep)",
                  boxShadow: "var(--cc-neu-inset-sm)",
                }}
              >
                <Link2 size={14} color="var(--cc-text-faint)" />
                <input
                  type="url"
                  placeholder="Paste YouTube / Drive / Loom link"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  style={{
                    flex: 1,
                    background: "none",
                    border: "none",
                    outline: "none",
                    color: "var(--cc-text)",
                    fontSize: "0.82rem",
                    fontFamily: "inherit",
                  }}
                />
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="cc-btn-primary"
                style={{
                  padding: "10px 16px",
                  borderRadius: "10px",
                  fontSize: "0.82rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  whiteSpace: "nowrap",
                }}
              >
                <Send size={13} />
                {submitting ? "..." : "Submit"}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const CCSpeechTracker: React.FC<CCSpeechTrackerProps> = ({
  uid,
  currentLevel,
  speeches,
  onSpeechSubmitted,
}) => {
  const levelSpeeches = speeches.filter((s) => s.level === currentLevel);
  const doneCount = levelSpeeches.filter((s) => s.status === "Well Done").length;

  return (
    <div
      style={{
        borderRadius: "20px",
        padding: "1.75rem",
        background: "var(--cc-bg)",
        boxShadow: "var(--cc-neu-md)",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              color: "var(--cc-text)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Mic2 size={16} color="var(--cc-accent-bright)" />
            Level {currentLevel} Speeches
          </h3>
          <span
            className="cc-chip"
            style={{
              background: "var(--cc-surface-inset)",
              color: doneCount === 4 ? "var(--cc-success)" : "var(--cc-accent-bright)",
            }}
          >
            {doneCount} / 4 Completed
          </span>
        </div>
        <p style={{ fontSize: "0.75rem", color: "var(--cc-text-muted)", marginTop: "4px" }}>
          Record a 2-minute speech and paste your link below each topic.
        </p>
      </div>

      {/* Progress bar */}
      <div
        className="cc-inset-sm"
        style={{ borderRadius: "999px", height: "6px", marginBottom: "1.25rem" }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: "999px",
            width: `${(doneCount / 4) * 100}%`,
            background: "var(--cc-grad-accent)",
            transition: "width 600ms cubic-bezier(0.4,0,0.2,1)",
            boxShadow: "var(--cc-glow-purple-sm)",
          }}
        />
      </div>

      {/* Speech cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {levelSpeeches.map((speech) => (
          <SpeechCard
            key={speech.speech_id}
            speech={speech}
            uid={uid}
            isActive={speech.level === currentLevel}
            onSubmitted={onSpeechSubmitted}
          />
        ))}
      </div>
    </div>
  );
};

export default CCSpeechTracker;
