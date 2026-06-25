import React, { useState, useCallback, useEffect } from "react";
import {
  getCCSpeeches,
  getCCUsersByCollege,
  getMeetingReports,
  getCollegeMeetingVideos,
  getCCAttendanceStats,
  validateMeetingVideo,
  rejectMeetingVideo,
  getPendingPresidentSpeeches,
  validateSpeech,
  rejectSpeech,
  type CCUser,
  type CCSpeech,
  type CCMeetingReport,
  type CCMeetingVideoSubmission,
} from "@/lib/ccClub";
import CCProgressTimeline from "./CCProgressTimeline";
import CCGamificationPanel from "./CCGamificationPanel";
import CCMeetingPanel from "./CCMeetingPanel";
import CCInlineVideoPlayer from "./CCInlineVideoPlayer";
import {
  Loader2,
  Crown,
  FileDown,
  CheckCircle2,
  XCircle,
  Clock,
  Video,
  ChevronDown,
  ChevronUp,
  Mic2,
  Forward,
} from "lucide-react";
import { toast } from "sonner";

interface CCPresidentDashboardProps {
  user: CCUser;
}

// ── President Video Review Panel ──────────────────────────────
const VideoReviewPanel: React.FC<{
  members: CCUser[];
  reports: CCMeetingReport[];
  videos: CCMeetingVideoSubmission[];
  onEvaluated: () => void;
}> = ({ members, reports, videos, onEvaluated }) => {
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState(false);

  const videoMap = Object.fromEntries(
    videos.map((v) => [`${v.report_id}_${v.uid}`, v])
  );

  const pending = videos.filter((v) => v.workflowState === "submitted_to_president" || (!v.workflowState && v.status === "Pending Review"));

  const handleValidate = async (reportId: string, uid: string) => {
    const key = `${reportId}_${uid}`;
    setSubmitting((p) => ({ ...p, [key]: true }));
    try {
      await validateMeetingVideo(reportId, uid);
      toast.success("Video validated & forwarded to Trainer");
      onEvaluated();
    } catch {
      toast.error("Failed to validate. Try again.");
    } finally {
      setSubmitting((p) => ({ ...p, [key]: false }));
    }
  };

  const handleReject = async (reportId: string, uid: string) => {
    const key = `${reportId}_${uid}`;
    setSubmitting((p) => ({ ...p, [key]: true }));
    try {
      await rejectMeetingVideo(reportId, uid, notes[key] || "Invalid video. Please re-record.");
      toast.success("Video marked as Redo");
      onEvaluated();
    } catch {
      toast.error("Failed to reject. Try again.");
    } finally {
      setSubmitting((p) => ({ ...p, [key]: false }));
    }
  };

  if (reports.length === 0) return null;

  return (
    <div
      className="cc-surface"
      style={{
        borderRadius: "20px",
        padding: "1.75rem",
        border: "1px solid var(--cc-border)",
      }}
    >
      <button
        type="button"
        onClick={() => setExpanded((p) => !p)}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 0,
          marginBottom: expanded ? "1.25rem" : 0,
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
          }}
        >
          <Video size={16} color="var(--cc-accent-bright)" />
          Meeting Video Reviews
          {pending.length > 0 && (
            <span
              style={{
                fontSize: "0.68rem",
                padding: "2px 8px",
                borderRadius: "999px",
                background: "hsl(38 40% 14%)",
                color: "hsl(38 80% 55%)",
                border: "1px solid hsl(38 40% 28%)",
                fontWeight: 700,
              }}
            >
              {pending.length} pending
            </span>
          )}
        </h3>
        {expanded ? (
          <ChevronUp size={16} color="var(--cc-text-faint)" />
        ) : (
          <ChevronDown size={16} color="var(--cc-text-faint)" />
        )}
      </button>

      {expanded && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {reports.map((report) => {
            const membersWithSubmission = members.filter((m) =>
              videoMap[`${report.id}_${m.uid}`]
            );
            if (membersWithSubmission.length === 0) return null;

            return (
              <div key={report.id}>
                <div
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    color: "var(--cc-text-muted)",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Week {report.week_number}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {membersWithSubmission.map((member) => {
                    const key = `${report.id}_${member.uid}`;
                    const video = videoMap[key];
                    if (!video) return null;

                    return (
                      <div
                        key={key}
                        style={{
                          borderRadius: "12px",
                          padding: "12px 14px",
                          background: "var(--cc-surface-inset)",
                          boxShadow: "var(--cc-neu-inset-sm)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            flexWrap: "wrap",
                            gap: "8px",
                            marginBottom: "8px",
                          }}
                        >
                          <div>
                            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--cc-text)" }}>
                              {member.name}
                            </span>
                            <div style={{ marginTop: "6px" }}>
                              <CCInlineVideoPlayer url={video.video_url} />
                            </div>
                          </div>
                          <span
                            style={{
                              fontSize: "0.68rem",
                              fontWeight: 700,
                              color:
                                video.workflowState === "evaluated" || video.status === "Well Done"
                                  ? "hsl(145 55% 45%)"
                                  : video.workflowState === "needs_redo" || video.status === "Redo"
                                  ? "hsl(0 65% 55%)"
                                  : video.workflowState === "validated"
                                  ? "var(--cc-accent-bright)"
                                  : "hsl(38 80% 55%)",
                            }}
                          >
                            {video.workflowState === "submitted_to_president" || video.status === "Pending Review" 
                              ? "Pending Validation"
                              : video.workflowState === "validated"
                              ? "Forwarded"
                              : video.workflowState === "needs_redo" ? "Needs Redo"
                              : video.workflowState === "evaluated" ? "Evaluated"
                              : video.status}
                          </span>
                        </div>

                        {(video.workflowState === "submitted_to_president" || video.status === "Pending Review") && (
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <input
                              type="text"
                              placeholder="Add feedback (optional)"
                              value={notes[key] || ""}
                              onChange={(e) =>
                                setNotes((p) => ({ ...p, [key]: e.target.value }))
                              }
                              style={{
                                width: "100%",
                                padding: "8px 12px",
                                borderRadius: "8px",
                                background: "hsl(210 18% 10%)",
                                border: "1px solid var(--cc-border)",
                                color: "var(--cc-text)",
                                fontSize: "0.8rem",
                                outline: "none",
                                boxSizing: "border-box",
                              }}
                            />
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button
                                type="button"
                                onClick={() => handleValidate(report.id!, member.uid)}
                                disabled={submitting[key]}
                                style={{
                                  flex: 1,
                                  padding: "8px",
                                  borderRadius: "8px",
                                  background: "var(--cc-surface-deep)",
                                  boxShadow: "var(--cc-neu-sm)",
                                  color: "var(--cc-success)",
                                  fontWeight: 700,
                                  fontSize: "0.78rem",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: "5px",
                                  border: "none",
                                }}
                              >
                                <Forward size={13} /> Validate & Forward
                              </button>
                              <button
                                type="button"
                                onClick={() => handleReject(report.id!, member.uid)}
                                disabled={submitting[key]}
                                style={{
                                  flex: 1,
                                  padding: "8px",
                                  borderRadius: "8px",
                                  background: "var(--cc-surface-deep)",
                                  boxShadow: "var(--cc-neu-sm)",
                                  color: "var(--cc-danger)",
                                  fontWeight: 700,
                                  fontSize: "0.78rem",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: "5px",
                                  border: "none",
                                }}
                              >
                                <XCircle size={13} /> Reject
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── Export Report ─────────────────────────────────────────────
const exportPresidentReport = (
  college: string,
  members: CCUser[],
  reports: CCMeetingReport[],
  videos: CCMeetingVideoSubmission[],
  attendanceStats: Record<string, { present: number; total: number; percentage: number }>,
  speechesMap: Record<string, CCSpeech[]>
) => {
  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });

  const videoMap = Object.fromEntries(
    videos.map((v) => [`${v.report_id}_${v.uid}`, v])
  );

  const rows = members.map((member) => {
    const att = attendanceStats[member.uid] ?? { present: 0, total: 0, percentage: 0 };
    const memberSpeeches = speechesMap[member.uid] ?? [];
    const wellDone = memberSpeeches.filter((s) => s.status === "Well Done").length;
    const redo = memberSpeeches.filter((s) => s.status === "Redo").length;
    const pending = memberSpeeches.filter((s) => s.status === "Pending Review").length;
    const notStarted = memberSpeeches.filter((s) => s.status === "Not Started").length;

    const memberVideos = videos.filter((v) => v.uid === member.uid);
    const videoWellDone = memberVideos.filter((v) => v.status === "Well Done").length;
    const videoRedo = memberVideos.filter((v) => v.status === "Redo").length;
    const videoPending = memberVideos.filter((v) => v.status === "Pending Review").length;
    const videoAbsent = reports.filter(
      (r) =>
        !r.attendance?.find((a) => a.uid === member.uid)?.present &&
        !videoMap[`${r.id}_${member.uid}`]
    ).length;

    const qualified =
      att.percentage >= 75 && wellDone >= 2 && videoRedo === 0 && videoAbsent === 0;

    const attColor =
      att.percentage >= 75 ? "#16a34a" : att.percentage >= 50 ? "#d97706" : "#dc2626";

    return `
    <div class="student-card">
      <div class="student-header">
        <div>
          <div class="student-name">${member.name}</div>
          <div class="student-meta">${member.email} · ${member.club_role}</div>
        </div>
        <div class="qualified-badge ${qualified ? "qualified" : "not-qualified"}">
          ${qualified ? "✅ Qualified" : "❌ Not Qualified"}
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-box" style="border-left-color: ${attColor}">
          <div class="stat-label">Attendance</div>
          <div class="stat-value" style="color:${attColor}">${att.percentage}%</div>
          <div class="stat-sub">${att.present}/${att.total} meetings</div>
        </div>
        <div class="stat-box" style="border-left-color:#16a34a">
          <div class="stat-label">Speeches Done</div>
          <div class="stat-value" style="color:#16a34a">${wellDone}</div>
          <div class="stat-sub">${redo} redo · ${pending} pending · ${notStarted} not started</div>
        </div>
        <div class="stat-box" style="border-left-color:#3b82f6">
          <div class="stat-label">Meeting Videos</div>
          <div class="stat-value" style="color:#3b82f6">${videoWellDone}</div>
          <div class="stat-sub">${videoRedo} redo · ${videoPending} pending · ${videoAbsent} missed</div>
        </div>
        <div class="stat-box" style="border-left-color:${member.total_points > 0 ? "#8b5cf6" : "#666"}">
          <div class="stat-label">Points</div>
          <div class="stat-value" style="color:#8b5cf6">${member.total_points}</div>
          <div class="stat-sub">Level ${member.current_level}</div>
        </div>
      </div>

      ${memberVideos.filter((v) => v.status === "Redo" && v.evaluator_notes).map((v) => `
        <div class="feedback-row">
          <span class="feedback-label">⚠ Week ${v.week_number} Redo:</span>
          ${v.evaluator_notes}
        </div>
      `).join("")}

      ${videoAbsent > 0 ? `<div class="feedback-row absent-row">⛔ ${videoAbsent} meeting(s) missed without video submission</div>` : ""}
    </div>`;
  }).join("");

  const qualified = members.filter((m) => {
    const att = attendanceStats[m.uid] ?? { percentage: 0 };
    const ms = speechesMap[m.uid] ?? [];
    const mv = videos.filter((v) => v.uid === m.uid);
    return (
      att.percentage >= 75 &&
      ms.filter((s) => s.status === "Well Done").length >= 2 &&
      mv.filter((v) => v.status === "Redo").length === 0
    );
  }).length;

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
<title>CC Club Report — ${college}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'DM Sans',sans-serif;font-size:12px;color:#1a1a2e;background:#fff;padding:32px 40px}
  .report-header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #1a1a2e;padding-bottom:20px;margin-bottom:28px}
  .report-title{font-family:'DM Serif Display',serif;font-size:26px;line-height:1.1}
  .report-subtitle{font-size:13px;color:#555;margin-top:4px}
  .report-meta{text-align:right;font-size:11px;color:#666;line-height:1.9}
  .report-meta strong{color:#1a1a2e}
  .summary-strip{display:flex;gap:14px;margin-bottom:28px}
  .summary-card{flex:1;padding:12px 16px;border-radius:10px;background:#f4f4f8;border-left:4px solid #1a1a2e}
  .summary-card.green{border-color:#16a34a;background:#f0fdf4}
  .summary-card.red{border-color:#dc2626;background:#fef2f2}
  .summary-label{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#888}
  .summary-value{font-size:22px;font-weight:700;margin-top:2px}
  .student-card{border:1px solid #e2e2ec;border-radius:12px;padding:16px;margin-bottom:18px;page-break-inside:avoid}
  .student-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px;flex-wrap:wrap;gap:8px}
  .student-name{font-size:15px;font-weight:700;color:#1a1a2e}
  .student-meta{font-size:11px;color:#666;margin-top:2px}
  .qualified-badge{font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px}
  .qualified{background:#f0fdf4;color:#16a34a;border:1px solid #bbf7d0}
  .not-qualified{background:#fef2f2;color:#dc2626;border:1px solid #fecaca}
  .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:10px}
  .stat-box{padding:10px 12px;border-radius:8px;background:#f8f8fc;border-left:3px solid #ccc}
  .stat-label{font-size:9px;text-transform:uppercase;letter-spacing:.8px;color:#888;margin-bottom:2px}
  .stat-value{font-size:18px;font-weight:800;line-height:1}
  .stat-sub{font-size:9px;color:#999;margin-top:2px}
  .feedback-row{font-size:11px;color:#b91c1c;background:#fef2f2;border:1px solid #fecaca;border-radius:6px;padding:6px 10px;margin-top:6px}
  .absent-row{color:#b45309;background:#fffbeb;border-color:#fde68a}
  .report-footer{margin-top:36px;padding-top:16px;border-top:1px solid #ddd;display:flex;justify-content:space-between;font-size:10px;color:#999}
  .confidential{font-weight:700;color:#dc2626;letter-spacing:1px;text-transform:uppercase}
  @media print{body{padding:16px 20px}@page{margin:12mm;size:A4}}
</style>
</head><body>
  <div class="report-header">
    <div>
      <div class="report-title">CC Club Member Report</div>
      <div class="report-subtitle">${college} · Generated ${today}</div>
    </div>
    <div class="report-meta">
      <div><strong>Total Members:</strong> ${members.length}</div>
      <div><strong>Total Meetings:</strong> ${reports.length}</div>
      <div><strong>Qualified:</strong> ${qualified} / ${members.length}</div>
    </div>
  </div>

  <div class="summary-strip">
    <div class="summary-card"><div class="summary-label">Total Members</div><div class="summary-value">${members.length}</div></div>
    <div class="summary-card green"><div class="summary-label">Qualified</div><div class="summary-value">${qualified}</div></div>
    <div class="summary-card red"><div class="summary-label">Not Qualified</div><div class="summary-value">${members.length - qualified}</div></div>
    <div class="summary-card"><div class="summary-label">Meetings Held</div><div class="summary-value">${reports.length}</div></div>
  </div>

  ${rows}

  <div class="report-footer">
    <span class="confidential">Confidential — CC Club Internal Report</span>
    <span>Qualification: ≥75% attendance + ≥2 speeches approved + no missed videos</span>
  </div>
  <script>window.onload=()=>window.print();</script>
</body></html>`;

  const win = window.open("", "_blank");
  if (win) { win.document.write(html); win.document.close(); }
  else toast.error("Popup blocked — please allow popups.");
};

// ── Main Dashboard ────────────────────────────────────────────
const CCPresidentDashboard: React.FC<CCPresidentDashboardProps> = ({ user }) => {
  const [members, setMembers] = useState<CCUser[]>([]);
  const [reports, setReports] = useState<CCMeetingReport[]>([]);
  const [videos, setVideos] = useState<CCMeetingVideoSubmission[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<
    Record<string, { present: number; total: number; percentage: number }>
  >({});
  const [speechesMap, setSpeechesMap] = useState<Record<string, CCSpeech[]>>({});
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [memberList, reportData, videoData, attStats] = await Promise.all([
        getCCUsersByCollege(user.college),
        getMeetingReports(user.college),
        getCollegeMeetingVideos(user.college),
        getCCAttendanceStats(user.college),
      ]);
      setMembers(memberList);
      setReports(reportData);
      setVideos(videoData);
      setAttendanceStats(attStats);
    } finally {
      setLoading(false);
    }
  }, [user.college]);

  // ── Pending Speech Validations state ──
  const [pendingSpeeches, setPendingSpeeches] = useState<{ uid: string; name: string; speech: CCSpeech }[]>([]);
  const [validating, setValidating] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({});

  const loadPendingSpeeches = useCallback(async () => {
    try {
      const ps = await getPendingPresidentSpeeches(user.college);
      setPendingSpeeches(ps);
    } catch { /* non-critical */ }
  }, [user.college]);

  const handleValidate = async (uid: string, speechId: string) => {
    setValidating(speechId);
    try {
      await validateSpeech(uid, speechId);
      toast.success("Speech forwarded to Trainer!");
      loadPendingSpeeches();
    } catch {
      toast.error("Validation failed.");
    } finally {
      setValidating(null);
    }
  };

  const handleReject = async (uid: string, speechId: string) => {
    const reason = rejectReason[speechId]?.trim() || "Invalid video. Please re-record.";
    setValidating(speechId);
    try {
      await rejectSpeech(uid, speechId, reason);
      toast.success("Speech rejected — student will be notified.");
      loadPendingSpeeches();
    } catch {
      toast.error("Rejection failed.");
    } finally {
      setValidating(null);
    }
  };

  useEffect(() => { loadAll(); loadPendingSpeeches(); }, [loadAll, loadPendingSpeeches]);

  const handleExport = async () => {
    setExporting(true);
    try {
      // Fetch speeches for all members
      const map: Record<string, CCSpeech[]> = {};
      await Promise.all(
        members.map(async (m) => {
          map[m.uid] = await getCCSpeeches(m.uid);
        })
      );
      setSpeechesMap(map);
      exportPresidentReport(user.college, members, reports, videos, attendanceStats, map);
    } catch {
      toast.error("Failed to generate report.");
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "12px", color: "var(--cc-text-muted)" }}>
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
      {/* President Welcome Banner */}
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
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <Crown size={18} color="var(--cc-amber)" fill="var(--cc-amber)" />
            <span className="cc-chip cc-chip-amber" style={{ fontSize: "0.68rem" }}>
              Club President
            </span>
          </div>
          <h1 style={{ fontSize: "clamp(1.2rem, 3vw, 1.6rem)", fontWeight: 800, color: "var(--cc-text)", marginBottom: "4px" }}>
            Welcome, <span className="cc-text-amber-gradient">{user.name}</span> 👑
          </h1>
          <p style={{ fontSize: "0.82rem", color: "var(--cc-text-muted)" }}>
            {user.college} · {members.length} members · {reports.length} meetings held
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          {/* Export Report button */}
          <button
            type="button"
            onClick={handleExport}
            disabled={exporting}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "10px 18px",
              borderRadius: "12px",
              background: "var(--cc-grad-accent)",
              border: "none",
              color: "hsl(210 18% 8%)",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
              opacity: exporting ? 0.7 : 1,
            }}
          >
            {exporting ? (
              <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
            ) : (
              <FileDown size={14} />
            )}
            {exporting ? "Generating..." : "Export Club Report"}
          </button>

          {/* Points badge */}
          <div style={{ padding: "12px 20px", borderRadius: "14px", background: "var(--cc-amber-soft)", border: "1px solid var(--cc-amber)", textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--cc-amber)", lineHeight: 1 }}>
              {user.total_points}
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--cc-text-muted)", marginTop: "2px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Points
            </div>
          </div>
        </div>
      </div>

      {/* Meeting Operations */}
      <CCMeetingPanel president={user} />

      {/* ── Pending Speech Validations ── */}
      {pendingSpeeches.length > 0 && (
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
              marginBottom: "1.25rem",
            }}
          >
            <Mic2 size={16} color="var(--cc-accent-bright)" />
            Pending Speech Validations
            <span
              style={{
                fontSize: "0.68rem",
                padding: "2px 8px",
                borderRadius: "999px",
                background: "hsl(38 40% 14%)",
                color: "hsl(38 80% 55%)",
                border: "1px solid hsl(38 40% 28%)",
                fontWeight: 700,
              }}
            >
              {pendingSpeeches.length} pending
            </span>
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {pendingSpeeches.map(({ uid, name, speech }) => (
              <div
                key={`${uid}_${speech.speech_id}`}
                style={{
                  borderRadius: "14px",
                  padding: "14px 16px",
                  background: "var(--cc-surface-inset)",
                  boxShadow: "var(--cc-neu-inset-xs)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
                  <div>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--cc-text)" }}>
                      {name}
                    </span>
                    <span style={{ fontSize: "0.72rem", color: "var(--cc-text-faint)", marginLeft: "8px" }}>
                      {speech.title} {(speech.version || 1) > 1 ? `(v${speech.version})` : ""}
                    </span>
                    {speech.youtubeUrl && (
                      <div style={{ marginTop: "6px" }}>
                        <CCInlineVideoPlayer url={speech.youtubeUrl} />
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--cc-amber)" }}>
                    <Clock size={11} style={{ verticalAlign: "middle", marginRight: "3px" }} />
                    Awaiting Validation
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <input
                    type="text"
                    placeholder="Rejection reason (optional)"
                    value={rejectReason[speech.speech_id] || ""}
                    onChange={(e) => setRejectReason((p) => ({ ...p, [speech.speech_id]: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      background: "hsl(210 18% 10%)",
                      border: "1px solid var(--cc-border)",
                      color: "var(--cc-text)",
                      fontSize: "0.8rem",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      type="button"
                      onClick={() => handleValidate(uid, speech.speech_id)}
                      disabled={validating === speech.speech_id}
                      style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: "8px",
                        background: "var(--cc-surface-deep)",
                        boxShadow: "var(--cc-neu-sm)",
                        color: "var(--cc-success)",
                        fontWeight: 700,
                        fontSize: "0.78rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "5px",
                        border: "none",
                      }}
                    >
                      <Forward size={13} /> Validate & Forward
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(uid, speech.speech_id)}
                      disabled={validating === speech.speech_id}
                      style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: "8px",
                        background: "var(--cc-surface-deep)",
                        boxShadow: "var(--cc-neu-sm)",
                        color: "var(--cc-danger)",
                        fontWeight: 700,
                        fontSize: "0.78rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "5px",
                        border: "none",
                      }}
                    >
                      <XCircle size={13} /> Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video review panel */}
      <VideoReviewPanel
        members={members}
        reports={reports}
        videos={videos}
        onEvaluated={loadAll}
      />

      {/* Progress Timeline */}
      <CCProgressTimeline currentLevel={user.current_level} />

      {/* Gamification */}
      <CCGamificationPanel user={user} />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default CCPresidentDashboard;