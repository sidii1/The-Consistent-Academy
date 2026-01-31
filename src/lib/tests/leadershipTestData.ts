// Leadership Style Assessment Data

export type LeadershipStyle = 
  | "autocratic"
  | "democratic"
  | "laissezFaire"
  | "transformational"
  | "transactional"
  | "servant"
  | "situational"
  | "coaching"
  | "visionary"
  | "bureaucratic";

export interface LeadershipQuestion {
  id: number;
  question: string;
  section?: string;
  leadershipStyle: LeadershipStyle;
}

export interface LeadershipTestSection {
  title: string;
  questions: LeadershipQuestion[];
}

export interface LeadershipTestData {
  title: string;
  description: string;
  sections: LeadershipTestSection[];
  totalQuestions: number;
  testType: "leadership";
}

export const leadershipTestData: LeadershipTestData = {
  title: "Leadership Style Assessment",
  description: "Comprehensive Leadership Style Diagnostic",
  totalQuestions: 60,
  testType: "leadership",
  sections: [
    {
      title: "Decision-Making Style",
      questions: [
        { id: 1, question: "I prefer to make decisions on my own rather than involve the team.", section: "Decision-Making Style", leadershipStyle: "autocratic" },
        { id: 2, question: "I consult my team before finalizing important decisions.", section: "Decision-Making Style", leadershipStyle: "democratic" },
        { id: 3, question: "I adjust my decision-making style based on the competence of my team.", section: "Decision-Making Style", leadershipStyle: "situational" },
        { id: 4, question: "I follow established rules and procedures while making decisions.", section: "Decision-Making Style", leadershipStyle: "bureaucratic" },
        { id: 5, question: "I make quick decisions even with limited information.", section: "Decision-Making Style", leadershipStyle: "autocratic" },
        { id: 6, question: "I encourage team members to challenge my decisions.", section: "Decision-Making Style", leadershipStyle: "democratic" },
        { id: 7, question: "I reward or penalize team members based on results achieved.", section: "Decision-Making Style", leadershipStyle: "transactional" },
        { id: 8, question: "I focus on long-term impact rather than short-term outcomes.", section: "Decision-Making Style", leadershipStyle: "transformational" },
        { id: 9, question: "I delegate decision-making authority freely.", section: "Decision-Making Style", leadershipStyle: "laissezFaire" },
        { id: 10, question: "I believe leaders must sometimes take unpopular decisions.", section: "Decision-Making Style", leadershipStyle: "autocratic" }
      ]
    },
    {
      title: "Communication & Influence",
      questions: [
        { id: 11, question: "I clearly communicate expectations and performance standards.", section: "Communication & Influence", leadershipStyle: "transactional" },
        { id: 12, question: "I actively listen to my team members' ideas and concerns.", section: "Communication & Influence", leadershipStyle: "democratic" },
        { id: 13, question: "I inspire people through vision and purpose.", section: "Communication & Influence", leadershipStyle: "visionary" },
        { id: 14, question: "I believe communication should follow formal channels.", section: "Communication & Influence", leadershipStyle: "bureaucratic" },
        { id: 15, question: "I regularly give constructive feedback.", section: "Communication & Influence", leadershipStyle: "coaching" },
        { id: 16, question: "I motivate people through rewards and recognition.", section: "Communication & Influence", leadershipStyle: "transactional" },
        { id: 17, question: "I adapt my communication style to different individuals.", section: "Communication & Influence", leadershipStyle: "situational" },
        { id: 18, question: "I encourage open and transparent communication.", section: "Communication & Influence", leadershipStyle: "democratic" },
        { id: 19, question: "I focus more on instructions than discussions.", section: "Communication & Influence", leadershipStyle: "autocratic" },
        { id: 20, question: "I mentor team members for their long-term growth.", section: "Communication & Influence", leadershipStyle: "coaching" }
      ]
    },
    {
      title: "People & Team Management",
      questions: [
        { id: 21, question: "I trust my team to work independently without close supervision.", section: "People & Team Management", leadershipStyle: "laissezFaire" },
        { id: 22, question: "I closely monitor team performance.", section: "People & Team Management", leadershipStyle: "autocratic" },
        { id: 23, question: "I focus on developing people, not just achieving targets.", section: "People & Team Management", leadershipStyle: "coaching" },
        { id: 24, question: "I intervene immediately when performance drops.", section: "People & Team Management", leadershipStyle: "transactional" },
        { id: 25, question: "I put my team's needs before my own.", section: "People & Team Management", leadershipStyle: "servant" },
        { id: 26, question: "I believe discipline is essential for team success.", section: "People & Team Management", leadershipStyle: "bureaucratic" },
        { id: 27, question: "I encourage collaboration and teamwork.", section: "People & Team Management", leadershipStyle: "democratic" },
        { id: 28, question: "I coach team members instead of directing them.", section: "People & Team Management", leadershipStyle: "coaching" },
        { id: 29, question: "I treat mistakes as learning opportunities.", section: "People & Team Management", leadershipStyle: "coaching" },
        { id: 30, question: "I believe authority is necessary to manage people effectively.", section: "People & Team Management", leadershipStyle: "autocratic" }
      ]
    },
    {
      title: "Change, Vision & Innovation",
      questions: [
        { id: 31, question: "I enjoy leading change initiatives.", section: "Change, Vision & Innovation", leadershipStyle: "transformational" },
        { id: 32, question: "I am comfortable experimenting with new ideas.", section: "Change, Vision & Innovation", leadershipStyle: "visionary" },
        { id: 33, question: "I prefer stability over frequent change.", section: "Change, Vision & Innovation", leadershipStyle: "bureaucratic" },
        { id: 34, question: "I help people see the bigger picture.", section: "Change, Vision & Innovation", leadershipStyle: "visionary" },
        { id: 35, question: "I encourage innovation even if it involves risk.", section: "Change, Vision & Innovation", leadershipStyle: "transformational" },
        { id: 36, question: "I strictly adhere to organizational policies.", section: "Change, Vision & Innovation", leadershipStyle: "bureaucratic" },
        { id: 37, question: "I inspire people to exceed expectations.", section: "Change, Vision & Innovation", leadershipStyle: "visionary" },
        { id: 38, question: "I prefer proven methods over creative approaches.", section: "Change, Vision & Innovation", leadershipStyle: "bureaucratic" },
        { id: 39, question: "I help individuals adapt during change.", section: "Change, Vision & Innovation", leadershipStyle: "situational" },
        { id: 40, question: "I challenge the status quo.", section: "Change, Vision & Innovation", leadershipStyle: "visionary" }
      ]
    },
    {
      title: "Ethics, Values & Responsibility",
      questions: [
        { id: 41, question: "I lead by example.", section: "Ethics, Values & Responsibility", leadershipStyle: "transformational" },
        { id: 42, question: "I believe leadership is about serving others.", section: "Ethics, Values & Responsibility", leadershipStyle: "servant" },
        { id: 43, question: "I hold people accountable for their actions.", section: "Ethics, Values & Responsibility", leadershipStyle: "transactional" },
        { id: 44, question: "I take responsibility for team failures.", section: "Ethics, Values & Responsibility", leadershipStyle: "servant" },
        { id: 45, question: "I ensure fairness and transparency.", section: "Ethics, Values & Responsibility", leadershipStyle: "democratic" },
        { id: 46, question: "I prioritize organizational goals over individual needs.", section: "Ethics, Values & Responsibility", leadershipStyle: "bureaucratic" },
        { id: 47, question: "I empower others to grow into leaders.", section: "Ethics, Values & Responsibility", leadershipStyle: "servant" },
        { id: 48, question: "I believe authority comes from position.", section: "Ethics, Values & Responsibility", leadershipStyle: "autocratic" },
        { id: 49, question: "I encourage ethical decision-making.", section: "Ethics, Values & Responsibility", leadershipStyle: "servant" },
        { id: 50, question: "I focus on building trust.", section: "Ethics, Values & Responsibility", leadershipStyle: "servant" }
      ]
    },
    {
      title: "Self-Awareness & Adaptability",
      questions: [
        { id: 51, question: "I reflect on my leadership behavior regularly.", section: "Self-Awareness & Adaptability", leadershipStyle: "transformational" },
        { id: 52, question: "I seek feedback from my team.", section: "Self-Awareness & Adaptability", leadershipStyle: "democratic" },
        { id: 53, question: "I change my leadership approach based on situations.", section: "Self-Awareness & Adaptability", leadershipStyle: "situational" },
        { id: 54, question: "I remain calm under pressure.", section: "Self-Awareness & Adaptability", leadershipStyle: "situational" },
        { id: 55, question: "I am open to learning new leadership skills.", section: "Self-Awareness & Adaptability", leadershipStyle: "coaching" },
        { id: 56, question: "I believe one leadership style does not fit all.", section: "Self-Awareness & Adaptability", leadershipStyle: "situational" },
        { id: 57, question: "I handle conflicts constructively.", section: "Self-Awareness & Adaptability", leadershipStyle: "democratic" },
        { id: 58, question: "I am confident in my leadership ability.", section: "Self-Awareness & Adaptability", leadershipStyle: "transformational" },
        { id: 59, question: "I encourage autonomy.", section: "Self-Awareness & Adaptability", leadershipStyle: "laissezFaire" },
        { id: 60, question: "I focus on continuous improvement.", section: "Self-Awareness & Adaptability", leadershipStyle: "transformational" }
      ]
    }
  ]
};

