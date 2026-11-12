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
  runTransaction,
  increment,
  arrayUnion,
  type DocumentReference,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export type SpeechStatus = "Not Started" | "Pending Review" | "Well Done" | "Redo";

export type CCRole =
  | "Student"
  | "President"
  | "Vice President"
  | "Team Leader"
  | "Event Team"
  | "Trainer";



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
  approvalStatus?: "pending" | "approved";
  profilePictureUrl?: string;
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
  youtubeUrl?: string;
  workflowState?: "submitted_to_president" | "validated" | "evaluated" | "needs_redo";
  trainerRemarks?: string;
  /** Who sent the speech back for a redo (set when workflowState === "needs_redo"). */
  sentBackBy?: "president" | "trainer";
  studentPointsAwarded?: number;
  presidentPointsAwarded?: number;
  version?: number;
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

/**
 * Roles that hold review powers over other members' work. Nobody can self-assign
 * these: sign-up creates the account as `approvalStatus: "pending"` and an admin
 * must approve it (AdminDashboard) before the dashboard unlocks.
 */
export const APPROVAL_REQUIRED_ROLES: CCRole[] = ["President", "Trainer"];

export const ROLE_POINTS: Record<CCRole, number> = {
  Student: 0,
  President: 10,
  "Vice President": 7,
  "Team Leader": 5,
  "Event Team": 3,
  Trainer: 0,
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
  const users = snap.docs.map((d) => d.data() as CCUser);
  // Exclude Trainers (they don't attend / submit) and anyone still awaiting admin approval
  return users.filter((u) => u.club_role !== "Trainer" && u.approvalStatus !== "pending");
}

/** Get all CC Club members (for admin panel) */
export async function getAllCCUsers(): Promise<CCUser[]> {
  const snap = await getDocs(collection(db, "cc_users"));
  return snap.docs.map((d) => d.data() as CCUser);
}

/** Every account (Trainer or President) waiting for admin approval. */
export async function getPendingApprovals(): Promise<CCUser[]> {
  const q = query(collection(db, "cc_users"), where("approvalStatus", "==", "pending"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as CCUser);
}

/** @deprecated use getPendingApprovals — kept so older imports keep compiling. */
export const getPendingTrainers = getPendingApprovals;

/** Approve a pending Trainer / President. Approving a President demotes any other President of that college. */
export async function approveMember(uid: string): Promise<void> {
  const ref = doc(db, "cc_users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Profile not found.");
  const member = snap.data() as CCUser;

  if (member.club_role === "President") {
    const others = await getDocs(
      query(
        collection(db, "cc_users"),
        where("college", "==", member.college),
        where("club_role", "==", "President")
      )
    );
    await Promise.all(
      others.docs
        .filter((d) => d.id !== uid && (d.data() as CCUser).approvalStatus !== "pending")
        .map((d) => updateDoc(d.ref, { club_role: "Student", updated_at: serverTimestamp() }))
    );
  }
  await updateDoc(ref, { approvalStatus: "approved", updated_at: serverTimestamp() });
}

/** @deprecated use approveMember */
export const approveTrainer = approveMember;

export async function deleteCCUser(uid: string): Promise<void> {
  await deleteDoc(doc(db, "cc_users", uid));
}

// ─────────────────────────────────────────────────────────────
// SHARED HELPERS
// ─────────────────────────────────────────────────────────────

type WorkflowState = NonNullable<CCSpeech["workflowState"]>;

/** Only http(s) links are accepted — blocks `javascript:` / `data:` URLs from ever being stored. */
export function isValidVideoUrl(raw: string): boolean {
  try {
    const u = new URL(raw.trim());
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

/**
 * Resolves the workflow state of a speech / meeting video, falling back to the
 * legacy `status` field for documents written before `workflowState` existed.
 */
export function getEffectiveWorkflowState(item: {
  workflowState?: WorkflowState;
  status?: string;
}): WorkflowState | undefined {
  if (item.workflowState) return item.workflowState;
  if (item.status === "Pending Review") return "submitted_to_president";
  if (item.status === "Well Done") return "evaluated";
  if (item.status === "Redo") return "needs_redo";
  return undefined;
}

/**
 * The single source of truth for how a speech should be displayed to students.
 * `workflowState` wins over the legacy `status` so that the two never disagree.
 */
export function getSpeechDisplayStatus(
  speech: Pick<CCSpeech, "status" | "workflowState">
): SpeechStatus {
  switch (getEffectiveWorkflowState(speech)) {
    case "evaluated":
      return "Well Done";
    case "needs_redo":
      return "Redo";
    case "submitted_to_president":
    case "validated":
      return "Pending Review";
    default:
      return speech.status ?? "Not Started";
  }
}

const clampPoints = (n: number) => Math.min(10, Math.max(0, Math.round(Number.isFinite(n) ? n : 0)));

const chunkArray = <T,>(arr: T[], size: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

const STALE_STATE_ERROR =
  "This item was already reviewed or changed by someone else. Refresh to see the latest status.";

/**
 * Atomically moves a document to a new workflow state, but only if it is
 * currently in one of the `from` states. This is what stops double-reviews,
 * double point awards and reviewers overwriting each other's decisions.
 */
async function transitionDoc(
  ref: DocumentReference,
  from: WorkflowState[],
  patch: Record<string, unknown>
): Promise<void> {
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) throw new Error("Submission not found.");
    const state = getEffectiveWorkflowState(snap.data() as { workflowState?: WorkflowState; status?: string });
    if (!state || !from.includes(state)) throw new Error(STALE_STATE_ERROR);
    tx.update(ref, patch);
  });
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
          version: 1,
        });
      }
    }
  }
  return all;
}

