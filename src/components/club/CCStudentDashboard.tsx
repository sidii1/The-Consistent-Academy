import React, { useState, useCallback, useEffect } from "react";
import {
  getCCSpeeches,
  getMeetingReports,
  getStudentMeetingVideos,
  getStudentAttendanceStats,
  submitMeetingVideo,
  type CCUser,
  type CCSpeech,
  type CCMeetingReport,
  type CCMeetingVideoSubmission,
} from "@/lib/ccClub";
import CCProgressTimeline from "./CCProgressTimeline";
import CCSpeechTracker from "./CCSpeechTracker";
import CCGamificationPanel from "./CCGamificationPanel";
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
} from "lucide-react";

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
      ? "hsl(145 55% 45%)"
      : percentage >= 50
      ? "hsl(38 80% 55%)"
      : "hsl(0 65% 55%)";

  const bg =
    total === 0
      ? "hsl(210 15% 13%)"
      : percentage >= 75
      ? "linear-gradient(135deg, hsl(145 30% 13%), hsl(210 15% 13%))"
      : percentage >= 50
      ? "linear-gradient(135deg, hsl(38 30% 13%), hsl(210 15% 13%))"
      : "linear-gradient(135deg, hsl(0 30% 13%), hsl(210 15% 13%))";

  const borderColor =
    total === 0
      ? "var(--cc-border)"
      : percentage >= 75
      ? "hsl(145 40% 25%)"
      : percentage >= 50
      ? "hsl(38 40% 25%)"
      : "hsl(0 40% 25%)";

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
        background: bg,
        border: `1px solid ${borderColor}`,
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
            background: `${color}22`,
            border: `1px solid ${color}44`,
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
          style={{
            height: "8px",
            borderRadius: "999px",
            background: "hsl(210 15% 20%)",
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
              boxShadow: `0 0 8px ${color}66`,
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
          <span style={{ color: "hsl(38 80% 55%)" }}>50%</span>
          <span style={{ color: "hsl(145 55% 45%)" }}>75%</span>
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
      color: "hsl(0 65% 55%)",
      bg: "hsl(0 30% 12%)",
      border: "hsl(0 40% 25%)",
    },
    redo: {
      icon: <XCircle size={16} />,
      color: "hsl(0 65% 55%)",
      bg: "hsl(0 30% 12%)",
      border: "hsl(0 40% 25%)",
    },
    welldone: {
      icon: <CheckCircle2 size={16} />,
      color: "hsl(145 55% 45%)",
      bg: "hsl(145 20% 12%)",
      border: "hsl(145 40% 25%)",
    },
    pending: {
      icon: <Clock size={16} />,
      color: "hsl(38 80% 55%)",
      bg: "hsl(38 20% 12%)",
      border: "hsl(38 40% 25%)",
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
        background: config.bg,
        border: `1px solid ${config.border}`,
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
        className="cc-surface"
        style={{
          borderRadius: "20px",
          padding: "1.75rem",
          border: "1px solid var(--cc-border)",
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
      className="cc-surface"
      style={{
        borderRadius: "20px",
        padding: "1.75rem",
        border: "1px solid var(--cc-border)",
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
                ? "hsl(38 80% 55%)"
                : "hsl(0 65% 55%)"
              : submission.status === "Well Done"
              ? "hsl(145 55% 45%)"
              : submission.status === "Redo"
              ? "hsl(0 65% 55%)"
              : "hsl(38 80% 55%)";

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
                background:
                  submission?.status === "Well Done"
                    ? "hsl(145 20% 12%)"
                    : !wasPresent && !submission
                    ? "hsl(0 20% 12%)"
                    : "hsl(210 15% 15%)",
                border: `1px solid ${
                  submission?.status === "Well Done"
                    ? "hsl(145 40% 22%)"
                    : !wasPresent && !submission
                    ? "hsl(0 40% 22%)"
                    : "var(--cc-border)"
                }`,
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
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: statusColor,
                    background: `${statusColor}18`,
                    border: `1px solid ${statusColor}40`,
                    borderRadius: "20px",
                    padding: "3px 10px",
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
                    background: "var(--cc-danger-soft)",
                    border: "1px solid hsl(0 50% 28%)",
                    marginBottom: "10px",
                  }}
                >
                  <p style={{ fontSize: "0.72rem", color: "hsl(0 65% 70%)" }}>
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
                    color: "hsl(145 55% 55%)",
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
                      background: "hsl(210 18% 10%)",
                      boxShadow:
                        "inset 3px 3px 7px var(--cc-shadow-dark), inset -3px -3px 7px var(--cc-shadow-light)",
                      border: "1px solid var(--cc-border)",
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
  const [speeches, setSpeeches] = useState<CCSpeech[]>([]);
  const [reports, setReports] = useState<CCMeetingReport[]>([]);
  const [videos, setVideos] = useState<CCMeetingVideoSubmission[]>([]);
  const [attendance, setAttendance] = useState({ present: 0, total: 0, percentage: 0 });
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [speechData, reportData, videoData, attStats] = await Promise.all([
        getCCSpeeches(user.uid),
        getMeetingReports(user.college),
        getStudentMeetingVideos(user.uid),
        getStudentAttendanceStats(user.uid, user.college),
      ]);
      setSpeeches(speechData);
      setReports(reportData);
      setVideos(videoData);
      setAttendance(attStats);
    } finally {
      setLoading(false);
    }
  }, [user.uid, user.college]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const loadSpeeches = useCallback(async () => {
    const data = await getCCSpeeches(user.uid);
    setSpeeches(data);
  }, [user.uid]);

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
        padding: "2rem 1.5rem",
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "1.5rem",
      }}
    >
      {/* Welcome banner */}
      <div
        style={{
          borderRadius: "20px",
          padding: "1.5rem 1.75rem",
          background: "linear-gradient(135deg, hsl(165 40% 14%), hsl(210 15% 13%))",
          border: "1px solid var(--cc-accent-soft)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
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
        <div
          style={{
            padding: "12px 20px",
            borderRadius: "14px",
            background: "var(--cc-accent-soft)",
            border: "1px solid var(--cc-accent)",
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
          className="cc-surface"
          style={{
            borderRadius: "20px",
            padding: "1.5rem",
            border: "1px solid var(--cc-border)",
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

      {/* Progress Timeline */}
      <CCProgressTimeline currentLevel={user.current_level} />

      {/* Main grid: Speech tracker + Gamification */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "1.5rem",
          alignItems: "start",
        }}
      >
        <CCSpeechTracker
          uid={user.uid}
          currentLevel={user.current_level}
          speeches={speeches}
          onSpeechSubmitted={loadSpeeches}
        />
        <CCGamificationPanel user={user} />
      </div>

      {/* Meeting video submissions */}
      <MeetingVideoPanel
        user={user}
        reports={reports}
        videos={videos}
        onSubmitted={loadAll}
      />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default CCStudentDashboard;