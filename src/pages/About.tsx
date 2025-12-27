import { motion } from "framer-motion";
import { Target, Heart, Lightbulb, BookOpen, Users, Award } from "lucide-react";
import { NeumorphicCard } from "@/components/ui/neumorphic-card";
import { FloatingBlob } from "@/components/ui/floating-blob";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { AnimatedHeading, AnimatedText } from "@/components/ui/animated-text";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const values = [
  { icon: Target, title: "Consistency", description: "Regular practice is the key to mastery. We believe in small, consistent steps towards fluency." },
  { icon: Heart, title: "Passion", description: "We're passionate about language learning and dedicated to helping every student succeed." },
  { icon: Lightbulb, title: "Innovation", description: "Modern teaching methods combined with time-tested techniques for optimal learning." },
];

const features = [
  { icon: BookOpen, title: "Comprehensive Curriculum", description: "Structured courses covering all aspects of English language learning." },
  { icon: Users, title: "Small Batch Sizes", description: "Personalized attention with limited students per batch for better learning outcomes." },
  { icon: Award, title: "Certified Excellence", description: "Recognized teaching methodology with proven track record of student success." },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <FloatingBlob className="top-20 -right-32" size="xl" color="primary" />
        <FloatingBlob className="bottom-0 -left-20" size="lg" color="accent" delay={0.5} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.span
              className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              About Us
            </motion.span>
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className="text-foreground">Building </span>
              <span className="text-gradient">Confident</span>
              <br />
              <span className="text-foreground">English Speakers</span>
            </motion.h1>
            <motion.p
              className="text-xl text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              The Consistent Academy is dedicated to transforming language learning through 
              structured, consistent practice and expert guidance.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <SectionWrapper className="bg-secondary/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <NeumorphicCard className="p-8 md:p-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-primary text-sm font-medium uppercase tracking-wider mb-4">Our Mission</h3>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Empowering Through Language
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Our mission is to make quality English education accessible to learners from all backgrounds. 
                  We believe that language proficiency opens doors to opportunities, and we're committed to 
                  helping every student achieve their communication goals through consistent, structured learning.
                </p>
              </motion.div>
            </NeumorphicCard>

            <NeumorphicCard className="p-8 md:p-12">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-primary text-sm font-medium uppercase tracking-wider mb-4">Our Vision</h3>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Global Communication Excellence
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  We envision a world where language barriers no longer limit potential. By fostering confident 
                  English speakers, we aim to create global citizens who can communicate effectively, share 
                  ideas across cultures, and succeed in an interconnected world.
                </p>
              </motion.div>
            </NeumorphicCard>
          </div>
        </div>
      </SectionWrapper>

      {/* Core Values */}
      <SectionWrapper>
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <AnimatedText className="text-primary text-sm font-medium uppercase tracking-wider mb-4">
              What We Stand For
            </AnimatedText>
            <AnimatedHeading delay={0.1}>
              <span className="text-foreground">Our Core </span>
              <span className="text-gradient">Values</span>
            </AnimatedHeading>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <NeumorphicCard key={index} delay={0.1 * index} className="text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </NeumorphicCard>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Teaching Philosophy */}
      <SectionWrapper className="bg-secondary/30">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <AnimatedText className="text-primary text-sm font-medium uppercase tracking-wider mb-4">
                Our Approach
              </AnimatedText>
              <AnimatedHeading delay={0.1}>
                <span className="text-foreground">Teaching </span>
                <span className="text-gradient">Philosophy</span>
              </AnimatedHeading>
            </div>

            <NeumorphicCard className="p-8 md:p-12">
              <div className="prose prose-lg max-w-none">
                <AnimatedText className="text-muted-foreground text-lg leading-relaxed mb-6" delay={0.2}>
                  At The Consistent Academy, we believe that language mastery is not about intensive cramming 
                  but about building habits that last. Our teaching philosophy centers on three key principles:
                </AnimatedText>
                
                <div className="space-y-6">
                  <motion.div
                    className="flex gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className="text-2xl font-bold text-primary">01</span>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Daily Practice Over Intensity</h4>
                      <p className="text-muted-foreground">
                        30 minutes of focused daily practice yields better results than sporadic hours-long sessions.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    <span className="text-2xl font-bold text-primary">02</span>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Real-World Application</h4>
                      <p className="text-muted-foreground">
                        We connect language learning to practical scenarios, making skills immediately applicable.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                  >
                    <span className="text-2xl font-bold text-primary">03</span>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Personalized Feedback</h4>
                      <p className="text-muted-foreground">
                        Every student receives individual attention and tailored guidance for their unique learning journey.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </NeumorphicCard>
          </div>
        </div>
      </SectionWrapper>

      {/* Features */}
      <SectionWrapper>
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <AnimatedText className="text-primary text-sm font-medium uppercase tracking-wider mb-4">
              Why Choose Us
            </AnimatedText>
            <AnimatedHeading delay={0.1}>
              <span className="text-foreground">What Makes Us </span>
              <span className="text-gradient">Different</span>
            </AnimatedHeading>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <NeumorphicCard key={index} delay={0.1 * index} className="text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6 shadow-glow">
                  <feature.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </NeumorphicCard>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <Footer />
    </div>
  );
};

export default About;
