import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";

import { db, auth } from "@/lib/firebase";
import { kidsTestData, adultsTestData, TestData } from "@/lib/testData";
import { NeumorphicButton } from "@/components/ui/neumorphic-button";
import { NeumorphicCard } from "@/components/ui/neumorphic-card";

/* ------------------------------------------------ */
/* ---------------- TEST INTERFACE ---------------- */
/* ------------------------------------------------ */

const TestInterface = ({
  testData,
  testType,
  userId,
  onBack,
}: {
  testData: TestData;
  testType: "kids" | "adults";
  userId: string;
  onBack: () => void;
}) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    console.log("🟢 SUBMIT");
    console.log("userId:", userId);
    console.log("testType:", testType);

    if (!userId || !testType) {
      alert("Missing user or test type");
      return;
    }

    setSubmitting(true);

    let score = 0;
    let total = 0;

    testData.sections.forEach((section) =>
      section.questions.forEach((q) => {
        total++;
        if (answers[q.id] === q.correctAnswer) score++;
      })
    );

    try {
      const ref = await addDoc(collection(db, "testResults"), {
        userId,
        testType,
        score,
        total,
        percentage: Math.round((score / total) * 100),
        createdAt: serverTimestamp(),
      });

      console.log("✅ SAVED:", ref.id);
      setSubmitted(true);
    } catch (e) {
      console.error("❌ FIRESTORE ERROR:", e);
      alert("Save failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Test Submitted 🎉</h2>
        <NeumorphicButton onClick={onBack}>
          Back to Tests
        </NeumorphicButton>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">{testData.title}</h2>

      {testData.sections.map((section) => (
        <div key={section.title} className="space-y-4">
          <h3 className="text-xl font-semibold">{section.title}</h3>

          {section.questions.map((q) => (
            <div key={q.id}>
              <p className="font-medium">{q.question}</p>

              {q.options.map((opt, idx) => {
                const letter = String.fromCharCode(97 + idx);
                return (
                  <label key={idx} className="block">
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      checked={answers[q.id] === letter}
                      onChange={() =>
                        setAnswers({ ...answers, [q.id]: letter })
                      }
                    />
                    {" "}{opt}
                  </label>
                );
              })}
            </div>
          ))}
        </div>
      ))}

      <NeumorphicButton
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? "Submitting..." : "Submit Test"}
      </NeumorphicButton>
    </div>
  );
};

/* ------------------------------------------------ */
/* -------------------- MAIN PAGE ------------------ */
/* ------------------------------------------------ */

const Tests = () => {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [selectedTest, setSelectedTest] =
    useState<"kids" | "adults" | null>(null);

  useEffect(() => {
    signOut(auth);
  }, []);

  const handleAuth = async () => {
    const cred = isRegister
      ? await createUserWithEmailAndPassword(auth, email, password)
      : await signInWithEmailAndPassword(auth, email, password);

    setUser(cred.user);
  };

  if (selectedTest && user) {
    return (
      <TestInterface
        testData={
          selectedTest === "kids"
            ? kidsTestData
            : adultsTestData
        }
        testType={selectedTest}
        userId={user.uid}
        onBack={() => setSelectedTest(null)}
      />
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      {!user && (
        <NeumorphicCard>
          <div className="p-6 space-y-4">
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <NeumorphicButton onClick={handleAuth}>
              {isRegister ? "Register" : "Login"}
            </NeumorphicButton>
            <button
              onClick={() => setIsRegister(!isRegister)}
            >
              Switch to {isRegister ? "Login" : "Register"}
            </button>
          </div>
        </NeumorphicCard>
      )}

      {user && !selectedTest && (
        <div className="space-y-4">
          <NeumorphicButton onClick={() => setSelectedTest("kids")}>
            Kids Test
          </NeumorphicButton>
          <NeumorphicButton onClick={() => setSelectedTest("adults")}>
            Adults Test
          </NeumorphicButton>
        </div>
      )}
    </div>
  );
};

export default Tests;
