export type SportType = 'volleyball' | 'basketball' | 'football' | 'badminton' | 'cricket';

export type MatchStatus = 'upcoming' | 'live' | 'halftime' | 'break' | 'finished';

export interface Player {
  id: string;
  name: string;
  number?: string;
  position?: string;
  photoUrl?: string;
}

export interface Match {
  id: string;
  sport: SportType;
  
  // Team 1
  team1_name: string;
  team1_color: string;
  team1_score: number;
  team1_players: Player[];
  
  // Team 2
  team2_name: string;
  team2_color: string;
  team2_score: number;
  team2_players: Player[];
  
  // Cricket specific
  team1_wickets: number;
  team2_wickets: number;
  team1_overs: number;
  team2_overs: number;
  current_batting_team: number;
  
  // Sets (volleyball/badminton)
  team1_sets: number;
  team2_sets: number;
  current_set: number;
  
  // Periods (basketball/football)
  current_period: number;
  
  // Timer
  timer_seconds: number;
  timer_running: boolean;
  timer_direction: 'up' | 'down';
  
  // Status
  status: MatchStatus;
  show_break_screen: boolean;
  break_message: string | null;
  
  // Access
  access_code: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export const SPORT_CONFIG: Record<SportType, {
  name: string;
  icon: string;
  hasTimer: boolean;
  timerDirection: 'up' | 'down';
  defaultTimerSeconds: number;
  hasSets: boolean;
  hasPeriods: boolean;
  periodNames: string[];
  hasWickets: boolean;
  hasOvers: boolean;
  maxScore?: number;
}> = {
  volleyball: {
    name: 'Volleyball',
    icon: '🏐',
    hasTimer: false,
    timerDirection: 'up',
    defaultTimerSeconds: 0,
    hasSets: true,
    hasPeriods: false,
    periodNames: ['Set 1', 'Set 2', 'Set 3', 'Set 4', 'Set 5'],
    hasWickets: false,
    hasOvers: false,
    maxScore: 25,
  },
  basketball: {
    name: 'Basketball',
    icon: '🏀',
    hasTimer: true,
    timerDirection: 'down',
    defaultTimerSeconds: 600, // 10 minutes
    hasSets: false,
    hasPeriods: true,
    periodNames: ['Q1', 'Q2', 'Q3', 'Q4', 'OT'],
    hasWickets: false,
    hasOvers: false,
  },
  football: {
    name: 'Football',
    icon: '⚽',
    hasTimer: true,
    timerDirection: 'up',
    defaultTimerSeconds: 0,
    hasSets: false,
    hasPeriods: true,
    periodNames: ['1st Half', '2nd Half', 'ET 1', 'ET 2'],
    hasWickets: false,
    hasOvers: false,
  },
  badminton: {
    name: 'Badminton',
    icon: '🏸',
    hasTimer: false,
    timerDirection: 'up',
    defaultTimerSeconds: 0,
    hasSets: true,
    hasPeriods: false,
    periodNames: ['Game 1', 'Game 2', 'Game 3'],
    hasWickets: false,
    hasOvers: false,
    maxScore: 21,
  },
  cricket: {
    name: 'Cricket',
    icon: '🏏',
    hasTimer: false,
    timerDirection: 'up',
    defaultTimerSeconds: 0,
    hasSets: false,
    hasPeriods: false,
    periodNames: ['1st Innings', '2nd Innings'],
    hasWickets: true,
    hasOvers: true,
  },
};
