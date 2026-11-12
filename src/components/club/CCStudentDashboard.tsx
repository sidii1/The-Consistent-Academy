import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  getCCUser,
  getMeetingReports,
  getStudentMeetingVideos,
  computeAttendanceStats,
  submitMeetingVideo,
  getCCSpeeches,
  getEffectiveWorkflowState,
  getSpeechDisplayStatus,
  isValidVideoUrl,
  type CCUser,
  type CCMeetingReport,
  type CCMeetingVideoSubmission,
  type CCSpeech,
} from "@/lib/ccClub";
import CCProgressTimeline from "./CCProgressTimeline";
import CCGamificationPanel from "./CCGamificationPanel";
import CCSpeechTracker from "./CCSpeechTracker";
import CCInlineVideoPlayer from "./CCInlineVideoPlayer";
import CCAvatarUpload from "./CCAvatarUpload";
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
  RefreshCw,
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
      className="cc-card"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div
          className="cc-well-deep"
          style={{
            width: "48px",
            height: "48px",
            padding: 0,
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CalendarCheck size={22} color={color} />
        </div>
        <div>
          <div className="cc-eyebrow" style={{ marginBottom: "2px" }}>My Attendance</div>
          <div style={{ fontSize: "1.4rem", fontWeight: 900, color, lineHeight: 1 }}>
            {percentage}%{" "}
            <span style={{ fontSize: "0.78rem", fontWeight: 500, color: "var(--cc-text-muted)" }}>
              ({present}/{total} meetings)
            </span>
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--cc-text-muted)", marginTop: "4px" }}>{label}</div>
        </div>
      </div>

      <div style={{ minWidth: "120px", flex: "0 0 120px" }}>
        <div
          className="cc-inset-sm"
          style={{ height: "8px", borderRadius: "999px", overflow: "hidden" }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Attendance"
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
type NotificationType = "absent" | "redo" | "welldone" | "pending";

const NOTIFICATION_CONFIG: Record<NotificationType, { icon: React.ReactNode; color: string }> = {
  absent: { icon: <AlertTriangle size={16} />, color: "var(--cc-danger)" },
  redo: { icon: <XCircle size={16} />, color: "var(--cc-danger)" },
  welldone: { icon: <CheckCircle2 size={16} />, color: "var(--cc-success)" },
  pending: { icon: <Clock size={16} />, color: "var(--cc-amber)" },
};

const NotificationBanner: React.FC<{
  type: NotificationType;
  message: string;
  sub?: string;
}> = ({ type, message, sub }) => {
  const config = NOTIFICATION_CONFIG[type];
  return (
    <div className="cc-well" style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "12px 14px", borderRadius: "12px" }}>
      <span style={{ color: config.color, marginTop: "1px", flexShrink: 0 }}>{config.icon}</span>
      <div>
        <p style={{ fontSize: "0.82rem", fontWeight: 600, color: config.color }}>{message}</p>
        {sub && <p style={{ fontSize: "0.74rem", color: "var(--cc-text-muted)", marginTop: "2px" }}>{sub}</p>}
      </div>
    </div>
  );
};

// ── Meeting Video Panel ───────────────────────────────────────
const MEETING_STATE_LABELS: Record<string, string> = {
  submitted_to_president: "Awaiting President",
  validated: "With Trainer",
  evaluated: "Evaluated ✅",
  needs_redo: "Needs Redo",
};