/**
 * Student submits (or re-submits after a redo) a speech recording.
 *
 * Guarded server-side-in-a-transaction so that a student cannot:
 *  - overwrite a speech that is under review or already evaluated,
 *  - jump ahead to a level they have not unlocked,
 *  - store a non-http(s) link.
 */
export async function submitCCSpeech(uid: string, speechId: string, url: string): Promise<void> {
  const cleanUrl = url.trim();
  if (!isValidVideoUrl(cleanUrl)) {
    throw new Error("Please enter a valid link starting with http:// or https://");
  }
  const match = /^L([1-4])_S([1-4])$/.exec(speechId);
  if (!match) throw new Error("Unknown speech.");
  const lvl = Number(match[1]) as 1 | 2 | 3 | 4;
  const num = Number(match[2]) as 1 | 2 | 3 | 4;

  const userRef = doc(db, "cc_users", uid);
  const speechRef = doc(db, "cc_users", uid, "cc_speeches", speechId);

  await runTransaction(db, async (tx) => {
    const [userSnap, speechSnap] = await Promise.all([tx.get(userRef), tx.get(speechRef)]);
    if (!userSnap.exists()) throw new Error("Profile not found.");

    const currentLevel = (userSnap.data() as CCUser).current_level ?? 1;
    if (lvl > currentLevel) throw new Error("Finish your current level to unlock this speech.");

    const existing = speechSnap.exists() ? (speechSnap.data() as CCSpeech) : null;
    const status = existing ? getSpeechDisplayStatus(existing) : "Not Started";
    if (status === "Pending Review") throw new Error("This speech is already under review.");
    if (status === "Well Done") throw new Error("This speech has already been approved.");

    const version = status === "Redo" ? (existing?.version ?? 1) + 1 : 1;

    // Full replace (no merge) so stale remarks / points from earlier attempts never linger.
    tx.set(speechRef, {
      speech_id: speechId,
      level: lvl,
      speech_number: num,
      title: SPEECH_FRAMEWORK[lvl][num - 1].title,
      submission_url: cleanUrl,
      youtubeUrl: cleanUrl,
      submission_type: "link",
      status: "Pending Review",
      workflowState: "submitted_to_president",
      score: null,
      submitted_at: serverTimestamp(),
      evaluated_at: null,
      evaluator_notes: "",
      version,
    });
  });
}

/** Re-submit after a redo. Kept as an alias — `submitCCSpeech` handles the redo case. */
export async function resubmitSpeech(
  uid: string,
  speechId: string,
  newUrl: string,
  _currentVersion?: number
): Promise<void> {
  await submitCCSpeech(uid, speechId, newUrl);
}

/**
 * Advances a student to the next level when all 4 speeches of their current
 * level are approved. Idempotent and transactional, so it is safe to call after
 * every approval. Returns the (possibly new) level.
 */
export async function syncLevelProgress(uid: string): Promise<number> {
  const userRef = doc(db, "cc_users", uid);
  return runTransaction(db, async (tx) => {
    const userSnap = await tx.get(userRef);
    if (!userSnap.exists()) return 1;
    const level = (userSnap.data() as CCUser).current_level ?? 1;
    if (level >= 4) return level;

    const speechSnaps = await Promise.all(
      [1, 2, 3, 4].map((n) => tx.get(doc(db, "cc_users", uid, "cc_speeches", `L${level}_S${n}`)))
    );
    const allDone = speechSnaps.every(
      (s) => s.exists() && getSpeechDisplayStatus(s.data() as CCSpeech) === "Well Done"
    );
    if (!allDone) return level;

    const next = (level + 1) as 1 | 2 | 3 | 4;
    tx.update(userRef, {
      current_level: next,
      badges: arrayUnion(`Level ${level} Complete`),
      updated_at: serverTimestamp(),
    });
    return next;
  });
}

