import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  getMeetingReports,
  getStudentMeetingVideos,
  getStudentAttendanceStats,
  submitMeetingVideo,
  getCCSpeeches,
  resubmitSpeech,
  updateCCUser,
  type CCUser,
  type CCMeetingReport,
  type CCMeetingVideoSubmission,
  type CCSpeech,
} from "@/lib/ccClub";
import { uploadToCloudinary } from "@/lib/utils";
import CCProgressTimeline from "./CCProgressTimeline";
import CCGamificationPanel from "./CCGamificationPanel";
import CCSpeechTracker from "./CCSpeechTracker";
import {
  Loader2,
  CalendarCheck,
  Video,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Link2,
  TrendingUp,
  Camera,
} from "lucide-react";
import { toast } from "sonner";

interface CCStudentDashboardProps {
  user: CCUser;
}

// ── Attendance Card ───────────────────────────────────────────
const AttendanceCard: React.FC<{
  present: number;
  total: number;
  percentage: number;
}> = ({ present, total, percentage }) => {
  const color =
    total === 0
      ? "var(--cc-text-faint)"
      : percentage >= 75
      ? "var(--cc-success)"
      : percentage >= 50
      ? "var(--cc-amber)"
      : "var(--cc-danger)";

  const label =
    total === 0
      ? "No meetings yet"
      : percentage >= 75
      ? "Great attendance! Keep it up 🎉"
      : percentage >= 50
      ? "Try to attend more meetings"
      : "⚠️ Attendance below 50% — at risk";

  return (
    <div
      style={{
        borderRadius: "20px",
        padding: "1.5rem 1.75rem",
        background: "var(--cc-bg)",
        boxShadow: "var(--cc-neu-md)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "14px",
            background: "var(--cc-surface-inset)",
            boxShadow: "var(--cc-neu-inset-sm)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CalendarCheck size={22} color={color} />
        </div>
        <div>
          <div
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              color: "var(--cc-text-faint)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "2px",
            }}
          >
            My Attendance
          </div>
          <div
            style={{
              fontSize: "1.4rem",
              fontWeight: 900,
              color,
              lineHeight: 1,
            }}
          >
            {percentage}%{" "}
            <span
              style={{
                fontSize: "0.78rem",
                fontWeight: 500,
                color: "var(--cc-text-muted)",
              }}
            >
              ({present}/{total} meetings)
            </span>
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--cc-text-muted)", marginTop: "4px" }}>
            {label}
          </div>
        </div>
      </div>

      {/* Mini progress bar */}
      <div style={{ minWidth: "120px", flex: "0 0 120px" }}>
        <div
          className="cc-inset-sm"
          style={{
            height: "8px",
            borderRadius: "999px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${percentage}%`,
              background: color,
              borderRadius: "999px",
              transition: "width 800ms cubic-bezier(0.4,0,0.2,1)",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "4px",
            fontSize: "0.65rem",
            color: "var(--cc-text-faint)",
          }}
        >
          <span>0%</span>
          <span style={{ color: "var(--cc-amber)" }}>50%</span>
          <span style={{ color: "var(--cc-success)" }}>75%</span>
        </div>
      </div>
    </div>
  );
};

// ── Notification Banner ───────────────────────────────────────
const NotificationBanner: React.FC<{
  type: "absent" | "redo" | "welldone" | "pending";
  message: string;
  sub?: string;
}> = ({ type, message, sub }) => {
  const config = {
    absent: {
      icon: <AlertTriangle size={16} />,
      color: "var(--cc-danger)",
    },
    redo: {
      icon: <XCircle size={16} />,
      color: "var(--cc-danger)",
    },
    welldone: {
      icon: <CheckCircle2 size={16} />,
      color: "var(--cc-success)",
    },
    pending: {
      icon: <Clock size={16} />,
      color: "var(--cc-amber)",
    },
  }[type];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        padding: "12px 14px",
        borderRadius: "12px",
        background: "var(--cc-surface-inset)",
        boxShadow: "var(--cc-neu-inset-xs)",
      }}
    >
      <span style={{ color: config.color, marginTop: "1px", flexShrink: 0 }}>
        {config.icon}
      </span>
      <div>
        <p style={{ fontSize: "0.82rem", fontWeight: 600, color: config.color }}>
          {message}
        </p>
        {sub && (
          <p style={{ fontSize: "0.74rem", color: "var(--cc-text-muted)", marginTop: "2px" }}>
            {sub}
          </p>
        )}
      </div>
    </div>
  );
};

