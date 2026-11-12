import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  getCCUser,
  getCCSpeeches,
  getCCUsersByCollege,
  getMeetingReports,
  getCollegeMeetingVideos,
  computeAttendanceStats,
  validateMeetingVideo,
  rejectMeetingVideo,
  getPendingPresidentSpeeches,
  validateSpeech,
  rejectSpeech,
  getEffectiveWorkflowState,
  getSpeechDisplayStatus,
  type AttendanceStats,
  type CCUser,
  type CCSpeech,
  type CCMeetingReport,
  type CCMeetingVideoSubmission,
} from "@/lib/ccClub";
import CCProgressTimeline from "./CCProgressTimeline";
import CCGamificationPanel from "./CCGamificationPanel";
import CCMeetingPanel from "./CCMeetingPanel";
import CCInlineVideoPlayer from "./CCInlineVideoPlayer";
import CCAvatarUpload from "./CCAvatarUpload";
import {
  Loader2,
  Crown,
  FileDown,
  XCircle,
  Clock,
  Video,
  ChevronDown,
  ChevronUp,
  Mic2,
  Forward,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

interface CCPresidentDashboardProps {
  user: CCUser;
}

type PendingSpeech = { uid: string; name: string; speech: CCSpeech };

// ── Review action row (shared by speeches and meeting videos) ──
const ReviewActions: React.FC<{
  busy: boolean;
  approveLabel: string;
  placeholder: string;
  onApprove: () => void;
  onReject: (reason: string) => void;
}> = ({ busy, approveLabel, placeholder, onApprove, onReject }) => {
  const [reason, setReason] = useState("");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <input
        className="cc-input"
        type="text"
        aria-label="Feedback for the student"
        placeholder={placeholder}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
      <div style={{ display: "flex", gap: "8px" }}>
        <button type="button" className="cc-btn-action cc-btn-action--success" style={{ flex: 1 }} disabled={busy} onClick={onApprove}>
          {busy ? <Loader2 size={13} className="cc-spin" /> : <Forward size={13} />} {approveLabel}
        </button>
        <button
          type="button"
          className="cc-btn-action cc-btn-action--danger"
          style={{ flex: 1 }}
          disabled={busy}
          onClick={() => {
            if (!reason.trim()) {
              toast.error("Add a short reason so the student knows what to fix.");
              return;
            }
            onReject(reason.trim());
          }}
        >
          <XCircle size={13} /> Reject
        </button>
      </div>
    </div>
  );
};

// ── President Video Review Panel ──────────────────────────────
const VIDEO_STATE_LABEL: Record<string, { label: string; color: string }> = {
  submitted_to_president: { label: "Pending Validation", color: "var(--cc-amber)" },
  validated: { label: "Forwarded", color: "var(--cc-accent-bright)" },
  evaluated: { label: "Evaluated", color: "var(--cc-success)" },
  needs_redo: { label: "Needs Redo", color: "var(--cc-danger)" },
};