/** Admin override: set a speech to Well Done / Redo regardless of where it is in the pipeline. */
export async function evaluateCCSpeech(
  uid: string,
  speechId: string,
  status: "Well Done" | "Redo",
  score: number | null,
  notes: string
): Promise<void> {
  await updateDoc(doc(db, "cc_users", uid, "cc_speeches", speechId), {
    status,
    // Keep workflowState in lock-step so the student / trainer / president views agree.
    workflowState: status === "Well Done" ? "evaluated" : "needs_redo",
    score,
    evaluator_notes: notes,
    trainerRemarks: notes,
    evaluated_at: serverTimestamp(),
  });
  if (status === "Well Done") await syncLevelProgress(uid);
}

// ── 3-Tier Workflow Functions ─────────────────────────────────────────────

type SpeechWithOwner = { uid: string; name: string; speech: CCSpeech };

async function getSpeechesInState(
  college: string,
  state: WorkflowState,
  preloadedUsers?: CCUser[]
): Promise<SpeechWithOwner[]> {
  const users = preloadedUsers ?? (await getCCUsersByCollege(college));
  const perUser = await Promise.all(
    users.map(async (user) => {
      const q = query(
        collection(db, "cc_users", user.uid, "cc_speeches"),
        where("workflowState", "==", state)
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ uid: user.uid, name: user.name, speech: d.data() as CCSpeech }));
    })
  );
  return perUser.flat();
}

export function getPendingPresidentSpeeches(college: string, users?: CCUser[]): Promise<SpeechWithOwner[]> {
  return getSpeechesInState(college, "submitted_to_president", users);
}

export function getValidatedSpeeches(college: string, users?: CCUser[]): Promise<SpeechWithOwner[]> {
  return getSpeechesInState(college, "validated", users);
}

/** President: forward a speech to the trainer. */
export async function validateSpeech(uid: string, speechId: string): Promise<void> {
  await transitionDoc(doc(db, "cc_users", uid, "cc_speeches", speechId), ["submitted_to_president"], {
    workflowState: "validated",
    status: "Pending Review",
  });
}

/** President: send a speech back to the student for a redo. */
export async function rejectSpeech(uid: string, speechId: string, reason: string): Promise<void> {
  await transitionDoc(doc(db, "cc_users", uid, "cc_speeches", speechId), ["submitted_to_president"], {
    workflowState: "needs_redo",
    status: "Redo",
    trainerRemarks: reason, // shown to the student as "Feedback"
    evaluator_notes: reason,
    sentBackBy: "president",
  });
}

/**
 * Trainer: final evaluation of a validated speech.
 *
 * Approving is a single transaction that (a) flips the speech to `evaluated`,
 * (b) credits the student, and (c) credits the college President — so points
 * can never be awarded twice or half-awarded. Afterwards the student's level is
 * re-checked. Returns whether a President received points.
 */
