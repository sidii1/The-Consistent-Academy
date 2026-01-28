import { motion } from "framer-motion";
import { NeumorphicCard } from "@/components/ui/neumorphic-card";
import { NeumorphicButton } from "@/components/ui/neumorphic-button";
import { Navbar } from "@/components/layout/Navbar";
import { Award, TrendingUp, AlertCircle, Lightbulb, RotateCcw, Home } from "lucide-react";
import type { LeadershipTestData, LeadershipStyle } from "@/lib/leadershipTestData";
import { leadershipStyleDescriptions } from "@/lib/leadershipTestData";

interface LeadershipResultsProps {
  testData: LeadershipTestData;
  scores: Record<LeadershipStyle, number>;
  dominantStyle: LeadershipStyle;
  secondaryStyle: LeadershipStyle;
  onRetry: () => void;
  onBackToSelection?: () => void;
}

const LeadershipResults = ({
  testData,
  scores,
  dominantStyle,
  secondaryStyle,
  onRetry,
  onBackToSelection,
}: LeadershipResultsProps) => {
  const dominantInfo = leadershipStyleDescriptions[dominantStyle];
  const secondaryInfo = leadershipStyleDescriptions[secondaryStyle];

  // Calculate max possible score for percentage calculation
  const maxScore = Math.max(...Object.values(scores));
  
  const getStyleImage = (style: LeadershipStyle) => {
    // Special case for laissez-faire (file is named "laissez.png")
    if (style === "laissezFaire") {
      return "/leadership/laissez.png";
    }
    return `/leadership/${style}.png`;
  };

  const renderStyleCard = (
    style: LeadershipStyle,
    styleInfo: typeof dominantInfo,
    isPrimary: boolean
  ) => {
    const score = scores[style];
    const percentage = (score / maxScore) * 100;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: isPrimary ? 0.2 : 0.4 }}
      >
        <NeumorphicCard className="overflow-hidden">
          <div className="relative">
            {/* Header Badge */}
            <div className="absolute top-4 right-4 z-10">
              <div
                className={`px-4 py-2 rounded-full shadow-neu-lg ${
                  isPrimary
                    ? "bg-gradient-to-br from-primary to-accent"
                    : "bg-gradient-to-br from-secondary to-muted"
                }`}
              >
                <span className={`text-xs font-bold ${isPrimary ? "text-white" : "text-foreground"}`}>
                  {isPrimary ? "Dominant Style" : "Secondary Style"}
                </span>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
              <img
                src={getStyleImage(style)}
                alt={styleInfo.name}
                className="w-full h-full object-cover opacity-90"
                onError={(e) => {
                  // Fallback gradient if image doesn't exist
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              
              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  {styleInfo.name}
                </h2>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-secondary/30 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-accent"
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: isPrimary ? 0.5 : 0.7 }}
                    />
                  </div>
                  <span className="text-sm font-bold text-primary">
                    {score} pts
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              {/* Description */}
              <div>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {styleInfo.description}
                </p>
              </div>

              {/* Strengths */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Strengths</h3>
                </div>
                <ul className="space-y-2">
                  {styleInfo.strengths.map((strength, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index + (isPrimary ? 0.6 : 0.8) }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-sm text-foreground">{strength}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Limitations */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Areas to Watch</h3>
                </div>
                <ul className="space-y-2">
                  {styleInfo.limitations.map((limitation, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index + (isPrimary ? 0.8 : 1.0) }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{limitation}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Growth Suggestions */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                    <Lightbulb className="w-4 h-4 text-green-500" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Growth Recommendations</h3>
                </div>
                <ul className="space-y-2">
                  {styleInfo.growthSuggestions.map((suggestion, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index + (isPrimary ? 1.0 : 1.2) }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                      <span className="text-sm text-foreground">{suggestion}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </NeumorphicCard>
      </motion.div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-16 px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <div className="flex items-center justify-center mb-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-neu-lg"
              >
                <Award className="w-8 h-8 text-white" />
              </motion.div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Your Leadership Profile
            </h1>
            <p className="text-base text-muted-foreground max-w-xl mx-auto">
              Based on your responses to {testData.totalQuestions} questions
            </p>
          </motion.div>

          {/* Results Cards */}
          <div className="space-y-6 mb-6">
            {/* Dominant Style */}
            {renderStyleCard(dominantStyle, dominantInfo, true)}

            {/* Secondary Style */}
            {renderStyleCard(secondaryStyle, secondaryInfo, false)}
          </div>

          {/* All Scores Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-6"
          >
            <NeumorphicCard>
              <div className="p-5">
                <h3 className="text-lg font-bold text-foreground mb-3">Complete Score Breakdown</h3>
                <div className="space-y-3">
                  {(Object.keys(scores) as LeadershipStyle[])
                    .sort((a, b) => scores[b] - scores[a])
                    .map((style, index) => {
                      const styleInfo = leadershipStyleDescriptions[style];
                      const score = scores[style];
                      const percentage = (score / maxScore) * 100;
                      const isTop = style === dominantStyle || style === secondaryStyle;

                      return (
                        <motion.div
                          key={style}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + index * 0.05 }}
                          className="space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-sm font-medium ${isTop ? 'text-primary' : 'text-foreground'}`}>
                              {styleInfo.name}
                            </span>
                            <span className={`text-sm font-bold ${isTop ? 'text-primary' : 'text-muted-foreground'}`}>
                              {score}
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-secondary/30 overflow-hidden">
                            <motion.div
                              className={`h-full ${isTop ? 'bg-gradient-to-r from-primary to-accent' : 'bg-muted'}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.8, delay: 0.7 + index * 0.05 }}
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                </div>
              </div>
            </NeumorphicCard>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <NeumorphicButton
              variant="secondary"
              onClick={onRetry}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Assessment
            </NeumorphicButton>
            
            {onBackToSelection && (
              <NeumorphicButton
                variant="primary"
                onClick={onBackToSelection}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Back to Tests
              </NeumorphicButton>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LeadershipResults;
