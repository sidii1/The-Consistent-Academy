import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  FileText,
  Users,
  Video,
  Send,
  Loader2,
  CheckSquare,
  Square,
  ImagePlus,
  CalendarDays,
  X,
} from "lucide-react";
import {
  getCCUsersByCollege,
  getMeetingReports,
  computeAttendanceStats,
  createMeetingReport,
  isValidVideoUrl,
  type CCUser,
  type AttendanceEntry,
  type AttendanceStats,
} from "@/lib/ccClub";
import { uploadToCloudinary } from "@/lib/utils";
import { Timestamp } from "firebase/firestore";

interface CCMeetingPanelProps {
  president: CCUser;
  /** Fired after a report is saved so the dashboard can refresh its lists. */
  onReportCreated?: () => void;
}

const MAX_PHOTO_BYTES = 8 * 1024 * 1024;

const todayInputValue = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const SectionTitle: React.FC<{
  icon: React.ReactNode;
  title: string;
  required?: boolean;
  htmlFor?: string;
}> = ({ icon, title, required, htmlFor }) => (
  <label htmlFor={htmlFor} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
    {icon}
    <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--cc-text)", letterSpacing: "0.02em" }}>{title}</span>
    {required && <span style={{ fontSize: "0.68rem", color: "var(--cc-danger)", fontWeight: 600 }}>* Required</span>}
  </label>
);

// Attendance % pill — colour shifts green/amber/red by threshold
const PctBadge: React.FC<{ pct: number; total: number }> = ({ pct, total }) => {
  const color =
    total === 0
      ? "var(--cc-text-faint)"
      : pct >= 75
      ? "var(--cc-success)"
      : pct >= 50
      ? "var(--cc-amber)"
      : "var(--cc-danger)";
  return (
    <span className="cc-chip" style={{ marginLeft: "auto", color, background: "var(--cc-surface-deep)" }}>
      {total === 0 ? "New" : `${pct}% (${total} mtg)`}
    </span>
  );
};