export async function evaluateSpeechByTrainer(
  uid: string,
  speechId: string,
  data: {
    remarks: string;
    needsRedo: boolean;
    studentPoints: number;
    presidentPoints: number;
  }
): Promise<{ presidentCredited: boolean; newLevel?: number }> {
  const speechRef = doc(db, "cc_users", uid, "cc_speeches", speechId);
  const remarks = data.remarks.trim();

  if (data.needsRedo) {
    await transitionDoc(speechRef, ["validated"], {
      workflowState: "needs_redo",
      status: "Redo",
      trainerRemarks: remarks,
      evaluator_notes: remarks,
      sentBackBy: "trainer",
      evaluated_at: serverTimestamp(),
    });
    return { presidentCredited: false };
  }

  const studentPoints = clampPoints(data.studentPoints);
  const presidentPoints = clampPoints(data.presidentPoints);

  const userRef = doc(db, "cc_users", uid);
  const studentSnap = await getDoc(userRef);
  if (!studentSnap.exists()) throw new Error("Student profile not found.");
  const student = studentSnap.data() as CCUser;

  // Find the President(s) of the student's college to credit (not possible inside a client transaction).
  let presidentRefs: DocumentReference[] = [];
  if (presidentPoints > 0) {
    const presSnap = await getDocs(
      query(
        collection(db, "cc_users"),
        where("college", "==", student.college),
        where("club_role", "==", "President")
      )
    );
    presidentRefs = presSnap.docs
      .filter((d) => (d.data() as CCUser).approvalStatus !== "pending")
      .map((d) => d.ref);
  }

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(speechRef);
    if (!snap.exists()) throw new Error("Speech not found.");
    if (getEffectiveWorkflowState(snap.data() as CCSpeech) !== "validated") throw new Error(STALE_STATE_ERROR);

    tx.update(speechRef, {
      workflowState: "evaluated",
      status: "Well Done",
      trainerRemarks: remarks,
      evaluator_notes: remarks,
      studentPointsAwarded: studentPoints,
      presidentPointsAwarded: presidentRefs.length > 0 ? presidentPoints : 0,
      score: studentPoints,
      evaluated_at: serverTimestamp(),
    });
    tx.update(userRef, { total_points: increment(studentPoints), updated_at: serverTimestamp() });
    presidentRefs.forEach((ref) =>
      tx.update(ref, { total_points: increment(presidentPoints), updated_at: serverTimestamp() })
    );
  });

  let newLevel: number | undefined;
  try {
    const level = await syncLevelProgress(uid);
    if (level > (student.current_level ?? 1)) newLevel = level;
  } catch {
    /* level sync is best-effort; the next approval re-checks */
  }
  return { presidentCredited: presidentRefs.length > 0 && presidentPoints > 0, newLevel };
}

// ─────────────────────────────────────────────────────────────
// CC MEETING REPORTS
// ─────────────────────────────────────────────────────────────

