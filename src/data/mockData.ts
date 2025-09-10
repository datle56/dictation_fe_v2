import { Language, Category, Lesson, Challenge, LessonGroup, User, RankingUser } from '../types/types';

export const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
];

export const currentUser: User = {
  id: 'user1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  avatar: '😊',
  level: 12,
  xp: 2450,
  streak: 7,
  totalLessons: 45,
  totalWins: 23,
  token: 'mock-token-for-testing'
};

export const categories: Category[] = [
  {
    id: 'business',
    name: 'Business',
    icon: '💼',
    description: 'Professional vocabulary and phrases',
    lessonCount: 24
  },
  {
    id: 'daily-life',
    name: 'Daily Life',
    icon: '🏠',
    description: 'Everyday conversations and situations',
    lessonCount: 30
  },
  {
    id: 'travel',
    name: 'Travel',
    icon: '✈️',
    description: 'Travel-related vocabulary and phrases',
    lessonCount: 20
  },
  {
    id: 'toeic',
    name: 'TOEIC',
    icon: '📝',
    description: 'TOEIC test preparation',
    lessonCount: 40
  },
  {
    id: 'food',
    name: 'Food & Dining',
    icon: '🍽️',
    description: 'Restaurant and cooking vocabulary',
    lessonCount: 16
  },
  {
    id: 'technology',
    name: 'Technology',
    icon: '💻',
    description: 'Tech terms and digital communication',
    lessonCount: 28
  }
];

const sampleChallenges: Challenge[] = [
  {
    id: 'c1',
    type: 'listen-type',
    title: 'Listen and Type',
    content: 'Listen carefully and type what you hear.',
    correctAnswer: 'Hello, how are you today?'
  },
  {
    id: 'c2',
    type: 'fill-blanks',
    title: 'Fill in the Blanks',
    content: 'I would like to _____ a reservation for _____ people.',
    blanks: ['make', 'two'],
    correctAnswer: 'make,two'
  },
  {
    id: 'c3',
    type: 'multiple-choice',
    title: 'Multiple Choice',
    content: 'What does "entrepreneur" mean?',
    options: [
      'A person who works for a company',
      'A person who starts and runs a business',
      'A person who studies business',
      'A person who invests money'
    ],
    correctAnswer: 'A person who starts and runs a business'
  }
];

export const lessonGroups: LessonGroup[] = [
  {
    id: 'business-basics',
    name: 'Business Basics',
    lessons: [
      { id: 'b1', title: 'Business Meetings', difficulty: 'Medium', progress: 75, categoryId: 3, challenges: sampleChallenges },
      { id: 'b2', title: 'Email Communication', difficulty: 'Easy', progress: 100, categoryId: 3, challenges: sampleChallenges },
      { id: 'b3', title: 'Presentations', difficulty: 'Hard', progress: 30, categoryId: 3, challenges: sampleChallenges },
      { id: 'b4', title: 'Phone Calls', difficulty: 'Medium', progress: 0, categoryId: 3, challenges: sampleChallenges },
      { id: 'b5', title: 'Negotiations', difficulty: 'Hard', progress: 0, categoryId: 3, challenges: sampleChallenges }
    ]
  },
  {
    id: 'business-advanced',
    name: 'Advanced Business',
    lessons: [
      { id: 'b6', title: 'Financial Reports', difficulty: 'Hard', progress: 0, categoryId: 3, challenges: sampleChallenges },
      { id: 'b7', title: 'Strategic Planning', difficulty: 'Hard', progress: 0, categoryId: 3, challenges: sampleChallenges },
      { id: 'b8', title: 'Team Management', difficulty: 'Medium', progress: 0, categoryId: 3, challenges: sampleChallenges }
    ]
  },
  {
    id: 'daily-morning',
    name: 'Morning & Evening',
    lessons: [
      { id: 'd1', title: 'Morning Routine', difficulty: 'Easy', progress: 90, categoryId: 2, challenges: sampleChallenges },
      { id: 'd2', title: 'Breakfast Time', difficulty: 'Easy', progress: 80, categoryId: 2, challenges: sampleChallenges },
      { id: 'd3', title: 'Evening Activities', difficulty: 'Easy', progress: 60, categoryId: 2, challenges: sampleChallenges }
    ]
  },
  {
    id: 'daily-social',
    name: 'Social Activities',
    lessons: [
      { id: 'd4', title: 'Shopping', difficulty: 'Medium', progress: 60, categoryId: 2, challenges: sampleChallenges },
      { id: 'd5', title: 'At the Bank', difficulty: 'Medium', progress: 40, categoryId: 2, challenges: sampleChallenges },
      { id: 'd6', title: 'Making Friends', difficulty: 'Easy', progress: 100, categoryId: 2, challenges: sampleChallenges }
    ]
  }
];

export const lessons: Lesson[] = lessonGroups.flatMap(group => group.lessons);

export const rankingUsers: RankingUser[] = [
  { id: '1', name: 'Sarah Chen', avatar: '👩‍💼', score: 3250, rank: 1, change: 0 },
  { id: '2', name: 'Mike Johnson', avatar: '👨‍🎓', score: 3180, rank: 2, change: 1 },
  { id: '3', name: 'Emma Wilson', avatar: '👩‍🎨', score: 3120, rank: 3, change: -1 },
  { id: '4', name: 'David Kim', avatar: '👨‍💻', score: 2980, rank: 4, change: 2 },
  { id: '5', name: 'Lisa Zhang', avatar: '👩‍🔬', score: 2850, rank: 5, change: 0 },
  { id: '6', name: 'Alex Johnson', avatar: '😊', score: 2450, rank: 6, change: -2 },
  { id: '7', name: 'Tom Brown', avatar: '👨‍🏫', score: 2320, rank: 7, change: 1 },
  { id: '8', name: 'Anna Lee', avatar: '👩‍⚕️', score: 2180, rank: 8, change: -1 }
];
