import { motion } from "framer-motion";
import { reveal } from "@/lib/device";
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
    name: "Harsha Chinchore",
    designation: "Experiential Learning Expert",
    role: "Communication & Opportunity Exploration",
    description:
      "A passionate Bharatanatyam dancer who wants to live life to the fullest and enjoy every moment of it. I'm growing a family business with all my energy and skills. I'm keen to communicate as much as I can, to understand new and upcoming opportunities across various fields, and I'm always excited to learn about new innovations. I believe we should learn from experiences that help us grow, both inside and out.",
    photo: "/team/experiential-learning-experts/Harsha Chinchore.jpg",
    expertiseLink: null,
    isSample: true,
  },
  {
    id: "ele5",
    name: "Shweta Chinchore",
    designation: "Experiential Learning Expert",
    role: "Observation & Interpersonal Understanding",
    description:
      "I'm a lazy brat, which helps me do things in the simplest way. I love listening to music of every genre. I remember things in great detail, which helps me relive moments, and I'm good at expressing them with minute details. I'm a keen observer, and a lot of things catch my eye. I love talking to people and understanding them and their experiences as a whole.",
    photo: "/team/experiential-learning-experts/Shweta Chinchore.jpg",
    expertiseLink: null,
    isSample: true,
  },
  {
    id: "ele6",
    name: "Sanjyoti Raut",
    designation: "Experiential Learning Expert",
    role: "Creative Teaching & Learning Facilitation",
    description:
      "I'm a curious soul with a big imagination and a never-ending bucket list! A big fan of teaching, I love making people go from \"I don't get it\" to \"That was easy!\". I love exploring new places, finding cute cafés, experimenting with art, and collecting memories along the way. I'm always up for spontaneous plans, creative adventures, and coffee with good conversation. Life's too short for boring routines, so here's to living, learning, and a little bit of madness!",
    photo: "/team/experiential-learning-experts/Sanjyoti Raut.jpg",
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
          {...reveal({
            initial: { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { duration: 0.6 },
          }, "none")}
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

