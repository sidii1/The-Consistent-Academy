import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export type CCRole =
  | "Student"
  | "President"
  | "Vice President"
  | "Team Leader"
  | "Event Team"

export type SpeechStatus =
  | "Not Started"
  | "Pending Review"
  | "Well Done"
  | "Redo";

export interface CCUser {
  uid: string;
  name: string;
  email: string;
  college: string;
  club_role: CCRole;
  current_level: 1 | 2 | 3 | 4;
  total_points: number;
  badges: string[];
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

export interface CCSpeech {
  speech_id: string;       // "L1_S1", "L2_S3", etc.
  level: 1 | 2 | 3 | 4;
  speech_number: 1 | 2 | 3 | 4;
  title: string;
  submission_url: string;
  submission_type: "link" | "none";
  status: SpeechStatus;
  score: number | null;
  submitted_at: Timestamp | null;
  evaluated_at: Timestamp | null;
  evaluator_notes: string;
}

export interface AttendanceEntry {
  uid: string;
  name: string;
  present: boolean;
}

export interface CCMeetingReport {
  id?: string;
  college: string;
  uploaded_by_uid: string;
  uploaded_by_name: string;
  meeting_date: Timestamp;
  week_number: number;
  mom_text: string;
  attendance: AttendanceEntry[];
  highlight_video_url: string;
  photos: string[];
  created_at?: Timestamp;
}

// ─────────────────────────────────────────────────────────────
// SPEECH FRAMEWORK DATA (derived from CC Club Manual)
// ─────────────────────────────────────────────────────────────

export const SPEECH_FRAMEWORK: Record<
  number,
  { title: string; objective: string; examples: string[] }[]
> = {
  1: [
    {
      title: "Self-Introduction Speech",
      objective: "Speak about yourself with clarity and basic confidence.",
      examples: ["Who am I?", "My Journey So Far", "My Strengths and Dreams"],
    },
    {
      title: "My Daily Life / Routine",
      objective: "Improve sentence formation and fluency in everyday English.",
      examples: ["A Day in My Life", "My Productive Routine", "My Weekend Story"],
    },
    {
      title: "My Favourite",
      objective: "Express likes and opinions with basic vocabulary.",
      examples: ["My Favourite Teacher", "A Movie I Love", "My Favourite Place"],
    },
    {
      title: "Describe an Experience",
      objective: "Narrate events using past tense and sequencing.",
      examples: ["My Best Day", "A Lesson I Learned", "An Embarrassing Moment"],
    },
  ],
  2: [
    {
      title: "Opinion Speech",
      objective: "Express and justify opinions logically.",
      examples: ["Online vs Offline Learning", "Is Social Media Good or Bad?", "Should Exams Be Removed?"],
    },
    {
      title: "Informative Speech",
      objective: "Explain a topic clearly and logically.",
      examples: ["Artificial Intelligence Basics", "Importance of Time Management", "How to Stay Fit"],
    },
    {
      title: "Storytelling Speech",
      objective: "Engage the audience through narration.",
      examples: ["A Story That Inspired Me", "A Fictional Story with a Moral", "A Childhood Memory"],
    },
    {
      title: "Problem-Solution Speech",
      objective: "Identify a problem and propose solutions.",
      examples: ["Stress Among Students", "Lack of Communication Skills", "Mobile Addiction"],
    },
  ],
  3: [
    {
      title: "Persuasive Speech",
      objective: "Convince the audience effectively.",
      examples: ["Why Communication Skills Matter More Than Marks", "Why Reading Should Be a Daily Habit", "Say No to Procrastination"],
    },
    {
      title: "Presentation Speech",
      objective: "Simulate corporate or academic presentations.",
      examples: ["My Dream Company", "Startup Idea Pitch", "Market Trends in Finance/Marketing"],
    },
    {
      title: "Debate Speech",
      objective: "Argue for or against a topic confidently.",
      examples: ["AI Will Replace Jobs", "Work From Home vs Office", "Marks Define Intelligence"],
    },
    {
      title: "Interview Simulation Speech",
      objective: "Prepare for real placement interviews.",
      examples: ["Tell Me About Yourself", "Why Should We Hire You?", "Strengths & Weaknesses"],
    },
  ],
  4: [
    {
      title: "Leadership Speech",
      objective: "Inspire, lead, and influence an audience.",
      examples: ["Be the Change", "Leadership is a Choice", "Rise Above Average"],
    },
    {
      title: "Extempore / Impromptu Speech",
      objective: "Think and speak instantly with clarity.",
      examples: ["Success", "Failure", "Money vs Happiness"],
    },
    {
      title: "Corporate Presentation",
      objective: "Deliver high-level professional presentations.",
      examples: ["Business Strategy Plan", "Company Analysis", "Product Launch Pitch"],
    },
    {
      title: "Impact Speech (TED-style)",
      objective: "Deliver a powerful, memorable talk.",
      examples: ["Why No One Is Happy?", "My Biggest Failure", "The Power of Consistency"],
    },
  ],
};

export const LEVEL_NAMES: Record<number, string> = {
  1: "Foundation",
  2: "Development",
  3: "Advanced",
  4: "Mastery",
};

export const ROLE_POINTS: Record<CCRole, number> = {
  Student: 0,
  President: 10,
  "Vice President": 7,
  "Team Leader": 5,
  "Event Team": 3,
};

// ─────────────────────────────────────────────────────────────
// CC USERS
// ─────────────────────────────────────────────────────────────

export async function createCCUser(uid: string, data: Omit<CCUser, "uid" | "created_at" | "updated_at">): Promise<void> {
  await setDoc(doc(db, "cc_users", uid), {
    ...data,
    uid,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });
}

export async function getCCUser(uid: string): Promise<CCUser | null> {
  const snap = await getDoc(doc(db, "cc_users", uid));
  if (!snap.exists()) return null;
  return snap.data() as CCUser;
}

export async function updateCCUser(uid: string, data: Partial<CCUser>): Promise<void> {
  await updateDoc(doc(db, "cc_users", uid), {
    ...data,
    updated_at: serverTimestamp(),
  });
}

/** Get all CC Club members for a given college (for attendance lists) */
export async function getCCUsersByCollege(college: string): Promise<CCUser[]> {
  const q = query(collection(db, "cc_users"), where("college", "==", college));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as CCUser);
}

