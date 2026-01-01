import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";
import { NeumorphicCard } from "@/components/ui/neumorphic-card";
import { NeumorphicButton } from "@/components/ui/neumorphic-button";
import { BookOpen, GraduationCap, ArrowLeft } from "lucide-react";
import TestInterface from "@/components/TestInterface";
import { kidsTestData, adultsTestData } from "@/lib/testData";

type TestType = "kids" | "adults" | null;

const Tests = () => {
  const [selectedTest, setSelectedTest] = useState<TestType>(null);

  const handleBackToSelection = () => {
    setSelectedTest(null);
  };

  if (selectedTest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
        <Navbar />
        <div className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            <motion.button
              onClick={handleBackToSelection}
              className="mb-4 flex items-center gap-2 px-4 py-2 rounded-xl shadow-neu hover:shadow-neu-lg transition-all text-muted-foreground hover:text-foreground"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft size={20} />
              Back to Test Selection
            </motion.button>
            <TestInterface
              testData={selectedTest === "kids" ? kidsTestData : adultsTestData}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
        <Navbar />

        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            {/* Header */}
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Grammar Assessment Tests
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Choose a test that matches your level and evaluate your grammar skills
              </p>
            </motion.div>

            {/* Test Selection Cards */}
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Kids Test Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <NeumorphicCard className="h-full">
                  <div className="p-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 shadow-neu">
                      <BookOpen className="w-8 h-8 text-primary" />
                    </div>
                    
                    <h2 className="text-3xl font-bold mb-4 text-foreground">
                      Kids Grammar Test
                    </h2>
                    
                    <p className="text-muted-foreground mb-6">
                      Designed for young learners aged 5-17 years
                    </p>

                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span className="text-muted-foreground">25 Questions</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span className="text-muted-foreground">Fill in the Blanks</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span className="text-muted-foreground">Analogies</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span className="text-muted-foreground">Synonyms & Comparisons</span>
                      </div>
                    </div>

                    <NeumorphicButton
                      variant="primary"
                      className="w-full"
                      onClick={() => setSelectedTest("kids")}
                    >
                      Start Kids Test
                    </NeumorphicButton>
                  </div>
                </NeumorphicCard>
              </motion.div>

              {/* Adults Test Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <NeumorphicCard className="h-full">
                  <div className="p-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center mb-6 shadow-neu">
                      <GraduationCap className="w-8 h-8 text-accent" />
                    </div>
                    
                    <h2 className="text-3xl font-bold mb-4 text-foreground">
                      Advanced Grammar Test
                    </h2>
                    
                    <p className="text-muted-foreground mb-6">
                      For adults and advanced learners
                    </p>

                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-accent"></div>
                        <span className="text-muted-foreground">28 Questions</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-accent"></div>
                        <span className="text-muted-foreground">Complex Grammar</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-accent"></div>
                        <span className="text-muted-foreground">Idioms & Phrases</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-accent"></div>
                        <span className="text-muted-foreground">Vocabulary & Sentence Improvement</span>
                      </div>
                    </div>

                    <NeumorphicButton
                      variant="primary"
                      className="w-full"
                      onClick={() => setSelectedTest("adults")}
                    >
                      Start Advanced Test
                    </NeumorphicButton>
                  </div>
                </NeumorphicCard>
              </motion.div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default Tests;
