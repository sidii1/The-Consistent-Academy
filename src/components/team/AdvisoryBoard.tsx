import { motion } from "framer-motion";
import { AnimatedHeading, AnimatedText } from "@/components/ui/animated-text";
import { TeamMemberCard, TeamMember } from "./TeamMemberCard";

// SAMPLE — replace with client-approved profiles
const advisoryBoardMembers: TeamMember[] = [
  {
    id: "ab1",
    name: "Dr. Anjali Mehta",
    designation: "Senior Educationist & Curriculum Expert",
    expertise: "Curriculum Design, Language Pedagogy",
    bio: "With over 25 years in education, Dr. Mehta has led curriculum development initiatives across leading universities in India and abroad. Her work in English Language Teaching has shaped thousands of learners worldwide.",
    photo: "/team/advisory-board/placeholder-1.jpg",
    linkedin: "https://www.linkedin.com",
    isSample: true,
  },
  {
    id: "ab2",
    name: "Mr. Suresh Krishnamurthy",
    designation: "Executive Coach & Leadership Consultant",
    expertise: "Leadership Development, Corporate Training",
    bio: "A certified executive coach with a track record of transforming leadership capability in Fortune 500 companies, Mr. Krishnamurthy brings his expertise in experiential learning to The Consistent Academy's advisory panel.",
    photo: "/team/advisory-board/placeholder-2.jpg",
    linkedin: "https://www.linkedin.com",
    isSample: true,
  },
  {
    id: "ab3",
    name: "Dr. Priya Nair",
    designation: "Applied Linguistics Researcher",
    expertise: "Second Language Acquisition, Assessment",
    bio: "Dr. Nair's research in applied linguistics and second language acquisition frameworks has been published in respected peer-reviewed journals. She advises on modern evidence-based teaching methodologies.",
    photo: "/team/advisory-board/placeholder-3.jpg",
    linkedin: "https://www.linkedin.com",
    isSample: true,
  },
  {
    id: "ab4",
    name: "Ms. Rekha Sharma",
    designation: "Soft Skills & Corporate Communication Expert",
    expertise: "Soft Skills Training, NLP, Behavioural Coaching",
    bio: "A practitioner of NLP and behavioural coaching with 18 years in corporate training, Ms. Sharma has designed transformative soft-skills programmes for leading MNCs and high-growth startups across India.",
    photo: "/team/advisory-board/placeholder-4.jpg",
    linkedin: "https://www.linkedin.com",
    isSample: true,
  },
];

export const AdvisoryBoard = () => {
  return (
    <div className="mt-20 relative">
      {/* Background decorative glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
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
            Strategic Guidance & Governance
          </AnimatedText>

          <AnimatedHeading delay={0.1} className="mb-4">
            Advisory <span className="text-gradient">Board</span>
          </AnimatedHeading>

          <AnimatedText
            className="text-neo-muted text-base max-w-2xl mx-auto leading-relaxed"
            delay={0.2}
          >
            Distinguished academicians, corporate leaders, and pedagogy experts
            guiding our curriculum standards, pedagogical innovation, and institutional direction.
          </AnimatedText>
        </motion.div>
      </div>

      {/* Members Grid (Magazine Spread Layout) */}
      <div className="space-y-8 max-w-5xl mx-auto">
        {advisoryBoardMembers.map((member, index) => (
          <TeamMemberCard
            key={member.id}
            member={member}
            variant="advisory"
            index={index}
            isAlternate={index % 2 === 1}
          />
        ))}
      </div>
    </div>
  );
};

export default AdvisoryBoard;

