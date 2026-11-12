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
  Lock,
  Loader2,
} from "lucide-react";
import {
  submitCCSpeech,
  isValidVideoUrl,
  getEffectiveWorkflowState,
  getSpeechDisplayStatus,
  SPEECH_FRAMEWORK,
  LEVEL_NAMES,
  type CCSpeech,
  type SpeechStatus,
} from "@/lib/ccClub";
import { toast } from "sonner";
import { LITE_MOTION } from "@/lib/device";

interface CCSpeechTrackerProps {
  uid: string;
  currentLevel: 1 | 2 | 3 | 4;
  speeches: CCSpeech[];
  onSpeechSubmitted: () => void;
}

const STATUS_CONFIG: Record<
  SpeechStatus,
  { label: string; chip: string; icon: React.ReactNode; color: string }
> = {
  "Not Started": {
    label: "Not Started",
    chip: "cc-chip-idle",
    icon: <AlertCircle size={11} />,
    color: "var(--cc-text-faint)",
  },
  "Pending Review": {
    label: "In Review",
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
  editable: boolean;
  onSubmitted: () => void;
}

const SpeechCard: React.FC<SpeechCardProps> = ({ speech, uid, editable, onSubmitted }) => {
  const status = getSpeechDisplayStatus(speech);
  const workflow = getEffectiveWorkflowState(speech);
  // Cards that need the student's attention open by default.
  const [expanded, setExpanded] = useState(editable && status === "Redo");
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const meta = SPEECH_FRAMEWORK[speech.level][speech.speech_number - 1];
  const statusCfg = STATUS_CONFIG[status];
  const canSubmit = editable && (status === "Not Started" || status === "Redo");
  const feedback = speech.trainerRemarks || speech.evaluator_notes;

  const handleSubmit = async () => {
    if (!url.trim()) {
      toast.error("Please paste a recording link.");
      return;
    }
    if (!isValidVideoUrl(url)) {
      toast.error("Enter a valid link starting with https:// (YouTube, Drive, Loom…)");
      return;
    }
    setSubmitting(true);
    try {
      await submitCCSpeech(uid, speech.speech_id, url.trim());
      toast.success(status === "Redo" ? "Speech resubmitted for review! 🎉" : "Speech submitted for review! 🎉");
      setUrl("");
      setExpanded(false);
      onSubmitted();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div layout={!LITE_MOTION} className="cc-well" style={{ padding: 0, borderRadius: "16px", overflow: "hidden" }}>
      <button
        type="button"
        onClick={() => setExpanded((p) => !p)}
        aria-expanded={expanded}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          boxShadow: "none",
          cursor: "pointer",
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          textAlign: "left",
          fontFamily: "inherit",
        }}
      >
        <div
          className="cc-well-deep"
          style={{
            width: "36px",
            height: "36px",
            padding: 0,
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontSize: "0.82rem",
            fontWeight: 800,
            color: statusCfg.color,
          }}
        >
          {status === "Well Done" ? <CheckCircle2 size={18} color="var(--cc-success)" /> : `S${speech.speech_number}`}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: "0.88rem",
              fontWeight: 700,
              color: status === "Well Done" ? "var(--cc-success)" : "var(--cc-text)",
              marginBottom: "3px",
            }}
          >
            {meta.title}
            {(speech.version ?? 1) > 1 && (
              <span style={{ fontSize: "0.68rem", marginLeft: "8px", color: "var(--cc-text-faint)", fontWeight: 500 }}>
                v{speech.version}
              </span>
            )}
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
          {expanded ? (
            <ChevronUp size={15} color="var(--cc-text-faint)" />
          ) : (
            <ChevronDown size={15} color="var(--cc-text-faint)" />
          )}
        </div>
      </button>

      <motion.div
        initial={false}
        animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
        transition={{ duration: LITE_MOTION ? 0 : 0.25 }}
        style={{ overflow: "hidden" }}
      >
        <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <hr className="cc-divider" style={{ margin: "0 0 6px" }} />

          <div>
            <p className="cc-eyebrow" style={{ marginBottom: "6px" }}>Example Topics</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {meta.examples.map((ex) => (
                <span key={ex} className="cc-chip cc-chip-accent" style={{ textTransform: "none", letterSpacing: 0, fontSize: "0.72rem" }}>
                  “{ex}”
                </span>
              ))}
            </div>
          </div>

          {status === "Redo" && feedback && (
            <div className="cc-well-deep">
              <p style={{ fontSize: "0.72rem", color: "var(--cc-danger)", fontWeight: 700, marginBottom: "4px" }}>
                {speech.sentBackBy === "president" ? "President feedback" : "Trainer feedback"}
              </p>
              <p style={{ fontSize: "0.78rem", color: "var(--cc-text-muted)", lineHeight: 1.6 }}>{feedback}</p>
            </div>
          )}

          {status === "Well Done" && (
            <div className="cc-well-deep" style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {speech.studentPointsAwarded !== undefined && (
                <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--cc-success)" }}>
                  ⭐ {speech.studentPointsAwarded}/10 points earned
                </p>
              )}
              {feedback && <p style={{ fontSize: "0.78rem", color: "var(--cc-text-muted)", lineHeight: 1.6 }}>{feedback}</p>}
            </div>
          )}

          {status === "Pending Review" && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--cc-pending)", fontSize: "0.78rem" }}>
              <Clock size={14} />
              {workflow === "validated"
                ? "Validated by your President — waiting for the Trainer's evaluation."
                : "Waiting for your President to validate your recording."}
            </div>
          )}

          {speech.youtubeUrl && status !== "Not Started" && (
            <a
              href={isValidVideoUrl(speech.youtubeUrl) ? speech.youtubeUrl : undefined}
              target="_blank"
              rel="noreferrer noopener"
              style={{ fontSize: "0.75rem", color: "var(--cc-accent-bright)", textDecoration: "underline", width: "fit-content" }}
            >
              View my submitted recording
            </a>
          )}

          {canSubmit && (
            <div className="cc-input-row">
              <div className="cc-input-wrap">
                <Link2 size={14} color="var(--cc-text-faint)" />
                <input
                  className="cc-input"
                  type="url"
                  inputMode="url"
                  aria-label={`Recording link for ${meta.title}`}
                  placeholder={status === "Redo" ? "Paste your new recording link" : "Paste YouTube / Drive / Loom link"}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || !url.trim()}
                className="cc-btn-primary"
                style={{
                  padding: "10px 16px",
                  borderRadius: "12px",
                  fontSize: "0.82rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  whiteSpace: "nowrap",
                }}
              >
                {submitting ? <Loader2 size={13} className="cc-spin" /> : <Send size={13} />}
                {status === "Redo" ? "Resubmit" : "Submit"}
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
  const [viewLevel, setViewLevel] = useState<1 | 2 | 3 | 4>(currentLevel);
  const levelSpeeches = speeches.filter((s) => s.level === viewLevel);
  const doneCount = levelSpeeches.filter((s) => getSpeechDisplayStatus(s) === "Well Done").length;
  const isCurrent = viewLevel === currentLevel;

  return (
    <div className="cc-card">
      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
          <h3 className="cc-card-title">
            <Mic2 size={16} color="var(--cc-accent-bright)" />
            Level {viewLevel} · {LEVEL_NAMES[viewLevel]}
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
          {isCurrent
            ? "Record a 2-minute speech and paste your link below each topic. Finish all 4 to unlock the next level."
            : "You completed this level — here's your record."}
        </p>
      </div>

      {/* Level switcher: future levels are locked until the current one is complete */}
      <div role="tablist" aria-label="Speech levels" style={{ display: "flex", gap: "8px", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        {([1, 2, 3, 4] as const).map((lvl) => {
          const locked = lvl > currentLevel;
          const active = lvl === viewLevel;
          return (
            <button
              key={lvl}
              type="button"
              role="tab"
              aria-selected={active}
              disabled={locked}
              onClick={() => setViewLevel(lvl)}
              className="cc-btn-action"
              style={{
                padding: "7px 14px",
                borderRadius: "999px",
                color: active ? "var(--cc-accent-bright)" : "var(--cc-text-muted)",
                boxShadow: active ? "var(--cc-neu-inset-sm)" : undefined,
              }}
            >
              {locked && <Lock size={11} />} L{lvl}
            </button>
          );
        })}
      </div>

      <div className="cc-inset-sm" style={{ borderRadius: "999px", height: "8px", marginBottom: "1.25rem", overflow: "hidden" }}>
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

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {levelSpeeches.map((speech) => (
          <SpeechCard
            key={`${speech.speech_id}_${speech.version ?? 1}_${getSpeechDisplayStatus(speech)}`}
            speech={speech}
            uid={uid}
            editable={isCurrent}
            onSubmitted={onSpeechSubmitted}
          />
        ))}
      </div>
    </div>
  );
};

export default CCSpeechTracker;
