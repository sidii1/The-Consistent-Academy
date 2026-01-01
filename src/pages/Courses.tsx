import { motion } from "framer-motion";
import { ArrowRight, Clock, Users, Star, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { NeumorphicButton } from "@/components/ui/neumorphic-button";
import { NeumorphicCard } from "@/components/ui/neumorphic-card";
import { FloatingBlob } from "@/components/ui/floating-blob";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { AnimatedHeading, AnimatedText } from "@/components/ui/animated-text";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { title } from "process";

const courses = [
  {
    title: "IELTS Preparation",
    description: "Comprehensive training for all four IELTS modules: Listening, Reading, Writing, and Speaking.",
    image: "/courses/img1.png",
    duration: "4 Weeks",
    students: "200+",
    rating: "4.9",
    features: ["Mock tests", "Speaking practice", "Writing feedback", "Score prediction","Study materials provided"],
    popular: true,
  },
  {
    title: "Spoken English",
    description: "Build confidence in everyday communication with practical conversation skills.",
    image: "/courses/img2.png",
    duration: "4 Weeks",
    students: "150+",
    rating: "4.8",
    features: ["Daily conversations", "Pronunciation", "Fluency building", "Role plays"],
    popular: false,
  },
  {
    title: "Writing Skills",
    description: "Master academic and professional writing with structured practice sessions.",
    image: "/courses/img3.png",
    duration: "2 Weeks",
    students: "120+",
    rating: "4.9",
    features: ["Essay writing", "Email etiquette", "Report writing", "Grammar focus"],
    popular: false,
  },
  {
    title: "Grammar Mastery",
    description: "Build a strong foundation with comprehensive grammar training from basics to advanced.",
    image: "/courses/img4.png",
    duration: "6 Weeks",
    students: "180+",
    rating: "4.7",
    features: ["Tenses", "Sentence structure", "Common errors", "Practice exercises"],
    popular: false,
  },
  {
    title: "Business English",
    description: "Professional communication skills for corporate environments and business contexts.",
    image: "/courses/img5.png",
    duration: "4 Weeks",
    students: "90+",
    rating: "4.8",
    features: ["Presentations", "Meetings", "Negotiations", "Corporate vocabulary"],
    popular: false,
  },
  {
    title: "Interview Preparation",
    description: "Ace your interviews with confident communication and structured responses.",
    image: "/courses/img6.png",
    duration: "4 Weeks",
    students: "100+",
    rating: "4.9",
    features: ["Mock interviews", "Body language", "Common questions", "Confidence building"],
    popular: true,
  },

  {
    title:"IELTS Writing",
    description: "Focused training on IELTS Writing tasks to boost your scores effectively.",
    image: "/courses/img7.png",
    duration: "2 Weeks",
    students: "80+",
    rating: "4.9",
    features:["Academic & General Training","Analyze(Task 1/Academic module)","Letters (Task 1/General module)","Descriptive Essays","Essential Grammar & Vocabulary "],
    popular: false,
  }
];

const kidsCourses = [
  {
    title: "Elocution Course",
    description: "Helps children speak clearly, confidently, and expressively.",
    duration: "4 Weeks",
    features: [
      "Clarity in speech & pronunciation",
      "Expressive reading & storytelling",
      "Vocabulary & grammar improvement",
      "Confidence in public speaking",
      "Listening & comprehension skills",
    ],
  },
  {
    title: "Public Speaking",
    description: "Builds confidence and stage presence in young learners.",
    duration: "4 Weeks",
    features: [
      "Reduced stage fear",
      "Improved body language & projection",
      "Speech structuring techniques",
      "Speaking confidence",
      "TED Talk style preparation",
      "Holistic personality development",
    ],
  },
  {
    title: "Grammar Foundations",
    description: "Strong grammar basics for clear and correct communication.",
    duration: "4 Weeks",
    features: [
      "Sentence construction",
      "Correct punctuation",
      "Parts of speech",
      "Verb tenses",
      "Subject-verb agreement",
      "Effective communication",
    ],
  },
  {
    title: "Creative Writing",
    description: "Encourages imagination and expressive writing skills.",
    duration: "4 Weeks",
    features: [
      "Idea generation & imagination",
      "Story structure (Beginning–Middle–End)",
      "Character creation",
      "Descriptive writing",
      "Emotional expression",
    ],
  },
  {
    title: "Reading Club",
    description: "Develops love for reading and critical thinking.",
    duration: "Ongoing",
    features: [
      "Reading for pleasure",
      "Vocabulary in context",
      "Comprehension & critical thinking",
      "Listening & speaking skills",
      "Empathy & life values through stories",
    ],
  },
];


const Courses = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 overflow-hidden">
        <FloatingBlob className="top-20 -right-32" size="xl" color="primary" />
        <FloatingBlob className="bottom-0 -left-20" size="lg" color="accent" delay={0.5} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className="text-foreground">Programs for </span>
              <span className="text-gradient">Every Goal</span>
            </motion.h1>
            <motion.p
              className="text-xl text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Choose from our carefully designed courses, each tailored to help you achieve 
              specific English language milestones.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <SectionWrapper className="pt-0">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <NeumorphicCard 
                key={index} 
                delay={0.05 * index} 
                className="relative overflow-hidden group p-0"
              >
                {course.popular && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-medium z-20">
                    Popular
                  </div>
                )}
                
                
                {/* Image Section */}
                <div className="relative h-32 w-full overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80" />
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm">{course.description}</p>
                  
                  <div className="flex gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock size={14} />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users size={14} />
                      {course.students}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Star size={14} className="text-yellow-500 fill-yellow-500" />
                      {course.rating}
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    {course.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle size={14} className="text-primary" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <Link to="/contact">
                    <NeumorphicButton variant="secondary" className="w-full">
                      Enroll Now
                      <ArrowRight size={16} />
                    </NeumorphicButton>
                  </Link>
                </div>
              </NeumorphicCard>
            ))}
          </div>
        </div>
      </SectionWrapper>
{/* KIDS COURSES SECTION */}
<SectionWrapper className="pt-8">
  <div className="container mx-auto">

    <div className="max-w-3xl mx-auto text-center mb-12">
      <AnimatedHeading>
        Courses for <span className="text-gradient">Kids</span>
      </AnimatedHeading>
      <AnimatedText className="text-muted-foreground text-lg mt-4">
        Fun, engaging, and skill-building programs designed specially for young learners.
      </AnimatedText>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {kidsCourses.map((course, index) => (
        <NeumorphicCard
          key={index}
          delay={0.05 * index}
          className="p-6"
        >
          <h3 className="text-xl font-semibold mb-2 text-foreground">
            {course.title}
          </h3>

          <p className="text-sm text-muted-foreground mb-4">
            {course.description}
          </p>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Clock size={14} />
            {course.duration}
          </div>

          <div className="space-y-2 mb-6">
            {course.features.map((feature, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle size={14} className="text-primary mt-0.5" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <Link to="/contact">
            <NeumorphicButton variant="secondary" className="w-full">
              Enroll Now
              <ArrowRight size={16} />
            </NeumorphicButton>
          </Link>
        </NeumorphicCard>
      ))}
    </div>

  </div>
</SectionWrapper>

      {/* CTA Section */}
      <SectionWrapper className="bg-secondary/30">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <AnimatedHeading>
              <span className="text-foreground">Not Sure Which </span>
              <span className="text-gradient">Course to Choose?</span>
            </AnimatedHeading>
            <AnimatedText className="text-muted-foreground text-lg mt-6 mb-8" delay={0.1}>
              Book a free consultation with our course advisors who can help you identify 
              the best program based on your goals and current English proficiency.
            </AnimatedText>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link to="/contact">
                <NeumorphicButton variant="primary" size="lg">
                  Book Free Consultation
                  <ArrowRight size={18} />
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

export default Courses;
