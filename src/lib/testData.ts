// Test types and data structures
export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  section?: string;
}

export interface TestData {
  title: string;
  description: string;
  sections: TestSection[];
  totalQuestions: number;
}

export interface TestSection {
  title: string;
  questions: Question[];
}

// Kids Test Data (Age 5-17)
export const kidsTestData: TestData = {
  title: "Grammar Test for Kids",
  description: "Age 5-17 Years",
  totalQuestions: 25,
  sections: [
    {
      title: "Fill in the Blanks (Prepositions, Articles, Conjunctions)",
      questions: [
        {
          id: 1,
          question: "The cat is sitting ___ the table.",
          options: ["on", "in", "at", "by"],
          correctAnswer: "a",
          section: "Fill in the Blanks"
        },
        {
          id: 2,
          question: "She bought ___ umbrella because it was raining.",
          options: ["a", "an", "the", "no article"],
          correctAnswer: "b",
          section: "Fill in the Blanks"
        },
        {
          id: 3,
          question: "I like tea ___ coffee, but not both.",
          options: ["and", "or", "because", "so"],
          correctAnswer: "b",
          section: "Fill in the Blanks"
        },
        {
          id: 4,
          question: "The book is ___ the bag.",
          options: ["on", "under", "in", "over"],
          correctAnswer: "c",
          section: "Fill in the Blanks"
        },
        {
          id: 5,
          question: "He was late ___ he missed the bus.",
          options: ["because", "but", "and", "although"],
          correctAnswer: "a",
          section: "Fill in the Blanks"
        }
      ]
    },
    {
      title: "Analogy",
      questions: [
        {
          id: 6,
          question: "Cat : Kitten :: Dog : ___",
          options: ["Puppy", "Calf", "Cub", "Foal"],
          correctAnswer: "a",
          section: "Analogy"
        },
        {
          id: 7,
          question: "Day : Night :: Hot : ___",
          options: ["Warm", "Cold", "Sun", "Light"],
          correctAnswer: "b",
          section: "Analogy"
        },
        {
          id: 8,
          question: "Pencil : Write :: Knife : ___",
          options: ["Eat", "Cut", "Hold", "Paint"],
          correctAnswer: "b",
          section: "Analogy"
        },
        {
          id: 9,
          question: "Teacher : School :: Doctor : ___",
          options: ["Home", "Hospital", "Office", "Market"],
          correctAnswer: "b",
          section: "Analogy"
        },
        {
          id: 10,
          question: "Bird : Fly :: Fish : ___",
          options: ["Run", "Jump", "Swim", "Crawl"],
          correctAnswer: "c",
          section: "Analogy"
        }
      ]
    },
    {
      title: "Tick the Grammatically Correct Sentence",
      questions: [
        {
          id: 11,
          question: "Choose the correct sentence:",
          options: [
            "She don't like apples.",
            "She doesn't likes apples.",
            "She doesn't like apples.",
            "She don't likes apples."
          ],
          correctAnswer: "c",
          section: "Grammar"
        },
        {
          id: 12,
          question: "Choose the correct sentence:",
          options: [
            "He is more smarter than me.",
            "He is smarter than me.",
            "He is smartest than me.",
            "He is smart than me."
          ],
          correctAnswer: "b",
          section: "Grammar"
        },
        {
          id: 13,
          question: "Choose the correct sentence:",
          options: [
            "We was playing football.",
            "We were playing football.",
            "We are playing football yesterday.",
            "We played football tomorrow."
          ],
          correctAnswer: "b",
          section: "Grammar"
        },
        {
          id: 14,
          question: "Choose the correct sentence:",
          options: [
            "The childs are happy.",
            "The children is happy.",
            "The children are happy.",
            "The child are happy."
          ],
          correctAnswer: "c",
          section: "Grammar"
        },
        {
          id: 15,
          question: "Choose the correct sentence:",
          options: [
            "I have finished my homework.",
            "I has finished my homework.",
            "I finishing my homework.",
            "I finish my homework yesterday."
          ],
          correctAnswer: "a",
          section: "Grammar"
        }
      ]
    },
    {
      title: "Synonyms",
      questions: [
        {
          id: 16,
          question: "Synonym of Happy",
          options: ["Sad", "Angry", "Joyful", "Tired"],
          correctAnswer: "c",
          section: "Synonyms"
        },
        {
          id: 17,
          question: "Synonym of Fast",
          options: ["Slow", "Quick", "Late", "Weak"],
          correctAnswer: "b",
          section: "Synonyms"
        },
        {
          id: 18,
          question: "Synonym of Big",
          options: ["Small", "Huge", "Tiny", "Short"],
          correctAnswer: "b",
          section: "Synonyms"
        },
        {
          id: 19,
          question: "Synonym of Begin",
          options: ["End", "Close", "Start", "Stop"],
          correctAnswer: "c",
          section: "Synonyms"
        },
        {
          id: 20,
          question: "Synonym of Brave",
          options: ["Coward", "Fearful", "Bold", "Weak"],
          correctAnswer: "c",
          section: "Synonyms"
        }
      ]
    },
    {
      title: "Degrees of Comparison",
      questions: [
        {
          id: 21,
          question: "Mount Everest is the ___ mountain in the world.",
          options: ["high", "higher", "highest", "more high"],
          correctAnswer: "c",
          section: "Comparison"
        },
        {
          id: 22,
          question: "This book is ___ than that one.",
          options: ["interesting", "more interesting", "most interesting", "very interesting"],
          correctAnswer: "b",
          section: "Comparison"
        },
        {
          id: 23,
          question: "She is the ___ student in the class.",
          options: ["intelligent", "more intelligent", "most intelligent", "intelligentest"],
          correctAnswer: "c",
          section: "Comparison"
        },
        {
          id: 24,
          question: "Today is ___ than yesterday.",
          options: ["cold", "colder", "coldest", "more colder"],
          correctAnswer: "b",
          section: "Comparison"
        },
        {
          id: 25,
          question: "Of all the boys, Ram is the ___.",
          options: ["tall", "taller", "tallest", "more tall"],
          correctAnswer: "c",
          section: "Comparison"
        }
      ]
    }
  ]
};