/** Get all CC Club members (for admin panel) */
export async function getAllCCUsers(): Promise<CCUser[]> {
  const snap = await getDocs(collection(db, "cc_users"));
  return snap.docs.map((d) => d.data() as CCUser);
}

export async function deleteCCUser(uid: string): Promise<void> {
  await deleteDoc(doc(db, "cc_users", uid));
}

// ─────────────────────────────────────────────────────────────
// CC SPEECHES (sub-collection under cc_users/{uid}/cc_speeches)
// ─────────────────────────────────────────────────────────────

/** Returns all 16 speeches for a user, filling in defaults for unstarted ones. */
export async function getCCSpeeches(uid: string): Promise<CCSpeech[]> {
  const colRef = collection(db, "cc_users", uid, "cc_speeches");
  const snap = await getDocs(colRef);
  const existing = new Map<string, CCSpeech>();
  snap.docs.forEach((d) => existing.set(d.id, d.data() as CCSpeech));

  // Build all 16 speech slots
  const all: CCSpeech[] = [];
  for (let lvl = 1; lvl <= 4; lvl++) {
    for (let num = 1; num <= 4; num++) {
      const id = `L${lvl}_S${num}`;
      if (existing.has(id)) {
        all.push(existing.get(id)!);
      } else {
        all.push({
          speech_id: id,
          level: lvl as 1 | 2 | 3 | 4,
          speech_number: num as 1 | 2 | 3 | 4,
          title: SPEECH_FRAMEWORK[lvl][num - 1].title,
          submission_url: "",
          submission_type: "none",
          status: "Not Started",
          score: null,
          submitted_at: null,
          evaluated_at: null,
          evaluator_notes: "",
        });
      }
    }
  }
  return all;
}

export async function submitCCSpeech(uid: string, speechId: string, url: string): Promise<void> {
  const lvl = parseInt(speechId.charAt(1)) as 1 | 2 | 3 | 4;
  const num = parseInt(speechId.charAt(4)) as 1 | 2 | 3 | 4;
  await setDoc(doc(db, "cc_users", uid, "cc_speeches", speechId), {
    speech_id: speechId,
    level: lvl,
    speech_number: num,
    title: SPEECH_FRAMEWORK[lvl][num - 1].title,
    submission_url: url,
    submission_type: "link",
    status: "Pending Review",
    score: null,
    submitted_at: serverTimestamp(),
    evaluated_at: null,
    evaluator_notes: "",
  });
}

/** Admin: update speech evaluation status */
export async function evaluateCCSpeech(
  uid: string,
  speechId: string,
  status: "Well Done" | "Redo",
  score: number | null,
  notes: string
): Promise<void> {
  await updateDoc(doc(db, "cc_users", uid, "cc_speeches", speechId), {
    status,
    score,
    evaluator_notes: notes,
    evaluated_at: serverTimestamp(),
  });
}