// ── Meeting Video Panel ───────────────────────────────────────
const MeetingVideoPanel: React.FC<{
  user: CCUser;
  reports: CCMeetingReport[];
  videos: CCMeetingVideoSubmission[];
  onSubmitted: () => void;
}> = ({ user, reports, videos, onSubmitted }) => {
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});

  const videoMap = Object.fromEntries(videos.map((v) => [v.report_id, v]));

  const handleSubmit = async (report: CCMeetingReport) => {
    const url = urls[report.id!]?.trim();
    if (!url) return;
    try { new URL(url); } catch {
      return;
    }
    setSubmitting((p) => ({ ...p, [report.id!]: true }));
    try {
      await submitMeetingVideo(
        user.uid,
        user.name,
        report.id!,
        report.week_number,
        url
      );
      setUrls((p) => ({ ...p, [report.id!]: "" }));
      onSubmitted();
    } catch {
      // silent — parent handles error display
    } finally {
      setSubmitting((p) => ({ ...p, [report.id!]: false }));
    }
  };

  if (reports.length === 0) {
    return (
      <div
        style={{
          borderRadius: "20px",
          padding: "1.75rem",
          background: "var(--cc-bg)",
          boxShadow: "var(--cc-neu-md)",
          textAlign: "center",
          color: "var(--cc-text-faint)",
          fontSize: "0.82rem",
        }}
      >
        <Video size={28} style={{ margin: "0 auto 8px", opacity: 0.3 }} />
        No meetings uploaded by your president yet.
      </div>
    );
  }

  return (
    <div
      style={{
        borderRadius: "20px",
        padding: "1.75rem",
        background: "var(--cc-bg)",
        boxShadow: "var(--cc-neu-md)",
      }}
    >
      <h3
        style={{
          fontSize: "1rem",
          fontWeight: 700,
          color: "var(--cc-text)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "4px",
        }}
      >
        <Video size={16} color="var(--cc-accent-bright)" />
        Meeting Video Submissions
      </h3>
      <p style={{ fontSize: "0.75rem", color: "var(--cc-text-muted)", marginBottom: "1.25rem" }}>
        Submit your video recording for each meeting. Absent meetings are flagged automatically.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {reports.map((report) => {
          const submission = videoMap[report.id!];
          const wasPresent = report.attendance?.find((a) => a.uid === user.uid)?.present ?? false;

          const statusColor =
            !submission
              ? wasPresent
                ? "var(--cc-amber)"
                : "var(--cc-danger)"
              : submission.status === "Well Done"
              ? "var(--cc-success)"
              : submission.status === "Redo"
              ? "var(--cc-danger)"
              : "var(--cc-amber)";

          const statusLabel =
            !submission
              ? wasPresent
                ? "Video Pending"
                : "Absent — Submit Video"
              : submission.status;

          const statusIcon =
            submission?.status === "Well Done" ? (
              <CheckCircle2 size={13} />
            ) : submission?.status === "Redo" ? (
              <XCircle size={13} />
            ) : (
              <Clock size={13} />
            );

          return (
            <div
              key={report.id}
              style={{
                borderRadius: "14px",
                padding: "14px 16px",
                background: "var(--cc-surface-inset)",
                boxShadow: "var(--cc-neu-inset-xs)",
              }}
            >
              {/* Row header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "8px",
                  flexWrap: "wrap",
                  marginBottom: submission && submission.status !== "Redo" ? 0 : "10px",
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "var(--cc-text)",
                    }}
                  >
                    Week {report.week_number}
                  </span>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      color: "var(--cc-text-faint)",
                      marginLeft: "8px",
                    }}
                  >
                    {report.meeting_date?.seconds
                      ? new Date(report.meeting_date.seconds * 1000).toLocaleDateString(
                          "en-IN",
                          { day: "numeric", month: "short", year: "numeric" }
                        )
                      : ""}
                  </span>
                </div>
                <span
                  className="cc-chip"
                  style={{
                    color: statusColor,
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  {statusIcon} {statusLabel}
                </span>
              </div>

              {/* Redo feedback */}
              {submission?.status === "Redo" && submission.evaluator_notes && (
                <div
                  style={{
                    padding: "8px 12px",
                    borderRadius: "10px",
                    background: "var(--cc-surface-deep)",
                    boxShadow: "var(--cc-neu-inset-xs)",
                    marginBottom: "10px",
                  }}
                >
                  <p style={{ fontSize: "0.72rem", color: "var(--cc-danger)" }}>
                    <strong>Feedback:</strong> {submission.evaluator_notes}
                  </p>
                </div>
              )}

              {/* Well Done praise */}
              {submission?.status === "Well Done" && (
                <div
                  style={{
                    marginTop: "8px",
                    fontSize: "0.75rem",
                    color: "var(--cc-success)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <CheckCircle2 size={13} />
                  {submission.evaluator_notes
                    ? submission.evaluator_notes
                    : "Excellent work! Your video was approved."}
                </div>
              )}

              {/* Submit input — show if no submission or Redo */}
              {(!submission || submission.status === "Redo") && (
                <div style={{ display: "flex", gap: "8px" }}>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "9px 12px",
                      borderRadius: "10px",
                      background: "var(--cc-surface-deep)",
                      boxShadow: "var(--cc-neu-inset-sm)",
                    }}
                  >
                    <Link2 size={13} color="var(--cc-text-faint)" />
                    <input
                      type="url"
                      placeholder={
                        !wasPresent
                          ? "Submit video even if absent — paste link"
                          : "Paste YouTube / Drive / Loom link"
                      }
                      value={urls[report.id!] || ""}
                      onChange={(e) =>
                        setUrls((p) => ({ ...p, [report.id!]: e.target.value }))
                      }
                      style={{
                        flex: 1,
                        background: "none",
                        border: "none",
                        outline: "none",
                        color: "var(--cc-text)",
                        fontSize: "0.8rem",
                        fontFamily: "inherit",
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSubmit(report)}
                    disabled={submitting[report.id!] || !urls[report.id!]?.trim()}
                    className="cc-btn-primary"
                    style={{
                      padding: "9px 14px",
                      borderRadius: "10px",
                      fontSize: "0.8rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      whiteSpace: "nowrap",
                      opacity: !urls[report.id!]?.trim() ? 0.5 : 1,
                    }}
                  >
                    <Send size={12} />
                    {submitting[report.id!] ? "..." : "Submit"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Notifications Panel ───────────────────────────────────────
const buildNotifications = (
  reports: CCMeetingReport[],
  videos: CCMeetingVideoSubmission[],
  uid: string
) => {
  const notifications: Array<{
    type: "absent" | "redo" | "welldone" | "pending";
    message: string;
    sub?: string;
  }> = [];

  const videoMap = Object.fromEntries(videos.map((v) => [v.report_id, v]));

  reports.forEach((r) => {
    const wasPresent = r.attendance?.find((a) => a.uid === uid)?.present ?? false;
    const video = videoMap[r.id!];

    if (!wasPresent && !video) {
      notifications.push({
        type: "absent",
        message: `You were absent in Week ${r.week_number} — please submit your video.`,
        sub: "Submitting a video even when absent shows commitment.",
      });
    }
    if (video?.status === "Redo") {
      notifications.push({
        type: "redo",
        message: `Week ${r.week_number} video needs to be redone.`,
        sub: video.evaluator_notes || "Check the feedback and resubmit.",
      });
    }
    if (video?.status === "Well Done") {
      notifications.push({
        type: "welldone",
        message: `Week ${r.week_number} video approved! 🎉`,
        sub: video.evaluator_notes || "Excellent work — keep it up!",
      });
    }
    if (video?.status === "Pending Review") {
      notifications.push({
        type: "pending",
        message: `Week ${r.week_number} video is under review.`,
        sub: "Your president will evaluate it soon.",
      });
    }
  });

  return notifications;
};

// ── Main Dashboard ────────────────────────────────────────────
const CCStudentDashboard: React.FC<CCStudentDashboardProps> = ({ user }) => {
  const [reports, setReports] = useState<CCMeetingReport[]>([]);
  const [videos, setVideos] = useState<CCMeetingVideoSubmission[]>([]);
  const [attendance, setAttendance] = useState({ present: 0, total: 0, percentage: 0 });
  const [loading, setLoading] = useState(true);
  const [speeches, setSpeeches] = useState<CCSpeech[]>([]);
  const [profilePic, setProfilePic] = useState(user.profilePictureUrl || "");
  const [uploadingPfp, setUploadingPfp] = useState(false);
  const pfpInputRef = useRef<HTMLInputElement>(null);
  const [redoUrls, setRedoUrls] = useState<Record<string, string>>({});
  const [resubmitting, setResubmitting] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [reportData, videoData, attStats, speechData] = await Promise.all([
        getMeetingReports(user.college),
        getStudentMeetingVideos(user.uid),
        getStudentAttendanceStats(user.uid, user.college),
        getCCSpeeches(user.uid),
      ]);
      setReports(reportData);
      setVideos(videoData);
      setAttendance(attStats);
      setSpeeches(speechData);
    } finally {
      setLoading(false);
    }
  }, [user.uid, user.college]);

  // Handle avatar upload
  const handlePfpUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPfp(true);
    try {
      const url = await uploadToCloudinary(file, "cc_pfp");
      await updateCCUser(user.uid, { profilePictureUrl: url });
      setProfilePic(url);
      toast.success("Profile picture updated!");
    } catch {
      toast.error("Failed to upload profile picture.");
    } finally {
      setUploadingPfp(false);
    }
  };

  // Handle speech redo resubmission
  const handleResubmit = async (speech: CCSpeech) => {
    const url = redoUrls[speech.speech_id]?.trim();
    if (!url) return toast.error("Please paste a YouTube URL.");
    try { new URL(url); } catch { return toast.error("Invalid URL."); }
    setResubmitting(speech.speech_id);
    try {
      await resubmitSpeech(user.uid, speech.speech_id, url, speech.version || 1);
      toast.success("Speech resubmitted for review!");
      setRedoUrls((p) => ({ ...p, [speech.speech_id]: "" }));
      loadAll();
    } catch {
      toast.error("Resubmission failed.");
    } finally {
      setResubmitting(null);
    }
  };

  useEffect(() => { loadAll(); }, [loadAll]);

  const notifications = buildNotifications(reports, videos, user.uid);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          gap: "12px",
          color: "var(--cc-text-muted)",
        }}
      >
        <Loader2 size={22} style={{ animation: "spin 1s linear infinite" }} />
        Loading your dashboard...
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "2rem 160px 2rem 1.5rem",
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "1.5rem",
        position: "relative",
      }}
    >
      {/* Colorful Ambient Orbs behind content */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: -1, borderRadius: "30px" }}>
        <div className="cc-animate-shimmer" style={{ position: "absolute", top: "5%", left: "0%", width: "45vw", height: "45vw", background: "radial-gradient(circle, rgba(139,127,255,0.08) 0%, transparent 65%)", filter: "blur(60px)" }} />
        <div className="cc-animate-shimmer" style={{ position: "absolute", top: "35%", right: "0%", width: "40vw", height: "40vw", background: "radial-gradient(circle, rgba(255,185,85,0.06) 0%, transparent 65%)", filter: "blur(60px)", animationDelay: "2s" }} />
        <div className="cc-animate-shimmer" style={{ position: "absolute", bottom: "10%", left: "15%", width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(74,222,128,0.05) 0%, transparent 65%)", filter: "blur(60px)", animationDelay: "4s" }} />
      </div>
      {/* Welcome banner */}
      <div
        style={{
          borderRadius: "20px",
          padding: "1.5rem 1.75rem",
          background: "var(--cc-bg)",
          boxShadow: "var(--cc-neu-lg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Avatar with upload */}
          <div
            onClick={() => pfpInputRef.current?.click()}
            title="Click to change profile picture"
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              background: profilePic ? `url(${profilePic}) center/cover` : "var(--cc-surface-inset)",
              boxShadow: "var(--cc-neu-sm)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
              overflow: "hidden",
              position: "relative",
              transition: "box-shadow 200ms",
            }}
          >
            {!profilePic && (
              <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--cc-accent-bright)" }}>
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}
            {uploadingPfp && (
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Loader2 size={16} color="#fff" style={{ animation: "spin 1s linear infinite" }} />
              </div>
            )}
            <div style={{ position: "absolute", bottom: 0, right: 0, width: "18px", height: "18px", borderRadius: "50%", background: "var(--cc-accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Camera size={10} color="#fff" />
            </div>
          </div>
          <input ref={pfpInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePfpUpload} />

          <div>
            <h1
              style={{
                fontSize: "clamp(1.2rem, 3vw, 1.6rem)",
                fontWeight: 800,
                color: "var(--cc-text)",
                marginBottom: "4px",
              }}
            >
              Welcome back, <span className="cc-text-gradient">{user.name}</span> 👋
            </h1>
            <p style={{ fontSize: "0.82rem", color: "var(--cc-text-muted)" }}>
              {user.college} · Level {user.current_level} Student
            </p>
          </div>
        </div>
        <div
          style={{
            padding: "12px 20px",
            borderRadius: "14px",
            background: "var(--cc-surface-inset)",
            boxShadow: "var(--cc-neu-inset-sm), var(--cc-glow-purple-sm)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--cc-accent-bright)", lineHeight: 1 }}>
            {user.total_points}
          </div>
          <div style={{ fontSize: "0.68rem", color: "var(--cc-text-muted)", marginTop: "2px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Points
          </div>
        </div>
      </div>

      {/* Attendance card */}
      <AttendanceCard {...attendance} />

      {/* Notifications */}
      {notifications.length > 0 && (
        <div
          style={{
            borderRadius: "20px",
            padding: "1.5rem",
            background: "var(--cc-bg)",
            boxShadow: "var(--cc-neu-md)",
          }}
        >
          <h3
            style={{
              fontSize: "0.9rem",
              fontWeight: 700,
              color: "var(--cc-text)",
              marginBottom: "12px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <TrendingUp size={15} color="var(--cc-accent-bright)" />
            Activity Alerts ({notifications.length})
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {notifications.map((n, i) => (
              <NotificationBanner key={i} {...n} />
            ))}
          </div>
        </div>
      )}

      {/* Speech Tracker */}
      <CCSpeechTracker uid={user.uid} currentLevel={user.current_level} speeches={speeches} onSpeechSubmitted={loadAll} />

      {/* Speech Workflow Status */}
      {speeches.filter(s => s.workflowState).length > 0 && (
        <div
          style={{
            borderRadius: "20px",
            padding: "1.75rem",
            background: "var(--cc-bg)",
            boxShadow: "var(--cc-neu-md)",
          }}
        >
          <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--cc-text)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
            <TrendingUp size={15} color="var(--cc-accent-bright)" /> Speech Evaluation Status
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {speeches.filter(s => s.workflowState).map((speech) => {
              const stateLabels: Record<string, { label: string; color: string }> = {
                submitted_to_president: { label: "Awaiting President Validation", color: "var(--cc-amber)" },
                validated: { label: "Forwarded to Trainer", color: "var(--cc-accent-bright)" },
                evaluated: { label: "Evaluated ✅", color: "var(--cc-success)" },
                needs_redo: { label: "Needs Redo", color: "var(--cc-danger)" },
              };
              const stateCfg = stateLabels[speech.workflowState!] || { label: speech.workflowState, color: "var(--cc-text-muted)" };

              return (
                <div
                  key={speech.speech_id}
                  style={{
                    borderRadius: "14px",
                    padding: "14px 16px",
                    background: "var(--cc-surface-inset)",
                    boxShadow: "var(--cc-neu-inset-xs)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: speech.workflowState === "needs_redo" ? "10px" : 0 }}>
                    <div>
                      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--cc-text)" }}>
                        {speech.title}
                      </span>
                      {(speech.version || 1) > 1 && (
                        <span style={{ fontSize: "0.68rem", marginLeft: "8px", color: "var(--cc-text-faint)" }}>
                          v{speech.version}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: "0.72rem", fontWeight: 700, color: stateCfg.color }}>
                      {stateCfg.label}
                    </span>
                  </div>

                  {/* Points display for evaluated speeches */}
                  {speech.workflowState === "evaluated" && speech.studentPointsAwarded !== undefined && (
                    <div style={{ fontSize: "0.78rem", color: "var(--cc-success)", marginTop: "6px" }}>
                      ⭐ Score: {speech.studentPointsAwarded}/10
                      {speech.trainerRemarks && <span style={{ color: "var(--cc-text-muted)", marginLeft: "12px" }}>&mdash; {speech.trainerRemarks}</span>}
                    </div>
                  )}

                  {/* Redo section */}
                  {speech.workflowState === "needs_redo" && (
                    <>
                      {speech.trainerRemarks && (
                        <div style={{ padding: "8px 12px", borderRadius: "10px", background: "var(--cc-surface-deep)", boxShadow: "var(--cc-neu-inset-xs)", marginBottom: "10px" }}>
                          <p style={{ fontSize: "0.75rem", color: "var(--cc-danger)" }}>
                            <strong>Feedback:</strong> {speech.trainerRemarks}
                          </p>
                        </div>
                      )}
                      <div style={{ display: "flex", gap: "8px" }}>
                        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px", padding: "9px 12px", borderRadius: "10px", background: "var(--cc-surface-deep)", boxShadow: "var(--cc-neu-inset-sm)" }}>
                          <Link2 size={13} color="var(--cc-text-faint)" />
                          <input
                            type="url"
                            placeholder="Paste updated YouTube URL"
                            value={redoUrls[speech.speech_id] || ""}
                            onChange={(e) => setRedoUrls((p) => ({ ...p, [speech.speech_id]: e.target.value }))}
                            style={{ flex: 1, background: "none", border: "none", outline: "none", color: "var(--cc-text)", fontSize: "0.8rem", fontFamily: "inherit" }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleResubmit(speech)}
                          disabled={resubmitting === speech.speech_id || !redoUrls[speech.speech_id]?.trim()}
                          className="cc-btn-primary"
                          style={{ padding: "9px 14px", borderRadius: "10px", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "5px", whiteSpace: "nowrap", opacity: !redoUrls[speech.speech_id]?.trim() ? 0.5 : 1 }}
                        >
                          <Send size={12} />
                          {resubmitting === speech.speech_id ? "..." : "Resubmit"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Meeting video submissions */}
      <MeetingVideoPanel
        user={user}
        reports={reports}
        videos={videos}
        onSubmitted={loadAll}
      />

      {/* Progress Timeline */}
      <CCProgressTimeline currentLevel={user.current_level} />

      {/* Gamification */}
      <CCGamificationPanel user={user} />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default CCStudentDashboard;