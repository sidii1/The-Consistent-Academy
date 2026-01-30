import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NeumorphicCard } from "@/components/ui/neumorphic-card";
import { NeumorphicButton } from "@/components/ui/neumorphic-button";
import { Navbar } from "@/components/layout/Navbar";
import { cn } from "@/lib/utils";
import type { LeadershipTestData, LeadershipStyle } from "@/lib/leadershipTestData";
import LeadershipResults from "./LeadershipResults";


interface LeadershipTestInterfaceProps {
  testData: LeadershipTestData;
  onBackToSelection?: () => void;
  onTestComplete?: (result: {
    scores: Record<LeadershipStyle, number>;
    dominantStyle: LeadershipStyle;
    secondaryStyle: LeadershipStyle;
  }) => void;
}

interface UserResponses {
  [questionId: number]: number;
}

const LIKERT_OPTIONS = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly Agree" },
];

// Likert → Intent weights
const WEIGHT_MAP: Record<number, number> = {
  1: -2,
  2: -1,
  3: 0,
  4: 1,
  5: 2,
};

const LeadershipTestInterface = ({
  testData,
  onBackToSelection,
  onTestComplete,
}: LeadershipTestInterfaceProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState<UserResponses>({});
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);

const allQuestions = testData.sections.flatMap((s) => s.questions);
const currentQuestion = allQuestions[currentQuestionIndex];
const totalQuestions = allQuestions.length;

const calculateResults = () => {
    const scores: Record<LeadershipStyle, number> = {
      autocratic: 0,
      democratic: 0,
      laissezFaire: 0,
      transformational: 0,
      transactional: 0,
      servant: 0,
      situational: 0,
      coaching: 0,
      visionary: 0,
      bureaucratic: 0,
    };


    const styleCounts: Record<LeadershipStyle, number> = { ...scores };

    
    allQuestions.forEach((q) => {
      styleCounts[q.leadershipStyle]++;
      const response = userResponses[q.id];
      if (response !== undefined) {
        scores[q.leadershipStyle] += WEIGHT_MAP[response];
      }
    });

    // Normalize safely
    (Object.keys(scores) as LeadershipStyle[]).forEach((style) => {
      if (styleCounts[style] > 0) {
        scores[style] = scores[style] / styleCounts[style];
      }
    });
    

    // Opposing leadership balancing
    const opposites: [LeadershipStyle, LeadershipStyle][] = [
      ["autocratic", "democratic"],
      ["transactional", "transformational"],
      ["bureaucratic", "visionary"],
      ["laissezFaire", "coaching"],
    ];

  opposites.forEach(([a, b]) => {
  if (styleCounts[a] >= 2 && styleCounts[b] >= 2) {
    const diff = scores[a] - scores[b];
    scores[a] = diff > 0 ? diff : 0;
    scores[b] = diff < 0 ? Math.abs(diff) : 0;
  }
});



   const MIN_ANSWERS_REQUIRED = Math.ceil(totalQuestions * 0.4);

const answeredCount = Object.keys(userResponses).length;

const sorted = (Object.keys(scores) as LeadershipStyle[]).sort(
  (a, b) => scores[b] - scores[a]
);

const topScore = scores[sorted[0]];
const secondScore = scores[sorted[1]];

const dominantStyle: LeadershipStyle =
  Math.abs(topScore - secondScore) < 0.3
    ? "situational"
    : sorted[0];

const secondaryStyle: LeadershipStyle = sorted[1];

  return {
    scores,
    dominantStyle,
    secondaryStyle,
  };
};

const handleResponseSelect = (value: number) => {
  setUserResponses((prev) => ({
    ...prev,
    [currentQuestion.id]: value,
  }));
};

const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((i) => i + 1);
    } else {
      setIsTestCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((i) => i - 1);
    }
  };

  const handleSubmit = () => {
    const results = calculateResults();
    if (onTestComplete) {
      onTestComplete(results);
    }
    setShowResults(true);
  };

  const handleRetry = () => {
    setUserResponses({});
    setCurrentQuestionIndex(0);
    setIsTestCompleted(false);
    setShowResults(false);
  };

if (showResults) {
  const results = calculateResults();
  return (
    <LeadershipResults
      testData={testData}
      scores={results.scores}
      dominantStyle={results.dominantStyle}
      secondaryStyle={results.secondaryStyle}
      onRetry={handleRetry}
      onBackToSelection={onBackToSelection}
    />
  );
}

