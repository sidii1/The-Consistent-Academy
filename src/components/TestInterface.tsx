import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NeumorphicCard } from "@/components/ui/neumorphic-card";
import { NeumorphicButton } from "@/components/ui/neumorphic-button";
import { CheckCircle2, XCircle, Trophy, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TestData } from "@/lib/testData";

interface TestInterfaceProps {
  testData: TestData;
}

interface UserAnswers {
  [questionId: number]: string;
}

const TestInterface = ({ testData }: TestInterfaceProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Flatten all questions from all sections
  const allQuestions = testData.sections.flatMap((section) => section.questions);
  const currentQuestion = allQuestions[currentQuestionIndex];
  const totalQuestions = allQuestions.length;

  const handleAnswerSelect = (answer: string) => {
    setUserAnswers({
      ...userAnswers,
      [currentQuestion.id]: answer,
    });
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
      setIsTestCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    allQuestions.forEach((question) => {
      if (userAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: totalQuestions,
      percentage: Math.round((correct / totalQuestions) * 100),
    };
  };

  const handleRetry = () => {
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setIsTestCompleted(false);
    setShowResults(false);
  };

  const getOptionLetter = (index: number) => {
    return String.fromCharCode(97 + index); // a, b, c, d
  };

  // Results Screen
  if (showResults) {
    const score = calculateScore();
    const answeredQuestions = Object.keys(userAnswers).length;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <NeumorphicCard className="max-w-4xl mx-auto">
          <div className="p-6 md:p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-neu-lg"
            >
              <Trophy className="w-10 h-10 text-white" />
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Test Completed!
            </h2>

            <p className="text-lg text-muted-foreground mb-6">
              {testData.title}
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-xl shadow-neu-inset bg-gradient-to-br from-card to-secondary/20">
                <div className="text-2xl font-bold text-primary mb-1">
                  {score.percentage}%
                </div>
                <div className="text-xs text-muted-foreground">Score</div>
              </div>

              <div className="p-4 rounded-xl shadow-neu-inset bg-gradient-to-br from-card to-secondary/20">
                <div className="text-2xl font-bold text-foreground mb-1">
                  {score.correct}/{score.total}
                </div>
                <div className="text-xs text-muted-foreground">Correct Answers</div>
              </div>

              <div className="p-4 rounded-xl shadow-neu-inset bg-gradient-to-br from-card to-secondary/20">
                <div className="text-2xl font-bold text-foreground mb-1">
                  {answeredQuestions}/{totalQuestions}
                </div>
                <div className="text-xs text-muted-foreground">Attempted</div>
              </div>
            </div>

            {/* Performance Message */}
            <div className="mb-6">
              {score.percentage >= 80 && (
                <p className="text-base text-primary font-medium">
                  🎉 Excellent work! You have a strong grasp of grammar!
                </p>
              )}
              {score.percentage >= 60 && score.percentage < 80 && (
                <p className="text-base text-accent font-medium">
                  👍 Good job! Keep practicing to improve further!
                </p>
              )}
              {score.percentage < 60 && (
                <p className="text-base text-muted-foreground font-medium">
                  💪 Keep learning! Practice makes perfect!
                </p>
              )}
            </div>

            {/* Detailed Results */}
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-4 text-foreground">Answer Review</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {allQuestions.map((question, index) => {
                  const userAnswer = userAnswers[question.id];
                  const isCorrect = userAnswer === question.correctAnswer;
                  const wasAnswered = userAnswer !== undefined;

                  return (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        "p-3 rounded-lg text-left",
                        isCorrect
                          ? "bg-green-50 border-2 border-green-200"
                          : wasAnswered
                          ? "bg-red-50 border-2 border-red-200"
                          : "bg-gray-50 border-2 border-gray-200"
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 mt-0.5">
                          {isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : wasAnswered ? (
                            <XCircle className="w-4 h-4 text-red-600" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground text-sm mb-1">
                            Q{index + 1}: {question.question}
                          </p>
                          <div className="text-xs space-y-0.5">
                            {wasAnswered && (
                              <p className={isCorrect ? "text-green-700" : "text-red-700"}>
                                Your answer: {question.options[userAnswer.charCodeAt(0) - 97]}
                              </p>
                            )}
                            {!isCorrect && (
                              <p className="text-green-700">
                                Correct answer: {question.options[question.correctAnswer.charCodeAt(0) - 97]}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <NeumorphicButton
              variant="primary"
              onClick={handleRetry}
              className="min-w-[180px]"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Retry Test
            </NeumorphicButton>
          </div>
        </NeumorphicCard>
      </motion.div>
    );
  }

  // Submit Confirmation Screen
  if (isTestCompleted) {
    const answeredQuestions = Object.keys(userAnswers).length;
    const unansweredCount = totalQuestions - answeredQuestions;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <NeumorphicCard className="max-w-2xl mx-auto">
          <div className="p-6 md:p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 text-foreground">
              Ready to Submit?
            </h2>

            <div className="mb-6">
              <p className="text-base text-muted-foreground mb-3">
                You have answered <span className="font-bold text-primary">{answeredQuestions}</span> out of{" "}
                <span className="font-bold">{totalQuestions}</span> questions.
              </p>
              {unansweredCount > 0 && (
                <p className="text-destructive font-medium text-sm">
                  ⚠️ {unansweredCount} question{unansweredCount > 1 ? "s" : ""} remaining unanswered
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

  // Test Interface
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const selectedAnswer = userAnswers[currentQuestion.id];

  return (
    <div className="max-w-6xl mx-auto">
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
            <NeumorphicCard className="mb-4">
              <div className="p-5">
                {currentQuestion.section && (
                  <div className="inline-block px-3 py-1 rounded-lg shadow-neu-inset bg-gradient-to-br from-primary/10 to-accent/10 mb-4">
                    <span className="text-xs font-medium text-primary">
                      {currentQuestion.section}
                    </span>
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

                {/* Clear Selection Button */}
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

            {/* Navigation - Below Question Card */}
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
                {Object.keys(userAnswers).length} / {totalQuestions} answered
              </div>

              {currentQuestionIndex === totalQuestions - 1 ? (
                <NeumorphicButton variant="primary" onClick={handleNext} className="text-sm">
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
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-secondary/30"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      fill="none"
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
                    <span className="text-2xl font-bold text-primary">
                      {currentQuestionIndex + 1}
                    </span>
                    <span className="text-xs text-muted-foreground">of {totalQuestions}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Answered</span>
                  <span className="font-medium text-foreground">
                    {Object.keys(userAnswers).length} / {totalQuestions}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Remaining</span>
                  <span className="font-medium text-foreground">
                    {totalQuestions - Object.keys(userAnswers).length}
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

              {/* Navigation Buttons */}
              <div className="space-y-2">
                <NeumorphicButton
                  variant="secondary"
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className={cn(
                    "w-full text-sm",
                    currentQuestionIndex === 0 && "opacity-50 cursor-not-allowed"
                  )}
                >
                  ← Previous
                </NeumorphicButton>

                {currentQuestionIndex === totalQuestions - 1 ? (
                  <NeumorphicButton 
                    variant="primary" 
                    onClick={handleNext} 
                    className="w-full text-sm"
                  >
                    Finish Test ✓
                  </NeumorphicButton>
                ) : (
                  <NeumorphicButton 
                    variant="primary" 
                    onClick={handleNext} 
                    className="w-full text-sm"
                  >
                    Next →
                  </NeumorphicButton>
                )}
              </div>
            </div>
          </NeumorphicCard>
        </div>
      </div>
    </div>
  );
};

export default TestInterface;
