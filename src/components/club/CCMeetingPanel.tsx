import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  FileText,
  Users,
  Video,
  Camera,
  Send,
  Loader2,
  CheckSquare,
  Square,
} from "lucide-react";
import {
  getCCUsersByCollege,
  getCCAttendanceStats,
  createMeetingReport,
  type CCUser,
  type AttendanceEntry,
} from "@/lib/ccClub";
import { Timestamp } from "firebase/firestore";

interface CCMeetingPanelProps {
  president: CCUser;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "10px",
  background: "hsl(210 18% 10%)",
  boxShadow:
    "inset 4px 4px 8px var(--cc-shadow-dark), inset -4px -4px 8px var(--cc-shadow-light)",
  border: "1px solid var(--cc-border)",
  color: "var(--cc-text)",
  fontSize: "0.88rem",
  outline: "none",
  transition: "border-color 200ms",
  boxSizing: "border-box" as const,
};

const SectionTitle: React.FC<{
  icon: React.ReactNode;
  title: string;
  required?: boolean;
}> = ({ icon, title, required }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
    {icon}
    <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--cc-text)", letterSpacing: "0.02em" }}>
      {title}
    </span>
    {required && (
      <span style={{ fontSize: "0.68rem", color: "var(--cc-danger)", fontWeight: 600 }}>
        * Required
      </span>
    )}
  </div>
);

// Attendance % pill — color shifts green/amber/red by threshold
const PctBadge: React.FC<{ pct: number; total: number }> = ({ pct, total }) => {
  const color =
    total === 0
      ? "var(--cc-text-faint)"
      : pct >= 75
      ? "hsl(145 55% 45%)"
      : pct >= 50
      ? "hsl(38 80% 55%)"
      : "hsl(0 65% 55%)";
  const bg =
    total === 0
      ? "hsl(210 15% 18%)"
      : pct >= 75
      ? "hsl(145 40% 12%)"
      : pct >= 50
      ? "hsl(38 40% 12%)"
      : "hsl(0 40% 12%)";

  return (
    <span
      style={{
        marginLeft: "auto",
        fontSize: "0.68rem",
        fontWeight: 700,
        color,
        background: bg,
        border: `1px solid ${color}44`,
        borderRadius: "20px",
        padding: "2px 8px",
        whiteSpace: "nowrap",
        letterSpacing: "0.03em",
      }}
    >
      {total === 0 ? "New" : `${pct}% (${total} mtg)`}
    </span>
  );
};

