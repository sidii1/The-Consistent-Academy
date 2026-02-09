import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { NeumorphicButton } from "@/components/ui/neumorphic-button";
import { NeumorphicCard } from "@/components/ui/neumorphic-card";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { AnimatedHeading, AnimatedText } from "@/components/ui/animated-text";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import ExpandableCourseCard, { Course } from "@/components/ui/expandable-course-card";

const courses: Course[] = [
  {
    title: " IELTS | TOEFL | PTE | CELPIP Preparation Course",
    subtitle: "Global English Proficiency Master Program",
    description: "Comprehensive training for all four modules with real proficiency focus, not just exam tricks.",
    image: "/courses/img1.png",
    hours: "20 Hours",
    price:"12000/-",
    modules: 4,
    targetAudience: "Students & professionals aiming for international study, migration, work, or permanent residency.",
    promise: "To build real English proficiency and test confidence, not just exam tricks.",
    highlights: [
      "Full course (All 4 skills): ₹12,000",
    "Single skill option (Speaking / Writing / Reading): ₹4,000",
    "7 hours per individual skill module",
    "Study material provided",
    "Regular practice tasks",
    "Mock tests",
    "Writing assessments & detailed feedback",
    "Speaking evaluations"
    ],
    moduleDetails: [
      {
        title: "Module 1: Listening Mastery",
        duration: "5 Hours",
        topics: [
          "Listening test formats (IELTS / TOEFL / PTE / CELPIP)",
          "MCQs, Sentence completion, Form/note completion",
          "Matching, Maps & diagrams",
          "Identifying distractors",
          "Handling fast speech & unfamiliar vocabulary",
          "Note-taking strategies",
          "Time management"
        ]
      },
      {
        title: "Module 2: Reading Mastery",
        duration: "5 Hours",
        topics: [
          "Reading formats (all exams)",
          "Skimming & scanning techniques",
          "True/False/Not Given, Yes/No/Not Given",
          "Matching headings",
          "Sentence & summary completion",
          "MCQs and vocabulary in context",
          "Paraphrasing recognition",
          "Time allocation per passage"
        ]
      },
      {
        title: "Module 3: Writing Mastery",
        duration: "5 Hours",
        topics: [
          "Task 1: Academic (graphs, charts, processes, maps)",
          "Task 1: General (formal/semi-formal/informal letters)",
          "Report structure & data comparison",
          "Task 2: Essay types (opinion, discussion, problem-solution)",
          "Planning & paragraph structure",
          "Introductions & conclusions",
          "Cohesive devices",
          "Avoiding common grammar errors"
        ]
      },
      {
        title: "Module 4: Speaking Mastery",
        duration: "5 Hours",
        topics: [
          "Speaking formats (all exams)",
          "Introductions & warm-up",
          "Cue card / long response",
          "Discussion & opinion questions",
          "Fluency-building techniques",
          "Pronunciation & intonation",
          "Expanding answers naturally",
          "Handling difficult questions",
          "Thinking-time strategies"
        ]
      }
    ]
  },
  {
    title: "Corporate Survival & Success Program",
    subtitle: "Fresher-Focused",
    description: "Transform into a corporate-ready professional with essential workplace skills and business etiquette.",
    image: "/courses/img2.png",
    hours: "12 Hours",
    price:"6000/-",
    modules: 6,
    targetAudience: "Freshers, graduate trainees, management trainees, first-job professionals (0–2 years experience).",
    promise: "Participants will think, speak, behave, and perform like corporate-ready professionals.",
    moduleDetails: [
      {
        title: "Module 1: Corporate Mindset & Workplace Reality",
        topics: [
          "Corporate culture & unwritten rules",
          "Professional behaviour & work ethics",
          "Ownership, accountability & attitude",
          "Hierarchy & reporting lines"
        ]
      },
      {
        title: "Module 2: Professional Communication Essentials",
        topics: [
          "Speaking professionally with seniors & colleagues",
          "Structuring clear responses",
          "Asking questions the right way",
          "Telephone & virtual meeting etiquette"
        ]
      },
      {
        title: "Module 3: Email, Chat & Workplace Writing",
        topics: [
          "Professional emails (requests, follow-ups, apologies)",
          "Corporate WhatsApp / Teams / Slack etiquette",
          "Subject lines, tone & clarity",
          "Avoiding casual or risky language"
        ]
      },
      {
        title: "Module 4: Meetings, Teamwork & Office Dynamics",
        topics: [
          "Behaviour in meetings",
          "When to speak & when to stay silent",
          "Giving updates & status reports",
          "Team collaboration etiquette"
        ]
      },
      {
        title: "Module 5: Personal Effectiveness & Image",
        topics: [
          "Time management & prioritisation",
          "Handling pressure & deadlines",
          "Dressing, body language & presence",
          "Managing mistakes professionally"
        ]
      },
      {
        title: "Module 6: Career Growth & Corporate Intelligence",
        topics: [
          "Handling feedback positively",
          "Managing office politics ethically",
          "Speaking up for growth",
          "Early career goal setting"
        ]
      }
    ]
  },
  {
    title: "Crack Your Interview – First Attempt",
    subtitle: "Fresher-Focused",
    description: "Transform from nervous fresher to confident, clear, and convincing interviewee.",
    image: "/courses/img3.png",
    hours: "6 Hours",
    price:"3000/-",
    modules: 6,
    targetAudience: "Final-year students, fresh graduates, job seekers (0–1 year).",
    promise: "To transform nervous freshers into confident, clear, and convincing interviewees.",
    moduleDetails: [
      {
        title: "Module 1: Interview Mindset & Recruiter Psychology",
        topics: [
          "What interviewers look for",
          "Common rejection reasons",
          "Confidence over perfection",
          "Overcoming fear & hesitation"
        ]
      },
      {
        title: "Module 2: Self-Introduction & Personal Branding",
        topics: [
          '"Tell me about yourself"',
          "Presenting education & projects",
          "Turning weaknesses into strengths",
          '"Why should we hire you?"'
        ]
      },
      {
        title: "Module 3: Answer Structuring & HR Questions",
        topics: [
          "STAR & PREP frameworks",
          "Strengths & weaknesses",
          "Failure & challenges",
          "Salary & availability"
        ]
      },
      {
        title: "Module 4: Communication & Body Language",
        topics: [
          "Eye contact & posture",
          "Voice modulation",
          "Handling nervousness",
          "Listening skills"
        ]
      },
      {
        title: "Module 5: Domain & Situational Questions",
        topics: [
          "Basic technical answers",
          "Behavioral questions",
          "Thinking on the spot",
          'Saying "I don\'t know" professionally'
        ]
      },
      {
        title: "Module 6: Mock Interviews & Final Polishing",
        topics: [
          "Full mock interviews",
          "Individual feedback",
          "Last-round mistakes",
          "Follow-up etiquette"
        ]
      }
    ]
  },
  {
    title: "Corporate Dining & Social Etiquette Masterclass",
    subtitle: "Because your career is also built outside the meeting room",
    description: "Master professional dining and social etiquette for corporate success.",
    image: "/courses/img4.png",
    hours: "6 Hours",
    price:"3000/-",
    modules: 6,
    targetAudience: "Freshers, management trainees, graduate hires, young professionals (0–3 years). Separate batches for boys and girls.",
    moduleDetails: [
      {
        title: "Module 1: Social Presence & First Impressions",
        topics: [
          "Corporate social culture",
          "Professional greetings",
          "Confidence without arrogance"
        ]
      },
      {
        title: "Module 2: Dining Etiquette (Indian & Global)",
        topics: [
          "Table manners",
          "Cutlery & seating",
          "Ordering food",
          "Do's & don'ts"
        ]
      },
      {
        title: "Module 3: Wine & Beverage Etiquette",
        topics: [
          "Beverage basics",
          "Declining drinks gracefully",
          "Professional boundaries"
        ]
      },
      {
        title: "Module 4: Conversation & Networking",
        topics: [
          "Small talk",
          "Safe vs risky topics",
          "Exiting conversations politely"
        ]
      },
      {
        title: "Module 5: Dress, Grooming & Presentation",
        topics: [
          "Event dressing",
          "Hygiene & grooming",
          "Cultural sensitivity"
        ]
      },
      {
        title: "Module 6: Emotional & Social Intelligence",
        topics: [
          "Respect & empathy",
          "Handling awkward moments",
          "Professional ethics"
        ]
      }
    ]
  },
  {
    title: "Advanced English & Leadership Presence for Managers",
    subtitle: "Because managers are watched before they are heard",
    description: "Build executive presence, clarity, and leadership communication credibility.",
    image: "/courses/img5.png",
    hours: "12 Hours",
    price:"6000/-",
    modules: 12,
    targetAudience: "Mid-level managers, team leads, first-time managers, senior executives.",
    promise: "To build executive presence, clarity, and leadership communication credibility.",
    moduleDetails: [
      {
        title: "Leadership Communication Essentials",
        duration: "1 Hour",
        topics: [
          "Executive presence fundamentals",
          "Leadership communication styles",
          "Building credibility through communication"
        ]
      },
      {
        title: "Advanced Business Writing",
        duration: "1 Hour",
        topics: [
          "Strategic emails and reports",
          "Executive summaries",
          "Persuasive business proposals"
        ]
      },
      {
        title: "Leading Meetings & Presentations",
        duration: "1 Hour",
        topics: [
          "Facilitating productive meetings",
          "Commanding attention in presentations",
          "Handling difficult discussions"
        ]
      },
      {
        title: "Influencing & Persuasion",
        duration: "1 Hour",
        topics: [
          "Persuasive communication techniques",
          "Stakeholder management",
          "Negotiation skills"
        ]
      },
      {
        title: "Conflict Resolution",
        duration: "1 Hour",
        topics: [
          "Managing team conflicts",
          "Difficult conversations",
          "Mediation techniques"
        ]
      },
      {
        title: "Cross-Cultural Communication",
        duration: "1 Hour",
        topics: [
          "Global business etiquette",
          "Cultural sensitivity",
          "Virtual team management"
        ]
      },
      {
        title: "Strategic Thinking & Articulation",
        duration: "1 Hour",
        topics: [
          "Communicating vision",
          "Strategic storytelling",
          "Thought leadership"
        ]
      },
      {
        title: "Crisis Communication",
        duration: "1 Hour",
        topics: [
          "Managing communication in crisis",
          "Damage control",
          "Transparent leadership"
        ]
      },
      {
        title: "Coaching & Feedback",
        duration: "1 Hour",
        topics: [
          "Giving constructive feedback",
          "Coaching conversations",
          "Performance discussions"
        ]
      },
      {
        title: "Personal Branding for Leaders",
        duration: "1 Hour",
        topics: [
          "Building executive brand",
          "LinkedIn presence",
          "Thought leadership content"
        ]
      },
      {
        title: "Public Speaking for Leaders",
        duration: "1 Hour",
        topics: [
          "Conference presentations",
          "Panel discussions",
          "Media interactions"
        ]
      },
      {
        title: "Emotional Intelligence in Leadership",
        duration: "1 Hour",
        topics: [
          "Self-awareness in communication",
          "Empathetic leadership",
          "Managing emotions under pressure"
        ]
      }
    ]
  },
  {
    title: "Communication Skill Training",
    description: "Clear, confident, and professional communication in interviews, meetings, and public speaking.",
    image: "/courses/img6.png",
    hours: "20 Hours",
    price:"5000/-",
    modules: 8,
    targetAudience: "Students, freshers, and early-career professionals.",
    promise: "Master clear, confident, and professional communication for all scenarios.",
    moduleDetails: [
      {
        title: "Module 1: Articulation",
        topics: [
          "Clear speech techniques",
          "Word pronunciation",
          "Accent neutralization"
        ]
      },
      {
        title: "Module 2: Fluency",
        topics: [
          "Speaking smoothly",
          "Sentence flow",
          "Natural pacing"
        ]
      },
      {
        title: "Module 3: Vocabulary Expansion",
        topics: [
          "Professional vocabulary",
          "Context-appropriate words",
          "Advanced expressions"
        ]
      },
      {
        title: "Module 4: Avoid Fillers",
        topics: [
          "Eliminating um, ah, like",
          "Pause techniques",
          "Conscious speaking"
        ]
      },
      {
        title: "Module 5: Pronunciation & Enunciation",
        topics: [
          "Sound production",
          "Difficult words practice",
          "Clarity exercises"
        ]
      },
      {
        title: "Module 6: Idioms & Phrases",
        topics: [
          "Common idioms",
          "Business phrases",
          "Contextual usage"
        ]
      },
      {
        title: "Module 7: Public Speaking",
        topics: [
          "Stage presence",
          "Audience engagement",
          "Presentation skills"
        ]
      },
      {
        title: "Module 8: Confidence Building",
        topics: [
          "Overcoming fear",
          "Self-assurance techniques",
          "Positive mindset"
        ]
      }
    ]
  },
  {
    title: "Personality Development Training",
    description: "Build a confident personality, strong body language, professional etiquette, and leadership skills.",
    image: "/courses/img7.png",
    hours: "12 Hours",
    price:"6000/-",
    modules: 8,
    targetAudience: "Students, freshers, and early-career professionals.",
    promise: "Develop a complete professional personality with confidence and leadership qualities.",
    moduleDetails: [
      {
        title: "Module 1: First Impressions",
        topics: [
          "Creating strong first impressions",
          "Professional appearance",
          "Confidence in introductions"
        ]
      },
      {
        title: "Module 2: Body Language",
        topics: [
          "Posture and gestures",
          "Eye contact techniques",
          "Non-verbal communication"
        ]
      },
      {
        title: "Module 3: Starting Conversations",
        topics: [
          "Ice-breaking techniques",
          "Small talk mastery",
          "Building rapport"
        ]
      },
      {
        title: "Module 4: Dress for Success",
        topics: [
          "Professional wardrobe",
          "Grooming standards",
          "Situation-appropriate dressing"
        ]
      },
      {
        title: "Module 5: Social & Business Etiquette",
        topics: [
          "Professional manners",
          "Social grace",
          "Business protocol"
        ]
      },
      {
        title: "Module 6: Dining Etiquette",
        topics: [
          "Table manners",
          "Formal dining",
          "Business lunch/dinner protocol"
        ]
      },
      {
        title: "Module 7: Leadership & Decision Making",
        topics: [
          "Leadership qualities",
          "Decision-making frameworks",
          "Taking initiative"
        ]
      },
      {
        title: "Module 8: Negotiation & Conflict Resolution",
        topics: [
          "Negotiation strategies",
          "Conflict management",
          "Win-win solutions"
        ]
      }
    ]
  },
  {
    title:"Train the Trainer Course",
    subtitle: "IELTS | Spoken English | ESL / TESOL / TEFL Trainer Certification",
    description: "Equip yourself with the skills to become an effective trainer and facilitator.",
    targetAudience: "Aspiring trainers, educators, and professionals looking to enhance their training skills.",
    image: "/courses/img14.png",
    hours: "15 Hours",
    price:"15000/-",
    modules: 8,
    moduleDetails: [
      {
        title: "Module 1: Training Fundamentals",
        topics: [
          "Understanding adult learning",
          "Training methodologies",
          "Learning objectives"
        ]
      },
      {
        title: "Module 2: Curriculum Design",
        topics: [
          "Course structure planning",
          "Content development",
          "Assessment strategies"
        ]
      },
      {
        title: "Module 3: Facilitation Skills",
        topics: [
          "Interactive teaching techniques",
          "Group dynamics management",
          "Effective questioning"
        ]
      },
      {
        title: "Module 4: Presentation & Delivery",
        topics: [
          "Engaging presentations",
          "Visual aids usage",
          "Confidence building"
        ]
      },
      {
        title: "Module 5: Feedback & Evaluation",
        topics: [
          "Providing constructive feedback",
          "Evaluating training effectiveness",
          "Continuous improvement"
        ]
      },
      {
        title: "Module 6: Coaching & Mentoring",
        topics: [
          "Coaching techniques for trainers",
          "Mentoring strategies for learners",
          "Supportive learning environment"
        ]
      },
      {
        title: "Module 7: Technology Integration in Training",
        topics: [
          "Digital tools for training delivery",
          "Online learning platforms usage",
          "Blended learning approaches"
        ]
      },
      {
        title: "Module 8: Advanced Trainer Competencies",
        topics: [
          "Leadership in training environments",
          "Innovation in training design and delivery methods.",
          ""
        ]
      }
    ]
  }
];