export const leadershipStyleDescriptions: Record<LeadershipStyle, {
  name: string;
  description: string;
  strengths: string[];
  limitations: string[];
  growthSuggestions: string[];
}> = {
  autocratic: {
    name: "Autocratic Leader",
    description: "You are a decisive, directive leader who makes independent decisions and expects prompt execution. This style excels in crisis situations, military operations, or when rapid, unambiguous decisions are essential. You value efficiency, clear chains of command, and maintaining control over outcomes. Your approach works best when you possess superior expertise or when circumstances demand immediate action without debate.",
    strengths: [
      "Efficient decision-making in crisis situations and time-sensitive scenarios",
      "Clear direction and unambiguous authority that eliminates confusion",
      "Effective in highly structured environments requiring strict compliance",
      "Provides stability and certainty in chaotic or uncertain conditions"
    ],
    limitations: [
      "May significantly limit team creativity, innovation, and independent thinking",
      "Can reduce team autonomy, initiative, and sense of ownership",
      "Risk of lower morale, disengagement, and higher turnover if overused",
      "May miss valuable insights from team members with different perspectives"
    ],
    growthSuggestions: [
      "Practice involving team in non-critical decisions to build engagement",
      "Seek input before finalizing strategies, even if final decision remains yours",
      "Develop awareness of when collaboration would enhance outcomes"
    ]
  },
  democratic: {
    name: "Democratic Leader",
    description: "You are an inclusive, collaborative leader who genuinely values team input and fosters open communication. This participative approach builds strong buy-in, leverages collective intelligence, and creates psychological safety. You believe the best solutions emerge from diverse perspectives and that team members perform best when they have a voice in decisions that affect them. This style thrives in knowledge work, creative industries, and environments requiring innovation and engagement.",
    strengths: [
      "High team engagement, morale, and commitment to decisions",
      "Builds deep trust, collaboration, and psychological safety",
      "Encourages diverse perspectives leading to better solutions",
      "Develops team members' decision-making capabilities and ownership"
    ],
    limitations: [
      "Slower decision-making process in urgent or time-sensitive situations",
      "May struggle with decisive action when consensus is elusive",
      "Can be challenging with very large teams or inexperienced members",
      "Risk of decision paralysis when opinions are deeply divided"
    ],
    growthSuggestions: [
      "Develop frameworks for faster consensus-building when time is limited",
      "Learn when to shift to directive style in genuine emergencies",
      "Practice setting clear decision deadlines and fallback mechanisms"
    ]
  },
  laissezFaire: {
    name: "Laissez-Faire Leader",
    description: "You are a hands-off leader who empowers team autonomy and trusts professionals to excel independently. This delegation-focused approach works exceptionally well with highly skilled, self-motivated experts who thrive with minimal supervision. You create space for creativity and innovation by removing bureaucratic obstacles and micromanagement. This style is ideal for research teams, creative professionals, or experienced specialists who value independence and have demonstrated competence.",
    strengths: [
      "Maximizes autonomy, creativity, and personal accountability",
      "Works exceptionally well with highly skilled, self-motivated teams",
      "Encourages innovation and unconventional problem-solving",
      "Reduces micromanagement and bureaucratic overhead"
    ],
    limitations: [
      "Significant risk of lack of direction and misalignment without structure",
      "May lead to unclear accountability and coordination challenges",
      "Not suitable for inexperienced teams or high-risk environments",
      "Can result in fragmented efforts without regular alignment"
    ],
    growthSuggestions: [
      "Provide clearer milestones, check-ins, and alignment mechanisms",
      "Balance freedom with accountability structures and progress reviews",
      "Ensure team has resources and clarity even with autonomy"
    ]
  },
  transformational: {
    name: "Transformational Leader",
    description: "You are a vision-driven, inspirational leader who motivates teams to exceed expectations through shared purpose and meaning. You create compelling narratives about the future, inspire personal growth, and catalyze organizational change. By connecting work to higher purpose and challenging people to develop beyond their perceived limits, you build passionate, committed teams. This style excels during organizational transformations, when launching new initiatives, or when deep cultural change is needed.",
    strengths: [
      "Inspires exceptional performance, innovation, and commitment",
      "Builds strong, values-driven organizational culture and identity",
      "Drives meaningful, sustainable change and continuous improvement",
      "Develops future leaders through mentorship and empowerment"
    ],
    limitations: [
      "Requires high emotional intelligence and exceptional communication skills",
      "Needs consistent energy, presence, and authenticity to sustain",
      "May overlook operational details and short-term execution needs",
      "Can be exhausting to maintain the inspirational intensity required"
    ],
    growthSuggestions: [
      "Balance inspiration with execution by partnering with operations-focused leaders",
      "Develop systems and processes to sustain change beyond personal charisma",
      "Build rituals that maintain momentum without constant personal intervention"
    ]
  },
  transactional: {
    name: "Transactional Leader",
    description: "You are a performance-focused, structured leader who manages through clear expectations, monitoring, and accountability. Your approach emphasizes exchanges: effort for rewards, results for recognition, and consequences for underperformance. You excel at creating predictable, efficient operations where expectations are crystal clear and performance is measured objectively. This style works well in sales environments, manufacturing, or any context where clear metrics drive success.",
    strengths: [
      "Establishes clear performance standards and transparent expectations",
      "Provides effective monitoring, feedback, and accountability systems",
      "Creates results-driven culture with objective measurement",
      "Excels at maintaining consistent operational excellence"
    ],
    limitations: [
      "Limited emotional connection and intrinsic motivation",
      "May not inspire performance beyond compliance and basic requirements",
      "Less focus on long-term development and growth",
      "Can create transactional relationships rather than commitment"
    ],
    growthSuggestions: [
      "Incorporate coaching, mentoring, and development conversations",
      "Balance metrics with people development and intrinsic motivation",
      "Recognize contributions beyond measurable outputs"
    ]
  },
  servant: {
    name: "Servant Leader",
    description: "You are a people-first, values-driven leader who prioritizes serving your team and fostering their growth above personal glory. You believe leadership is fundamentally about enabling others to succeed and developing their full potential. By removing obstacles, providing resources, and genuinely caring for team members' well-being, you build exceptional loyalty and trust. This style creates psychologically safe, ethical cultures where people flourish.",
    strengths: [
      "Builds exceptionally high trust, loyalty, and team cohesion",
      "Creates strong ethical foundation and values-based culture",
      "Develops future leaders through genuine investment in growth",
      "Generates long-term commitment and discretionary effort"
    ],
    limitations: [
      "May struggle with authority enforcement and difficult personnel decisions",
      "Can be perceived as too soft or indecisive in competitive environments",
      "Risk of being taken advantage of by those who don't share values",
      "May prioritize individual needs over organizational imperatives"
    ],
    growthSuggestions: [
      "Set clear boundaries and expectations while maintaining compassion",
      "Practice assertiveness and tough decisions when organizational needs require",
      "Balance serving individuals with accountability to mission and results"
    ]
  },
  situational: {
    name: "Situational Leader",
    description: "You are a highly adaptive, context-aware leader who flexibly adjusts your approach based on the situation, task, and team member maturity. You recognize that different circumstances demand different leadership responses—directive when teaching new skills, supportive when building confidence, delegating when working with experts. This sophisticated approach requires continuous assessment of readiness levels and the wisdom to match your style to each unique context.",
    strengths: [
      "Highly adaptable to different contexts, tasks, and team dynamics",
      "Effectively matches leadership style to team member maturity and situation",
      "Versatile and responsive to changing needs and circumstances",
      "Maximizes effectiveness by avoiding one-size-fits-all approaches"
    ],
    limitations: [
      "Requires exceptionally high awareness, emotional intelligence, and skill",
      "Can seem inconsistent or unpredictable if transitions aren't explained",
      "Demands constant assessment and energy to adjust approaches",
      "Complexity can be overwhelming for leaders new to this style"
    ],
    growthSuggestions: [
      "Communicate clearly why you adapt your approach in different situations",
      "Develop diagnostic frameworks to assess team member readiness systematically",
      "Practice explaining your leadership choices to build understanding"
    ]
  },
  coaching: {
    name: "Coaching Leader",
    description: "You are a development-focused, patient leader who invests deeply in the long-term growth of team members. Rather than simply directing or managing tasks, you ask powerful questions, provide developmental feedback, and create learning opportunities. You believe people's potential is unlocked through intentional development conversations and practice. This style creates strong individual capabilities, builds learning cultures, and develops the next generation of leaders.",
    strengths: [
      "Builds exceptional individual and team capabilities over time",
      "Creates sustained learning culture and growth mindset",
      "Provides long-term team development and succession strength",
      "Increases engagement through personalized development investment"
    ],
    limitations: [
      "Very time-intensive approach requiring significant one-on-one investment",
      "May be too slow for urgent operational needs or crisis situations",
      "Requires advanced coaching skills, patience, and emotional intelligence",
      "Can frustrate task-oriented team members seeking quick answers"
    ],
    growthSuggestions: [
      "Balance coaching conversations with task completion and deadlines",
      "Develop efficient coaching frameworks and tools for scalability",
      "Learn when to shift from coaching to directing in urgent situations"
    ]
  },
  visionary: {
    name: "Visionary Leader",
    description: "You are a future-focused, innovative leader who paints compelling pictures of what's possible and mobilizes people toward transformative goals. You excel at seeing possibilities others miss, articulating inspiring future states, and giving meaning to change. Your strategic thinking and ability to communicate a compelling 'why' energizes teams to pursue ambitious objectives. This style is essential during major transitions, when entering new markets, or when organizations need directional clarity.",
    strengths: [
      "Creates compelling strategic direction and clarity of purpose",
      "Inspires innovation, change, and ambitious goal pursuit",
      "Builds strong sense of meaning and organizational identity",
      "Excels at strategic thinking and anticipating future trends"
    ],
    limitations: [
      "Needs strong execution support to translate vision into reality",
      "May overlook practical constraints, resources, or implementation details",
      "Can be overly future-focused at expense of current operations",
      "Risk of vision-reality gap if execution capabilities don't match ambition"
    ],
    growthSuggestions: [
      "Partner with detail-oriented, execution-focused leaders for balance",
      "Connect inspiring vision to concrete milestones and actionable steps",
      "Develop appreciation for operational realities and resource constraints"
    ]
  },
  bureaucratic: {
    name: "Bureaucratic Leader",
    description: "You are a process-driven, compliance-focused leader who ensures consistency, reliability, and adherence to established procedures. You value rules, regulations, and standardized approaches that create predictability and minimize risk. This style is essential in highly regulated industries (healthcare, finance, government) where compliance is non-negotiable and consistency is critical to quality and safety. You provide clarity and structure in complex environments.",
    strengths: [
      "Ensures high consistency, reliability, and standardization",
      "Maintains clear processes, documentation, and compliance",
      "Reduces uncertainty, errors, and regulatory risks",
      "Creates fair, predictable systems that treat everyone equally"
    ],
    limitations: [
      "Low flexibility and innovation due to rigid adherence to rules",
      "May significantly slow down response times and decision-making",
      "Can stifle creativity, initiative, and adaptive problem-solving",
      "Risk of prioritizing process adherence over outcomes or customer needs"
    ],
    growthSuggestions: [
      "Create designated spaces for controlled experimentation and innovation",
      "Balance necessary process adherence with pragmatic flexibility",
      "Regularly review and streamline procedures to eliminate unnecessary bureaucracy"
    ]
  }
};
