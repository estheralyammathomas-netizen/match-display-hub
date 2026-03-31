import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Match, SPORT_CONFIG } from '@/types/match';
import { TeamCard } from './TeamCard';
import { TimerDisplay } from './TimerDisplay';
import { StatusBadge } from './StatusBadge';
import { SportBadge } from './SportBadge';
import { BreakScreen } from './BreakScreen';

interface PublicScoreboardProps {
  match: Match;
}

export function PublicScoreboard({ match }: PublicScoreboardProps) {
  const [timerSeconds, setTimerSeconds] = useState(match.timer_seconds);
  const sportConfig = SPORT_CONFIG[match.sport];

  // Handle local timer
  useEffect(() => {
    setTimerSeconds(match.timer_seconds);
  }, [match.timer_seconds]);

  useEffect(() => {
    if (!match.timer_running) return;

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (match.timer_direction === 'down') {
          return Math.max(0, prev - 1);
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [match.timer_running, match.timer_direction]);

  return (
    <div className="stadium-bg relative overflow-hidden">
      {/* Background glow effects */}
      <div 
        className="absolute top-0 left-0 w-1/2 h-full opacity-10 pointer-events-none"
        style={{ 
          background: `radial-gradient(circle at 30% 30%, ${match.team1_color}40 0%, transparent 50%)` 
        }}
      />
      <div 
        className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none"
        style={{ 
          background: `radial-gradient(circle at 70% 30%, ${match.team2_color}40 0%, transparent 50%)` 
        }}
      />

      {/* Break screen overlay */}
      <AnimatePresence>
        {match.show_break_screen && (
          <BreakScreen
            message={match.break_message || 'BREAK'}
            sport={match.sport}
            team1Name={match.team1_name}
            team2Name={match.team2_name}
            team1Score={match.team1_score}
            team2Score={match.team2_score}
            team1Wickets={match.team1_wickets}
            team2Wickets={match.team2_wickets}
            team1Overs={match.team1_overs}
            team2Overs={match.team2_overs}
            team1Sets={match.team1_sets}
            team2Sets={match.team2_sets}
            currentBattingTeam={match.current_batting_team}
            timerSeconds={timerSeconds}
            timerRunning={match.timer_running}
            periodLabel={
              sportConfig.hasSets || sportConfig.hasPeriods
                ? sportConfig.hasSets
                  ? sportConfig.periodNames[match.current_set - 1]
                  : sportConfig.periodNames[match.current_period - 1]
                : undefined
            }
            team1Players={match.team1_players}
            team2Players={match.team2_players}
            team1Color={match.team1_color}
            team2Color={match.team2_color}
          />
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <SportBadge sport={match.sport} />
          <StatusBadge status={match.status} />
        </div>

        {/* Period/Set indicator */}
        {(sportConfig.hasPeriods || sportConfig.hasSets) && (
          <div className="text-center mb-4">
            <span className="font-display text-2xl text-muted-foreground">
              {sportConfig.hasSets 
                ? sportConfig.periodNames[match.current_set - 1]
                : sportConfig.periodNames[match.current_period - 1]
              }
            </span>
          </div>
        )}

        {/* Timer */}
        {sportConfig.hasTimer && (
          <div className="text-center mb-8">
            <TimerDisplay 
              seconds={timerSeconds} 
              running={match.timer_running}
              size="lg"
            />
          </div>
        )}

        {/* Scores */}
        <div className="flex-1 flex items-center justify-center">
          <div className="grid md:grid-cols-3 gap-8 items-center w-full max-w-6xl">
            {/* Team 1 */}
            <TeamCard
              name={match.team1_name}
              color={match.team1_color}
              score={match.team1_score}
              players={match.team1_players}
              sport={match.sport}
              wickets={match.team1_wickets}
              overs={match.team1_overs}
              sets={match.team1_sets}
              isHome
            />

            {/* VS divider */}
            <div className="hidden md:flex flex-col items-center justify-center">
              <span className="text-4xl font-display font-bold text-muted-foreground">
                VS
              </span>
            </div>

            {/* Team 2 */}
            <TeamCard
              name={match.team2_name}
              color={match.team2_color}
              score={match.team2_score}
              players={match.team2_players}
              sport={match.sport}
              wickets={match.team2_wickets}
              overs={match.team2_overs}
              sets={match.team2_sets}
              isHome={false}
            />
          </div>
        </div>

        {/* Cricket batting indicator */}
        {sportConfig.hasWickets && (
          <div className="text-center mt-8">
            <span className="font-display text-xl text-muted-foreground">
              Batting: {match.current_batting_team === 1 ? match.team1_name : match.team2_name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
