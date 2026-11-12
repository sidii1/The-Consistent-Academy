import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  getCCUsersByCollege,
  getValidatedSpeeches,
  getCCSpeeches,
  getMeetingReports,
  evaluateSpeechByTrainer,
  getValidatedMeetingVideos,
  evaluateMeetingVideoByTrainer,
  getSpeechDisplayStatus,
  getEffectiveWorkflowState,
  type CCUser,
  type CCSpeech,
  type CCMeetingVideoSubmission,
} from "@/lib/ccClub";
import CCInlineVideoPlayer from "./CCInlineVideoPlayer";
import CCAvatarUpload from "./CCAvatarUpload";
import { toast } from "sonner";
import {
  Loader2,
  ChevronDown,
  ChevronUp,
  Send,
  BarChart3,
  Users,
  AlertTriangle,
  RefreshCw,
  GraduationCap,
  Inbox,
} from "lucide-react";

interface CCTrainerDashboardProps {
  user: CCUser;
}

interface StudentGroup {
  user: CCUser;
  speeches: CCSpeech[]; // validated speeches awaiting trainer evaluation
  meetingVideos: CCMeetingVideoSubmission[]; // validated meeting videos awaiting evaluation
  allSpeeches: CCSpeech[]; // all speeches, for analytics
}

// ── Evaluation form (shared by speeches and meeting videos) ───────────────────
interface EvaluationFormProps {
  withPoints: boolean;
  submitting: boolean;
  hasPresident: boolean;
  onSubmit: (v: { remarks: string; needsRedo: boolean; studentPts: number; presidentPts: number }) => void;
}

const clamp10 = (n: number) => Math.min(10, Math.max(0, Number.isFinite(n) ? Math.round(n) : 0));