const kidsCourses = [
  {
    title: "Elocution Course",
    description: "Helps children speak clearly, confidently, and expressively.",
    duration: "4 Weeks",
    price:"3000/-",
    image: "/courses/img8.png",
    features: [
      "Clarity in speech & pronunciation",
      "Expressive reading & storytelling",
      "Vocabulary & grammar improvement",
      "Confidence in public speaking",
      "Listening & comprehension skills",
    ],
  },
  {
    title: "TedX & Toastmaster Training ",
    description: "Builds confidence and stage presence in young learners.",
    duration: "4 Weeks",
    price:"3000/-",
    image: "/courses/img9.png",
    features: [
      "Reduced stage fear",
      "Improved body language & projection",
      "Speech structuring techniques",
      "Toastmaster like confidence",
      "TED Talk style preparation",
      "Holistic personality development",
    ],
  },
  {
    title: "Grammar Foundations",
    description: "Strong grammar basics for clear and correct communication.",
    duration: "4 Weeks",
    price:"3000/-",
    image: "/courses/img10.png",
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
    price:"3000/-",
    image: "/courses/img11.png",
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
    duration: "Online",
    price:"500/per month",
    image: "/courses/img12.png",
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
      <section className="relative pt-28 overflow-hidden">

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
          <ExpandableCourseCard courses={courses} />
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
          {course.image && (
            <div className="mb-4 rounded-lg overflow-hidden">
              <img 
                src={course.image} 
                alt={course.title}
                className="w-full h-32 object-cover"
              />
            </div>
          )}
          
          <div className="flex items-center justify-between gap-3 mb-2">
  <h3 className="text-xl font-semibold text-foreground">
    {course.title}
  </h3>

  <span className="text-primary font-semibold text-sm whitespace-nowrap">
    ₹ {course.price}
  </span>
</div>


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
