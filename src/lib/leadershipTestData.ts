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
    description: "Decisive, control-oriented, efficient in crises. You prefer making decisions independently and maintaining clear authority.",
    strengths: [
      "Quick and decisive in critical situations",
      "Clear chain of command and expectations",
      "Efficient in crisis management"
    ],
    limitations: [
      "May limit creativity and team engagement",
      "Can reduce team autonomy and initiative",
      "Risk of lower morale if overused"
    ],
    growthSuggestions: [
      "Practice involving team in non-critical decisions",
      "Seek input before finalizing strategies"
    ]
  },
  democratic: {
    name: "Democratic Leader",
    description: "Inclusive, collaborative, trust-building. You value team input and foster open communication.",
    strengths: [
      "High team engagement and morale",
      "Builds trust and collaboration",
      "Encourages diverse perspectives"
    ],
    limitations: [
      "Slower decision-making in urgent situations",
      "May struggle with decisive action when needed",
      "Can be challenging with large teams"
    ],
    growthSuggestions: [
      "Develop frameworks for faster consensus",
      "Learn when to shift to directive style"
    ]
  },
  laissezFaire: {
    name: "Laissez-Faire Leader",
    description: "Empowers autonomy, suits expert teams. You trust your team to work independently with minimal supervision.",
    strengths: [
      "Maximizes autonomy and creativity",
      "Works well with highly skilled teams",
      "Encourages innovation"
    ],
    limitations: [
      "Risk of lack of direction",
      "May lead to unclear accountability",
      "Not suitable for inexperienced teams"
    ],
    growthSuggestions: [
      "Provide clearer milestones and check-ins",
      "Balance freedom with accountability"
    ]
  },
  transformational: {
    name: "Transformational Leader",
    description: "Vision-driven, inspirational, change-oriented. You inspire teams to exceed expectations through shared purpose.",
    strengths: [
      "Inspires high performance and innovation",
      "Builds strong organizational culture",
      "Drives meaningful change"
    ],
    limitations: [
      "Requires high emotional intelligence",
      "Needs consistent energy and presence",
      "May overlook operational details"
    ],
    growthSuggestions: [
      "Balance inspiration with execution",
      "Develop systems for sustainable change"
    ]
  },
  transactional: {
    name: "Transactional Leader",
    description: "Performance-focused, structured, result-oriented. You manage through clear expectations and accountability.",
    strengths: [
      "Clear performance standards",
      "Effective monitoring and feedback",
      "Results-driven approach"
    ],
    limitations: [
      "Limited emotional connection",
      "May not inspire beyond compliance",
      "Less focus on development"
    ],
    growthSuggestions: [
      "Incorporate coaching and mentoring",
      "Balance metrics with people development"
    ]
  },
  servant: {
    name: "Servant Leader",
    description: "People-first, ethical, trust-based. You prioritize serving your team and fostering their growth.",
    strengths: [
      "High trust and loyalty",
      "Strong ethical foundation",
      "Develops future leaders"
    ],
    limitations: [
      "May struggle with authority enforcement",
      "Can be seen as too soft",
      "Risk of being taken advantage of"
    ],
    growthSuggestions: [
      "Set clear boundaries and expectations",
      "Practice assertiveness when needed"
    ]
  },
  situational: {
    name: "Situational Leader",
    description: "Flexible, adaptive, context-driven. You adjust your leadership style based on team needs and situations.",
    strengths: [
      "Highly adaptable to different contexts",
      "Matches style to team maturity",
      "Versatile and responsive"
    ],
    limitations: [
      "Requires high awareness and skill",
      "Can seem inconsistent if not explained",
      "Demands constant assessment"
    ],
    growthSuggestions: [
      "Communicate why you adapt your approach",
      "Develop diagnostic frameworks"
    ]
  },
  coaching: {
    name: "Coaching Leader",
    description: "Development-focused, patient, growth-oriented. You invest in long-term development of team members.",
    strengths: [
      "Builds strong capabilities",
      "Creates learning culture",
      "Long-term team development"
    ],
    limitations: [
      "Time-intensive approach",
      "May be slow for urgent needs",
      "Requires patience and skill"
    ],
    growthSuggestions: [
      "Balance coaching with task completion",
      "Develop efficient coaching frameworks"
    ]
  },
  visionary: {
    name: "Visionary Leader",
    description: "Future-focused, innovative, purpose-driven. You paint compelling pictures of the future and inspire change.",
    strengths: [
      "Creates compelling direction",
      "Inspires innovation and change",
      "Builds sense of purpose"
    ],
    limitations: [
      "Needs strong execution support",
      "May overlook practical constraints",
      "Can be too future-focused"
    ],
    growthSuggestions: [
      "Partner with detail-oriented leaders",
      "Connect vision to concrete actions"
    ]
  },
  bureaucratic: {
    name: "Bureaucratic Leader",
    description: "Process-driven, reliable, compliance-focused. You ensure consistency through established procedures.",
    strengths: [
      "High consistency and reliability",
      "Clear processes and compliance",
      "Reduces uncertainty"
    ],
    limitations: [
      "Low flexibility and innovation",
      "May slow down responses",
      "Can stifle creativity"
    ],
    growthSuggestions: [
      "Create space for controlled experimentation",
      "Balance process with flexibility"
    ]
  }
};
