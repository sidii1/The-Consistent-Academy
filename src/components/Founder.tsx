import { motion } from "framer-motion";
import { Quote, Award, BookOpen, ExternalLink } from "lucide-react";
import { AnimatedText, AnimatedHeading } from "@/components/ui/animated-text";
import { NeumorphicCard } from "@/components/ui/neumorphic-card";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { BookCard } from "@/components/ui/book-card";
import { sub } from "date-fns";

const milestones = [
  { year: "2007", achievements: ["Started Teaching Career"] },
  { year: "2016", achievements: ["IELTS Master Trainer Certification"] },
  { year: "2019", achievements: ["TEFL & TESOL Trainer"] },
  { year: "2022", achievements: ["Published 'Cakewalk IELTS'"] },
  { year: "2024", achievements: ["Head of Department (Academics)", "Published 'Reading Detectives'"] },
  { year: "2025", achievements: ["Founded The Consistent Academy", "Published '101 Management Books You'll Never Read But Should'"] },
];

const books = [
  {
    title: "Cakewalk IELTS",
    description:
      "A focused, student-friendly guide that simplifies IELTS preparation with practical strategies, clarity, and confidence-building techniques.",
    imagePath: "/books/cakewalk-ielts.jpg",
    links: [
      { label: "Evincepub", url: "https://evincepub.com/product/a-focal-easy-guide-cakewalk-ielts/" },
      { label: "Bspkart", url: "https://www.bspkart.com/product/a-focal-easy-guide-cakewalk-ielts/" },
      { label: "Amazon", url: "https://www.amazon.in/Focal-Easy-Guide-Cakewalk-IELTS/dp/9354468594/ref" },
      { label: "Flipkart", url: "https://www.flipkart.com/focal-easy-guide-cakewalk-ielts/p/itme05662a461566" },
    ],
  },
  {
    title: "The Reading Detective",
    description:
      "A delightful book for kids that builds comprehension, critical thinking, and a love for reading through engaging stories and activities.",
    imagePath: "/books/the-reading-detective.jpg",
    links: [
      { label: "Evincepub", url: "https://evincepub.com/product/the-reading-detective-solving-comprehension-mysteries-for-kids/" },
      { label: "Amazon", url: "https://www.amazon.in/dp/9363559335" },
      { label: "Flipkart", url: "https://www.flipkart.com/the-reading-detective/p/itm59cbee5b6ff6a" },
      { label: "Instamojo (eBook)", url: "https://evincepub.myinstamojo.com/product/the-reading-detective/" },
    ],
  },
  {
    title: "101 Management Books You'll Never Read But Should",
    description:
      "A crisp, insightful compilation that distills powerful management lessons from the world's most influential business books.",
    imagePath: "/books/101-management.jpg",
    links: [
      { label: "Evincepub", url: "https://evincepub.com/product/101-management-books-youll-never-read-but-should/" },
      { label: "Amazon", url: "https://www.amazon.in/dp/9373352318" },
      { label: "Flipkart", url: "https://www.flipkart.com/101-management-books-youll-never-read-but-should/p/itm6bc57a7fd9b2c" },
    ],
  },
];

const Founder = () => {
  return (
    <section id="founder" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-section-purple" />

      <SectionWrapper className="relative z-10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
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
            </motion.div>

            {/* Image */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="relative w-full max-w-lg mx-auto lg:mx-0">
                <div className="w-full aspect-square rounded-full shadow-neu-2xl bg-gradient-to-br from-card to-secondary/30 overflow-hidden">
                  <img
                    src="/gallery/vidya.png"
                    alt="Vidya Wankhade"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Quote */}
                <NeumorphicCard className="p-6 bg-gradient-to-br from-primary/15 to-accent/10 mt-8" hover={false}>
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
              </div>
            </motion.div>

          </div>

          {/* Milestones Timeline - Full Width */}
          <motion.div 
            className="mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <AnimatedText 
              className="text-foreground text-2xl font-semibold mb-12 text-center" 
              delay={0.6}
            >
              Journey of Excellence
            </AnimatedText>
            
            <div className="relative px-2 sm:px-4">
              {/* Timeline Line */}
              <div className="absolute top-6 sm:top-8 left-4 sm:left-8 right-4 sm:right-8 h-0.5 sm:h-1 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]" />
              
              {/* Timeline Items */}
              <div className="relative flex justify-between items-start gap-1 sm:gap-2 md:gap-4">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.year}
                    className="flex flex-col items-center flex-1 min-w-0"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 + index * 0.15, duration: 0.6 }}
                  >
                    {/* Year Indicator */}
                    <div className="relative z-10 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full shadow-neu bg-gradient-to-br from-card via-background to-secondary/30 flex items-center justify-center mb-2 sm:mb-3 md:mb-4 group hover:shadow-neu-lg hover:scale-105 transition-all duration-300">
                      <div className="absolute inset-1 sm:inset-1.5 md:inset-2 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
                        <span className="text-primary font-bold text-[0.6rem] sm:text-xs md:text-sm group-hover:scale-110 transition-transform duration-300">
                          {milestone.year}
                        </span>
                      </div>
                    </div>
                    
                    {/* Achievement Card */}
                    <div className="w-full px-0.5 sm:px-1 md:px-2">
                      <div className="relative p-1.5 sm:p-2 md:p-4 rounded-lg sm:rounded-xl shadow-neu bg-gradient-to-br from-card/80 via-background/90 to-secondary/20 backdrop-blur-sm hover:shadow-neu-lg transition-all duration-400 hover:-translate-y-1 group">
                        <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                          {milestone.achievements.map((achievement, i) => (
                            <p 
                              key={i} 
                              className="text-[0.5rem] sm:text-xs md:text-sm font-semibold text-foreground leading-tight text-center group-hover:text-primary transition-colors duration-300"
                            >
                              {achievement}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ================= BOOKS SECTION ================= */}
          <motion.div 
            className="mt-12 relative"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Background decorative elements */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <div className="absolute top-1/4 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
            </div>

            {/* Section Header */}
            <div className="text-center mb-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-primary text-sm font-medium uppercase tracking-wider mb-3">
                  Published Works
                </p>
                <h2 className="text-3xl md:text-4xl font-bold">
                  Books by <span className="text-gradient">Vidya Wankhade</span>
                </h2>
              </motion.div>
            </div>

            {/* Books Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-8 lg:gap-12 group">
              {books.map((book, i) => (
                <BookCard
                  key={i}
                  title={book.title}
                  description={book.description}
                  imagePath={book.imagePath}
                  links={book.links}
                  index={i}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </SectionWrapper>
    </section>
  );
};

export default Founder;