export async function createMeetingReport(data: Omit<CCMeetingReport, "id" | "created_at">): Promise<string> {
  // One report per week per college — prevents accidental double-submits skewing attendance %.
  const dup = await getDocs(
    query(
      collection(db, "cc_meeting_reports"),
      where("college", "==", data.college),
      where("week_number", "==", data.week_number)
    )
  );
  if (!dup.empty) {
    throw new Error(`A report for Week ${data.week_number} has already been submitted.`);
  }
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

export type AttendanceStats = Record<string, { present: number; total: number; percentage: number }>;

/** Pure helper: derive per-member attendance from already-loaded reports (no extra reads). */
export function computeAttendanceStats(reports: CCMeetingReport[]): AttendanceStats {
  const stats: AttendanceStats = {};
  reports.forEach((report) => {
    (report.attendance ?? []).forEach((entry) => {
      if (!stats[entry.uid]) stats[entry.uid] = { present: 0, total: 0, percentage: 0 };
      stats[entry.uid].total += 1;
      if (entry.present) stats[entry.uid].present += 1;
    });
  });
  Object.values(stats).forEach((s) => {
    s.percentage = s.total > 0 ? Math.round((s.present / s.total) * 100) : 0;
  });
  return stats;
}

export async function getCCAttendanceStats(college: string): Promise<AttendanceStats> {
  const q = query(collection(db, "cc_meeting_reports"), where("college", "==", college));
  const snap = await getDocs(q);
  return computeAttendanceStats(snap.docs.map((d) => d.data() as CCMeetingReport));
}

export interface CCMeetingVideoSubmission {
  uid: string;
  name: string;
  report_id: string;
  week_number: number;
  video_url: string;
  status: "Pending Review" | "Well Done" | "Redo";
  workflowState?: "submitted_to_president" | "validated" | "evaluated" | "needs_redo";
  trainerRemarks?: string;
  evaluator_notes: string;
  sentBackBy?: "president" | "trainer";
  version?: number;
  submitted_at: Timestamp | null;
  evaluated_at: Timestamp | null;
}

// ── Meeting Video Submissions ──────────────────────────────

const meetingVideoRef = (reportId: string, uid: string) =>
  doc(db, "cc_meeting_videos", `${reportId}_${uid}`);

/**
 * Student submits (or re-submits after a redo) a video for a meeting.
 * Refuses to overwrite a submission that is under review or already evaluated,
 * and only accepts reports from the student's own college.
 */
export async function submitMeetingVideo(
  uid: string,
  name: string,
  reportId: string,
  weekNumber: number,
  videoUrl: string
): Promise<void> {
  const cleanUrl = videoUrl.trim();
  if (!isValidVideoUrl(cleanUrl)) {
    throw new Error("Please enter a valid link starting with http:// or https://");
  }
  const ref = meetingVideoRef(reportId, uid);
  const userRef = doc(db, "cc_users", uid);
  const reportRef = doc(db, "cc_meeting_reports", reportId);

  await runTransaction(db, async (tx) => {
    const [existingSnap, userSnap, reportSnap] = await Promise.all([
      tx.get(ref),
      tx.get(userRef),
      tx.get(reportRef),
    ]);
    if (!reportSnap.exists()) throw new Error("That meeting no longer exists.");
    if (!userSnap.exists()) throw new Error("Profile not found.");
    if ((reportSnap.data() as CCMeetingReport).college !== (userSnap.data() as CCUser).college) {
      throw new Error("You can only submit videos for your own college's meetings.");
    }

    let version = 1;
    if (existingSnap.exists()) {
      const existing = existingSnap.data() as CCMeetingVideoSubmission;
      if (getEffectiveWorkflowState(existing) !== "needs_redo") {
        throw new Error("This video has already been submitted and is being reviewed.");
      }
      version = (existing.version ?? 1) + 1;
    }

    tx.set(ref, {
      uid,
      name,
      report_id: reportId,
      week_number: weekNumber,
      video_url: cleanUrl,
      status: "Pending Review",
      workflowState: "submitted_to_president",
      evaluator_notes: "",
      version,
      submitted_at: serverTimestamp(),
      evaluated_at: null,
    });
  });
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

/** Fetch every video submission for a set of reports (batched `in` queries — 30 ids max each). */
async function getVideosForReports(reportIds: string[]): Promise<CCMeetingVideoSubmission[]> {
  if (reportIds.length === 0) return [];
  const snaps = await Promise.all(
    chunkArray(reportIds, 30).map((ids) =>
      getDocs(query(collection(db, "cc_meeting_videos"), where("report_id", "in", ids)))
    )
  );
  return snaps.flatMap((s) => s.docs.map((d) => d.data() as CCMeetingVideoSubmission));
}

/** President: get all video submissions for their college meetings */
export async function getCollegeMeetingVideos(
  college: string,
  preloadedReports?: CCMeetingReport[]
): Promise<CCMeetingVideoSubmission[]> {
  const reports = preloadedReports ?? (await getMeetingReports(college));
  return getVideosForReports(reports.map((r) => r.id!).filter(Boolean));
}

/** President: validate a student's meeting video */
export async function validateMeetingVideo(reportId: string, uid: string): Promise<void> {
  await transitionDoc(meetingVideoRef(reportId, uid), ["submitted_to_president"], {
    workflowState: "validated",
  });
}

/** President: reject a student's meeting video */
export async function rejectMeetingVideo(
  reportId: string,
  uid: string,
  reason: string
): Promise<void> {
  await transitionDoc(meetingVideoRef(reportId, uid), ["submitted_to_president"], {
    workflowState: "needs_redo",
    status: "Redo",
    evaluator_notes: reason,
    trainerRemarks: reason,
    sentBackBy: "president",
    evaluated_at: serverTimestamp(),
  });
}

/** Trainer: get validated meeting videos for a college */
export async function getValidatedMeetingVideos(
  college: string,
  preloadedReports?: CCMeetingReport[]
): Promise<CCMeetingVideoSubmission[]> {
  const all = await getCollegeMeetingVideos(college, preloadedReports);
  return all.filter((v) => getEffectiveWorkflowState(v) === "validated");
}

/** Trainer: evaluate a student's meeting video */
export async function evaluateMeetingVideoByTrainer(
  reportId: string,
  uid: string,
  data: {
    remarks: string;
    needsRedo: boolean;
  }
): Promise<void> {
  const remarks = data.remarks.trim();
  await transitionDoc(
    meetingVideoRef(reportId, uid),
    ["validated"],
    data.needsRedo
      ? {
          workflowState: "needs_redo",
          status: "Redo",
          trainerRemarks: remarks,
          evaluator_notes: remarks,
          sentBackBy: "trainer",
          evaluated_at: serverTimestamp(),
        }
      : {
          workflowState: "evaluated",
          status: "Well Done",
          trainerRemarks: remarks,
          evaluator_notes: remarks,
          evaluated_at: serverTimestamp(),
        }
  );
}

// ── Attendance Stats ──────────────────────────────────────

/** Get a single student's attendance stats */
export async function getStudentAttendanceStats(
  uid: string,
  college: string
): Promise<{ present: number; total: number; percentage: number }> {
  const stats = await getCCAttendanceStats(college);
  return stats[uid] ?? { present: 0, total: 0, percentage: 0 };
}
