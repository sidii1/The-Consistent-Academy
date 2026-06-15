import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NeumorphicCard } from "@/components/ui/neumorphic-card";
import { NeumorphicButton } from "@/components/ui/neumorphic-button";
import { Navbar } from "@/components/layout/Navbar";
import { XCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TestData } from "@/lib/tests/testData";
import TestResults from "./TestResults";

interface TestInterfaceProps {
  testData: TestData;
  onBackToSelection?: () => void;
  onTestComplete?: (result: {
    attempted: number;
    correct: number;
    wrong: number;
  }) => void;
}

interface UserAnswers {
  [questionId: number]: string;
}

const TestInterface = ({
  testData,
  onBackToSelection,
  onTestComplete,
}: TestInterfaceProps) => {

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showUnansweredWarning, setShowUnansweredWarning] = useState(false);

  // Flatten all questions from all sections
  const allQuestions = testData.sections.flatMap((section) => section.questions);
  const currentQuestion = allQuestions[currentQuestionIndex];
  const totalQuestions = allQuestions.length;
  const answeredCount = Object.keys(userAnswers).length;
  const allAnswered = answeredCount === totalQuestions;

  const handleAnswerSelect = (answer: string) => {
    setUserAnswers({
      ...userAnswers,
      [currentQuestion.id]: answer,
    });
    // Clear warning once user starts answering
    if (showUnansweredWarning) setShowUnansweredWarning(false);
  };

  const calculateResults = () => {
    let correct = 0;
    allQuestions.forEach((question) => {
      const userAnswer = userAnswers[question.id];
      if (userAnswer && userAnswer === question.correctAnswer) {
        correct++;
      }
    });
    const attempted = Object.keys(userAnswers).length;
    const wrong = attempted - correct;
    return { attempted, correct, wrong };
  };

  const handleClearAnswer = () => {
    const newAnswers = { ...userAnswers };
    delete newAnswers[currentQuestion.id];
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Trying to finish — validate all answered
      if (!allAnswered) {
        setShowUnansweredWarning(true);
        // Jump to first unanswered question
        const firstUnanswered = allQuestions.findIndex((q) => !userAnswers[q.id]);
        if (firstUnanswered !== -1) setCurrentQuestionIndex(firstUnanswered);
        return;
      }
      setIsTestCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Called from the submit confirmation screen
  const handleSubmit = () => {
    if (!allAnswered) {
      setShowUnansweredWarning(true);
      setIsTestCompleted(false);
      const firstUnanswered = allQuestions.findIndex((q) => !userAnswers[q.id]);
      if (firstUnanswered !== -1) setCurrentQuestionIndex(firstUnanswered);
      return;
    }
    const results = calculateResults();
    onTestComplete?.(results);
    setShowResults(true);
  };

  // Triggered by sidebar / mobile "Submit Test" buttons
  const handleAttemptSubmit = () => {
    if (!allAnswered) {
      setShowUnansweredWarning(true);
      const firstUnanswered = allQuestions.findIndex((q) => !userAnswers[q.id]);
      if (firstUnanswered !== -1) setCurrentQuestionIndex(firstUnanswered);
      return;
    }
    setIsTestCompleted(true);
  };

  const handleRetry = () => {
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setIsTestCompleted(false);
    setShowResults(false);
    setShowUnansweredWarning(false);
  };

  const getOptionLetter = (index: number) => String.fromCharCode(97 + index);

  const getSectionDescription = (section: string): string => {
    const descriptions: { [key: string]: string } = {
      "Fill in the Blanks": "Choose the correct word",
      "Analogy": "Find the correct pair",
      "Grammar": "Identify correct sentence",
      "Synonyms": "Find words with similar meaning",
      "Comparison": "Use comparative/superlative forms",
      "Idioms": "Understand phrase meanings",
      "Vocabulary": "Match words to definitions",
    };
    return descriptions[section] || "";
  };

  // ── Results Screen ──
  if (showResults) {
  return (
    <TestResults
      testData={testData}
      userAnswers={userAnswers}
      allQuestions={allQuestions}
      onBackToSelection={onBackToSelection}
    />
  );
}if (showResults) {
    return (
      <TestResults
        testData={testData}
        userAnswers={userAnswers}
        allQuestions={allQuestions}

        onBackToSelection={onBackToSelection}
      />
    );
  }

  // ── Submit Confirmation Screen ──
  if (isTestCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <NeumorphicCard className="max-w-2xl mx-auto mt-24">
          <div className="p-4 md:p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 text-foreground">
              Ready to Submit?
            </h2>
            <div className="mb-6">
              <p className="text-base text-muted-foreground mb-3">
                You have answered{" "}
                <span className="font-bold text-primary">{answeredCount}</span> out of{" "}
                <span className="font-bold">{totalQuestions}</span> questions.
              </p>
              {/* This screen is only reachable when allAnswered is true,
                  but we keep this as a safety net display */}
              {!allAnswered && (
                <p className="text-destructive font-medium text-sm">
                  ⚠️ {totalQuestions - answeredCount} question
                  {totalQuestions - answeredCount !== 1 ? "s" : ""} still unanswered
                </p>
              )}
            </div>
            <div className="flex gap-4 justify-center">
              <NeumorphicButton
                variant="secondary"
                onClick={() => setIsTestCompleted(false)}
              >
                Review Answers
              </NeumorphicButton>
              <NeumorphicButton variant="primary" onClick={handleSubmit}>
                Submit Test
              </NeumorphicButton>
            </div>
          </div>
        </NeumorphicCard>
      </motion.div>
    );
  }

  // ── Test Interface ──
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const selectedAnswer = userAnswers[currentQuestion.id];
  const unansweredCount = totalQuestions - answeredCount;

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto mt-12 px-4">

        {/* ── Unanswered warning banner ── */}
        <AnimatePresence>
          {showUnansweredWarning && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="flex items-center gap-3 mb-4 px-5 py-3 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive"
            >
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">
                Please answer all questions before submitting.{" "}
                <span className="font-bold">{unansweredCount} question{unansweredCount !== 1 ? "s" : ""} remaining.</span>
                {" "}You've been taken to the first unanswered question.
              </p>
              <button
                onClick={() => setShowUnansweredWarning(false)}
                className="ml-auto flex-shrink-0 hover:opacity-70 transition-opacity"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-[1fr_300px] gap-4">
          {/* Question Card - Left Side */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <NeumorphicCard className="mb-4 ">
                <div className="p-5">
                  {currentQuestion.section && (
                    <div className="mb-4">
                      <div className="inline-block px-3 py-1 rounded-lg shadow-neu-inset bg-gradient-to-br from-primary/10 to-accent/10">
                        <span className="text-xs font-medium text-primary">
                          {currentQuestion.section}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 ml-1">
                        {getSectionDescription(currentQuestion.section)}
                      </p>
                    </div>
                  )}

                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-4">
                    {currentQuestion.question}
                  </h3>

                  {/* Options */}
                  <div className="space-y-2">
                    {currentQuestion.options.map((option, index) => {
                      const optionLetter = getOptionLetter(index);
                      const isSelected = selectedAnswer === optionLetter;

                      return (
                        <motion.button
                          key={index}
                          onClick={() => handleAnswerSelect(optionLetter)}
                          className={cn(
                            "w-full p-3 rounded-xl text-left transition-all duration-300 flex items-center gap-3",
                            isSelected
                              ? "shadow-neu-inset bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary"
                              : "shadow-neu hover:shadow-neu-lg bg-gradient-to-br from-card to-secondary/20 border-2 border-transparent"
                          )}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <div
                            className={cn(
                              "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm transition-all",
                              isSelected
                                ? "bg-gradient-to-br from-primary to-accent text-white shadow-neu-lg"
                                : "shadow-neu-inset text-muted-foreground"
                            )}
                          >
                            {optionLetter.toUpperCase()}
                          </div>
                          <span className="text-sm md:text-base text-foreground flex-1">
                            {option}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Clear Selection */}
                  {selectedAnswer && (
                    <motion.button
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      onClick={handleClearAnswer}
                      className="mt-3 text-s text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
                    >
                      <XCircle className="w-3 h-3" />
                      Clear Selection
                    </motion.button>
                  )}
                </div>
              </NeumorphicCard>

              {/* Mobile Navigation */}
              <div className="flex items-center justify-between lg:hidden">
                <NeumorphicButton
                  variant="secondary"
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className={cn(
                    "text-sm",
                    currentQuestionIndex === 0 && "opacity-50 cursor-not-allowed"
                  )}
                >
                  Previous
                </NeumorphicButton>

                <div className="text-xs text-muted-foreground">
                  {answeredCount} / {totalQuestions} answered
                </div>

                {currentQuestionIndex === totalQuestions - 1 ? (
                  <NeumorphicButton
                    variant="primary"
                    onClick={handleAttemptSubmit}
                    className="text-sm"
                  >
                    Finish Test
                  </NeumorphicButton>
                ) : (
                  <NeumorphicButton variant="primary" onClick={handleNext} className="text-sm">
                    Next
                  </NeumorphicButton>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress Sidebar - Right Side */}
          <div className="lg:sticky lg:top-24 lg:self-start hidden lg:block">
            <NeumorphicCard>
              <div className="p-4">
                <h2 className="text-sm font-bold text-foreground mb-3">{testData.title}</h2>

                {/* Progress Circle */}
                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-32 h-32">
                    <svg className="transform -rotate-90 w-32 h-32">
                      <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="none" className="text-secondary/30" />
                      <circle
                        cx="64" cy="64" r="56"
                        stroke="url(#gradient)" strokeWidth="8" fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
                        className="transition-all duration-500 ease-out"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="hsl(262 83% 58%)" />
                          <stop offset="100%" stopColor="hsl(280 70% 65%)" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-primary">{currentQuestionIndex + 1}</span>
                      <span className="text-xs text-muted-foreground">of {totalQuestions}</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Answered</span>
                    <span className={cn("font-medium", allAnswered ? "text-green-600" : "text-foreground")}>
                      {answeredCount} / {totalQuestions}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Remaining</span>
                    <span className={cn("font-medium", unansweredCount > 0 ? "text-destructive" : "text-green-600")}>
                      {unansweredCount}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative h-2 rounded-full shadow-neu-inset bg-gradient-to-r from-card to-secondary/20 overflow-hidden mb-4">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>

                {/* Answered progress bar */}
                <div className="mb-1">
                  <p className="text-[10px] text-muted-foreground mb-1">Questions answered</p>
                  <div className="relative h-2 rounded-full bg-secondary/30 overflow-hidden">
                    <motion.div
                      className={cn(
                        "absolute top-0 left-0 h-full rounded-full",
                        allAnswered ? "bg-green-500" : "bg-amber-400"
                      )}
                      animate={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="space-y-2 mt-4">
                  <NeumorphicButton
                    variant="secondary"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    className={cn("w-full text-sm", currentQuestionIndex === 0 && "opacity-50 cursor-not-allowed")}
                  >
                    ← Previous
                  </NeumorphicButton>

                  {currentQuestionIndex === totalQuestions - 1 ? (
                    <NeumorphicButton
                      variant="primary"
                      onClick={handleAttemptSubmit}
                      className="w-full"
                    >
                      Submit Test ✓
                    </NeumorphicButton>
                  ) : (
                    <NeumorphicButton variant="primary" onClick={handleNext} className="w-full text-sm">
                      Next →
                    </NeumorphicButton>
                  )}

                  {/* Submit Early */}
                  <div className="pt-2 border-t border-border/50">
                    <NeumorphicButton
                      variant="secondary"
                      onClick={handleAttemptSubmit}
                      className={cn(
                        "w-full text-xs",
                        !allAnswered && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {allAnswered ? "Submit Test" : `Answer ${unansweredCount} more to submit`}
                    </NeumorphicButton>
                  </div>
                </div>
              </div>
            </NeumorphicCard>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestInterface;