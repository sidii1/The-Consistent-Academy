// lib/saveTestResult.ts
// Use this wherever you currently write the test result to Firestore.
// It fetches the user's name + company from users/{uid} and attaches them.

import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface TestPayload {
  score: number;
  totalQuestions: number;
  percentage: number;
  testType?: string;           // e.g. "Grammar", "Vocabulary"
  [key: string]: any;          // any extra fields you already save
}

export async function saveTestResult(payload: TestPayload) {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  // Pull name + company saved at signup
  const userDoc = await getDoc(doc(db, "users", user.uid));
  const userData = userDoc.exists() ? userDoc.data() : {};

  await addDoc(collection(db, "testResults"), {
  ...payload,
  userId: user.uid,   // ← was "uid", now matches the Firestore rule
  email: user.email,
  name: userData.name || "N/A",
  company: userData.company || "N/A",
  createdAt: serverTimestamp(),
});await addDoc(collection(db, "testResults"), {
    ...payload,
    uid: user.uid,
    email: user.email,
    name: userData.name || "N/A",
    company: userData.company || "N/A",
    createdAt: serverTimestamp(),
  });
}