const EvaluationForm: React.FC<EvaluationFormProps> = ({ withPoints, submitting, hasPresident, onSubmit }) => {
  const [remarks, setRemarks] = useState("");
  const [needsRedo, setNeedsRedo] = useState(false);
  const [studentPts, setStudentPts] = useState(0);
  const [presidentPts, setPresidentPts] = useState(0);

  const handle = () => {
    if (needsRedo && !remarks.trim()) {
      toast.error("Please explain what the student should improve before requesting a redo.");
      return;
    }
    if (!needsRedo && withPoints && studentPts === 0) {
      if (!window.confirm("You're approving with 0 student points. Continue?")) return;
    }
    onSubmit({ remarks, needsRedo, studentPts: clamp10(studentPts), presidentPts: clamp10(presidentPts) });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <textarea
        className="cc-input"
        aria-label="Trainer remarks"
        placeholder={needsRedo ? "What should the student improve? (required for a redo)" : "Trainer remarks / feedback..."}
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
        rows={3}
        style={{ lineHeight: 1.6 }}
      />

      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.78rem", color: "var(--cc-danger)", cursor: "pointer", fontWeight: 600 }}>
          <input type="checkbox" checked={needsRedo} onChange={(e) => setNeedsRedo(e.target.checked)} style={{ accentColor: "#F87171" }} />
          Needs Redo
        </label>

        {withPoints && !needsRedo && (
          <>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.78rem", color: "var(--cc-text-muted)" }}>
              Student points
              <input
                className="cc-input cc-input-num"
                type="number"
                min={0}
                max={10}
                value={studentPts}
                onChange={(e) => setStudentPts(clamp10(Number(e.target.value)))}
              />
              /10
            </label>
            <label
              style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.78rem", color: "var(--cc-text-muted)" }}
              title={hasPresident ? "Credited to the college President" : "No President is registered for this college — these points will not be credited"}
            >
              President points
              <input
                className="cc-input cc-input-num"
                type="number"
                min={0}
                max={10}
                value={presidentPts}
                onChange={(e) => setPresidentPts(clamp10(Number(e.target.value)))}
                disabled={!hasPresident}
              />
              /10
            </label>
          </>
        )}
      </div>

      <button
        type="button"
        onClick={handle}
        disabled={submitting}
        className="cc-btn-primary"
        style={{ padding: "10px", borderRadius: "12px", fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
      >
        {submitting ? <Loader2 size={13} className="cc-spin" /> : <Send size={13} />}
        {submitting ? "Submitting..." : needsRedo ? "Send Back for Redo" : "Submit Evaluation"}
      </button>
    </div>
  );
};

const CCTrainerDashboard: React.FC<CCTrainerDashboardProps> = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [studentGroups, setStudentGroups] = useState<StudentGroup[]>([]);
  const [president, setPresident] = useState<CCUser | null>(null);
  const [expandedUid, setExpandedUid] = useState<string | null>(null);
  const [submittingKey, setSubmittingKey] = useState<string | null>(null);

  const loadAll = useCallback(
    async (silent = false) => {
      if (silent) setRefreshing(true);
      else setLoading(true);
      setLoadError(null);
      try {
        const members = await getCCUsersByCollege(user.college);
        const reports = await getMeetingReports(user.college);

        // Everything else is independent — fetch it in parallel instead of one student at a time.
        const [validatedList, validatedVideos, speechesPerMember] = await Promise.all([
          getValidatedSpeeches(user.college, members),
          getValidatedMeetingVideos(user.college, reports),
          Promise.all(members.map((m) => getCCSpeeches(m.uid))),
        ]);

        const groups: StudentGroup[] = members
          .map((m, i) => ({
            user: m,
            allSpeeches: speechesPerMember[i],
            speeches: validatedList.filter((v) => v.uid === m.uid).map((v) => v.speech),
            meetingVideos: validatedVideos.filter((v) => v.uid === m.uid),
          }))
          // Presidents review rather than submit, so they aren't part of the trainee list.
          .filter((g) => g.user.club_role !== "President");

        // Students with work waiting float to the top.
        groups.sort(
          (a, b) =>
            b.speeches.length + b.meetingVideos.length - (a.speeches.length + a.meetingVideos.length) ||
            a.user.name.localeCompare(b.user.name)
        );

        setPresident(members.find((m) => m.club_role === "President") ?? null);
        setStudentGroups(groups);
        // Open the first student with pending work so the trainer lands on something actionable.
        setExpandedUid((prev) => prev ?? groups.find((g) => g.speeches.length + g.meetingVideos.length > 0)?.user.uid ?? null);
      } catch (err) {
        console.error("TRAINER DASHBOARD LOAD ERROR:", err);
        const message = err instanceof Error ? err.message : String(err);
        setLoadError(message);
        toast.error("Failed to load trainer data: " + message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user.college]
  );

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleEvaluateSpeech = async (
    uid: string,
    speechId: string,
    v: { remarks: string; needsRedo: boolean; studentPts: number; presidentPts: number }
  ) => {
    const key = `${uid}_${speechId}`;
    setSubmittingKey(key);
    try {
      const result = await evaluateSpeechByTrainer(uid, speechId, {
        remarks: v.remarks,
        needsRedo: v.needsRedo,
        studentPoints: v.studentPts,
        presidentPoints: v.presidentPts,
      });
      if (v.needsRedo) {
        toast.success("Sent back to the student for a redo.");
      } else {
        const bits = [`+${v.studentPts} pts to student`];
        if (result.presidentCredited) bits.push(`+${v.presidentPts} to President`);
        else if (v.presidentPts > 0) bits.push("President points not credited (no President found)");
        if (result.newLevel) bits.push(`🎉 reached Level ${result.newLevel}`);
        toast.success(`Evaluation submitted — ${bits.join(", ")}.`);
      }
      await loadAll(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Evaluation failed.");
      loadAll(true); // the item may already have been handled — show the truth
    } finally {
      setSubmittingKey(null);
    }
  };

  const handleEvaluateMeetingVideo = async (
    uid: string,
    reportId: string,
    v: { remarks: string; needsRedo: boolean }
  ) => {
    const key = `${uid}_${reportId}_mv`;
    setSubmittingKey(key);
    try {
      await evaluateMeetingVideoByTrainer(reportId, uid, v);
      toast.success(v.needsRedo ? "Sent back to the student for a redo." : "Meeting video evaluated!");
      await loadAll(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Evaluation failed.");
      loadAll(true);
    } finally {
      setSubmittingKey(null);
    }
  };

  // ── Analytics ──
  const { averageScore, noSubmissions, redoCount, totalPending } = useMemo(() => {
    const scores = studentGroups.flatMap((g) =>
      g.allSpeeches
        .filter((s) => getEffectiveWorkflowState(s) === "evaluated" && s.studentPointsAwarded !== undefined)
        .map((s) => s.studentPointsAwarded as number)
    );
    return {
      averageScore: scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : "N/A",
      noSubmissions: studentGroups.filter((g) => g.allSpeeches.every((s) => getSpeechDisplayStatus(s) === "Not Started")).length,
      redoCount: studentGroups.filter((g) => g.allSpeeches.some((s) => getSpeechDisplayStatus(s) === "Redo")).length,
      totalPending: studentGroups.reduce((acc, g) => acc + g.speeches.length + g.meetingVideos.length, 0),
    };
  }, [studentGroups]);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "12px", color: "var(--cc-text-muted)" }}>
        <Loader2 size={22} className="cc-spin" />
        Loading trainer dashboard...
      </div>
    );
  }

  if (loadError && studentGroups.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "14px", color: "var(--cc-text-muted)", textAlign: "center", padding: "1rem" }}>
        <AlertTriangle size={26} color="var(--cc-danger)" />
        <p style={{ fontSize: "0.9rem" }}>We couldn't load your students.</p>
        <button type="button" className="cc-btn-primary" style={{ padding: "10px 20px", borderRadius: "12px" }} onClick={() => loadAll()}>
          Try again
        </button>
      </div>
    );
  }

  const analytics = [
    { label: "Avg. Student Score", value: averageScore, sub: "out of 10", color: "var(--cc-teal)" },
    { label: "Awaiting You", value: totalPending, sub: "submissions to evaluate", color: totalPending > 0 ? "var(--cc-amber)" : "var(--cc-success)" },
    { label: "No Submissions", value: noSubmissions, sub: "students haven't submitted", color: noSubmissions > 0 ? "var(--cc-danger)" : "var(--cc-success)" },
    { label: "Requiring Re-dos", value: redoCount, sub: "students with redo speeches", color: redoCount > 0 ? "var(--cc-amber)" : "var(--cc-success)" },
  ];

  return (
    <div
      className="cc-dashboard-root"
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "2rem 1.5rem",
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr)",
        gap: "1.5rem",
        position: "relative",
      }}
    >
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: -1, borderRadius: "30px" }} aria-hidden="true">
        <div className="cc-animate-shimmer" style={{ position: "absolute", top: "5%", left: "0%", width: "45vw", height: "45vw", background: "var(--cc-orb-teal)", filter: "blur(60px)" }} />
        <div className="cc-animate-shimmer" style={{ position: "absolute", top: "35%", right: "0%", width: "40vw", height: "40vw", background: "var(--cc-orb-purple)", filter: "blur(60px)", animationDelay: "2s" }} />
      </div>

      {/* Welcome header */}
      <div className="cc-card-hero" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", minWidth: 0 }}>
          <CCAvatarUpload uid={user.uid} name={user.name} initialUrl={user.profilePictureUrl} accent="var(--cc-teal)" />
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <GraduationCap size={18} color="var(--cc-teal)" />
              <span className="cc-chip cc-chip-teal" style={{ fontSize: "0.68rem" }}>Trainer</span>
            </div>
            <h1 style={{ fontSize: "clamp(1.2rem, 3vw, 1.6rem)", fontWeight: 800, color: "var(--cc-text)", marginBottom: "4px" }}>
              Welcome, <span className="cc-text-teal-gradient">{user.name}</span>
            </h1>
            <p style={{ fontSize: "0.82rem", color: "var(--cc-text-muted)" }}>
              {user.college} · {studentGroups.length} students
              {president ? ` · President: ${president.name}` : " · no President yet"}
            </p>
          </div>
        </div>

        <button type="button" className="cc-btn-action" onClick={() => loadAll(true)} disabled={refreshing}>
          <RefreshCw size={14} className={refreshing ? "cc-spin" : undefined} /> Refresh
        </button>
      </div>

      {/* Student accordions */}
      <div className="cc-card">
        <h3 className="cc-card-title" style={{ marginBottom: "1rem", flexWrap: "wrap" }}>
          <Users size={16} color="var(--cc-teal)" /> Student Submissions for Evaluation
          {totalPending > 0 && <span className="cc-chip cc-chip-amber">{totalPending} to evaluate</span>}
        </h3>

        {studentGroups.length === 0 ? (
          <p style={{ fontSize: "0.82rem", color: "var(--cc-text-faint)", textAlign: "center", padding: "2rem 0" }}>
            No students found in {user.college}.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {studentGroups.map((group) => {
              const isExpanded = expandedUid === group.user.uid;
              const pendingCount = group.speeches.length + group.meetingVideos.length;
              return (
                <div key={group.user.uid} className="cc-well" style={{ padding: 0, overflow: "hidden" }}>
                  <button
                    type="button"
                    onClick={() => setExpandedUid(isExpanded ? null : group.user.uid)}
                    aria-expanded={isExpanded}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      background: "none",
                      border: "none",
                      boxShadow: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      textAlign: "left",
                      fontFamily: "inherit",
                      gap: "8px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                      <div
                        className="cc-well-deep"
                        style={{
                          width: "32px",
                          height: "32px",
                          padding: 0,
                          borderRadius: "50%",
                          backgroundImage: group.user.profilePictureUrl ? `url("${group.user.profilePictureUrl}")` : undefined,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          fontSize: "0.78rem",
                          fontWeight: 800,
                          color: "var(--cc-accent-bright)",
                        }}
                      >
                        {!group.user.profilePictureUrl && group.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--cc-text)" }}>{group.user.name}</span>
                        <span style={{ fontSize: "0.68rem", color: "var(--cc-text-faint)", marginLeft: "8px" }}>
                          Level {group.user.current_level} · {group.user.total_points ?? 0} pts
                        </span>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                      {pendingCount > 0 && <span className="cc-chip cc-chip-amber">{pendingCount} pending</span>}
                      {isExpanded ? <ChevronUp size={14} color="var(--cc-text-faint)" /> : <ChevronDown size={14} color="var(--cc-text-faint)" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                      {pendingCount === 0 ? (
                        <p style={{ fontSize: "0.78rem", color: "var(--cc-text-faint)", padding: "8px 0", display: "flex", alignItems: "center", gap: "6px" }}>
                          <Inbox size={14} /> Nothing awaiting evaluation from this student.
                        </p>
                      ) : (
                        <>
                          {group.speeches.map((speech) => {
                            const key = `${group.user.uid}_${speech.speech_id}`;
                            return (
                              <div key={`${key}_v${speech.version ?? 1}`} className="cc-well-deep" style={{ padding: "14px" }}>
                                <div style={{ marginBottom: "12px" }}>
                                  <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--cc-text)", marginBottom: "2px" }}>
                                    {speech.title}
                                    <span className="cc-chip cc-chip-teal" style={{ marginLeft: "8px", fontSize: "0.62rem", padding: "2px 8px" }}>Speech · L{speech.level}</span>
                                  </div>
                                  <div style={{ fontSize: "0.72rem", color: "var(--cc-text-faint)" }}>
                                    Version {speech.version ?? 1} · {speech.speech_id}
                                  </div>
                                  {speech.youtubeUrl && (
                                    <div style={{ marginTop: "8px" }}>
                                      <CCInlineVideoPlayer url={speech.youtubeUrl} />
                                    </div>
                                  )}
                                </div>
                                <EvaluationForm
                                  withPoints
                                  hasPresident={!!president}
                                  submitting={submittingKey === key}
                                  onSubmit={(v) => handleEvaluateSpeech(group.user.uid, speech.speech_id, v)}
                                />
                              </div>
                            );
                          })}

                          {group.meetingVideos.map((mv) => {
                            const key = `${group.user.uid}_${mv.report_id}_mv`;
                            return (
                              <div key={`${key}_v${mv.version ?? 1}`} className="cc-well-deep" style={{ padding: "14px" }}>
                                <div style={{ marginBottom: "12px" }}>
                                  <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--cc-text)", marginBottom: "2px" }}>
                                    Meeting Video
                                    <span className="cc-chip cc-chip-accent" style={{ marginLeft: "8px", fontSize: "0.62rem", padding: "2px 8px" }}>Week {mv.week_number}</span>
                                  </div>
                                  {mv.video_url && (
                                    <div style={{ marginTop: "8px" }}>
                                      <CCInlineVideoPlayer url={mv.video_url} />
                                    </div>
                                  )}
                                </div>
                                <EvaluationForm
                                  withPoints={false}
                                  hasPresident={!!president}
                                  submitting={submittingKey === key}
                                  onSubmit={(v) => handleEvaluateMeetingVideo(group.user.uid, mv.report_id, { remarks: v.remarks, needsRedo: v.needsRedo })}
                                />
                              </div>
                            );
                          })}
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Analytics */}
      <div className="cc-card">
        <h3 className="cc-card-title" style={{ marginBottom: "1rem" }}>
          <BarChart3 size={16} color="var(--cc-teal)" /> Class Analytics
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))", gap: "12px" }}>
          {analytics.map((a) => (
            <div key={a.label} className="cc-well-deep" style={{ padding: "1.25rem", textAlign: "center" }}>
              <div className="cc-eyebrow" style={{ marginBottom: "6px" }}>{a.label}</div>
              <div style={{ fontSize: "2rem", fontWeight: 900, color: a.color, lineHeight: 1 }}>{a.value}</div>
              <div style={{ fontSize: "0.68rem", color: "var(--cc-text-faint)", marginTop: "4px" }}>{a.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CCTrainerDashboard;