const VideoReviewPanel: React.FC<{
  members: CCUser[];
  reports: CCMeetingReport[];
  videos: CCMeetingVideoSubmission[];
  onEvaluated: () => void;
}> = ({ members, reports, videos, onEvaluated }) => {
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const videoMap = useMemo(() => Object.fromEntries(videos.map((v) => [`${v.report_id}_${v.uid}`, v])), [videos]);
  const pendingCount = videos.filter((v) => getEffectiveWorkflowState(v) === "submitted_to_president").length;

  const run = async (key: string, action: () => Promise<void>, okMsg: string, failMsg: string) => {
    setBusyKey(key);
    try {
      await action();
      toast.success(okMsg);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : failMsg);
    } finally {
      setBusyKey(null);
      onEvaluated(); // always re-sync — the item may have been handled elsewhere
    }
  };

  if (reports.length === 0) return null;

  return (
    <div className="cc-card">
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
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 0,
          marginBottom: expanded ? "1.25rem" : 0,
          fontFamily: "inherit",
        }}
      >
        <h3 className="cc-card-title" style={{ flexWrap: "wrap" }}>
          <Video size={16} color="var(--cc-accent-bright)" />
          Meeting Video Reviews
          {pendingCount > 0 && <span className="cc-chip cc-chip-amber">{pendingCount} pending</span>}
        </h3>
        {expanded ? <ChevronUp size={16} color="var(--cc-text-faint)" /> : <ChevronDown size={16} color="var(--cc-text-faint)" />}
      </button>

      {expanded && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {reports.map((report) => {
            const withSubmission = members.filter((m) => videoMap[`${report.id}_${m.uid}`]);
            if (withSubmission.length === 0) return null;

            return (
              <div key={report.id}>
                <div className="cc-eyebrow" style={{ marginBottom: "8px" }}>Week {report.week_number}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {withSubmission.map((member) => {
                    const key = `${report.id}_${member.uid}`;
                    const video = videoMap[key];
                    const state = getEffectiveWorkflowState(video) ?? "submitted_to_president";
                    const cfg = VIDEO_STATE_LABEL[state];

                    return (
                      <div key={key} className="cc-well-deep" style={{ padding: "12px 14px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
                          <div>
                            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--cc-text)" }}>{member.name}</span>
                            {(video.version ?? 1) > 1 && (
                              <span style={{ fontSize: "0.68rem", marginLeft: "8px", color: "var(--cc-text-faint)" }}>v{video.version}</span>
                            )}
                            <div style={{ marginTop: "6px" }}>
                              <CCInlineVideoPlayer url={video.video_url} />
                            </div>
                          </div>
                          <span style={{ fontSize: "0.72rem", fontWeight: 600, color: cfg.color }}>{cfg.label}</span>
                        </div>

                        {state === "submitted_to_president" && (
                          <ReviewActions
                            busy={busyKey === key}
                            approveLabel="Validate & Forward"
                            placeholder="Reason (required if you reject)"
                            onApprove={() => run(key, () => validateMeetingVideo(report.id!, member.uid), "Video approved & forwarded to Trainer", "Failed to approve. Try again.")}
                            onReject={(reason) => run(key, () => rejectMeetingVideo(report.id!, member.uid, reason), "Video sent back for a redo", "Failed to reject. Try again.")}
                          />
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
/** Everything interpolated into the report HTML must be escaped — names/notes are user-controlled. */
const esc = (value: unknown): string =>
  String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));

const exportPresidentReport = (
  college: string,
  members: CCUser[],
  reports: CCMeetingReport[],
  videos: CCMeetingVideoSubmission[],
  attendanceStats: AttendanceStats,
  speechesMap: Record<string, CCSpeech[]>
) => {
  const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  const videoMap = Object.fromEntries(videos.map((v) => [`${v.report_id}_${v.uid}`, v]));

  // One evaluation per member — the same numbers drive the card and the summary strip.
  const evaluated = members.map((member) => {
    const att = attendanceStats[member.uid] ?? { present: 0, total: 0, percentage: 0 };
    const memberSpeeches = speechesMap[member.uid] ?? [];
    const speechCount = (s: string) => memberSpeeches.filter((x) => getSpeechDisplayStatus(x) === s).length;
    const wellDone = speechCount("Well Done");
    const redo = speechCount("Redo");
    const pending = speechCount("Pending Review");
    const notStarted = speechCount("Not Started");

    const memberVideos = videos.filter((v) => v.uid === member.uid);
    const videoCount = (st: string) => memberVideos.filter((v) => getEffectiveWorkflowState(v) === st).length;
    const videoWellDone = videoCount("evaluated");
    const videoRedo = videoCount("needs_redo");
    const videoPending = videoCount("submitted_to_president") + videoCount("validated");
    const videoAbsent = reports.filter(
      (r) => !r.attendance?.find((a) => a.uid === member.uid)?.present && !videoMap[`${r.id}_${member.uid}`]
    ).length;

    const qualified = att.percentage >= 75 && wellDone >= 2 && videoRedo === 0 && videoAbsent === 0;
    return { member, att, wellDone, redo, pending, notStarted, memberVideos, videoWellDone, videoRedo, videoPending, videoAbsent, qualified };
  });

  const rows = evaluated
    .map(({ member, att, wellDone, redo, pending, notStarted, memberVideos, videoWellDone, videoRedo, videoPending, videoAbsent, qualified }) => {
      const attColor = att.percentage >= 75 ? "#16a34a" : att.percentage >= 50 ? "#d97706" : "#dc2626";
      return `
    <div class="student-card">
      <div class="student-header">
        <div>
          <div class="student-name">${esc(member.name)}</div>
          <div class="student-meta">${esc(member.email)} · ${esc(member.club_role)}</div>
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
          <div class="stat-value" style="color:#8b5cf6">${Number(member.total_points) || 0}</div>
          <div class="stat-sub">Level ${Number(member.current_level) || 1}</div>
        </div>
      </div>

      ${memberVideos
        .filter((v) => getEffectiveWorkflowState(v) === "needs_redo" && (v.trainerRemarks || v.evaluator_notes))
        .map(
          (v) => `
        <div class="feedback-row">
          <span class="feedback-label">⚠ Week ${Number(v.week_number)} Redo:</span>
          ${esc(v.trainerRemarks || v.evaluator_notes)}
        </div>
      `
        )
        .join("")}

      ${videoAbsent > 0 ? `<div class="feedback-row absent-row">⛔ ${videoAbsent} meeting(s) missed without video submission</div>` : ""}
    </div>`;
    })
    .join("");

  const qualifiedCount = evaluated.filter((e) => e.qualified).length;

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
<title>CC Club Report — ${esc(college)}</title>
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
      <div class="report-subtitle">${esc(college)} · Generated ${esc(today)}</div>
    </div>
    <div class="report-meta">
      <div><strong>Total Members:</strong> ${members.length}</div>
      <div><strong>Total Meetings:</strong> ${reports.length}</div>
      <div><strong>Qualified:</strong> ${qualifiedCount} / ${members.length}</div>
    </div>
  </div>

  <div class="summary-strip">
    <div class="summary-card"><div class="summary-label">Total Members</div><div class="summary-value">${members.length}</div></div>
    <div class="summary-card green"><div class="summary-label">Qualified</div><div class="summary-value">${qualifiedCount}</div></div>
    <div class="summary-card red"><div class="summary-label">Not Qualified</div><div class="summary-value">${members.length - qualifiedCount}</div></div>
    <div class="summary-card"><div class="summary-label">Meetings Held</div><div class="summary-value">${reports.length}</div></div>
  </div>

  ${rows}

  <div class="report-footer">
    <span class="confidential">Confidential — CC Club Internal Report</span>
    <span>Qualification: ≥75% attendance + ≥2 speeches approved + no missed or redo videos</span>
  </div>
  <script>window.onload=()=>window.print();</script>
</body></html>`;

  const win = window.open("", "_blank");
  if (win) {
    win.document.write(html);
    win.document.close();
  } else toast.error("Popup blocked — please allow popups.");
};

// ── Main Dashboard ────────────────────────────────────────────
const CCPresidentDashboard: React.FC<CCPresidentDashboardProps> = ({ user: initialUser }) => {
  const [user, setUser] = useState<CCUser>(initialUser);
  const [members, setMembers] = useState<CCUser[]>([]);
  const [reports, setReports] = useState<CCMeetingReport[]>([]);
  const [videos, setVideos] = useState<CCMeetingVideoSubmission[]>([]);
  const [pendingSpeeches, setPendingSpeeches] = useState<PendingSpeech[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [busySpeech, setBusySpeech] = useState<string | null>(null);

  const attendanceStats = useMemo(() => computeAttendanceStats(reports), [reports]);

  const loadAll = useCallback(
    async (silent = false) => {
      if (silent) setRefreshing(true);
      else setLoading(true);
      setLoadError(false);
      try {
        const [fresh, memberList, reportData] = await Promise.all([
          getCCUser(initialUser.uid),
          getCCUsersByCollege(initialUser.college),
          getMeetingReports(initialUser.college),
        ]);
        // The president reviews work — they aren't one of the trainees being tracked.
        const trainees = memberList.filter((m) => m.uid !== initialUser.uid);
        const [videoData, pending] = await Promise.all([
          getCollegeMeetingVideos(initialUser.college, reportData),
          getPendingPresidentSpeeches(initialUser.college, trainees),
        ]);
        if (fresh) setUser(fresh);
        setMembers(trainees);
        setReports(reportData);
        setVideos(videoData);
        setPendingSpeeches(pending);
      } catch (err) {
        console.error("President dashboard load failed:", err);
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

  const runSpeechAction = async (speechKey: string, action: () => Promise<void>, okMsg: string, failMsg: string) => {
    setBusySpeech(speechKey);
    try {
      await action();
      toast.success(okMsg);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : failMsg);
    } finally {
      setBusySpeech(null);
      loadAll(true);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const map: Record<string, CCSpeech[]> = {};
      await Promise.all(
        members.map(async (m) => {
          map[m.uid] = await getCCSpeeches(m.uid);
        })
      );
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
        <Loader2 size={22} className="cc-spin" />
        Loading your dashboard...
      </div>
    );
  }

  if (loadError && reports.length === 0 && members.length === 0) {
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
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: -1, borderRadius: "30px" }} aria-hidden="true">
        <div className="cc-animate-shimmer" style={{ position: "absolute", top: "5%", left: "0%", width: "45vw", height: "45vw", background: "var(--cc-orb-purple)", filter: "blur(60px)" }} />
        <div className="cc-animate-shimmer" style={{ position: "absolute", top: "35%", right: "0%", width: "40vw", height: "40vw", background: "var(--cc-orb-amber)", filter: "blur(60px)", animationDelay: "2s" }} />
        <div className="cc-animate-shimmer" style={{ position: "absolute", bottom: "10%", left: "15%", width: "50vw", height: "50vw", background: "var(--cc-orb-teal)", filter: "blur(60px)", animationDelay: "4s" }} />
      </div>

      {/* President welcome banner */}
      <div className="cc-card-hero" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", minWidth: 0 }}>
          <CCAvatarUpload uid={user.uid} name={user.name} initialUrl={user.profilePictureUrl} accent="var(--cc-amber)" />
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <Crown size={18} color="var(--cc-amber)" fill="var(--cc-amber)" />
              <span className="cc-chip cc-chip-amber" style={{ fontSize: "0.68rem" }}>Club President</span>
            </div>
            <h1 style={{ fontSize: "clamp(1.2rem, 3vw, 1.6rem)", fontWeight: 800, color: "var(--cc-text)", marginBottom: "4px" }}>
              Welcome, <span className="cc-text-amber-gradient">{user.name}</span> 👑
            </h1>
            <p style={{ fontSize: "0.82rem", color: "var(--cc-text-muted)" }}>
              {user.college} · {members.length} members · {reports.length} meetings held
            </p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <button type="button" className="cc-btn-action" onClick={() => loadAll(true)} disabled={refreshing} title="Refresh submissions and points">
            <RefreshCw size={14} className={refreshing ? "cc-spin" : undefined} /> Refresh
          </button>
          <button type="button" className="cc-btn-primary" onClick={handleExport} disabled={exporting} style={{ display: "flex", alignItems: "center", gap: "7px", padding: "10px 18px", borderRadius: "12px", fontSize: "0.9rem" }}>
            {exporting ? <Loader2 size={14} className="cc-spin" /> : <FileDown size={14} />}
            {exporting ? "Generating..." : "Export Club Report"}
          </button>
          <div className="cc-well-deep" style={{ padding: "12px 20px", borderRadius: "14px", textAlign: "center", boxShadow: "var(--cc-neu-inset-sm), var(--cc-glow-amber-sm)" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--cc-amber)", lineHeight: 1 }}>{user.total_points ?? 0}</div>
            <div className="cc-eyebrow" style={{ marginTop: "2px" }}>Points</div>
          </div>
        </div>
      </div>

      <CCMeetingPanel president={user} onReportCreated={() => loadAll(true)} />

      {pendingSpeeches.length > 0 && (
        <div className="cc-card">
          <h3 className="cc-card-title" style={{ marginBottom: "1.25rem", flexWrap: "wrap" }}>
            <Mic2 size={16} color="var(--cc-accent-bright)" />
            Pending Speech Validations
            <span className="cc-chip cc-chip-amber">{pendingSpeeches.length} pending</span>
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {pendingSpeeches.map(({ uid, name, speech }) => {
              const key = `${uid}_${speech.speech_id}`;
              return (
                <div key={`${key}_v${speech.version ?? 1}`} className="cc-well-deep" style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
                    <div>
                      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--cc-text)" }}>{name}</span>
                      <span style={{ fontSize: "0.72rem", color: "var(--cc-text-faint)", marginLeft: "8px" }}>
                        {speech.title} {(speech.version ?? 1) > 1 ? `(v${speech.version})` : ""}
                      </span>
                      {speech.youtubeUrl && (
                        <div style={{ marginTop: "6px" }}>
                          <CCInlineVideoPlayer url={speech.youtubeUrl} />
                        </div>
                      )}
                    </div>
                    <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--cc-amber)", display: "flex", alignItems: "center", gap: "3px" }}>
                      <Clock size={11} /> Awaiting Validation
                    </span>
                  </div>
                  <ReviewActions
                    busy={busySpeech === key}
                    approveLabel="Approve & Forward"
                    placeholder="Reason (required if you reject)"
                    onApprove={() => runSpeechAction(key, () => validateSpeech(uid, speech.speech_id), "Speech forwarded to Trainer!", "Validation failed.")}
                    onReject={(reason) => runSpeechAction(key, () => rejectSpeech(uid, speech.speech_id, reason), "Speech sent back — the student can resubmit.", "Rejection failed.")}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      <VideoReviewPanel members={members} reports={reports} videos={videos} onEvaluated={() => loadAll(true)} />

      <CCProgressTimeline currentLevel={(user.current_level ?? 1) as 1 | 2 | 3 | 4} />

      <CCGamificationPanel user={user} />
    </div>
  );
};

export default CCPresidentDashboard;
