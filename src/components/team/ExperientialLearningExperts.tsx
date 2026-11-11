import { motion } from "framer-motion";
import { AnimatedHeading, AnimatedText } from "@/components/ui/animated-text";
import { TeamMemberCard, TeamMember } from "./TeamMemberCard";

// SAMPLE — replace with client-approved profiles
const eleTeamMembers: TeamMember[] = [
  {
    id: "ele1",
    name: "Aparna Jadhav",
    designation: "Experiential Learning Expert",
    role: "Leadership Facilitation & Group Dynamics",
    description:
      "Hi, I’m Aparna! I’m 100% powered by chai, coffee, and big ambitions. My height may be compact think cute, portable, and ridiculously adjustable but my mind and creative ideas are huge. I thrive when I’m managing events, hosting shows on stage, and putting my wildest ideas out there for the world to see. I’m built for the high-energy world of marketing, where my creativity gets to run the show. Dynamite really does come in small packages, and I’m ready to prove it! ",
    photo: "/team/experiential-learning-experts/Aparna Jadhav.png",
    expertiseLink: null,
    isSample: true,
  },
  {
    id: "ele2",
    name: "Ishani Soundankar",
    designation: "Experiential Learning Expert",
    role: "Project-Based Learning & Innovation",
    description:
      "I’m a curious soul with big dreams, a creative streak, and about 20 tabs open in my brain at all times! I love dancing, getting lost in art and craft, playing indoor and outdoor games, traveling, and watching movies that make me laugh, think, or leave me emotional. My passion? Creating, expressing, exploring, and turning random ideas into something real. I love discovering new places, meeting interesting people, and saying yes to experiences that help me grow. I’m basically a mix of an artist, an explorer, a dreamer, a achiever and someone who wants to try a little bit of everything! ",
    photo: "/team/experiential-learning-experts/Ishani Soundankar.jpg",
    expertiseLink: null,
    isSample: true,
  },
  {
    id: "ele3",
    name: "Nidhi Pillia",
    designation: "Experiential Learning Expert",
    role: "Communication Workshops & Reflective Practice",
    description:
      "Part engineer, part artist, and part person who will absolutely turn a random thought into a 5-minute speech. I’m into music, painting, crocheting, a little debate, and collecting experiences that make good stories later. From winning karate medals to surviving the chaos of college events, I like keeping life interesting. I love trying new things, exploring new places, and saying yes to adventures (after overthinking them for at least 20 minutes). Basically, I’m a curious human with too many hobbies and not enough hours!",
    photo: "/team/experiential-learning-experts/NIDHI PILLIA.jpg",
    expertiseLink: null,
    isSample: true,
  },
  {
    id: "ele4",
    name: "Sakshi Masalkar",
    designation: "Experiential Learning Expert",
    role: "Outdoor & Action Learning",
    description:
      "I'm a happy-go-lucky, cheerful, sweet, and extroverted person. I love travelling and exploring new places. I've travelled to Rajasthan, Bangalore, Mysore, and explored various beautiful forts across Maharashtra.Apart from travelling, I love canvas painting. I'm also passionate about art, creativity, and handmade crafts. I enjoy making artistic things with my own hands and trying something new whenever I get the opportunity.I believe in enjoying little moments, exploring new experiences, and keeping my creative side alive.",
    photo: "",
    expertiseLink: null,
    isSample: true,
  },
];

export const ExperientialLearningExperts = () => {
  return (
    <div className="mt-24 relative">
      {/* Background decorative glow */}
      <div className="absolute inset-0 -z-10 overflow-visible pointer-events-none">
        <div className="absolute top-1/2 -left-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
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
        </motion.div>
      </div>

      {/* Members Grid (Magazine Spread Layout) */}
      <div className="space-y-8 max-w-5xl mx-auto">
        {eleTeamMembers.map((member, index) => (
          <TeamMemberCard
            key={member.id}
            member={member}
            variant="spread"
            index={index}
            isAlternate={index % 2 === 1}
          />
        ))}
      </div>
    </div>
  );
};

export default ExperientialLearningExperts;

