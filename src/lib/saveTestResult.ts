// lib/saveTestResult.ts
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface TestPayload {
  score: number;
  totalQuestions: number;
  percentage: number;
  testType?: string;
  [key: string]: any;
}

export async function saveTestResult(payload: TestPayload) {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const userDoc = await getDoc(doc(db, "users", user.uid));
  const userData = userDoc.exists() ? userDoc.data() : {};

  await addDoc(collection(db, "testResults"), {
    ...payload,
    userId: user.uid,        // matches Firestore rule: request.resource.data.userId
    email: user.email,
    name: userData.name || "N/A",
    company: userData.company || "N/A",
    createdAt: serverTimestamp(),
  });

  console.log("✅ Test result saved");
}