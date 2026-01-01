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
          <div className="p-8 md:p-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-neu-lg"
            >
              <Trophy className="w-12 h-12 text-white" />
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Test Completed!
            </h2>

            <p className="text-xl text-muted-foreground mb-8">
              {testData.title}
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 rounded-2xl shadow-neu-inset bg-gradient-to-br from-card to-secondary/20">
                <div className="text-3xl font-bold text-primary mb-2">
                  {score.percentage}%
                </div>
                <div className="text-sm text-muted-foreground">Score</div>
              </div>

              <div className="p-6 rounded-2xl shadow-neu-inset bg-gradient-to-br from-card to-secondary/20">
                <div className="text-3xl font-bold text-foreground mb-2">
                  {score.correct}/{score.total}
                </div>
                <div className="text-sm text-muted-foreground">Correct Answers</div>
              </div>

              <div className="p-6 rounded-2xl shadow-neu-inset bg-gradient-to-br from-card to-secondary/20">
                <div className="text-3xl font-bold text-foreground mb-2">
                  {answeredQuestions}/{totalQuestions}
                </div>
                <div className="text-sm text-muted-foreground">Attempted</div>
              </div>
            </div>

            {/* Performance Message */}
            <div className="mb-8">
              {score.percentage >= 80 && (
                <p className="text-lg text-primary font-medium">
                  🎉 Excellent work! You have a strong grasp of grammar!
                </p>
              )}
              {score.percentage >= 60 && score.percentage < 80 && (
                <p className="text-lg text-accent font-medium">
                  👍 Good job! Keep practicing to improve further!
                </p>
              )}
              {score.percentage < 60 && (
                <p className="text-lg text-muted-foreground font-medium">
                  💪 Keep learning! Practice makes perfect!
                </p>
              )}
            </div>

            {/* Detailed Results */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-6 text-foreground">Answer Review</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
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
                        "p-4 rounded-xl text-left",
                        isCorrect
                          ? "bg-green-50 border-2 border-green-200"
                          : wasAnswered
                          ? "bg-red-50 border-2 border-red-200"
                          : "bg-gray-50 border-2 border-gray-200"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          ) : wasAnswered ? (
                            <XCircle className="w-5 h-5 text-red-600" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground mb-2">
                            Q{index + 1}: {question.question}
                          </p>
                          <div className="text-sm space-y-1">
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
              className="min-w-[200px]"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
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
          <div className="p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              Ready to Submit?
            </h2>

            <div className="mb-8">
              <p className="text-lg text-muted-foreground mb-4">
                You have answered <span className="font-bold text-primary">{answeredQuestions}</span> out of{" "}
                <span className="font-bold">{totalQuestions}</span> questions.
              </p>
              {unansweredCount > 0 && (
                <p className="text-destructive font-medium">
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
    <div className="max-w-4xl mx-auto">
      {/* Header with Progress */}
      <NeumorphicCard className="mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground">{testData.title}</h2>
            <span className="text-sm font-medium text-muted-foreground">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="relative h-3 rounded-full shadow-neu-inset bg-gradient-to-r from-card to-secondary/20 overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </NeumorphicCard>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <NeumorphicCard className="mb-8">
            <div className="p-8">
              {currentQuestion.section && (
                <div className="inline-block px-4 py-2 rounded-xl shadow-neu-inset bg-gradient-to-br from-primary/10 to-accent/10 mb-6">
                  <span className="text-sm font-medium text-primary">
                    {currentQuestion.section}
                  </span>
                </div>
              )}

              <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-8">
                {currentQuestion.question}
              </h3>

              {/* Options */}
              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => {
                  const optionLetter = getOptionLetter(index);
                  const isSelected = selectedAnswer === optionLetter;

                  return (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswerSelect(optionLetter)}
                      className={cn(
                        "w-full p-5 rounded-2xl text-left transition-all duration-300 flex items-start gap-4",
                        isSelected
                          ? "shadow-neu-inset bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary"
                          : "shadow-neu hover:shadow-neu-lg bg-gradient-to-br from-card to-secondary/20 border-2 border-transparent"
                      )}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 font-bold transition-all",
                          isSelected
                            ? "bg-gradient-to-br from-primary to-accent text-white shadow-neu-lg"
                            : "shadow-neu-inset text-muted-foreground"
                        )}
                      >
                        {optionLetter.toUpperCase()}
                      </div>
                      <span className="text-base md:text-lg text-foreground flex-1 pt-1">
                        {option}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </NeumorphicCard>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <NeumorphicButton
          variant="secondary"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className={cn(
            currentQuestionIndex === 0 && "opacity-50 cursor-not-allowed"
          )}
        >
          Previous
        </NeumorphicButton>

        <div className="text-sm text-muted-foreground">
          {Object.keys(userAnswers).length} / {totalQuestions} answered
        </div>

        {currentQuestionIndex === totalQuestions - 1 ? (
          <NeumorphicButton variant="primary" onClick={handleNext}>
            Finish Test
          </NeumorphicButton>
        ) : (
          <NeumorphicButton variant="primary" onClick={handleNext}>
            Next
          </NeumorphicButton>
        )}
      </div>
    </div>
  );
};

export default TestInterface;
