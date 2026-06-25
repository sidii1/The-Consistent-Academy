import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  getCCUsersByCollege,
  getValidatedSpeeches,
  getCCSpeeches,
  evaluateSpeechByTrainer,
  updateCCUser,
  getValidatedMeetingVideos,
  evaluateMeetingVideoByTrainer,
  type CCUser,
  type CCSpeech,
  type CCMeetingVideoSubmission,
} from "@/lib/ccClub";
import CCInlineVideoPlayer from "./CCInlineVideoPlayer";
import { uploadToCloudinary } from "@/lib/utils";
import { toast } from "sonner";
import {
  Loader2,
  Camera,
  ChevronDown,
  ChevronUp,
  Play,
  X,
  Send,
  BarChart3,
  Users,
  AlertTriangle,
  RefreshCw,
  GraduationCap,
} from "lucide-react";

interface CCTrainerDashboardProps {
  user: CCUser;
}

// ── Types for grouped student data ──
interface StudentSpeechGroup {
  user: CCUser;
  speeches: CCSpeech[]; // only validated speeches awaiting trainer evaluation
  meetingVideos: CCMeetingVideoSubmission[]; // validated meeting videos awaiting evaluation
  allSpeeches: CCSpeech[]; // all speeches for analytics
}

const CCTrainerDashboard: React.FC<CCTrainerDashboardProps> = ({ user }) => {
  // ── Core state ──
  const [loading, setLoading] = useState(true);
  const [studentGroups, setStudentGroups] = useState<StudentSpeechGroup[]>([]);
  const [expandedUid, setExpandedUid] = useState<string | null>(null);

  // ── Avatar state ──
  const [profilePic, setProfilePic] = useState(user.profilePictureUrl || "");
  const [uploadingPfp, setUploadingPfp] = useState(false);
  const pfpInputRef = useRef<HTMLInputElement>(null);



  // ── Evaluation form state ──
  const [evalRemarks, setEvalRemarks] = useState<Record<string, string>>({});
  const [evalNeedsRedo, setEvalNeedsRedo] = useState<Record<string, boolean>>({});
  const [evalStudentPts, setEvalStudentPts] = useState<Record<string, number>>({});
  const [evalPresidentPts, setEvalPresidentPts] = useState<Record<string, number>>({});
  const [submittingEval, setSubmittingEval] = useState<string | null>(null);

  // ── Data loading ──
  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      let members: any[] = [];
      try {
        members = await getCCUsersByCollege(user.college);
      } catch (err: any) {
        console.error("Error fetching users:", err);
        throw new Error("fetching users: " + err.message);
      }

      let validatedList: any[] = [];
      try {
        validatedList = await getValidatedSpeeches(user.college);
      } catch (err: any) {
        console.error("Error fetching speeches:", err);
        throw new Error("fetching speeches: " + err.message);
      }

      let validatedMeetingVideos: any[] = [];
      try {
        validatedMeetingVideos = await getValidatedMeetingVideos(user.college);
      } catch (err: any) {
        console.error("Error fetching meeting videos:", err);
        throw new Error("fetching meeting videos: " + err.message);
      }

      // Build student groups: include all members (students), not just those with validated speeches
      const studentMembers = members.filter(
        (m) => m.club_role === "Student" || m.club_role === "Team Leader" || m.club_role === "Vice President" || m.club_role === "Event Team"
      );

      // Fetch all speeches for every student for analytics purposes
      const groups: StudentSpeechGroup[] = [];
      for (const student of studentMembers) {
        let allSpeeches: any[] = [];
        try {
          allSpeeches = await getCCSpeeches(student.uid);
        } catch (err: any) {
          console.error(`Error fetching speeches for student ${student.uid}:`, err);
          throw new Error("fetching student speeches: " + err.message);
        }
        const validated = validatedList
          .filter((v) => v.uid === student.uid)
          .map((v) => v.speech);
        const meetingVideos = validatedMeetingVideos.filter((v) => v.uid === student.uid);
        groups.push({ user: student, speeches: validated, meetingVideos, allSpeeches });
      }
      setStudentGroups(groups);
    } catch (err: any) {
      console.error("TRAINER DASHBOARD LOAD ERROR:", err);
      toast.error("Failed to load trainer data: " + (err?.message || String(err)));
    } finally {
      setLoading(false);
    }
  }, [user.college]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // ── Avatar upload ──
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



  // ── Submit evaluation ──
  const handleEvaluate = async (uid: string, speechId: string) => {
    const key = `${uid}_${speechId}`;
    const studentPts = Math.min(10, Math.max(0, evalStudentPts[key] ?? 0));
    const presidentPts = Math.min(10, Math.max(0, evalPresidentPts[key] ?? 0));

    setSubmittingEval(key);
    try {
      await evaluateSpeechByTrainer(uid, speechId, {
        remarks: evalRemarks[key] || "",
        needsRedo: evalNeedsRedo[key] || false,
        studentPoints: studentPts,
        presidentPoints: presidentPts,
      });
      toast.success(evalNeedsRedo[key] ? "Marked for redo." : "Evaluation submitted!");
      loadAll();
    } catch {
      toast.error("Evaluation failed.");
    } finally {
      setSubmittingEval(null);
    }
  };

  const handleEvaluateMeetingVideo = async (uid: string, reportId: string) => {
    const key = `${uid}_${reportId}_mv`;
    setSubmittingEval(key);
    try {
      await evaluateMeetingVideoByTrainer(reportId, uid, {
        remarks: evalRemarks[key] || "",
        needsRedo: evalNeedsRedo[key] || false,
      });
      toast.success(evalNeedsRedo[key] ? "Marked for redo." : "Meeting Video Evaluation submitted!");
      loadAll();
    } catch {
      toast.error("Evaluation failed.");
    } finally {
      setSubmittingEval(null);
    }
  };

  // ── Analytics calculations (Phase 5) ──
  const allEvaluatedScores = studentGroups.flatMap((g) =>
    g.allSpeeches
      .filter((s) => s.workflowState === "evaluated" && s.studentPointsAwarded !== undefined)
      .map((s) => s.studentPointsAwarded!)
  );
  const averageScore =
    allEvaluatedScores.length > 0
      ? (allEvaluatedScores.reduce((a, b) => a + b, 0) / allEvaluatedScores.length).toFixed(1)
      : "N/A";

  const noSubmissions = studentGroups.filter(
    (g) => g.allSpeeches.every((s) => s.status === "Not Started")
  ).length;

  const redoCount = studentGroups.filter(
    (g) => g.allSpeeches.some((s) => s.workflowState === "needs_redo")
  ).length;

  // ── Loading state ──
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
        Loading trainer dashboard...
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
      {/* Ambient orbs */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: -1, borderRadius: "30px" }}>
        <div className="cc-animate-shimmer" style={{ position: "absolute", top: "5%", left: "0%", width: "45vw", height: "45vw", background: "radial-gradient(circle, rgba(74,222,128,0.08) 0%, transparent 65%)", filter: "blur(60px)" }} />
        <div className="cc-animate-shimmer" style={{ position: "absolute", top: "35%", right: "0%", width: "40vw", height: "40vw", background: "radial-gradient(circle, rgba(139,127,255,0.06) 0%, transparent 65%)", filter: "blur(60px)", animationDelay: "2s" }} />
      </div>

      {/* ── Welcome Header ── */}
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
          {/* Avatar */}
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
            }}
          >
            {!profilePic && (
              <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "hsl(160 60% 50%)" }}>
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}
            {uploadingPfp && (
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Loader2 size={16} color="#fff" style={{ animation: "spin 1s linear infinite" }} />
              </div>
            )}
            <div style={{ position: "absolute", bottom: 0, right: 0, width: "18px", height: "18px", borderRadius: "50%", background: "hsl(160 60% 45%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Camera size={10} color="#fff" />
            </div>
          </div>
          <input ref={pfpInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePfpUpload} />

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <GraduationCap size={18} color="hsl(160 60% 50%)" />
              <span
                style={{
                  fontSize: "0.68rem",
                  padding: "2px 8px",
                  borderRadius: "999px",
                  background: "hsl(160 30% 12%)",
                  color: "hsl(160 60% 55%)",
                  border: "1px solid hsl(160 40% 28%)",
                  fontWeight: 700,
                }}
              >
                Trainer
              </span>
            </div>
            <h1 style={{ fontSize: "clamp(1.2rem, 3vw, 1.6rem)", fontWeight: 800, color: "var(--cc-text)", marginBottom: "4px" }}>
              Welcome, <span style={{ color: "hsl(160 60% 55%)" }}>{user.name}</span>
            </h1>
            <p style={{ fontSize: "0.82rem", color: "var(--cc-text-muted)" }}>
              {user.college} · {studentGroups.length} students
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadAll}
          style={{
            padding: "10px 16px",
            borderRadius: "12px",
            background: "var(--cc-surface-inset)",
            boxShadow: "var(--cc-neu-sm)",
            border: "none",
            color: "var(--cc-text-muted)",
            fontWeight: 600,
            fontSize: "0.82rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* ── Student Accordions ── */}
      <div
        style={{
          borderRadius: "20px",
          padding: "1.75rem",
          background: "var(--cc-bg)",
          boxShadow: "var(--cc-neu-md)",
        }}
      >
        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--cc-text)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
          <Users size={16} color="hsl(160 60% 50%)" /> Student Submissions for Evaluation
          {studentGroups.filter(g => g.speeches.length > 0 || g.meetingVideos.length > 0).length > 0 && (
            <span style={{ fontSize: "0.68rem", padding: "2px 8px", borderRadius: "999px", background: "hsl(160 30% 12%)", color: "hsl(160 60% 55%)", border: "1px solid hsl(160 40% 28%)", fontWeight: 700 }}>
              {studentGroups.reduce((acc, g) => acc + g.speeches.length + g.meetingVideos.length, 0)} to evaluate
            </span>
          )}
        </h3>

        {studentGroups.length === 0 ? (
          <p style={{ fontSize: "0.82rem", color: "var(--cc-text-faint)", textAlign: "center", padding: "2rem 0" }}>
            No students found in {user.college}.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {studentGroups.map((group) => {
              const isExpanded = expandedUid === group.user.uid;
              return (
                <div
                  key={group.user.uid}
                  style={{
                    borderRadius: "14px",
                    background: "var(--cc-surface-inset)",
                    boxShadow: "var(--cc-neu-inset-xs)",
                    overflow: "hidden",
                  }}
                >
                  {/* Accordion header */}
                  <button
                    type="button"
                    onClick={() => setExpandedUid(isExpanded ? null : group.user.uid)}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      textAlign: "left",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: group.user.profilePictureUrl
                            ? `url(${group.user.profilePictureUrl}) center/cover`
                            : "var(--cc-surface-deep)",
                          boxShadow: "var(--cc-neu-inset-sm)",
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
                      <div>
                        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--cc-text)" }}>
                          {group.user.name}
                        </span>
                        <span style={{ fontSize: "0.68rem", color: "var(--cc-text-faint)", marginLeft: "8px" }}>
                          Level {group.user.current_level} · {group.user.total_points} pts
                        </span>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {(group.speeches.length > 0 || group.meetingVideos.length > 0) && (
                        <span style={{ fontSize: "0.68rem", padding: "2px 8px", borderRadius: "999px", background: "hsl(38 40% 14%)", color: "hsl(38 80% 55%)", border: "1px solid hsl(38 40% 28%)", fontWeight: 700 }}>
                          {group.speeches.length + group.meetingVideos.length} pending
                        </span>
                      )}
                      {isExpanded ? <ChevronUp size={14} color="var(--cc-text-faint)" /> : <ChevronDown size={14} color="var(--cc-text-faint)" />}
                    </div>
                  </button>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                      {group.speeches.length === 0 && group.meetingVideos.length === 0 ? (
                        <p style={{ fontSize: "0.78rem", color: "var(--cc-text-faint)", padding: "8px 0" }}>
                          No submissions awaiting evaluation from this student.
                        </p>
                      ) : (
                        <>
                        {group.speeches.map((speech) => {
                          const key = `${group.user.uid}_${speech.speech_id}`;
                          return (
                            <div
                              key={speech.speech_id}
                              style={{
                                borderRadius: "12px",
                                padding: "14px",
                                background: "var(--cc-surface-deep)",
                                boxShadow: "var(--cc-neu-inset-sm)",
                              }}
                            >
                              {/* Speech info row */}
                              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "12px", flexWrap: "wrap", flexDirection: "column" }}>
                                <div>
                                  <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--cc-text)", marginBottom: "2px" }}>
                                    {speech.title} <span style={{ fontSize: "0.7rem", color: "hsl(160 60% 50%)", marginLeft: "8px" }}>SPEECH</span>
                                  </div>
                                  <div style={{ fontSize: "0.72rem", color: "var(--cc-text-faint)" }}>
                                    Version {speech.version || 1} · {speech.speech_id}
                                  </div>
                                </div>
                                {speech.youtubeUrl && (
                                  <CCInlineVideoPlayer url={speech.youtubeUrl} />
                                )}
                              </div>

                              {/* Evaluation Form */}
                              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                <textarea
                                  placeholder="Trainer remarks / feedback..."
                                  value={evalRemarks[key] || ""}
                                  onChange={(e) => setEvalRemarks((p) => ({ ...p, [key]: e.target.value }))}
                                  rows={3}
                                  style={{
                                    width: "100%",
                                    padding: "10px 12px",
                                    borderRadius: "8px",
                                    background: "hsl(210 18% 10%)",
                                    border: "1px solid var(--cc-border)",
                                    color: "var(--cc-text)",
                                    fontSize: "0.82rem",
                                    outline: "none",
                                    resize: "vertical",
                                    boxSizing: "border-box",
                                    fontFamily: "inherit",
                                    lineHeight: 1.6,
                                  }}
                                />

                                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                                  {/* Needs Redo checkbox */}
                                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.78rem", color: "var(--cc-danger)", cursor: "pointer", fontWeight: 600 }}>
                                    <input
                                      type="checkbox"
                                      checked={evalNeedsRedo[key] || false}
                                      onChange={(e) => setEvalNeedsRedo((p) => ({ ...p, [key]: e.target.checked }))}
                                      style={{ accentColor: "hsl(0 65% 55%)" }}
                                    />
                                    Needs Redo
                                  </label>

                                  {/* Student points */}
                                  <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.78rem", color: "var(--cc-text-muted)" }}>
                                    Student Points:
                                    <input
                                      type="number"
                                      min={0}
                                      max={10}
                                      value={evalStudentPts[key] ?? 0}
                                      onChange={(e) => setEvalStudentPts((p) => ({ ...p, [key]: Number(e.target.value) }))}
                                      style={{
                                        width: "48px",
                                        padding: "4px 6px",
                                        borderRadius: "6px",
                                        background: "hsl(210 18% 10%)",
                                        border: "1px solid var(--cc-border)",
                                        color: "var(--cc-text)",
                                        fontSize: "0.82rem",
                                        outline: "none",
                                        textAlign: "center",
                                      }}
                                    />
                                    /10
                                  </div>

                                  {/* President points */}
                                  <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.78rem", color: "var(--cc-text-muted)" }}>
                                    President Points:
                                    <input
                                      type="number"
                                      min={0}
                                      max={10}
                                      value={evalPresidentPts[key] ?? 0}
                                      onChange={(e) => setEvalPresidentPts((p) => ({ ...p, [key]: Number(e.target.value) }))}
                                      style={{
                                        width: "48px",
                                        padding: "4px 6px",
                                        borderRadius: "6px",
                                        background: "hsl(210 18% 10%)",
                                        border: "1px solid var(--cc-border)",
                                        color: "var(--cc-text)",
                                        fontSize: "0.82rem",
                                        outline: "none",
                                        textAlign: "center",
                                      }}
                                    />
                                    /10
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleEvaluate(group.user.uid, speech.speech_id)}
                                  disabled={submittingEval === key}
                                  className="cc-btn-primary"
                                  style={{
                                    padding: "10px",
                                    borderRadius: "10px",
                                    fontSize: "0.85rem",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "6px",
                                    opacity: submittingEval === key ? 0.6 : 1,
                                  }}
                                >
                                  <Send size={13} />
                                  {submittingEval === key ? "Submitting..." : "Submit Evaluation"}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                        
                        {group.meetingVideos.map((mv) => {
                          const key = `${group.user.uid}_${mv.report_id}_mv`;
                          return (
                            <div
                              key={key}
                              style={{
                                borderRadius: "12px",
                                padding: "14px",
                                background: "var(--cc-surface-deep)",
                                boxShadow: "var(--cc-neu-inset-sm)",
                              }}
                            >
                              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "12px", flexWrap: "wrap", flexDirection: "column" }}>
                                <div>
                                  <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--cc-text)", marginBottom: "2px" }}>
                                    Meeting Video <span style={{ fontSize: "0.7rem", color: "hsl(220 60% 60%)", marginLeft: "8px" }}>WEEK {mv.week_number}</span>
                                  </div>
                                </div>
                                {mv.video_url && (
                                  <CCInlineVideoPlayer url={mv.video_url} />
                                )}
                              </div>

                              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                <textarea
                                  placeholder="Trainer remarks / feedback..."
                                  value={evalRemarks[key] || ""}
                                  onChange={(e) => setEvalRemarks((p) => ({ ...p, [key]: e.target.value }))}
                                  rows={3}
                                  style={{
                                    width: "100%",
                                    padding: "10px 12px",
                                    borderRadius: "8px",
                                    background: "hsl(210 18% 10%)",
                                    border: "1px solid var(--cc-border)",
                                    color: "var(--cc-text)",
                                    fontSize: "0.82rem",
                                    outline: "none",
                                    resize: "vertical",
                                    boxSizing: "border-box",
                                    fontFamily: "inherit",
                                    lineHeight: 1.6,
                                  }}
                                />

                                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.78rem", color: "var(--cc-danger)", cursor: "pointer", fontWeight: 600 }}>
                                    <input
                                      type="checkbox"
                                      checked={evalNeedsRedo[key] || false}
                                      onChange={(e) => setEvalNeedsRedo((p) => ({ ...p, [key]: e.target.checked }))}
                                      style={{ accentColor: "hsl(0 65% 55%)" }}
                                    />
                                    Needs Redo
                                  </label>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleEvaluateMeetingVideo(group.user.uid, mv.report_id)}
                                  disabled={submittingEval === key}
                                  className="cc-btn-primary"
                                  style={{
                                    padding: "10px",
                                    borderRadius: "10px",
                                    fontSize: "0.85rem",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "6px",
                                    opacity: submittingEval === key ? 0.6 : 1,
                                  }}
                                >
                                  <Send size={13} />
                                  {submittingEval === key ? "Submitting..." : "Submit Evaluation"}
                                </button>
                              </div>
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

      {/* ── Phase 5: Analytics Cards ── */}
      <div
        style={{
          borderRadius: "20px",
          padding: "1.75rem",
          background: "var(--cc-bg)",
          boxShadow: "var(--cc-neu-md)",
        }}
      >
        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--cc-text)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
          <BarChart3 size={16} color="hsl(160 60% 50%)" /> Class Analytics
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
          {/* Average Score */}
          <div
            style={{
              borderRadius: "14px",
              padding: "1.25rem",
              background: "var(--cc-surface-inset)",
              boxShadow: "var(--cc-neu-inset-sm)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--cc-text-faint)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
              Avg. Student Score
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "hsl(160 60% 50%)", lineHeight: 1 }}>
              {averageScore}
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--cc-text-faint)", marginTop: "4px" }}>
              out of 10
            </div>
          </div>

          {/* No submissions */}
          <div
            style={{
              borderRadius: "14px",
              padding: "1.25rem",
              background: "var(--cc-surface-inset)",
              boxShadow: "var(--cc-neu-inset-sm)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--cc-text-faint)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
              No Submissions
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: noSubmissions > 0 ? "var(--cc-danger)" : "var(--cc-success)", lineHeight: 1 }}>
              {noSubmissions}
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--cc-text-faint)", marginTop: "4px" }}>
              students haven't submitted
            </div>
          </div>

          {/* Redo students */}
          <div
            style={{
              borderRadius: "14px",
              padding: "1.25rem",
              background: "var(--cc-surface-inset)",
              boxShadow: "var(--cc-neu-inset-sm)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--cc-text-faint)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
              Requiring Re-dos
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: redoCount > 0 ? "var(--cc-amber)" : "var(--cc-success)", lineHeight: 1 }}>
              {redoCount}
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--cc-text-faint)", marginTop: "4px" }}>
              students with re-do speeches
            </div>
          </div>
        </div>
      </div>



      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default CCTrainerDashboard;
