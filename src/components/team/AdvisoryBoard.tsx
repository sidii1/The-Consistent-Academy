import { motion } from "framer-motion";
import { reveal } from "@/lib/device";
import { AnimatedHeading, AnimatedText } from "@/components/ui/animated-text";
import { TeamMemberCard, TeamMember } from "./TeamMemberCard";

const advisoryBoardMembers: TeamMember[] = [
  {
    id: "ab1",
    name: "Dr. Meenakshi Tyagi",
    designation: "Dean - Academics, PCET's Pune Business School",
    bio: "I am someone who enjoys learning, exploring new things and having meaningful conversations. I love my work in the field of education, but equally enjoy discovering life beyond work. I am deeply interested in human behaviour, neuroscience, leadership and personal growth. Beyond my professional life, fitness and health are an important part of who I am. I enjoy staying active, exploring wellness, understanding the mind-body connection and constantly working towards becoming a healthier, stronger version of myself. I believe life is all about growing, enjoying the journey and staying curious.",
    photo: "/team/advisory-board/meenakshi-tyagi.webp",
  },
  {
    id: "ab2",
    name: "Shilpa Shukla",
    designation: "Certified Abroad Career Counsellor",
    bio: "Certified Abroad Career Counsellor and a proud Army wife and a mother of two. My elder son is studying at University of California, Berkeley while the younger daughter is a Guinness book record holder. I am a Sagittarius who believes life is meant to be lived colourfully. Art is my happy place, whether it's painting, crocheting or diving into a new creative adventure. Sitting idle is simply not my thing; I need to be doing, creating or discovering something new. I love interacting with parents and guiding them for their children's bright future.",
    photo: "/team/advisory-board/shilpa-shukla.webp",
  },
  {
    id: "ab3",
    name: "Dr. Sneha Damle",
    designation: "Counsellor & Co-founder, SETU Parents' Support Group",
    bio: "Co-founder of SETU, a parents' support group, since 2003. I have 17 years of experience in successfully running Amar Pre-School. I am a Nagpur-based counsellor with a PhD in Psychology and MSW in Labour Welfare. I work with children, teenagers, parents and couples on stress, anxiety, exam pressure, relationships and family conflict, drawing on my training in REBT. I run aptitude, personality and IQ assessments that guide students in classes 9 to 12 towards the right stream and career. I write on parenting and psychology for Loksatta and Maharashtra Times, and I love to interact with parents and students in Marathi, Hindi and English.",
    photo: "/team/advisory-board/sneha-damle.webp",
  },
  {
    id: "ab4",
    name: "Sonia Govardhan",
    designation: "Director, Beamish",
    bio: "I am a happy and enthusiastic Leader who doesn't want to walk on a trodden path. I love to be amongst children as they are innocent and purest souls. I like my work and my team. Being a Cambridge author for Parent Handbook and Cambridge Professional Development Trainer gives me great pleasure. I am an Internationally Trained Phonics Trainer. Crafting beautiful experiences for children and paving their future path into wonderful journeys is my passion.",
    photo: "/team/advisory-board/sonia-govardhan.webp",
  },
  {
    id: "ab5",
    name: "Syed Ali Jafri",
    designation: "Director, FPA Edutech",
    bio: "I am a finance professional, educator and mentor passionate about making industry knowledge accessible and practical. My interests span financial services, investment banking, fund accounting, financial markets and the evolving role of technology in finance. Through my association with FPA Edutech, I actively engage in knowledge-sharing, professional development and mentoring aspiring professionals. I enjoy simplifying complex concepts, sharing industry insights and helping individuals strengthen their professional presence through LinkedIn optimisation and personal branding. I believe in continuous learning, meaningful networking and empowering the next generation with practical knowledge, industry exposure and the confidence to navigate an ever-changing professional world.",
    photo: "/team/advisory-board/syed-ali-jafri.webp",
  },
];

export const AdvisoryBoard = () => {
  return (
    <div id="visionaries" className="mt-20 relative scroll-mt-24">
      {/* Background decorative glow */}
      <div className="absolute inset-0 -z-10 overflow-visible pointer-events-none">
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
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

          <AnimatedHeading delay={0.1} className="mb-4">
            Board of <span className="text-gradient">Visionaries</span>
          </AnimatedHeading>

          <AnimatedText
            className="text-neo-muted text-base max-w-2xl mx-auto leading-relaxed"
            delay={0.2}
          >
            A distinguished group of leaders, experts and mentors shaping the future of young achievers.
          </AnimatedText>
        </motion.div>
      </div>

      <div className="space-y-6 md:space-y-8 max-w-5xl mx-auto">
        {advisoryBoardMembers.map((member, index) => (
          <TeamMemberCard key={member.id} member={member} variant="spread" index={index} />
        ))}
      </div>
    </div>
  );
};

export default AdvisoryBoard;

