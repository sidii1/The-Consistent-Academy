/*
 * Built-in sample webinars. These are shown on /webinars only while no webinar has been
 * published from the admin dashboard (Admin > Webinars), and can be imported there
 * with one click to edit or replace them.
 */

export interface Speaker {
  name: string;
  designation: string;
  bio: string;
  photo: string;
}

export interface Webinar {
  id: string;
  title: string;
  description: string;
  topic: string;
  speaker: Speaker;
  date: string;
  time: string;
  timezone: string;
  duration: string;
  platform: string;
  audience: string;
  prerequisites?: string;
  status: "upcoming" | "registration_open" | "completed";
  /** True for the built-in demo entries (shown until real webinars are published). */
  isSample?: boolean;
  /** Admin-managed webinars only: hidden from the public page until true. */
  published?: boolean;
  /** Optional machine-readable start date (YYYY-MM-DD). When absent, `date` is parsed. */
  dateISO?: string;
  /** Lower numbers appear first within a tab. */
  order?: number;
}

export const SAMPLE_WEBINARS: Webinar[] = [
  {
    id: "public-speaking-101",
    title: "The Art of Confident Public Speaking",
    description:
      "Overcome stage fright, master body language, and captivate any audience with proven psychological techniques. This power-packed session will equip you with the frameworks that top communicators use in boardrooms and stages worldwide.",
    topic: "Public Speaking & Communication",
    speaker: {
      name: "Dr. Priya Sharma",
      designation: "Communication Coach & NLP Practitioner",
      bio:
        "Dr. Priya Sharma has over 14 years of experience training executives, students, and TEDx speakers in the art of confident communication. She holds a doctorate in Applied Linguistics and has coached speakers across 12 countries.",
      photo: "",
    },
    date: "December 15, 2026",
    time: "6:00 PM – 7:30 PM",
    timezone: "IST",
    duration: "90 minutes",
    platform: "Zoom",
    audience: "Professionals, students, and anyone who wants to speak confidently in public",
    prerequisites: "No prior experience required",
    status: "upcoming",
    isSample: true,
  },
  {
    id: "business-english-pro",
    title: "Mastering Business English for Professionals",
    description:
      "Level up your corporate communication with advanced vocabulary, polished email writing, and meeting etiquette. Learn how to influence decisions, navigate difficult conversations, and project authority in any professional setting.",
    topic: "Business English & Corporate Communication",
    speaker: {
      name: "Mr. Rahul Desai",
      designation: "Corporate Trainer & Business Communication Expert",
      bio:
        "Rahul Desai is a seasoned corporate trainer who has facilitated communication workshops for Fortune 500 teams and leading Indian conglomerates. With an MBA from IIM Bangalore, he blends business acumen with language expertise.",
      photo: "",
    },
    date: "November 24, 2026",
    time: "7:00 PM – 8:30 PM",
    timezone: "IST",
    duration: "90 minutes",
    platform: "Google Meet",
    audience: "Working professionals, managers, and MBA aspirants",
    prerequisites: "Intermediate English proficiency",
    status: "upcoming",
    isSample: true,
  },
  {
    id: "ielts-writing-advanced",
    title: "IELTS Writing Task 2: Advanced Strategies",
    description:
      "Deep-dive into examiner expectations, band 8+ essay structures, and the most common pitfalls that keep candidates from achieving their target score. Live essay analysis, real-time Q&A, and a personalized feedback session included.",
    topic: "IELTS Preparation — Writing",
    speaker: {
      name: "Ms. Vidya Wankhade",
      designation: "Founder, The Consistent Academy & IELTS Expert",
      bio:
        "Vidya Wankhade is the founder of The Consistent Academy and has helped over 2,000 students achieve band 7+ in IELTS. Her systematic approach to academic writing has made her one of the most sought-after IELTS coaches in Maharashtra.",
      photo: "",
    },
    date: "November 17, 2026",
    time: "5:00 PM – 6:30 PM",
    timezone: "IST",
    duration: "90 minutes",
    platform: "Zoom",
    audience: "IELTS aspirants targeting Band 7 or above",
    prerequisites: "Familiarity with IELTS Writing Task 2 format",
    status: "registration_open",
    isSample: true,
  },
  {
    id: "email-communication-workplace",
    title: "Effective Email Communication in the Workplace",
    description:
      "A deep exploration of professional email writing — tone, structure, subject lines, and how to write emails that get responses. Covered real-world scenarios from requesting approvals to handling conflict over email.",
    topic: "Workplace Communication",
    speaker: {
      name: "Ms. Vidya Wankhade",
      designation: "Founder, The Consistent Academy",
      bio:
        "Vidya Wankhade is the founder of The Consistent Academy and has helped over 2,000 students achieve measurable communication improvements in their professional lives.",
      photo: "",
    },
    date: "September 20, 2026",
    time: "6:00 PM – 7:00 PM",
    timezone: "IST",
    duration: "60 minutes",
    platform: "Zoom",
    audience: "Corporate employees and freshers",
    prerequisites: "None",
    status: "completed",
    isSample: true,
  },
  {
    id: "interview-skills-masterclass",
    title: "Interview Skills Masterclass",
    description:
      "From body language and first impressions to structuring STAR-format answers and salary negotiation — this masterclass covered everything candidates need to ace interviews at top companies.",
    topic: "Career & Interview Preparation",
    speaker: {
      name: "Mr. Rahul Desai",
      designation: "Corporate Trainer & Business Communication Expert",
      bio:
        "Rahul Desai is a seasoned corporate trainer with deep expertise in HR communication, interview coaching, and professional grooming for the corporate world.",
      photo: "",
    },
    date: "October 10, 2026",
    time: "5:30 PM – 7:00 PM",
    timezone: "IST",
    duration: "90 minutes",
    platform: "Google Meet",
    audience: "Job seekers, freshers, and professionals switching careers",
    prerequisites: "None",
    status: "completed",
    isSample: true,
  },
];
