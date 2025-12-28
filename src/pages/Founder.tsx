import { motion } from "framer-motion";
import { Quote, Award } from "lucide-react";
import { AnimatedText, AnimatedHeading } from "@/components/ui/animated-text";
import { NeumorphicCard } from "@/components/ui/neumorphic-card";
import { SectionWrapper } from "@/components/ui/section-wrapper";

const expertise = [
  // "IELTS Speaking & Writing",
  // "Interview Preparation",
  // "Corporate & Business English",
  // "Personality Development",
  // "Soft Skills Training",
  // "Professional Communication"
];

const milestones = [

  { year: "2016", title: "IELTS Master Trainer Certification" },
  { year: "2024", title: "Head of Department (Academics)" },
  { year: "2025", title: "Founded The Consistent Academy" }
];

const Founder = () => {
  return (
    <section id="founder" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />

      <SectionWrapper className="relative z-10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <AnimatedText className="text-primary text-sm font-medium uppercase tracking-wider mb-4">
                Meet the Founder
              </AnimatedText>

              <AnimatedHeading delay={0.1} className="mb-6">
                <span className="text-foreground">Vidya </span>
                <span className="text-gradient">Wankhade</span>
              </AnimatedHeading>

              <AnimatedText className="text-muted-foreground text-lg mb-6" delay={0.2}>
  Author, IELTS full course(speaking+reading+writing) & Interview Coach, and Founder of{" "}
  <strong>The Consistent Academy</strong>. With over{" "}
  <strong>19 years of experience</strong>, Vidya has helped students,
  professionals, and aspiring leaders communicate with clarity,
  confidence, and impact.
</AnimatedText>

<AnimatedText className="text-muted-foreground text-lg mb-6" delay={0.3}>
  A <strong>British Council Certified IELTS Master Trainer</strong>,{" "}
  <strong>Certified Soft Skills & Corporate Trainer</strong>, and{" "}
  <strong>Train-the-Trainer professional</strong>, she blends language mastery
  with real-world communication strategies — helping learners stand out,
  not just speak up.
</AnimatedText>

<AnimatedText className="text-muted-foreground text-lg mb-6" delay={0.4}>
  Vidya Wankhade holds <strong>B.Sc, B.Ed, and MPM</strong> qualifications and is{" "}
  <strong>UGC NET qualified</strong>. She is also certified as a{" "}
  <strong>TOEFL Trainer, PET Trainer</strong>, and is{" "}
  <strong>TESOL/TEFL certified</strong>, bringing global standards into
  every classroom she leads.
</AnimatedText>

<AnimatedText className="text-muted-foreground text-lg mb-6" delay={0.5}>
  She is the author of <strong>three books</strong>, including the
  widely appreciated <em>“Cakewalk IELTS”</em>,{" "}
  <em>“Reading Detective – Solving Comprehension Mysteries for Kids”</em>, and{" "}
  <em>“101 Management Books You’ll Never Read But Should”</em>.
</AnimatedText>




              {/* Expertise */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {expertise.map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-br from-primary/15 to-card shadow-neu-sm text-sm font-medium text-foreground"
                  >
                    {skill}
                  </motion.div>
                ))}
              </div>

              {/* Quote */}
              <NeumorphicCard className="p-6 bg-gradient-to-br from-primary/15 to-accent/10 mb-8" hover={false}>
                <div className="flex gap-4">
                  <Quote className="w-8 h-8 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-foreground italic mb-2">
                      “Confidence in communication is not a talent — it's a skill.
                      With the right structure and consistency, anyone can master it.”
                    </p>
                    <p className="text-sm text-muted-foreground">
                      — Vidya Wankhade
                    </p>
                  </div>
                </div>
              </NeumorphicCard>

              {/* Milestones */}
              <div className="grid grid-cols-4 gap-8">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.year}
                    className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-card shadow-neu-sm"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <span className="text-primary font-bold text-lg">
                      {milestone.year}
                    </span>
                    <p className="text-sm text-foreground font-medium mt-1">
                      {milestone.title}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Image */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative aspect-square max-w-md mx-auto">
                <div className="text-center">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-card to-primary/20 shadow-neu mx-auto mb-4 overflow-hidden">
                    <img
                      src="/vidya.png"
                      alt="Vidya Wankhade"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </SectionWrapper>
    </section>
  );
};

export default Founder;
