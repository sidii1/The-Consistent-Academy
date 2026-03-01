import { useState } from "react";
import { motion } from "framer-motion";
import { NeumorphicCard } from "@/components/ui/neumorphic-card";
import { NeumorphicButton } from "@/components/ui/neumorphic-button";
import { Navbar } from "@/components/layout/Navbar";
import { Award, TrendingUp, AlertCircle, Lightbulb, RotateCcw, Home, ChevronDown, ChevronRight, Star, Zap, Users, Target, BarChart } from "lucide-react";
import type { LeadershipTestData, LeadershipStyle } from "@/lib/leadershipTestData";
import { leadershipStyleDescriptions } from "@/lib/leadershipTestData";

interface LeadershipResultsProps {
  testData: LeadershipTestData;
  scores: Record<LeadershipStyle, number>;
  dominantStyle: LeadershipStyle;
  secondaryStyle: LeadershipStyle;
  confidence: "low" | "medium" | "high";
  onRetry: () => void;
  onBackToSelection?: () => void;
}

const LeadershipResults = ({
  testData,
  scores,
  dominantStyle,
  secondaryStyle,
  confidence,
  onRetry,
  onBackToSelection,
}: LeadershipResultsProps) => {
  const confidenceMeta = {
  high: {
    label: "High Confidence",
    color: "text-green-600",
    bg: "bg-green-100",
    message: "Your responses were consistent and decisive.",
  },
  medium: {
    label: "Moderate Confidence",
    color: "text-yellow-600",
    bg: "bg-yellow-100",
    message: "Your results are fairly reliable, but more answers can improve accuracy.",
  },
  low: {
    label: "Low Confidence",
    color: "text-red-600",
    bg: "bg-red-100",
    message: "Answer more questions or avoid neutral responses for clearer results.",
  },
};

  const dominantInfo = leadershipStyleDescriptions[dominantStyle];
  const secondaryInfo = leadershipStyleDescriptions[secondaryStyle];

  // Calculate percentages for all styles
  const maxScore = Math.max(...Object.values(scores));
  const sortedStyles = (Object.keys(scores) as LeadershipStyle[]).sort(
    (a, b) => scores[b] - scores[a]
  );

  const getStyleImage = (style: LeadershipStyle) => {
    if (style === "laissezFaire") {
      return "/leadership/laissez.png";
    }
    return `/leadership/${style}.png`;
  };

  const getStyleIcon = (style: LeadershipStyle) => {
    const icons = {
      autocratic: <Target className="w-5 h-5" />,
      democratic: <Users className="w-5 h-5" />,
      laissezFaire: <ChevronDown className="w-5 h-5" />,
      transformational: <Zap className="w-5 h-5" />,
      transactional: <BarChart className="w-5 h-5" />,
      servant: <Users className="w-5 h-5" />,
      situational: <ChevronRight className="w-5 h-5" />,
      coaching: <Lightbulb className="w-5 h-5" />,
      visionary: <Star className="w-5 h-5" />,
      bureaucratic: <BarChart className="w-5 h-5" />,
    };
    return icons[style] || <Star className="w-5 h-5" />;
  };

  const getColorForStyle = (style: LeadershipStyle) => {
    const colors = {
      autocratic: "from-red-500 to-orange-500",
      democratic: "from-blue-500 to-cyan-500",
      laissezFaire: "from-emerald-500 to-green-500",
      transformational: "from-purple-500 to-pink-500",
      transactional: "from-amber-500 to-yellow-500",
      servant: "from-teal-500 to-emerald-500",
      situational: "from-indigo-500 to-blue-500",
      coaching: "from-sky-500 to-cyan-500",
      visionary: "from-violet-500 to-purple-500",
      bureaucratic: "from-gray-600 to-slate-600",
    };
    return colors[style] || "from-primary to-accent";
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Hero Section - Above the Fold */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 mb-3">
                  <Award className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Assessment Complete</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
                    {dominantInfo.name}
                  </span>
                  <br />
                  <span className="text-2xl md:text-3xl text-foreground/80">
                    is Your Leadership Style
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mb-4">
                  {dominantInfo.description}
                </p>
                <div
  className={`mt-4 rounded-xl px-4 py-3 text-sm ${confidenceMeta[confidence].bg}`}
>
  <div className={`font-semibold ${confidenceMeta[confidence].color}`}>
    {confidenceMeta[confidence].label}
  </div>
  <p className="text-foreground/80 mt-1">
    {confidenceMeta[confidence].message}
  </p>
</div>

                <div className="flex flex-wrap gap-3">
                  <div className="px-3 py-2 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                    <div className="text-xl font-bold text-primary">{scores[dominantStyle]}</div>
                    <div className="text-xs text-muted-foreground">Dominant Score</div>
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20">
                    <div className="text-xl font-bold text-secondary">{scores[secondaryStyle]}</div>
                    <div className="text-xs text-muted-foreground">Secondary Score</div>
                  </div>
                </div>
              </div>

              {/* Dominant Style Image/Visual */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="relative w-full lg:w-1/3 max-w-md"
              >
                <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/20">
                  <img
                    src={getStyleImage(dominantStyle)}
                    alt={dominantInfo.name}
                    className="w-full h-full object-contain p-6"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center">
                            <div class="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${getColorForStyle(dominantStyle)}">
                              ${dominantInfo.name.split(' ').map(word => word[0]).join('')}
                            </div>
                          </div>
                        `;
                      }
                    }}
                  />
                  <div className="absolute bottom-3 right-3 w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                    <div className="text-white font-bold text-lg">#1</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Two-Column Layout for Both Leadership Styles */}
          <div className="grid lg:grid-cols-3 gap-5 mb-6">
            {/* Dominant Style Details - Left Side (2/3 width) */}
            <div className="lg:col-span-2">
              <NeumorphicCard className="h-full">
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Leadership Style Breakdown</h3>
                      <p className="text-xs text-muted-foreground">Detailed analysis of your dominant leadership approach</p>
                    </div>
                  </div>

                  {/* All Details in One Section - Reduced Spacing */}
                  <div className="space-y-5">
                    {/* Strengths Section */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-emerald-500" />
                        </div>
                        <h4 className="font-bold text-foreground">Key Strengths</h4>
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        {dominantInfo.strengths.map((strength, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-3 rounded-lg bg-gradient-to-br from-emerald-500/5 to-transparent border border-emerald-500/10"
                          >
                            <div className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                              <span className="text-sm">{strength}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Areas to Watch Section */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                        </div>
                        <h4 className="font-bold text-foreground">Areas to Watch</h4>
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        {dominantInfo.limitations.map((limitation, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 + 0.1 }}
                            className="p-3 rounded-lg bg-gradient-to-br from-amber-500/5 to-transparent border border-amber-500/10"
                          >
                            <div className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                              <span className="text-sm">{limitation}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Growth Recommendations Section */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500/20 to-cyan-500/20 flex items-center justify-center">
                          <Lightbulb className="w-4 h-4 text-sky-500" />
                        </div>
                        <h4 className="font-bold text-foreground">Growth Recommendations</h4>
                      </div>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {dominantInfo.growthSuggestions.map((suggestion, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 + 0.2 }}
                            className="p-3 rounded-lg bg-gradient-to-br from-sky-500/5 to-transparent border border-sky-500/10"
                          >
                            <div className="text-sm">{suggestion}</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </NeumorphicCard>
            </div>

            {/* Secondary Style - Right Side (1/3 width) */}
            <div className="space-y-5">
              {/* Secondary Style Card - Enhanced Visibility */}
              <NeumorphicCard className="overflow-hidden border border-secondary/20">
                <div className="relative">
                  {/* Enhanced Header Badge - More Prominent */}
                  <div className="absolute top-3 right-3 z-20">
                    <div className="px-3 py-1.5 rounded-full shadow-lg bg-gradient-to-r from-secondary to-secondary/90 border border-white/20">
                      <span className="text-xs font-bold text-black tracking-wide">
                        SECONDARY STYLE
                      </span>
                    </div>
                  </div>

                  {/* Secondary Style Image - Fixed Overlay */}
                  <div className="relative h-50 overflow-hidden bg-gradient-to-br from-secondary/5 to-muted/5">
                    <img
                      src={getStyleImage(secondaryStyle)}
                      alt={secondaryInfo.name}
                      className="w-full h-full object-contain p-4"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center">
                              <div class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary to-secondary/80">
                                ${secondaryInfo.name.split(' ').map(word => word[0]).join('')}
                              </div>
                            </div>
                          `;
                        }
                      }}
                    />
                    {/* Reduced overlay opacity for better image visibility */}
                    <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/5 to-transparent" />
                    
                    {/* Title Overlay - Moved to bottom with better contrast */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background/90 to-transparent">
                      <h2 className="text-lg font-bold text-foreground mb-0.5">
                        {secondaryInfo.name}
                      </h2>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Your Score</span>
                        <span className="text-base font-bold text-secondary">{scores[secondaryStyle]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content - Reduced Padding */}
                  <div className="p-4 space-y-3">
                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {secondaryInfo.description}
                    </p>

                    {/* Key Strengths */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center">
                          <TrendingUp className="w-3.5 h-3.5 text-secondary" />
                        </div>
                        <h4 className="text-sm font-bold text-foreground">Key Strengths</h4>
                      </div>
                      <ul className="space-y-1.5 pl-1">
                        {secondaryInfo.strengths.slice(0, 3).map((strength, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                            <span className="text-xs">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Growth Recommendations */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500/20 to-cyan-500/20 flex items-center justify-center">
                          <Lightbulb className="w-3.5 h-3.5 text-sky-500" />
                        </div>
                        <h4 className="text-sm font-bold text-foreground">Development Tips</h4>
                      </div>
                      <ul className="space-y-1.5 pl-1">
                        {secondaryInfo.growthSuggestions.slice(0, 2).map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 flex-shrink-0" />
                            <span className="text-xs">{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </NeumorphicCard>

              {/* Quick Stats */}
              <NeumorphicCard>
                <div className="p-4">
                  <h3 className="font-bold text-foreground mb-3">Assessment Overview</h3>
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Questions</span>
                      <span className="font-medium">{testData.totalQuestions}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Styles Assessed</span>
                      <span className="font-medium">10</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Accuracy</span>
                      <span className="font-medium text-primary">High</span>
                    </div>
                  </div>
                </div>
              </NeumorphicCard>
            </div>
          </div>

          {/* Complete Score Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <NeumorphicCard>
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <BarChart className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground">Complete Score Breakdown</h3>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {sortedStyles.length} Leadership Styles
                  </div>
                </div>

                <div className="space-y-3">
                  {sortedStyles.map((style, index) => {
                    const styleInfo = leadershipStyleDescriptions[style];
                    const score = scores[style];
                    const percentage = (score / maxScore) * 100;
                    const isTop2 = index < 2;

                    return (
                      <motion.div
                        key={style}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.03 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center flex-shrink-0">
                          <div className={`text-xs font-bold ${isTop2 ? (index === 0 ? 'text-primary' : 'text-secondary') : 'text-muted-foreground'}`}>
                            {index + 1}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs font-medium truncate ${isTop2 ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {styleInfo.name}
                            </span>
                            <span className={`text-xs font-medium ${isTop2 ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {score}
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full bg-secondary/20 overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${isTop2 ? 'bg-gradient-to-r from-primary to-accent' : 'bg-muted'}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.8, delay: 0.6 + index * 0.03 }}
                            />
                          </div>
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
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-3 justify-center"
          >
            <NeumorphicButton
              variant="secondary"
              onClick={onRetry}
              className="flex items-center gap-2 text-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retake Assessment
            </NeumorphicButton>
            
            {onBackToSelection && (
              <NeumorphicButton
                variant="primary"
                onClick={onBackToSelection}
                className="flex items-center gap-2 text-sm"
              >
                <Home className="w-3.5 h-3.5" />
                Explore More Tests
              </NeumorphicButton>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LeadershipResults;