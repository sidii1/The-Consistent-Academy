import { motion } from "framer-motion";
import { Quote, Award, BookOpen, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { NeumorphicButton } from "@/components/ui/neumorphic-button";
import { NeumorphicCard } from "@/components/ui/neumorphic-card";
import { FloatingBlob } from "@/components/ui/floating-blob";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { AnimatedHeading, AnimatedText } from "@/components/ui/animated-text";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const milestones = [
  { year: "2015", title: "Started Teaching", description: "Began teaching English to students in local communities" },
  { year: "2018", title: "IELTS Specialist", description: "Became a certified IELTS trainer with specialized training" },
  { year: "2020", title: "Founded Academy", description: "Launched The Consistent Academy with a vision for quality education" },
  { year: "2023", title: "500+ Students", description: "Crossed the milestone of training 500+ successful students" },
];

const values = [
  { icon: Heart, title: "Passion for Teaching", description: "Every class is an opportunity to inspire and transform lives." },
  { icon: BookOpen, title: "Continuous Learning", description: "Staying updated with the latest teaching methodologies and trends." },
  { icon: Award, title: "Student Success", description: "Measuring success through every student's achievement and growth." },
];

const Founder = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <FloatingBlob className="top-20 -right-32" size="xl" color="primary" />
        <FloatingBlob className="bottom-0 -left-20" size="lg" color="accent" delay={0.5} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <motion.div
              className="order-2 lg:order-1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative max-w-md mx-auto lg:mx-0">
                <FloatingBlob className="-top-10 -left-10" size="sm" color="accent" />
                <div className="relative z-10 aspect-[4/5] rounded-3xl shadow-neu-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden">
                  <div className="text-center p-8">
                    <div className="w-40 h-40 rounded-full bg-card shadow-neu mx-auto mb-6 flex items-center justify-center">
                      <span className="text-6xl">👩‍🏫</span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Founder image placeholder
                      <br />
                      <span className="text-xs">(Will be replaced with actual photo)</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              className="order-1 lg:order-2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.span
                className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Meet the Founder
              </motion.span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                <span className="text-foreground">Vidya </span>
                <span className="text-gradient">Wankhade</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                Founder & Lead Instructor, The Consistent Academy
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                With over a decade of experience in English language education, Vidya has dedicated 
                her career to helping students achieve their communication goals. Her unique teaching 
                methodology, rooted in the principle of consistent daily practice, has transformed 
                hundreds of learners into confident English speakers.
              </p>

              <NeumorphicCard className="p-6" hover={false}>
                <div className="flex gap-4">
                  <Quote className="w-8 h-8 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-foreground italic mb-2">
                      "Consistency is the bridge between goals and accomplishment. In language learning, 
                      small daily steps lead to giant leaps in fluency."
                    </p>
                    <p className="text-sm text-muted-foreground">— Vidya Wankhade</p>
                  </div>
                </div>
              </NeumorphicCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Journey */}
      <SectionWrapper className="bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <AnimatedText className="text-primary text-sm font-medium uppercase tracking-wider mb-4">
              The Journey
            </AnimatedText>
            <AnimatedHeading delay={0.1}>
              <span className="text-foreground">From Passion to </span>
              <span className="text-gradient">Purpose</span>
            </AnimatedHeading>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-border" />

              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  className={`relative flex items-center gap-8 mb-12 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                >
                  {/* Dot */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-primary -translate-x-1/2 shadow-glow z-10" />

                  {/* Card */}
                  <div className={`w-full md:w-1/2 pl-20 md:pl-0 ${index % 2 === 0 ? "md:pr-16" : "md:pl-16"}`}>
                    <NeumorphicCard className="p-6">
                      <span className="text-primary font-bold text-lg">{milestone.year}</span>
                      <h3 className="text-xl font-semibold text-foreground mt-2 mb-2">{milestone.title}</h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </NeumorphicCard>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Philosophy */}
      <SectionWrapper>
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <AnimatedText className="text-primary text-sm font-medium uppercase tracking-wider mb-4">
                Teaching Philosophy
              </AnimatedText>
              <AnimatedHeading delay={0.1}>
                <span className="text-foreground">What Drives </span>
                <span className="text-gradient">My Teaching</span>
              </AnimatedHeading>
            </div>

            <NeumorphicCard className="p-8 md:p-12 mb-12">
              <div className="prose prose-lg max-w-none">
                <AnimatedText className="text-muted-foreground text-lg leading-relaxed" delay={0.2}>
                  My teaching philosophy is built on a simple yet powerful belief: every person can become 
                  a confident English speaker with the right guidance and consistent effort. I've seen 
                  students who thought they could never speak English fluently transform into articulate 
                  communicators, and that transformation is what drives me every day.
                </AnimatedText>
                <AnimatedText className="text-muted-foreground text-lg leading-relaxed mt-4" delay={0.3}>
                  I believe in creating a supportive, judgment-free learning environment where mistakes 
                  are celebrated as learning opportunities. My goal is not just to teach English but to 
                  build confidence that extends beyond language into every aspect of my students' lives.
                </AnimatedText>
              </div>
            </NeumorphicCard>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <NeumorphicCard key={index} delay={0.1 * index} className="text-center p-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </NeumorphicCard>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* CTA */}
      <SectionWrapper className="bg-secondary/30">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <AnimatedHeading>
              <span className="text-foreground">Ready to Start Your </span>
              <span className="text-gradient">Learning Journey?</span>
            </AnimatedHeading>
            <AnimatedText className="text-muted-foreground text-lg mt-6 mb-8" delay={0.1}>
              Join me in this journey of consistent growth and watch your English skills flourish.
            </AnimatedText>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link to="/contact">
                <NeumorphicButton variant="primary" size="lg">
                  Get in Touch
                </NeumorphicButton>
              </Link>
            </motion.div>
          </div>
        </div>
      </SectionWrapper>

      <Footer />
    </div>
  );
};

export default Founder;