const MeetingVideoPanel: React.FC<{
  user: CCUser;
  reports: CCMeetingReport[];
  videos: CCMeetingVideoSubmission[];
  onSubmitted: () => void;
}> = ({ user, reports, videos, onSubmitted }) => {
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});

  const videoMap = useMemo(() => Object.fromEntries(videos.map((v) => [v.report_id, v])), [videos]);

  const handleSubmit = async (report: CCMeetingReport) => {
    const id = report.id!;
    const url = urls[id]?.trim();
    if (!url) return;
    if (!isValidVideoUrl(url)) {
      toast.error("Enter a valid link starting with https:// (YouTube, Drive, Loom…)");
      return;
    }
    setSubmitting((p) => ({ ...p, [id]: true }));
    try {
      await submitMeetingVideo(user.uid, user.name, id, report.week_number, url);
      toast.success(`Week ${report.week_number} video submitted!`);
      setUrls((p) => ({ ...p, [id]: "" }));
      onSubmitted();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't submit your video. Please try again.");
    } finally {
      setSubmitting((p) => ({ ...p, [id]: false }));
    }
  };

  if (reports.length === 0) {
    return (
      <div className="cc-card" style={{ textAlign: "center", color: "var(--cc-text-faint)", fontSize: "0.82rem" }}>
        <Video size={28} style={{ margin: "0 auto 8px", opacity: 0.3 }} />
        No meetings uploaded by your president yet.
      </div>
    );
  }

  return (
    <div className="cc-card">
      <h3 className="cc-card-title" style={{ marginBottom: "4px" }}>
        <Video size={16} color="var(--cc-accent-bright)" />
        Meeting Video Submissions
      </h3>
      <p style={{ fontSize: "0.75rem", color: "var(--cc-text-muted)", marginBottom: "1.25rem" }}>
        Submit your video recording for each meeting. Absent meetings are flagged automatically.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {reports.map((report) => {
          const id = report.id!;
          const submission = videoMap[id];
          const state = submission ? getEffectiveWorkflowState(submission) : undefined;
          const wasPresent = report.attendance?.find((a) => a.uid === user.uid)?.present ?? false;
          const needsRedo = state === "needs_redo";
          const canSubmit = !submission || needsRedo;
          const feedback = submission?.trainerRemarks || submission?.evaluator_notes;

          const statusColor = !submission
            ? wasPresent
              ? "var(--cc-amber)"
              : "var(--cc-danger)"
            : needsRedo
            ? "var(--cc-danger)"
            : state === "evaluated"
            ? "var(--cc-success)"
            : state === "validated"
            ? "var(--cc-accent-bright)"
            : "var(--cc-amber)";

          const statusLabel = !submission
            ? wasPresent
              ? "Video Pending"
              : "Absent — Submit Video"
            : (state && MEETING_STATE_LABELS[state]) || submission.status;

          const statusIcon = state === "evaluated" ? <CheckCircle2 size={13} /> : needsRedo ? <XCircle size={13} /> : <Clock size={13} />;

          return (
            <div key={id} className="cc-well">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "8px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--cc-text)" }}>
                    Week {report.week_number}
                  </span>
                  <span style={{ fontSize: "0.72rem", color: "var(--cc-text-faint)", marginLeft: "8px" }}>
                    {report.meeting_date?.seconds
                      ? new Date(report.meeting_date.seconds * 1000).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : ""}
                  </span>
                </div>
                <span className="cc-chip" style={{ color: statusColor }}>
                  {statusIcon} {statusLabel}
                </span>
              </div>

              {submission?.video_url && (
                <div style={{ marginTop: "10px" }}>
                  <CCInlineVideoPlayer url={submission.video_url} />
                </div>
              )}

              {needsRedo && feedback && (
                <div className="cc-well-deep" style={{ marginTop: "10px" }}>
                  <p style={{ fontSize: "0.74rem", color: "var(--cc-danger)", lineHeight: 1.6 }}>
                    <strong>{submission?.sentBackBy === "president" ? "President feedback:" : "Trainer feedback:"}</strong>{" "}
                    {feedback}
                  </p>
                </div>
              )}

              {state === "evaluated" && (
                <div style={{ marginTop: "8px", fontSize: "0.75rem", color: "var(--cc-success)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <CheckCircle2 size={13} />
                  {feedback || "Excellent work! Your video was approved."}
                </div>
              )}

              {canSubmit && (
                <div className="cc-input-row" style={{ marginTop: "10px" }}>
                  <div className="cc-input-wrap">
                    <Link2 size={13} color="var(--cc-text-faint)" />
                    <input
                      className="cc-input"
                      type="url"
                      inputMode="url"
                      aria-label={`Video link for week ${report.week_number}`}
                      placeholder={
                        needsRedo
                          ? "Paste your new video link"
                          : !wasPresent
                          ? "Submit video even if absent — paste link"
                          : "Paste YouTube / Drive / Loom link"
                      }
                      value={urls[id] || ""}
                      onChange={(e) => setUrls((p) => ({ ...p, [id]: e.target.value }))}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmit(report)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSubmit(report)}
                    disabled={submitting[id] || !urls[id]?.trim()}
                    className="cc-btn-primary"
                    style={{
                      padding: "9px 14px",
                      borderRadius: "12px",
                      fontSize: "0.8rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {submitting[id] ? <Loader2 size={12} className="cc-spin" /> : <Send size={12} />}
                    {needsRedo ? "Resubmit" : "Submit"}
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

// ── Notifications ─────────────────────────────────────────────
const buildNotifications = (
  reports: CCMeetingReport[],
  videos: CCMeetingVideoSubmission[],
  speeches: CCSpeech[],
  uid: string
) => {
  const notifications: Array<{ type: NotificationType; message: string; sub?: string }> = [];
  const videoMap = Object.fromEntries(videos.map((v) => [v.report_id, v]));

  // Speeches first — they gate level progression.
  speeches.forEach((s) => {
    const state = getEffectiveWorkflowState(s);
    if (!state) return;
    if (state === "needs_redo") {
      notifications.push({
        type: "redo",
        message: `"${s.title}" needs a redo.`,
        sub: s.trainerRemarks || s.evaluator_notes || "Check the feedback and resubmit from the speech tracker.",
      });
    } else if (state === "evaluated") {
      notifications.push({
        type: "welldone",
        message: `"${s.title}" was evaluated${s.studentPointsAwarded !== undefined ? ` — ${s.studentPointsAwarded}/10` : ""}! 🎉`,
        sub: s.trainerRemarks || undefined,
      });
    }
  });

  reports.forEach((r) => {
    const wasPresent = r.attendance?.find((a) => a.uid === uid)?.present ?? false;
    const video = videoMap[r.id!];
    const state = video ? getEffectiveWorkflowState(video) : undefined;

    if (!wasPresent && !video) {
      notifications.push({
        type: "absent",
        message: `You were absent in Week ${r.week_number} — please submit your video.`,
        sub: "Submitting a video even when absent shows commitment.",
      });
    }
    if (state === "needs_redo") {
      notifications.push({
        type: "redo",
        message: `Week ${r.week_number} video needs to be redone.`,
        sub: video.trainerRemarks || video.evaluator_notes || "Check the feedback and resubmit.",
      });
    }
    if (state === "evaluated") {
      notifications.push({
        type: "welldone",
        message: `Week ${r.week_number} video evaluated! 🎉`,
        sub: video.trainerRemarks || video.evaluator_notes || "Excellent work — keep it up!",
      });
    }
    if (state === "submitted_to_president") {
      notifications.push({
        type: "pending",
        message: `Week ${r.week_number} video is awaiting validation.`,
        sub: "Your president will review it soon.",
      });
    }
    if (state === "validated") {
      notifications.push({
        type: "pending",
        message: `Week ${r.week_number} video forwarded to trainer.`,
        sub: "Awaiting final evaluation.",
      });
    }
  });

  return notifications;
};

// ── Speech evaluation history ─────────────────────────────────
const SPEECH_STATE_CONFIG: Record<string, { label: string; color: string }> = {
  submitted_to_president: { label: "Awaiting President", color: "var(--cc-amber)" },
  validated: { label: "With Trainer", color: "var(--cc-accent-bright)" },
  evaluated: { label: "Evaluated ✅", color: "var(--cc-success)" },
  needs_redo: { label: "Needs Redo", color: "var(--cc-danger)" },
};

const SpeechStatusList: React.FC<{ speeches: CCSpeech[] }> = ({ speeches }) => {
  const submitted = speeches.filter((s) => getEffectiveWorkflowState(s));
  if (submitted.length === 0) return null;

  return (
    <div className="cc-card">
      <h3 className="cc-card-title" style={{ marginBottom: "12px" }}>
        <TrendingUp size={15} color="var(--cc-accent-bright)" /> Speech Evaluation Status
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {submitted.map((speech) => {
          const state = getEffectiveWorkflowState(speech)!;
          const cfg = SPEECH_STATE_CONFIG[state];
          const feedback = speech.trainerRemarks || speech.evaluator_notes;
          return (
            <div key={speech.speech_id} className="cc-well">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <div>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--cc-text)" }}>{speech.title}</span>
                  <span style={{ fontSize: "0.68rem", marginLeft: "8px", color: "var(--cc-text-faint)" }}>
                    L{speech.level}
                    {(speech.version ?? 1) > 1 ? ` · v${speech.version}` : ""}
                  </span>
                </div>
                <span style={{ fontSize: "0.74rem", fontWeight: 600, color: cfg.color }}>{cfg.label}</span>
              </div>

              {state === "evaluated" && speech.studentPointsAwarded !== undefined && (
                <div style={{ fontSize: "0.78rem", color: "var(--cc-success)", marginTop: "6px" }}>
                  ⭐ Score: {speech.studentPointsAwarded}/10
                  {feedback && <span style={{ color: "var(--cc-text-muted)", marginLeft: "12px" }}>— {feedback}</span>}
                </div>
              )}

              {state === "needs_redo" && feedback && (
                <div className="cc-well-deep" style={{ marginTop: "10px" }}>
                  <p style={{ fontSize: "0.75rem", color: "var(--cc-danger)", lineHeight: 1.6 }}>
                    <strong>{speech.sentBackBy === "president" ? "President feedback:" : "Trainer feedback:"}</strong>{" "}
                    {feedback}
                  </p>
                  <p style={{ fontSize: "0.7rem", color: "var(--cc-text-faint)", marginTop: "4px" }}>
                    Re-record and resubmit from the Level {speech.level} tracker above.
                  </p>
                </div>
              )}

              {speech.youtubeUrl && (
                <div style={{ marginTop: "12px" }}>
                  <CCInlineVideoPlayer url={speech.youtubeUrl} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Main Dashboard ────────────────────────────────────────────
const CCStudentDashboard: React.FC<CCStudentDashboardProps> = ({ user: initialUser }) => {
  // `initialUser` is a snapshot from sign-in; keep a live copy so points / level update after reviews.
  const [user, setUser] = useState<CCUser>(initialUser);
  const [reports, setReports] = useState<CCMeetingReport[]>([]);
  const [videos, setVideos] = useState<CCMeetingVideoSubmission[]>([]);
  const [speeches, setSpeeches] = useState<CCSpeech[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const loadAll = useCallback(
    async (silent = false) => {
      if (silent) setRefreshing(true);
      else setLoading(true);
      setLoadError(false);
      try {
        const [fresh, reportData, videoData, speechData] = await Promise.all([
          getCCUser(initialUser.uid),
          getMeetingReports(initialUser.college),
          getStudentMeetingVideos(initialUser.uid),
          getCCSpeeches(initialUser.uid),
        ]);
        if (fresh) setUser(fresh);
        setReports(reportData);
        setVideos(videoData);
        setSpeeches(speechData);
      } catch (err) {
        console.error("Student dashboard load failed:", err);
        setLoadError(true);
        toast.error("Couldn't load your dashboard. Please try again.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [initialUser.uid, initialUser.college]
  );

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const attendance = useMemo(
    () => computeAttendanceStats(reports)[user.uid] ?? { present: 0, total: 0, percentage: 0 },
    [reports, user.uid]
  );
  const notifications = useMemo(
    () => buildNotifications(reports, videos, speeches, user.uid),
    [reports, videos, speeches, user.uid]
  );

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "12px", color: "var(--cc-text-muted)" }}>
        <Loader2 size={22} className="cc-spin" />
        Loading your dashboard...
      </div>
    );
  }

  if (loadError && reports.length === 0 && speeches.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "14px", color: "var(--cc-text-muted)" }}>
        <AlertTriangle size={26} color="var(--cc-danger)" />
        <p style={{ fontSize: "0.9rem" }}>We couldn't load your dashboard.</p>
        <button type="button" className="cc-btn-primary" style={{ padding: "10px 20px", borderRadius: "12px" }} onClick={() => loadAll()}>
          Try again
        </button>
      </div>
    );
  }

  const currentLevel = (user.current_level ?? 1) as 1 | 2 | 3 | 4;
  const pendingSpeechCount = speeches.filter((s) => getSpeechDisplayStatus(s) === "Pending Review").length;

  return (
    <div
      className="cc-dashboard-root"
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "2rem 160px 2rem 1.5rem",
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr)",
        gap: "1.5rem",
        position: "relative",
      }}
    >
      {/* Ambient orbs behind content */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: -1, borderRadius: "30px" }} aria-hidden="true">
        <div className="cc-animate-shimmer" style={{ position: "absolute", top: "5%", left: "0%", width: "45vw", height: "45vw", background: "var(--cc-orb-purple)", filter: "blur(60px)" }} />
        <div className="cc-animate-shimmer" style={{ position: "absolute", top: "35%", right: "0%", width: "40vw", height: "40vw", background: "var(--cc-orb-amber)", filter: "blur(60px)", animationDelay: "2s" }} />
        <div className="cc-animate-shimmer" style={{ position: "absolute", bottom: "10%", left: "15%", width: "50vw", height: "50vw", background: "var(--cc-orb-teal)", filter: "blur(60px)", animationDelay: "4s" }} />
      </div>

      {/* Welcome banner */}
      <div
        className="cc-card-hero"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px", minWidth: 0 }}>
          <CCAvatarUpload uid={user.uid} name={user.name} initialUrl={user.profilePictureUrl} />
          <div style={{ minWidth: 0 }}>
            <h1 style={{ fontSize: "clamp(1.2rem, 3vw, 1.6rem)", fontWeight: 800, color: "var(--cc-text)", marginBottom: "4px" }}>
              Welcome back, <span className="cc-text-gradient">{user.name}</span> 👋
            </h1>
            <p style={{ fontSize: "0.82rem", color: "var(--cc-text-muted)" }}>
              {user.college} · Level {currentLevel} {user.club_role}
              {pendingSpeechCount > 0 && ` · ${pendingSpeechCount} speech${pendingSpeechCount > 1 ? "es" : ""} in review`}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <button
            type="button"
            className="cc-btn-action"
            onClick={() => loadAll(true)}
            disabled={refreshing}
            title="Refresh points and review status"
          >
            <RefreshCw size={14} className={refreshing ? "cc-spin" : undefined} /> Refresh
          </button>
          <div className="cc-well-deep" style={{ padding: "12px 20px", borderRadius: "14px", textAlign: "center", boxShadow: "var(--cc-neu-inset-sm), var(--cc-glow-purple-sm)" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--cc-accent-bright)", lineHeight: 1 }}>
              {user.total_points ?? 0}
            </div>
            <div className="cc-eyebrow" style={{ marginTop: "2px" }}>Points</div>
          </div>
        </div>
      </div>

      <AttendanceCard {...attendance} />

      {notifications.length > 0 && (
        <div className="cc-card" style={{ padding: "1.5rem" }}>
          <h3 className="cc-card-title" style={{ fontSize: "0.9rem", marginBottom: "12px" }}>
            <TrendingUp size={15} color="var(--cc-accent-bright)" />
            Activity Alerts ({notifications.length})
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "320px", overflowY: "auto", padding: "4px" }}>
            {notifications.map((n, i) => (
              <NotificationBanner key={`${n.type}-${i}`} {...n} />
            ))}
          </div>
        </div>
      )}

      {/* Speech tracker — where students submit and redo speeches */}
      <CCSpeechTracker
        uid={user.uid}
        currentLevel={currentLevel}
        speeches={speeches}
        onSpeechSubmitted={() => loadAll(true)}
      />

      <SpeechStatusList speeches={speeches} />

      <MeetingVideoPanel user={user} reports={reports} videos={videos} onSubmitted={() => loadAll(true)} />

      <CCProgressTimeline currentLevel={currentLevel} />

      <CCGamificationPanel user={user} />
    </div>
  );
};

export default CCStudentDashboard;
