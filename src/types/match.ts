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

export interface SportConfig {
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
  // Scoring rules
  pointsPerScore: number[];      // Valid point increments (e.g., [1] for football, [1,2,3] for basketball)
  maxPointsPerSet?: number;      // Points needed to win a set (volleyball/badminton)
  winByTwo?: boolean;            // Must win by 2 points (volleyball/badminton)
  maxPointsCap?: number;         // Absolute max points (badminton caps at 30)
  setsToWin?: number;            // Sets needed to win match
  maxSets?: number;              // Maximum possible sets
  finalSetPoints?: number;       // Points in final set (volleyball set 5 is to 15)
  maxPeriods?: number;           // Maximum periods including overtime
  maxWickets?: number;           // Cricket max wickets (10)
  maxOvers?: number;             // Cricket max overs (20 for T20)
  runsPerScore?: number[];       // Cricket run options [1,2,3,4,6]
}

export const SPORT_CONFIG: Record<SportType, SportConfig> = {
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
    // Rules: Best of 5 sets, first to 25 (15 in set 5), win by 2
    pointsPerScore: [1],
    maxPointsPerSet: 25,
    finalSetPoints: 15,
    winByTwo: true,
    setsToWin: 3,
    maxSets: 5,
  },
  basketball: {
    name: 'Basketball',
    icon: '🏀',
    hasTimer: true,
    timerDirection: 'down',
    defaultTimerSeconds: 600, // 10 minutes per quarter
    hasSets: false,
    hasPeriods: true,
    periodNames: ['Q1', 'Q2', 'Q3', 'Q4', 'OT1', 'OT2', 'OT3'],
    hasWickets: false,
    hasOvers: false,
    // Rules: Score 1 (free throw), 2 (inside), or 3 (three-pointer)
    pointsPerScore: [1, 2, 3],
    maxPeriods: 7, // 4 quarters + 3 possible overtimes
  },
  football: {
    name: 'Football',
    icon: '⚽',
    hasTimer: true,
    timerDirection: 'up',
    defaultTimerSeconds: 0,
    hasSets: false,
    hasPeriods: true,
    periodNames: ['1st Half', '2nd Half', 'ET 1', 'ET 2', 'Penalties'],
    hasWickets: false,
    hasOvers: false,
    // Rules: 1 point per goal
    pointsPerScore: [1],
    maxPeriods: 5, // 2 halves + 2 extra time + penalties
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
    // Rules: Best of 3 games, first to 21, win by 2, capped at 30
    pointsPerScore: [1],
    maxPointsPerSet: 21,
    winByTwo: true,
    maxPointsCap: 30,
    setsToWin: 2,
    maxSets: 3,
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
    // Rules: 10 wickets, runs can be 1,2,3,4,6
    pointsPerScore: [1, 2, 3, 4, 6],
    runsPerScore: [1, 2, 3, 4, 6],
    maxWickets: 10,
    maxOvers: 20, // T20 format (can be changed)
  },
};

// Helper functions for game logic
export function canWinSet(
  sport: SportType,
  currentSet: number,
  teamScore: number,
  opponentScore: number
): boolean {
  const config = SPORT_CONFIG[sport];
  
  if (!config.hasSets) return false;
  
  const targetPoints = (sport === 'volleyball' && currentSet === 5) 
    ? config.finalSetPoints! 
    : config.maxPointsPerSet!;
  
  // Must reach target points
  if (teamScore < targetPoints) return false;
  
  // Must win by 2 (if applicable)
  if (config.winByTwo && teamScore - opponentScore < 2) return false;
  
  // Check cap for badminton
  if (config.maxPointsCap && teamScore >= config.maxPointsCap) {
    return teamScore > opponentScore;
  }
  
  return true;
}

export function isMatchOver(
  sport: SportType,
  team1Sets: number,
  team2Sets: number
): boolean {
  const config = SPORT_CONFIG[sport];
  
  if (!config.setsToWin) return false;
  
  return team1Sets >= config.setsToWin || team2Sets >= config.setsToWin;
}

export function getSetPointTarget(sport: SportType, currentSet: number): number {
  const config = SPORT_CONFIG[sport];
  
  if (sport === 'volleyball' && currentSet === 5) {
    return config.finalSetPoints || 15;
  }
  
  return config.maxPointsPerSet || 25;
}

export function isInningsOver(
  sport: SportType,
  wickets: number,
  overs: number
): boolean {
  if (sport !== 'cricket') return false;
  
  const config = SPORT_CONFIG[sport];
  
  // All out or overs complete
  return wickets >= (config.maxWickets || 10) || overs >= (config.maxOvers || 20);
}