// ─────────────────────────────────────────────────────────────
// CC MEETING REPORTS
// ─────────────────────────────────────────────────────────────

export async function createMeetingReport(data: Omit<CCMeetingReport, "id" | "created_at">): Promise<string> {
  const ref = await addDoc(collection(db, "cc_meeting_reports"), {
    ...data,
    created_at: serverTimestamp(),
  });
  return ref.id;
}

export async function getMeetingReports(college: string): Promise<CCMeetingReport[]> {
  const q = query(
    collection(db, "cc_meeting_reports"),
    where("college", "==", college),
    orderBy("created_at", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CCMeetingReport));
}
export async function getCCAttendanceStats(
  college: string
): Promise<Record<string, { present: number; total: number; percentage: number }>> {
  const q = query(
    collection(db, "cc_meeting_reports"),
    where("college", "==", college)
  );
  const snap = await getDocs(q);
  const reports = snap.docs.map((d) => d.data() as CCMeetingReport);
 
  const stats: Record<string, { present: number; total: number; percentage: number }> = {};
 
  reports.forEach((report) => {
    report.attendance.forEach((entry) => {
      if (!stats[entry.uid]) {
        stats[entry.uid] = { present: 0, total: 0, percentage: 0 };
      }
      stats[entry.uid].total += 1;
      if (entry.present) stats[entry.uid].present += 1;
    });
  });
 
  // Calculate percentages
  Object.keys(stats).forEach((uid) => {
    const s = stats[uid];
    s.percentage = s.total > 0 ? Math.round((s.present / s.total) * 100) : 0;
  });
 
  return stats;
}

export interface CCMeetingVideoSubmission {
  uid: string;
  name: string;
  report_id: string;
  week_number: number;
  video_url: string;
  status: "Pending Review" | "Well Done" | "Redo";
  evaluator_notes: string;
  submitted_at: Timestamp | null;
  evaluated_at: Timestamp | null;
}

// ── Meeting Video Submissions ──────────────────────────────

/** Student submits a video for a specific meeting report */
export async function submitMeetingVideo(
  uid: string,
  name: string,
  reportId: string,
  weekNumber: number,
  videoUrl: string
): Promise<void> {
  await setDoc(
    doc(db, "cc_meeting_videos", `${reportId}_${uid}`),
    {
      uid,
      name,
      report_id: reportId,
      week_number: weekNumber,
      video_url: videoUrl,
      status: "Pending Review",
      evaluator_notes: "",
      submitted_at: serverTimestamp(),
      evaluated_at: null,
    }
  );
}

/** Get all video submissions for a student */
export async function getStudentMeetingVideos(
  uid: string
): Promise<CCMeetingVideoSubmission[]> {
  const q = query(
    collection(db, "cc_meeting_videos"),
    where("uid", "==", uid)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as CCMeetingVideoSubmission);
}

/** President: get all video submissions for their college meetings */
export async function getCollegeMeetingVideos(
  college: string
): Promise<CCMeetingVideoSubmission[]> {
  // Get all report IDs for this college first
  const reports = await getMeetingReports(college);
  if (reports.length === 0) return [];

  const reportIds = reports.map((r) => r.id!);
  // Firestore 'in' supports max 30 items; chunk if needed
  const chunks: string[][] = [];
  for (let i = 0; i < reportIds.length; i += 30) {
    chunks.push(reportIds.slice(i, i + 30));
  }

  const allVideos: CCMeetingVideoSubmission[] = [];
  for (const chunk of chunks) {
    const q = query(
      collection(db, "cc_meeting_videos"),
      where("report_id", "in", chunk)
    );
    const snap = await getDocs(q);
    snap.docs.forEach((d) => allVideos.push(d.data() as CCMeetingVideoSubmission));
  }
  return allVideos;
}

/** President: evaluate a student's meeting video */
export async function evaluateMeetingVideo(
  reportId: string,
  uid: string,
  status: "Well Done" | "Redo",
  notes: string
): Promise<void> {
  await updateDoc(doc(db, "cc_meeting_videos", `${reportId}_${uid}`), {
    status,
    evaluator_notes: notes,
    evaluated_at: serverTimestamp(),
  });
}

// ── Attendance Stats (already added — keep existing getCCAttendanceStats) ──

/** Get a single student's attendance stats */
export async function getStudentAttendanceStats(
  uid: string,
  college: string
): Promise<{ present: number; total: number; percentage: number }> {
  const stats = await getCCAttendanceStats(college);
  return stats[uid] ?? { present: 0, total: 0, percentage: 0 };
}