const CCMeetingPanel: React.FC<CCMeetingPanelProps> = ({ president, onReportCreated }) => {
  const [members, setMembers] = useState<CCUser[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats>({});

  // Form state
  const [mom, setMom] = useState("");
  const [attendance, setAttendance] = useState<AttendanceEntry[]>([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [weekNumber, setWeekNumber] = useState("");
  const [meetingDate, setMeetingDate] = useState(todayInputValue());
  const [existingWeeks, setExistingWeeks] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    try {
      const [list, reports] = await Promise.all([
        getCCUsersByCollege(president.college),
        getMeetingReports(president.college),
      ]);
      // The president runs the meeting; attendance + qualification track the trainees.
      const trainees = list.filter((m) => m.uid !== president.uid);
      setMembers(trainees);
      setAttendanceStats(computeAttendanceStats(reports));
      const weeks = reports.map((r) => r.week_number);
      setExistingWeeks(weeks);
      setWeekNumber((prev) => prev || String((weeks.length ? Math.max(...weeks) : 0) + 1));
      setAttendance((prev) =>
        trainees.map((m) => prev.find((a) => a.uid === m.uid) ?? { uid: m.uid, name: m.name, present: false })
      );
    } catch {
      toast.error("Failed to load member list.");
    } finally {
      setLoadingMembers(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [president.college, president.uid]);

  const toggleAttendance = (uid: string) =>
    setAttendance((prev) => prev.map((a) => (a.uid === uid ? { ...a, present: !a.present } : a)));
  const setAll = (present: boolean) => setAttendance((prev) => prev.map((a) => ({ ...a, present })));

  const presentCount = attendance.filter((a) => a.present).length;
  const weekTaken = weekNumber !== "" && existingWeeks.includes(Number(weekNumber));

  const bandCounts = useMemo(() => {
    const vals = Object.values(attendanceStats).filter((s) => s.total > 0);
    return {
      high: vals.filter((s) => s.percentage >= 75).length,
      mid: vals.filter((s) => s.percentage >= 50 && s.percentage < 75).length,
      low: vals.filter((s) => s.percentage < 50).length,
    };
  }, [attendanceStats]);

  const handlePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files || []);
    e.target.value = "";
    const valid = picked.filter((f) => f.type.startsWith("image/") && f.size <= MAX_PHOTO_BYTES);
    if (valid.length < picked.length) toast.error("Only image files up to 8 MB are accepted.");
    setPhotoFiles((prev) => [...prev, ...valid].slice(0, 3));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const week = Number(weekNumber);
    if (!weekNumber || !Number.isInteger(week) || week < 1) return toast.error("Please enter a valid week number.");
    if (weekTaken) return toast.error(`Week ${week} already has a report.`);
    if (!meetingDate) return toast.error("Please pick the meeting date.");
    if (new Date(`${meetingDate}T00:00:00`) > new Date()) return toast.error("The meeting date can't be in the future.");
    if (!mom.trim()) return toast.error("Minutes of Meeting cannot be empty.");
    if (!isValidVideoUrl(videoUrl)) return toast.error("Add the highlight video link (it must start with https://).");
    if (photoFiles.length === 0) return toast.error("Please upload at least one group photo.");
    if (presentCount === 0 && !window.confirm("No one is marked present. Submit this report anyway?")) return;

    setSubmitting(true);
    try {
      const photoUrls = await Promise.all(photoFiles.map((file) => uploadToCloudinary(file, "cc_meeting")));

      await createMeetingReport({
        college: president.college,
        uploaded_by_uid: president.uid,
        uploaded_by_name: president.name,
        meeting_date: Timestamp.fromDate(new Date(`${meetingDate}T12:00:00`)),
        week_number: week,
        mom_text: mom.trim(),
        attendance,
        highlight_video_url: videoUrl.trim(),
        photos: photoUrls,
      });

      toast.success("Meeting report submitted! ✅");
      setMom("");
      setVideoUrl("");
      setPhotoFiles([]);
      setWeekNumber("");
      setMeetingDate(todayInputValue());
      setAttendance((prev) => prev.map((a) => ({ ...a, present: false })));
      await load(); // refresh percentages + suggest the next week number
      onReportCreated?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="cc-card">
      <div style={{ marginBottom: "1.5rem" }}>
        <h3 className="cc-card-title" style={{ color: "var(--cc-amber)" }}>
          <FileText size={16} />
          Meeting Operations & Reporting
        </h3>
        <p style={{ fontSize: "0.75rem", color: "var(--cc-text-muted)", marginTop: "4px" }}>
          Upload required documentation after every offline campus meeting.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }} noValidate>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <SectionTitle icon={null} title="Week Number" required htmlFor="cc-week" />
            <input
              id="cc-week"
              className="cc-input"
              type="number"
              min={1}
              placeholder="e.g. 4"
              value={weekNumber}
              onChange={(e) => setWeekNumber(e.target.value)}
              style={{ maxWidth: "140px" }}
              aria-invalid={weekTaken}
            />
            {weekTaken && (
              <p style={{ fontSize: "0.7rem", color: "var(--cc-danger)", marginTop: "4px" }}>Week {weekNumber} already has a report.</p>
            )}
          </div>
          <div>
            <SectionTitle icon={<CalendarDays size={14} color="var(--cc-accent-bright)" />} title="Meeting Date" required htmlFor="cc-date" />
            <input
              id="cc-date"
              className="cc-input"
              type="date"
              max={todayInputValue()}
              value={meetingDate}
              onChange={(e) => setMeetingDate(e.target.value)}
              style={{ maxWidth: "190px", colorScheme: "dark" }}
            />
          </div>
        </div>

        <div>
          <SectionTitle icon={<FileText size={14} color="var(--cc-accent-bright)" />} title="Minutes of Meeting (MoM)" required htmlFor="cc-mom" />
          <textarea
            id="cc-mom"
            className="cc-input"
            placeholder="Describe the agenda, activities conducted, key takeaways, and any decisions made during this meeting..."
            value={mom}
            onChange={(e) => setMom(e.target.value)}
            rows={6}
            style={{ lineHeight: 1.7 }}
          />
          <p style={{ fontSize: "0.7rem", color: "var(--cc-text-faint)", marginTop: "4px" }}>{mom.length} characters</p>
        </div>

        {/* Attendance */}
        <div>
          <SectionTitle
            icon={<Users size={14} color="var(--cc-accent-bright)" />}
            title={`Attendance — ${presentCount} / ${members.length} present today`}
            required
          />

          {loadingMembers ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--cc-text-muted)", fontSize: "0.82rem" }}>
              <Loader2 size={14} className="cc-spin" /> Loading members...
            </div>
          ) : members.length === 0 ? (
            <p style={{ fontSize: "0.8rem", color: "var(--cc-text-faint)" }}>No registered members found for {president.college}.</p>
          ) : (
            <>
              <div style={{ display: "flex", gap: "12px", marginBottom: "10px", flexWrap: "wrap", alignItems: "center" }}>
                {[
                  { color: "var(--cc-success)", label: "≥75% attendance" },
                  { color: "var(--cc-amber)", label: "50–74%" },
                  { color: "var(--cc-danger)", label: "<50%" },
                  { color: "var(--cc-text-faint)", label: "New member" },
                ].map(({ color, label }) => (
                  <span key={label} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.65rem", color: "var(--cc-text-faint)" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: color, display: "inline-block" }} />
                    {label}
                  </span>
                ))}
                <span style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
                  <button type="button" className="cc-btn-action cc-btn-action--success" style={{ padding: "5px 10px", fontSize: "0.7rem" }} onClick={() => setAll(true)}>
                    All present
                  </button>
                  <button type="button" className="cc-btn-action" style={{ padding: "5px 10px", fontSize: "0.7rem" }} onClick={() => setAll(false)}>
                    <X size={11} /> Clear
                  </button>
                </span>
              </div>

              <div className="cc-inset-sm" style={{ borderRadius: "14px", padding: "12px", display: "flex", flexDirection: "column", gap: "8px", maxHeight: "300px", overflowY: "auto" }}>
                {attendance.map((entry) => {
                  const stats = attendanceStats[entry.uid];
                  return (
                    <button
                      key={entry.uid}
                      type="button"
                      role="checkbox"
                      aria-checked={entry.present}
                      onClick={() => toggleAttendance(entry.uid)}
                      className="cc-btn-action"
                      style={{
                        justifyContent: "flex-start",
                        gap: "10px",
                        padding: "9px 12px",
                        width: "100%",
                        textAlign: "left",
                        fontWeight: 500,
                        fontSize: "0.82rem",
                        // pressed-in when marked present, raised when not
                        background: entry.present ? "var(--cc-surface-inset)" : "var(--cc-bg)",
                        boxShadow: entry.present ? "var(--cc-neu-inset-xs)" : "var(--cc-neu-sm)",
                        color: entry.present ? "var(--cc-success)" : "var(--cc-text-muted)",
                      }}
                    >
                      {entry.present ? <CheckSquare size={16} color="var(--cc-success)" /> : <Square size={16} color="var(--cc-text-faint)" />}
                      <span style={{ flex: 1 }}>{entry.name}</span>
                      <PctBadge pct={stats?.percentage ?? 0} total={stats?.total ?? 0} />
                    </button>
                  );
                })}
              </div>

              <div style={{ marginTop: "8px", display: "flex", justifyContent: "flex-end", gap: "16px", fontSize: "0.72rem", color: "var(--cc-text-faint)", flexWrap: "wrap" }}>
                <span>🟢 ≥75%: <strong style={{ color: "var(--cc-text)" }}>{bandCounts.high}</strong></span>
                <span>🟡 50–74%: <strong style={{ color: "var(--cc-text)" }}>{bandCounts.mid}</strong></span>
                <span>🔴 &lt;50%: <strong style={{ color: "var(--cc-text)" }}>{bandCounts.low}</strong></span>
              </div>
            </>
          )}
        </div>

        <div>
          <SectionTitle icon={<Video size={14} color="var(--cc-accent-bright)" />} title="Highlight Video" required htmlFor="cc-video" />
          <input
            id="cc-video"
            className="cc-input"
            type="url"
            inputMode="url"
            placeholder="YouTube / Drive / Loom link of meeting highlights"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </div>

        <div>
          <SectionTitle icon={<ImagePlus size={14} color="var(--cc-accent-bright)" />} title="Meeting Photos (1–3 images)" required htmlFor="cc-photos" />
          <input
            id="cc-photos"
            className="cc-input"
            type="file"
            multiple
            accept="image/*"
            onChange={handlePhotos}
            disabled={photoFiles.length >= 3}
            style={{ cursor: "pointer", padding: "12px 14px" }}
          />
          {photoFiles.length > 0 && (
            <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
              {photoFiles.map((f, i) => (
                <span key={`${f.name}-${i}`} className="cc-well-deep" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.74rem", color: "var(--cc-text-muted)", padding: "6px 10px" }}>
                  📸 <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
                  <button
                    type="button"
                    onClick={() => setPhotoFiles((prev) => prev.filter((_, j) => j !== i))}
                    aria-label={`Remove ${f.name}`}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--cc-text-faint)", display: "flex", padding: 0 }}
                  >
                    <X size={13} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="cc-btn-primary"
          style={{ padding: "14px", borderRadius: "14px", fontSize: "0.95rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="cc-spin" /> Submitting Report...
            </>
          ) : (
            <>
              <Send size={15} /> Submit Meeting Report
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CCMeetingPanel;