const handleClearResponse = () => {
  setUserResponses((prev) => {
    const updated = { ...prev };
    delete updated[currentQuestion.id];
    return updated;
  });
};




  // Submit Confirmation Screen
  if (isTestCompleted) {
    const answeredQuestions = Object.keys(userResponses).length;
    const unansweredCount = totalQuestions - answeredQuestions;

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
                Submit Assessment
              </NeumorphicButton>
            </div>
          </div>
        </NeumorphicCard>
      </motion.div>
    );
  }

  // Test Interface
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const selectedResponse = userResponses[currentQuestion.id];

  // Color mapping for options
  const getOptionColor = (value: number, isSelected: boolean) => {
    if (isSelected) {
      switch (value) {
        case 1: return "bg-gradient-to-br from-red-500/20 to-rose-600/20 border-red-500";
        case 2: return "bg-gradient-to-br from-orange-500/20 to-amber-600/20 border-orange-500";
        case 3: return "bg-gradient-to-br from-gray-500/20 to-slate-600/20 border-gray-500";
        case 4: return "bg-gradient-to-br from-emerald-500/20 to-green-600/20 border-emerald-500";
        case 5: return "bg-gradient-to-br from-primary/20 to-violet-600/20 border-primary";
        default: return "bg-gradient-to-br from-primary/20 to-accent/20 border-primary";
      }
    } else {
      switch (value) {
        case 1: return "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 border-transparent";
        case 2: return "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border-transparent";
        case 3: return "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-transparent";
        case 4: return "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/20 dark:to-emerald-900/20 border-transparent";
        case 5: return "bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 border-transparent";
        default: return "bg-gradient-to-br from-card to-secondary/20 border-transparent";
      }
    }
  };

  const getNumberColor = (value: number, isSelected: boolean) => {
    if (isSelected) {
      switch (value) {
        case 1: return "bg-red-500 text-white";
        case 2: return "bg-orange-500 text-white";
        case 3: return "bg-gray-600 text-white";
        case 4: return "bg-emerald-500 text-white";
        case 5: return "bg-primary text-white";
        default: return "bg-primary text-white";
      }
    } else {
      switch (value) {
        case 1: return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
        case 2: return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300";
        case 3: return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
        case 4: return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
        case 5: return "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary/90";
        default: return "bg-secondary/20 text-foreground";
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto mt-12 px-4">
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
              <NeumorphicCard className="mb-4 hover:shadow-neu">
                <div className="p-5 md:p-8">
                  {currentQuestion.section && (
                    <div className="mb-6">
                      <div className="inline-block px-3 py-1.5 rounded-lg shadow-neu-inset bg-gradient-to-br from-primary/10 to-accent/10 border mb-2 border-primary/20">
                        <span className="text-sm font-medium text-primary">
                          {currentQuestion.section}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Select the option that best reflects your leadership approach
                      </p>
                    </div>
                  )}

                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-8 leading-relaxed">
                    {currentQuestion.question}
                  </h3>

                  {/* 5-Point Likert Scale */}
                  <div className="space-y-6">
                    {/* Desktop: Enhanced Horizontal Scale */}
                    <div className="hidden md:block">
                      <div className="relative">
                        {/* Option Labels */}
                        <div className="flex justify-between mb-4">
                          {LIKERT_OPTIONS.map((option) => (
                            <div key={option.value} className="text-center flex-1 px-2">
                              <span className="text-sm font-semibold text-foreground block mb-1">
                                {option.label}
                              </span>
                              {/* <span className="text-xs text-muted-foreground block">
                                {option.label.split(' ')[1]}
                              </span> */}
                            </div>
                          ))}
                        </div>

                        {/* Interactive Scale */}
                        <div className="flex items-center gap-4">
                          {LIKERT_OPTIONS.map((option) => {
                            const isSelected = selectedResponse === option.value;
                            
                            return (
                              <div key={option.value} className="flex-1 flex flex-col items-center">
                                <motion.button
                                  onClick={() => handleResponseSelect(option.value)}
                                  className={cn(
                                    "relative w-full h-20 rounded-full transition-all duration-200 flex flex-col items-center justify-center",
                                    "border-2 shadow-neu hover:shadow-neu-lg",
                                    getOptionColor(option.value, isSelected),
                                    isSelected && "shadow-lg"
                                  )}
                                  whileHover={{ y: -2 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <div
                                    className={cn(
                                      "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all",
                                      "shadow-sm",
                                      getNumberColor(option.value, isSelected)
                                    )}
                                  >
                                    {option.value}
                                  </div>
                                  {/* <span className={cn(
                                    "text-xs font-medium",
                                    isSelected 
                                      ? "text-foreground font-semibold" 
                                      : "text-muted-foreground"
                                  )}>
                                    {option.value === 1 ? "SD" : 
                                     option.value === 2 ? "D" :
                                     option.value === 3 ? "N" :
                                     option.value === 4 ? "A" : "SA"}
                                  </span> */}
                                </motion.button>
                              
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Mobile: Enhanced Vertical Scale */}
                    <div className="md:hidden space-y-3">
                      {LIKERT_OPTIONS.map((option) => {
                        const isSelected = selectedResponse === option.value;
                        
                        return (
                          <motion.button
                            key={option.value}
                            onClick={() => handleResponseSelect(option.value)}
                            className={cn(
                              "w-full p-4 rounded-xl text-left transition-all duration-200 flex items-center gap-4",
                              "shadow-neu border-2",
                              getOptionColor(option.value, isSelected)
                            )}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div
                              className={cn(
                                "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg shadow-sm",
                                getNumberColor(option.value, isSelected)
                              )}
                            >
                              {option.value}
                            </div>
                            <div className="flex-1">
                              <span className="text-sm md:text-base font-semibold text-foreground block">
                                {option.label}
                              </span>
                              <span className="text-xs text-muted-foreground mt-0.5">
                                Click to select
                              </span>
                            </div>
                            {isSelected && (
                              <div className="w-3 h-3 rounded-full bg-primary flex-shrink-0"></div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Clear Selection Button */}
                  {selectedResponse && (
                    <motion.button
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      onClick={handleClearResponse}
                      className="mt-6 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      Clear Selection
                    </motion.button>
                  )}
                </div>
              </NeumorphicCard>

              {/* Navigation - Below Question Card (Mobile) */}
              <div className="flex items-center justify-between lg:hidden mt-4">
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

                <div className="text-xs text-muted-foreground px-3 py-1.5 rounded-lg bg-secondary/10">
                  {Object.keys(userResponses).length} / {totalQuestions} answered
                </div>

                {currentQuestionIndex === totalQuestions - 1 ? (
                  <NeumorphicButton variant="primary" onClick={handleNext} className="text-sm">
                    Finish
                  </NeumorphicButton>
                ) : (
                  <NeumorphicButton variant="primary" onClick={handleNext} className="text-sm">
                    Next
                  </NeumorphicButton>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress Sidebar - Right Side (UNCHANGED) */}
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
                      {Object.keys(userResponses).length} / {totalQuestions}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Remaining</span>
                    <span className="font-medium text-foreground">
                      {totalQuestions - Object.keys(userResponses).length}
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
                  <button
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    className={cn(
                      "w-full text-sm px-4 py-2 rounded-xl font-medium transition-all",
                      "shadow-neu bg-gradient-to-br from-card to-secondary/20",
                      "active:shadow-neu-inset",
                      currentQuestionIndex === 0 && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    ← Previous
                  </button>

                  {currentQuestionIndex === totalQuestions - 1 ? (
                    <button
                      onClick={() => setIsTestCompleted(true)}
                      className="w-full text-sm px-4 py-2 rounded-xl font-medium transition-all shadow-neu bg-gradient-to-br from-primary to-accent text-white active:shadow-neu-inset"
                    >
                      Submit
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="w-full text-sm px-4 py-2 rounded-xl font-medium transition-all shadow-neu bg-gradient-to-br from-primary to-accent text-white active:shadow-neu-inset"
                    >
                      Next →
                    </button>
                  )}

                  {/* Submit Early Button */}
                  <div className="pt-2 border-t border-border/50">
                    <button
                      onClick={() => setIsTestCompleted(true)}
                      className="w-full text-xs px-4 py-2 rounded-xl font-medium transition-all shadow-neu bg-gradient-to-br from-card to-secondary/20 active:shadow-neu-inset"
                    >
                      Submit
                    </button>
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

export default LeadershipTestInterface;