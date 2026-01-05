import { useState } from "react";
import { motion } from "framer-motion";
import { NeumorphicCard } from "@/components/ui/neumorphic-card";
import { NeumorphicButton } from "@/components/ui/neumorphic-button";
import { 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  RotateCcw, 
  Sparkles, 
  Brain, 
  TrendingUp, 
  AlertCircle, 
  Award,
  ArrowLeft 
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { TestData, Question } from "@/lib/testData";
import { Navbar } from "@/components/layout/Navbar";

interface TestResultsProps {
  testData: TestData;
  userAnswers: { [questionId: number]: string };
  allQuestions: Question[];
  onRetry: () => void;
  onBackToSelection?: () => void;
}

interface ScoreData {
  correct: number;
  total: number;
  percentage: number;
}

const TestResults = ({ 
  testData, 
  userAnswers, 
  allQuestions, 
  onRetry,
  onBackToSelection 
}: TestResultsProps) => {
  const [showAIReview, setShowAIReview] = useState(false);

  const calculateScore = (): ScoreData => {
    let correct = 0;
    allQuestions.forEach((question) => {
      if (userAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: allQuestions.length,
      percentage: Math.round((correct / allQuestions.length) * 100),
    };
  };

  const generateAIReview = () => {
    const score = calculateScore();
    const incorrectQuestions = allQuestions.filter(
      (q) => userAnswers[q.id] && userAnswers[q.id] !== q.correctAnswer
    );
    const unansweredQuestions = allQuestions.filter(
      (q) => !userAnswers[q.id]
    );

    // Group errors by section
    const errorsBySection: { [key: string]: Question[] } = {};
    incorrectQuestions.forEach((q) => {
      const section = q.section || "General";
      if (!errorsBySection[section]) {
        errorsBySection[section] = [];
      }
      errorsBySection[section].push(q);
    });

    return {
      score,
      incorrectQuestions,
      unansweredQuestions,
      errorsBySection,
      totalErrors: incorrectQuestions.length,
      completionRate: ((Object.keys(userAnswers).length / allQuestions.length) * 100).toFixed(1),
    };
  };

  const score = calculateScore();
  const answeredQuestions = Object.keys(userAnswers).length;
  const totalQuestions = allQuestions.length;

  // AI Review Screen
  if (showAIReview) {
    const aiReview = generateAIReview();
    const { errorsBySection, incorrectQuestions, unansweredQuestions } = aiReview;

    return (
      <>
        <Navbar />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto px-4"
        >
        <NeumorphicCard>
          <div className="p-6 md:p-8">
            {/* AI Review Header */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-neu-lg"
              >
                <Brain className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AI Performance Analysis
              </h2>
              <p className="text-sm text-muted-foreground">
                Powered by intelligent analysis • Personalized insights for {testData.title}
              </p>
            </div>

            {/* Overall Assessment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200"
            >
              <div className="flex items-start gap-3">
                <Award className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-foreground mb-2">Overall Performance</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {score.percentage >= 80 && (
                      <>
                        Outstanding work! You've demonstrated <strong className="text-purple-600">excellent mastery</strong> of grammar concepts with a {score.percentage}% score. Your strong performance across {Object.keys(errorsBySection).length > 0 ? "most" : "all"} sections shows solid understanding. {incorrectQuestions.length > 0 ? "Let's refine those few areas that need attention." : "Keep up this exceptional level!"}
                      </>
                    )}
                    {score.percentage >= 60 && score.percentage < 80 && (
                      <>
                        Good effort! You've scored {score.percentage}%, showing <strong className="text-purple-600">solid foundational knowledge</strong>. There are {incorrectQuestions.length} areas where focused practice will boost your confidence. You're on the right track—let's identify specific patterns to improve.
                      </>
                    )}
                    {score.percentage >= 40 && score.percentage < 60 && (
                      <>
                        You're building your skills with a {score.percentage}% score. I've identified <strong className="text-purple-600">{incorrectQuestions.length} key learning opportunities</strong> that will significantly improve your grammar proficiency. With targeted practice on these concepts, you'll see rapid improvement.
                      </>
                    )}
                    {score.percentage < 40 && (
                      <>
                        Thank you for completing this test! With {score.percentage}%, there's substantial room for growth. I've prepared a <strong className="text-purple-600">personalized learning roadmap</strong> focusing on {Object.keys(errorsBySection).length} core areas. Consistent practice with these fundamentals will build a strong foundation.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Section-by-Section Analysis */}
            {Object.keys(errorsBySection).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-6"
              >
                <h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Area-Specific Insights
                </h3>
                <div className="space-y-3">
                  {Object.entries(errorsBySection).map(([section, questions], idx) => (
                    <motion.div
                      key={section}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + idx * 0.1 }}
                      className="p-4 rounded-xl shadow-neu bg-gradient-to-br from-card to-secondary/20"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm font-bold">{questions.length}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-1">{section}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {section === "Fill in the Blanks" || section === "Grammar" ? (
                              <>Found {questions.length} mistake{questions.length > 1 ? "s" : ""} in grammar rules. Focus on <strong>verb tenses, subject-verb agreement, and proper word usage</strong>. Review grammar fundamentals and practice with similar exercises.</>
                            ) : section === "Analogy" ? (
                              <>Identified {questions.length} analogy error{questions.length > 1 ? "s" : ""}. Work on <strong>understanding relationships between concepts</strong> and pattern recognition. Practice identifying connections between words and their meanings.</>
                            ) : section === "Synonyms" || section === "Vocabulary" ? (
                              <>Detected {questions.length} vocabulary gap{questions.length > 1 ? "s" : ""}. Expand your <strong>word bank and context understanding</strong>. Read more diverse content and maintain a vocabulary journal.</>
                            ) : section === "Comparison" ? (
                              <>Found {questions.length} error{questions.length > 1 ? "s" : ""} in comparative forms. Review <strong>positive, comparative, and superlative degrees</strong>. Practice with more complex comparison structures.</>
                            ) : section === "Idioms" ? (
                              <>Missed {questions.length} idiom{questions.length > 1 ? "s" : ""}. Idioms require <strong>contextual learning and regular exposure</strong>. Create flashcards and use them in sentences to internalize meanings.</>
                            ) : (
                              <>Found {questions.length} area{questions.length > 1 ? "s" : ""} needing attention. Review the fundamental concepts and practice with varied examples to strengthen understanding.</>
                            )}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-purple-600">
                            <Sparkles className="w-3 h-3" />
                            <span>Priority: {questions.length >= 3 ? "High" : questions.length >= 2 ? "Medium" : "Low"}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Detailed Question Analysis */}
            {incorrectQuestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-6"
              >
                <h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-purple-600" />
                  Detailed Mistake Analysis
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {incorrectQuestions.map((question, idx) => {
                    const userAnswer = userAnswers[question.id];
                    const questionIndex = allQuestions.findIndex(q => q.id === question.id);
                    
                    return (
                      <motion.div
                        key={question.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + idx * 0.05 }}
                        className="p-4 rounded-xl bg-red-50 border-2 border-red-200"
                      >
                        <div className="flex items-start gap-3">
                          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="font-medium text-foreground text-sm mb-2">
                              Q{questionIndex + 1}: {question.question}
                            </p>
                            <div className="space-y-2 text-xs">
                              <div className="flex items-start gap-2">
                                <span className="text-red-700 font-medium min-w-[90px]">Your answer:</span>
                                <span className="text-red-700">{question.options[userAnswer.charCodeAt(0) - 97]}</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-green-700 font-medium min-w-[90px]">Correct answer:</span>
                                <span className="text-green-700">{question.options[question.correctAnswer.charCodeAt(0) - 97]}</span>
                              </div>
                              <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-start gap-2">
                                  <Brain className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <p className="text-blue-900 font-medium mb-1">AI Explanation:</p>
                                    <p className="text-blue-800 leading-relaxed">
                                      {question.section === "Grammar" || question.section === "Fill in the Blanks" ? (
                                        <>This tests your understanding of proper grammar structure. The correct answer "{question.options[question.correctAnswer.charCodeAt(0) - 97]}" follows the grammatical rule, while your choice may have violated tense agreement, subject-verb consistency, or proper word form.</>
                                      ) : question.section === "Analogy" ? (
                                        <>Analogies test relationship patterns. The correct answer maintains the same relationship type as the given pair. Consider the nature of the connection: Is it function, category, hierarchy, or characteristic?</>
                                      ) : question.section === "Synonyms" || question.section === "Vocabulary" ? (
                                        <>This evaluates vocabulary knowledge. "{question.options[question.correctAnswer.charCodeAt(0) - 97]}" is the word closest in meaning. Context clues in the original word can help you identify similar meanings.</>
                                      ) : question.section === "Comparison" ? (
                                        <>Comparative and superlative forms have specific rules. Remember: comparative for two items (add -er or use 'more'), superlative for three or more (add -est or use 'most').</>
                                      ) : question.section === "Idioms" ? (
                                        <>Idioms have figurative meanings that differ from literal interpretations. "{question.options[question.correctAnswer.charCodeAt(0) - 97]}" represents the true meaning of this phrase in common usage.</>
                                      ) : (
                                        <>The correct answer is "{question.options[question.correctAnswer.charCodeAt(0) - 97]}" based on the grammatical principle being tested. Review this concept to strengthen your understanding.</>
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Personalized Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-6 p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200"
            >
              <div className="flex items-start gap-3">
                <TrendingUp className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-foreground mb-2">Personalized Action Plan</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {score.percentage < 60 && (
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span><strong>Daily Practice:</strong> Dedicate 15-20 minutes daily to grammar exercises focusing on your weak areas</span>
                      </li>
                    )}
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span><strong>Review Mistakes:</strong> Revisit each incorrect answer and understand the underlying rule or concept</span>
                    </li>
                    {Object.keys(errorsBySection).length > 0 && (
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span><strong>Targeted Study:</strong> Focus on {Object.keys(errorsBySection)[0]} as your primary improvement area</span>
                      </li>
                    )}
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span><strong>Read Actively:</strong> Read diverse content and note grammar patterns, new vocabulary, and sentence structures</span>
                    </li>
                    {unansweredQuestions.length > 0 && (
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span><strong>Complete Attempts:</strong> You left {unansweredQuestions.length} question{unansweredQuestions.length > 1 ? "s" : ""} unanswered. Make educated guesses to maximize learning</span>
                      </li>
                    )}
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span><strong>Retake Test:</strong> After studying, retake this test to measure improvement and build confidence</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
              <NeumorphicButton
                variant="secondary"
                onClick={() => setShowAIReview(false)}
              >
                ← Back to Results
              </NeumorphicButton>
              <NeumorphicButton
                variant="primary"
                onClick={onRetry}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Test
              </NeumorphicButton>
            </div>
          </div>
        </NeumorphicCard>
      </motion.div>
      </>
    );
  }

  // Regular Results Screen
  return (
    <>
      <Navbar />
      <div className="relative px-4">
      {/* Back Button */}
      {onBackToSelection && (
        <motion.button
          onClick={onBackToSelection}
          className="absolute left-4 top-0 flex items-center gap-2 px-6 py-3 rounded-xl shadow-neu hover:shadow-neu-lg transition-shadow text-muted-foreground hover:text-foreground"
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <ArrowLeft size={20} />
          <span className="text-sm">Back to Test Selection</span>
        </motion.button>
      )}

      <div className="max-w-5xl mx-auto">
        <NeumorphicCard className="w-full">
          <div className="p-6 md:p-4 text-center">
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

            {/* AI Review Button - Top Position */}
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => setShowAIReview(true)}
              className="mb-6 px-6 py-3 rounded-2xl font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-neu-lg hover:shadow-neu-xl transition-all duration-300 flex items-center gap-2 mx-auto relative overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity" />
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="relative z-10">Get AI Review & Insights</span>
              <Brain className="w-5 h-5" />
            </motion.button>

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
              onClick={onRetry}
              className="min-w-[180px]"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Retry Test
            </NeumorphicButton>
          </div>
        </NeumorphicCard>
      </div>
    </div>
    </>
  );
};

export default TestResults;