// Adults Test Data
export const adultsTestData: TestData = {
  title: "Advanced Grammar Test",
  description: "For Adults and Advanced Learners",
  totalQuestions: 28,
  sections: [
    {
      title: "Fill-in-the-Blanks",
      questions: [
        {
          id: 1,
          question: "Neither of the candidates ____ suitable for the position.",
          options: ["is", "are", "were", "have"],
          correctAnswer: "a",
          section: "Grammar"
        },
        {
          id: 2,
          question: "If I ____ you, I would apply for the scholarship immediately.",
          options: ["was", "were", "am", "had been"],
          correctAnswer: "b",
          section: "Grammar"
        },
        {
          id: 3,
          question: "She refused to accept the job offer, ____ it was a great opportunity.",
          options: ["because", "since", "although", "but"],
          correctAnswer: "c",
          section: "Grammar"
        },
        {
          id: 4,
          question: "By this time next year, he ____ his PhD thesis.",
          options: ["completes", "will complete", "will have completed", "had completed"],
          correctAnswer: "c",
          section: "Grammar"
        },
        {
          id: 5,
          question: "The committee has finally decided ____ the proposal.",
          options: ["accept", "to accept", "accepting", "accepted"],
          correctAnswer: "b",
          section: "Grammar"
        }
      ]
    },
    {
      title: "Challenging Verbal Analogy",
      questions: [
        {
          id: 6,
          question: "Water : Thirst :: Food : ?",
          options: ["Hunger", "Appetite", "Starvation", "Meal"],
          correctAnswer: "a",
          section: "Analogy"
        },
        {
          id: 7,
          question: "Embryo : Foetus :: Bud : ?",
          options: ["Sapling", "Flower", "Tree", "Root"],
          correctAnswer: "b",
          section: "Analogy"
        },
        {
          id: 8,
          question: "Pride : Lion :: School : ?",
          options: ["Horses", "Wolves", "Fish", "Whales"],
          correctAnswer: "c",
          section: "Analogy"
        },
        {
          id: 9,
          question: "Optimist : Cheerful :: Pessimist : ?",
          options: ["Hopeful", "Gloomy", "Joyful", "Confident"],
          correctAnswer: "b",
          section: "Analogy"
        },
        {
          id: 10,
          question: "Oath : Allegiance :: Lament : ?",
          options: ["Joy", "Grief", "Promise", "Repentance"],
          correctAnswer: "b",
          section: "Analogy"
        }
      ]
    },
    {
      title: "Idioms & Phrases",
      questions: [
        {
          id: 11,
          question: "He smells a rat in this deal.",
          options: [
            "He feels something is fishy or suspicious",
            "He is allergic to rats",
            "He is angry",
            "He is frightened"
          ],
          correctAnswer: "a",
          section: "Idioms"
        },
        {
          id: 12,
          question: "The teacher's warning fell on deaf ears.",
          options: [
            "Was not heard properly",
            "Was completely ignored",
            "Was accepted politely",
            "Was misunderstood"
          ],
          correctAnswer: "b",
          section: "Idioms"
        },
        {
          id: 13,
          question: "The plan was kept under wraps until the official announcement.",
          options: [
            "Kept open",
            "Kept ready",
            "Kept secret",
            "Kept unfinished"
          ],
          correctAnswer: "c",
          section: "Idioms"
        },
        {
          id: 14,
          question: "She decided to burn the midnight oil to finish her thesis.",
          options: [
            "Work very hard at night",
            "Waste time",
            "Sleep late",
            "Read story books"
          ],
          correctAnswer: "a",
          section: "Idioms"
        },
        {
          id: 15,
          question: "His performance in the interview was below par.",
          options: [
            "Outstanding",
            "Average",
            "Worse than expected",
            "Excellent"
          ],
          correctAnswer: "c",
          section: "Idioms"
        }
      ]
    },
    {
      title: "One-Word Substitution",
      questions: [
        {
          id: 16,
          question: "A person who loves books",
          options: ["Philanthropist", "Bibliophile", "Stoic", "Lexicographer"],
          correctAnswer: "b",
          section: "Vocabulary"
        },
        {
          id: 17,
          question: "A place where bees are kept",
          options: ["Aviary", "Apiary", "Sanctuary", "Apiarist"],
          correctAnswer: "b",
          section: "Vocabulary"
        },
        {
          id: 18,
          question: "A speech made without preparation",
          options: ["Monologue", "Soliloquy", "Extempore", "Dialogue"],
          correctAnswer: "c",
          section: "Vocabulary"
        },
        {
          id: 19,
          question: "A person who eats human flesh",
          options: ["Cannibal", "Carnivore", "Omnivore", "Anthropologist"],
          correctAnswer: "a",
          section: "Vocabulary"
        },
        {
          id: 20,
          question: "A person who believes in God",
          options: ["Atheist", "Theist", "Pagan", "Agnostic"],
          correctAnswer: "b",
          section: "Vocabulary"
        },
        {
          id: 21,
          question: "A person who does not believe in any religion",
          options: ["Agnostic", "Theist", "Heathen", "Secularist"],
          correctAnswer: "a",
          section: "Vocabulary"
        },
        {
          id: 22,
          question: "A government by the rich",
          options: ["Plutocracy", "Aristocracy", "Oligarchy", "Democracy"],
          correctAnswer: "a",
          section: "Vocabulary"
        },
        {
          id: 23,
          question: "A person who is indifferent to pain or pleasure",
          options: ["Pessimist", "Philistine", "Stoic", "Optimist"],
          correctAnswer: "c",
          section: "Vocabulary"
        }
      ]
    },
    {
      title: "Sentence Improvement",
      questions: [
        {
          id: 24,
          question: "He did not spoke to me yesterday.",
          options: [
            "He did not spoke to me yesterday.",
            "He does not speak to me yesterday.",
            "He did not speak to me yesterday.",
            "He did not spoken to me yesterday."
          ],
          correctAnswer: "c",
          section: "Grammar"
        },
        {
          id: 25,
          question: "I am working on this project since last year.",
          options: [
            "I have worked on this project since last year.",
            "I have been working on this project since last year.",
            "I work on this project since last year.",
            "No improvement"
          ],
          correctAnswer: "b",
          section: "Grammar"
        },
        {
          id: 26,
          question: "The teacher asked us that why we were late.",
          options: [
            "The teacher asked us why we were late.",
            "The teacher asked us that why were we late.",
            "The teacher asked us that why we are late.",
            "No improvement"
          ],
          correctAnswer: "a",
          section: "Grammar"
        },
        {
          id: 27,
          question: "Each of the students have completed the assignment.",
          options: [
            "Each of the students have completed the assignment.",
            "Every student have completed the assignment.",
            "Each of the students has completed the assignment.",
            "Each student were completed the assignment."
          ],
          correctAnswer: "c",
          section: "Grammar"
        },
        {
          id: 28,
          question: "I look forward to meet you next week.",
          options: [
            "I look forward to meet you next week.",
            "I look forward to meeting you next week.",
            "I look forward for meeting you next week.",
            "No improvement"
          ],
          correctAnswer: "b",
          section: "Grammar"
        }
      ]
    }
  ]
};