const CCMeetingPanel: React.FC<CCMeetingPanelProps> = ({ president }) => {
  const [members, setMembers] = useState<CCUser[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  // uid → { present, total, percentage }
  const [attendanceStats, setAttendanceStats] = useState<
    Record<string, { present: number; total: number; percentage: number }>
  >({});

  // Form state
  const [mom, setMom] = useState("");
  const [attendance, setAttendance] = useState<AttendanceEntry[]>([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [photo1, setPhoto1] = useState("");
  const [photo2, setPhoto2] = useState("");
  const [photo3, setPhoto3] = useState("");
  const [weekNumber, setWeekNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [list, stats] = await Promise.all([
          getCCUsersByCollege(president.college),
          getCCAttendanceStats(president.college),
        ]);
        setMembers(list);
        setAttendanceStats(stats);
        setAttendance(list.map((m) => ({ uid: m.uid, name: m.name, present: false })));
      } catch {
        toast.error("Failed to load member list.");
      } finally {
        setLoadingMembers(false);
      }
    
    console.log("Querying college:", president.college);
    const list = await getCCUsersByCollege(president.college);
    console.log("Members found:", list.length, list);
    // ... rest of your code
  

    };
    load();
  }, [president.college]);

  const toggleAttendance = (uid: string) => {
    setAttendance((prev) =>
      prev.map((a) => (a.uid === uid ? { ...a, present: !a.present } : a))
    );
  };

  const presentCount = attendance.filter((a) => a.present).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mom.trim()) return toast.error("Minutes of Meeting cannot be empty.");
    if (!videoUrl.trim()) return toast.error("Please add the highlight video link.");
    if (!photo1.trim()) return toast.error("Group photo link is mandatory.");
    if (!weekNumber || isNaN(Number(weekNumber)))
      return toast.error("Please enter a valid week number.");

    const photos = [photo1, photo2, photo3].filter(Boolean);

    setSubmitting(true);
    try {
      await createMeetingReport({
        college: president.college,
        uploaded_by_uid: president.uid,
        uploaded_by_name: president.name,
        meeting_date: Timestamp.now(),
        week_number: Number(weekNumber),
        mom_text: mom.trim(),
        attendance,
        highlight_video_url: videoUrl.trim(),
        photos,
      });

      toast.success("Meeting report submitted! ✅");

      // Refresh attendance stats so percentages update immediately
      const updatedStats = await getCCAttendanceStats(president.college);
      setAttendanceStats(updatedStats);

      // Reset form
      setMom("");
      setVideoUrl("");
      setPhoto1("");
      setPhoto2("");
      setPhoto3("");
      setWeekNumber("");
      setAttendance((prev) => prev.map((a) => ({ ...a, present: false })));
    } catch {
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="cc-surface"
      style={{
        borderRadius: "20px",
        padding: "1.75rem",
        border: "1px solid var(--cc-amber-soft)",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            color: "var(--cc-amber)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <FileText size={16} />
          Meeting Operations & Reporting
        </h3>
        <p style={{ fontSize: "0.75rem", color: "var(--cc-text-muted)", marginTop: "4px" }}>
          Upload required documentation after every offline campus meeting.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
      >
        {/* Week Number */}
        <div>
          <SectionTitle icon={null} title="Week Number" required />
          <input
            type="number"
            min={1}
            placeholder="e.g. 4"
            value={weekNumber}
            onChange={(e) => setWeekNumber(e.target.value)}
            style={{ ...inputStyle, maxWidth: "160px" }}
            onFocus={(e) => (e.target.style.borderColor = "var(--cc-amber)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--cc-border)")}
          />
        </div>

        {/* MoM */}
        <div>
          <SectionTitle
            icon={<FileText size={14} color="var(--cc-accent-bright)" />}
            title="Minutes of Meeting (MoM)"
            required
          />
          <textarea
            placeholder="Describe the agenda, activities conducted, key takeaways, and any decisions made during this meeting..."
            value={mom}
            onChange={(e) => setMom(e.target.value)}
            rows={6}
            style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7, fontFamily: "inherit" }}
            onFocus={(e) => (e.target.style.borderColor = "var(--cc-accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--cc-border)")}
          />
          <p style={{ fontSize: "0.7rem", color: "var(--cc-text-faint)", marginTop: "4px" }}>
            {mom.length} characters
          </p>
        </div>

        {/* ── Attendance ── */}
        <div>
          <SectionTitle
            icon={<Users size={14} color="var(--cc-accent-bright)" />}
            title={`Attendance — ${presentCount} / ${members.length} present today`}
            required
          />

          {loadingMembers ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "var(--cc-text-muted)",
                fontSize: "0.82rem",
              }}
            >
              <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
              Loading members...
            </div>
          ) : members.length === 0 ? (
            <p style={{ fontSize: "0.8rem", color: "var(--cc-text-faint)" }}>
              No registered members found for {president.college}.
            </p>
          ) : (
            <>
              {/* Legend */}
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  marginBottom: "8px",
                  flexWrap: "wrap",
                }}
              >
                {[
                  { color: "hsl(145 55% 45%)", label: "≥75% attendance" },
                  { color: "hsl(38 80% 55%)", label: "50–74%" },
                  { color: "hsl(0 65% 55%)", label: "<50%" },
                  { color: "var(--cc-text-faint)", label: "New member" },
                ].map(({ color, label }) => (
                  <span
                    key={label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "0.65rem",
                      color: "var(--cc-text-faint)",
                    }}
                  >
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: color,
                        display: "inline-block",
                      }}
                    />
                    {label}
                  </span>
                ))}
              </div>

              {/* Member list */}
              <div
                className="cc-inset-sm"
                style={{
                  borderRadius: "12px",
                  padding: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  maxHeight: "300px",
                  overflowY: "auto",
                }}
              >
                {attendance.map((entry) => {
                  const stats = attendanceStats[entry.uid];
                  const pct = stats?.percentage ?? 0;
                  const total = stats?.total ?? 0;

                  return (
                    <button
                      key={entry.uid}
                      type="button"
                      onClick={() => toggleAttendance(entry.uid)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "9px 12px",
                        borderRadius: "8px",
                        background: entry.present
                          ? "var(--cc-success-soft)"
                          : "hsl(210 15% 18%)",
                        border: `1px solid ${
                          entry.present ? "hsl(145 40% 25%)" : "var(--cc-border)"
                        }`,
                        cursor: "pointer",
                        transition: "all 200ms",
                        textAlign: "left",
                        width: "100%",
                      }}
                    >
                      {entry.present ? (
                        <CheckSquare size={16} color="var(--cc-success)" />
                      ) : (
                        <Square size={16} color="var(--cc-text-faint)" />
                      )}

                      <span
                        style={{
                          fontSize: "0.82rem",
                          fontWeight: 500,
                          color: entry.present
                            ? "var(--cc-success)"
                            : "var(--cc-text-muted)",
                          flex: 1,
                        }}
                      >
                        {entry.name}
                      </span>

                      {/* Historical attendance % badge */}
                      <PctBadge pct={pct} total={total} />
                    </button>
                  );
                })}
              </div>

              {/* Summary row */}
              <div
                style={{
                  marginTop: "8px",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "16px",
                  fontSize: "0.72rem",
                  color: "var(--cc-text-faint)",
                }}
              >
                <span>
                  🟢 ≥75%:{" "}
                  <strong style={{ color: "var(--cc-text)" }}>
                    {
                      Object.values(attendanceStats).filter(
                        (s) => s.total > 0 && s.percentage >= 75
                      ).length
                    }
                  </strong>
                </span>
                <span>
                  🟡 50–74%:{" "}
                  <strong style={{ color: "var(--cc-text)" }}>
                    {
                      Object.values(attendanceStats).filter(
                        (s) => s.total > 0 && s.percentage >= 50 && s.percentage < 75
                      ).length
                    }
                  </strong>
                </span>
                <span>
                  🔴 &lt;50%:{" "}
                  <strong style={{ color: "var(--cc-text)" }}>
                    {
                      Object.values(attendanceStats).filter(
                        (s) => s.total > 0 && s.percentage < 50
                      ).length
                    }
                  </strong>
                </span>
              </div>
            </>
          )}
        </div>

        {/* Video */}
        <div>
          <SectionTitle
            icon={<Video size={14} color="var(--cc-accent-bright)" />}
            title="Highlight Video"
            required
          />
          <input
            type="url"
            placeholder="YouTube / Drive / Loom link of meeting highlights"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "var(--cc-accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--cc-border)")}
          />
        </div>

        {/* Photos */}
        <div>
          <SectionTitle
            icon={<Camera size={14} color="var(--cc-accent-bright)" />}
            title="Photos (2–3 links)"
            required
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              { val: photo1, set: setPhoto1, placeholder: "📸 Group Photo link (mandatory)" },
              { val: photo2, set: setPhoto2, placeholder: "📸 Photo 2 link (optional)" },
              { val: photo3, set: setPhoto3, placeholder: "📸 Photo 3 link (optional)" },
            ].map(({ val, set, placeholder }) => (
              <input
                key={placeholder}
                type="url"
                placeholder={placeholder}
                value={val}
                onChange={(e) => set(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "var(--cc-accent)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--cc-border)")}
              />
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="cc-btn-primary"
          style={{
            padding: "14px",
            borderRadius: "12px",
            fontSize: "0.95rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          {submitting ? (
            <>
              <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
              Submitting Report...
            </>
          ) : (
            <>
              <Send size={15} />
              Submit Meeting Report
            </>
          )}
        </button>
      </form>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default CCMeetingPanel;