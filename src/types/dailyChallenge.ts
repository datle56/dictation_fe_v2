export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  type: 'speed' | 'accuracy' | 'endurance' | 'mixed';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xpReward: number;
  timeLimit: number; // in minutes
  completed: boolean;
  locked: boolean;
  unlockCondition?: string;
  score?: number;
  completedAt?: string;
  lessonId?: number;
  categoryId?: number;
}

export interface DailyChallengeStats {
  totalXP: number;
  todayXP: number;
  globalRank: number;
  rankChange: number;
  challengesCompleted: number;
  averageScore: number;
  bestScore: number;
  totalTimeSpent: number; // in seconds
}

export interface ChallengeStreak {
  currentStreak: number;
  longestStreak: number;
  last7Days: boolean[]; // true if completed, false if not
  totalChallengesCompleted: number;
  streakStartDate: string;
  nextMilestone: number;
}

export interface DailyChallengeLeaderboard {
  id: string;
  name: string;
  avatar: string;
  score: number;
  rank: number;
  rankChange: number;
  streak: number;
  challengesCompleted: number;
  isCurrentUser: boolean;
}

export interface DailyChallengeHistory {
  date: string;
  challenges: {
    title: string;
    score: number;
    timeSpent: number; // in seconds
    xpEarned: number;
  }[];
  totalXP: number;
  streakDay?: number;
}

export interface ChallengeReward {
  id: string;
  title: string;
  description: string;
  requirement: string;
  xpReward: number;
  badgeIcon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface DailyChallengeSession {
  challengeId: string;
  startTime: Date;
  endTime?: Date;
  score?: number;
  completed: boolean;
  answers: {
    questionId: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    timeSpent: number;
  }[];
}