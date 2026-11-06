import { motion } from "framer-motion";
import { AnimatedHeading, AnimatedText } from "@/components/ui/animated-text";
import { TeamMemberCard, TeamMember } from "./TeamMemberCard";

// SAMPLE — replace with client-approved profiles
const eleTeamMembers: TeamMember[] = [
  {
    id: "ele1",
    name: "Ms. Kavita Joshi",
    designation: "Experiential Learning Expert",
    role: "Leadership Facilitation & Group Dynamics",
    description:
      "Kavita designs immersive learning experiences that bridge classroom concepts with real-world application, specialising in group dynamics, leadership presence, and interpersonal communication.",
    photo: "/team/experiential-learning-experts/placeholder-1.jpg",
    expertiseLink: null,
    isSample: true,
  },
  {
    id: "ele2",
    name: "Mr. Aditya Kulkarni",
    designation: "Experiential Learning Expert",
    role: "Project-Based Learning & Innovation",
    description:
      "Aditya brings a passion for project-based learning, helping students develop creative solutions to real-world challenges through structured experiential frameworks and interactive prototyping.",
    photo: "/team/experiential-learning-experts/placeholder-2.jpg",
    expertiseLink: null,
    isSample: true,
  },
  {
    id: "ele3",
    name: "Ms. Tanvi Desai",
    designation: "Experiential Learning Expert",
    role: "Communication Workshops & Reflective Practice",
    description:
      "Tanvi facilitates communication-centred workshops that employ storytelling, roleplay, and structured reflective journalling to help participants internalise learning at a deeper psychological level.",
    photo: "/team/experiential-learning-experts/placeholder-3.jpg",
    expertiseLink: null,
    isSample: true,
  },
  {
    id: "ele4",
    name: "Mr. Nikhil Patil",
    designation: "Experiential Learning Expert",
    role: "Outdoor & Action Learning",
    description:
      "Nikhil specialises in action-learning methodologies and immersive team simulations, creating high-energy, collaborative environments that unlock team potential and self-confidence.",
    photo: "/team/experiential-learning-experts/placeholder-4.jpg",
    expertiseLink: null,
    isSample: true,
  },
];

export const ExperientialLearningExperts = () => {
  return (
    <div className="mt-24 relative">
      {/* Background decorative glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 -left-20 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Section Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <AnimatedText className="text-neo-accent text-sm uppercase tracking-widest font-semibold mb-3">
            Hands-on Mentorship & Immersive Facilitation
          </AnimatedText>

          <AnimatedHeading delay={0.1} className="mb-4">
            Experiential Learning <span className="text-gradient">Experts</span>
          </AnimatedHeading>

          <AnimatedText
            className="text-neo-muted text-base max-w-2xl mx-auto leading-relaxed"
            delay={0.2}
          >
            Our dedicated team of facilitators crafting immersive, project-driven learning journeys that transform passive knowledge into real-world fluency and leadership confidence.
          </AnimatedText>

          {/* Sample content indicator */}
          <div className="inline-flex items-center gap-2 mt-4 px-3 py-1 rounded-full bg-neo-base shadow-neo-inset-sm text-neo-muted text-xs">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span>Interactive cards — hover on desktop or tap to reveal full bios</span>
          </div>
        </motion.div>
      </div>

      {/* Grid of 3D Flip Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {eleTeamMembers.map((member, index) => (
          <TeamMemberCard
            key={member.id}
            member={member}
            variant="ele"
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default ExperientialLearningExperts;

