import { motion } from 'framer-motion';
import { Player, SportType, SPORT_CONFIG } from '@/types/match';
import { User } from 'lucide-react';
import { ScoreDisplay } from './ScoreDisplay';
import { TimerDisplay } from './TimerDisplay';

interface BreakScreenProps {
  message?: string;
  sport: SportType;
  team1Name: string;
  team2Name: string;
  team1Score: number;
  team2Score: number;
  team1Wickets: number;
  team2Wickets: number;
  team1Overs: number;
  team2Overs: number;
  team1Sets: number;
  team2Sets: number;
  currentBattingTeam: number;
  timerSeconds: number;
  timerRunning: boolean;
  periodLabel?: string;
  team1Players: Player[];
  team2Players: Player[];
  team1Color: string;
  team2Color: string;
}

export function BreakScreen({
  message = 'BREAK',
  sport,
  team1Name,
  team2Name,
  team1Score,
  team2Score,
  team1Wickets,
  team2Wickets,
  team1Overs,
  team2Overs,
  team1Sets,
  team2Sets,
  currentBattingTeam,
  timerSeconds,
  timerRunning,
  periodLabel,
  team1Players,
  team2Players,
  team1Color,
  team2Color,
}: BreakScreenProps) {
  const sportConfig = SPORT_CONFIG[sport];
  const maxWickets = sportConfig.maxWickets ?? 10;

  return (
    <motion.div 
      className="break-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Break message */}
        <motion.h1 
          className="text-5xl md:text-7xl font-display font-black text-center text-white mb-8 md:mb-10"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {message}
        </motion.h1>

        {/* Live / paused score + clock */}
        <motion.div
          className="max-w-5xl mx-auto mb-10 md:mb-14"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.28 }}
        >
          {periodLabel && (
            <p className="text-center font-display text-xl md:text-2xl text-white/75 mb-6">
              {periodLabel}
            </p>
          )}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-10 lg:gap-14">
            <div className="flex flex-col items-center text-center">
              <h3
                className="font-display text-2xl md:text-3xl font-bold mb-2"
                style={{ color: team1Color }}
              >
                {team1Name}
              </h3>
              <ScoreDisplay score={team1Score} teamColor={team1Color} size="lg" />
              {sportConfig.hasWickets && (
                <p className="mt-3 font-display text-lg text-white/85">
                  {team1Wickets}/{maxWickets} wkts · {team1Overs.toFixed(1)} ov
                </p>
              )}
              {sportConfig.hasSets && (
                <p className="mt-2 font-display text-xl text-white/85">Sets {team1Sets}</p>
              )}
            </div>
            <span className="text-3xl md:text-5xl font-display font-bold text-white/35 select-none">
              VS
            </span>
            <div className="flex flex-col items-center text-center">
              <h3
                className="font-display text-2xl md:text-3xl font-bold mb-2"
                style={{ color: team2Color }}
              >
                {team2Name}
              </h3>
              <ScoreDisplay score={team2Score} teamColor={team2Color} size="lg" />
              {sportConfig.hasWickets && (
                <p className="mt-3 font-display text-lg text-white/85">
                  {team2Wickets}/{maxWickets} wkts · {team2Overs.toFixed(1)} ov
                </p>
              )}
              {sportConfig.hasSets && (
                <p className="mt-2 font-display text-xl text-white/85">Sets {team2Sets}</p>
              )}
            </div>
          </div>
          {sportConfig.hasTimer && (
            <div className="mt-8 flex flex-col items-center gap-2">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50 font-display">
                {timerRunning ? 'Clock (live)' : 'Clock (paused)'}
              </p>
              <TimerDisplay
                seconds={timerSeconds}
                running={timerRunning}
                size="lg"
              />
            </div>
          )}
          {sportConfig.hasWickets && (
            <p className="text-center mt-6 font-display text-lg text-white/70">
              Batting: {currentBattingTeam === 1 ? team1Name : team2Name}
            </p>
          )}
        </motion.div>

        {/* Players showcase */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Team 1 */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="grid gap-3">
              {team1Players.map((player, index) => (
                <motion.div
                  key={player.id}
                  className="player-card flex items-center gap-4"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  {player.photoUrl ? (
                    <img 
                      src={player.photoUrl} 
                      alt={player.name}
                      className="w-12 h-12 rounded-full object-cover border-2"
                      style={{ borderColor: team1Color }}
                    />
                  ) : (
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: team1Color }}
                    >
                      <User className="w-6 h-6 text-background" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-foreground">{player.name}</p>
                    {player.number && (
                      <p className="text-sm text-muted-foreground">#{player.number}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Team 2 */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="grid gap-3">
              {team2Players.map((player, index) => (
                <motion.div
                  key={player.id}
                  className="player-card flex items-center gap-4"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  {player.photoUrl ? (
                    <img 
                      src={player.photoUrl} 
                      alt={player.name}
                      className="w-12 h-12 rounded-full object-cover border-2"
                      style={{ borderColor: team2Color }}
                    />
                  ) : (
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: team2Color }}
                    >
                      <User className="w-6 h-6 text-background" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-foreground">{player.name}</p>
                    {player.number && (
                      <p className="text-sm text-muted-foreground">#{player.number}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
