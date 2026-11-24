import { collection, deleteDoc, doc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { SAMPLE_WEBINARS, type Webinar } from "@/data/sampleWebinars";

export type { Webinar } from "@/data/sampleWebinars";

const COLLECTION = "webinars";

/** Start of today in local time; webinars before this are over. */
const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

/** Webinar start as a timestamp, from `dateISO` or the human-readable `date`. NaN if unparseable. */
export const webinarTime = (w: Pick<Webinar, "date" | "dateISO">): number =>
  Date.parse(w.dateISO ? `${w.dateISO}T00:00:00` : w.date);

/**
 * Status shown to visitors. A webinar whose date has passed is treated as completed even
 * if nobody updated it, so registration never stays open for a past event.
 */
export const effectiveStatus = (w: Webinar): Webinar["status"] => {
  if (w.status === "completed") return "completed";
  const t = webinarTime(w);
  return Number.isFinite(t) && t < startOfToday() ? "completed" : w.status;
};

const byOrderThenDate = (a: Webinar, b: Webinar) =>
  (a.order ?? 1000) - (b.order ?? 1000) || (webinarTime(a) || 0) - (webinarTime(b) || 0);

/** Published webinars from Firestore, or the built-in samples when none are published (or the read fails). */
export async function loadPublicWebinars(): Promise<Webinar[]> {
  try {
    const snap = await getDocs(query(collection(db, COLLECTION), where("published", "==", true)));
    if (snap.empty) return SAMPLE_WEBINARS;
    return snap.docs.map((d) => ({ ...(d.data() as Webinar), id: d.id })).sort(byOrderThenDate);
  } catch (err) {
    console.warn("Could not load webinars from Firestore; showing built-in list.", err);
    return SAMPLE_WEBINARS;
  }
}

/** Every webinar document, for the admin panel. */
export async function listAllWebinars(): Promise<Webinar[]> {
  const snap = await getDocs(collection(db, COLLECTION));
  return snap.docs.map((d) => ({ ...(d.data() as Webinar), id: d.id })).sort(byOrderThenDate);
}

/** Firestore rejects `undefined` values, so drop them before writing. */
const clean = <T extends object>(o: T): T => JSON.parse(JSON.stringify(o));

export async function saveWebinar(w: Webinar): Promise<void> {
  const { id, ...rest } = w;
  await setDoc(doc(db, COLLECTION, id), { ...clean(rest), updatedAt: serverTimestamp() });
}

export async function deleteWebinar(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

/** Writes the built-in samples as editable, published documents. Skips ids that already exist. */
export async function importSampleWebinars(existingIds: Set<string>): Promise<number> {
  let n = 0;
  for (const [i, w] of SAMPLE_WEBINARS.entries()) {
    if (existingIds.has(w.id)) continue;
    await saveWebinar({ ...w, isSample: true, published: true, order: i });
    n++;
  }
  return n;
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
