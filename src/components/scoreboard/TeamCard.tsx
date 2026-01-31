import { cn } from '@/lib/utils';
import { ScoreDisplay } from './ScoreDisplay';
import { Player, SportType, SPORT_CONFIG } from '@/types/match';

interface TeamCardProps {
  name: string;
  color: string;
  score: number;
  players?: Player[];
  sport: SportType;
  wickets?: number;
  overs?: number;
  sets?: number;
  isHome?: boolean;
  className?: string;
}

export function TeamCard({
  name,
  color,
  score,
  players = [],
  sport,
  wickets,
  overs,
  sets,
  isHome = true,
  className,
}: TeamCardProps) {
  const sportConfig = SPORT_CONFIG[sport];

  return (
    <div 
      className={cn(
        'score-card rounded-2xl p-6 md:p-8 flex flex-col items-center',
        className
      )}
    >
      {/* Team name */}
      <h2 
        className="text-2xl md:text-3xl font-display font-bold mb-4 tracking-wide text-center"
        style={{ color }}
      >
        {name}
      </h2>

      {/* Score */}
      <ScoreDisplay score={score} teamColor={color} size="lg" />

      {/* Cricket specific stats */}
      {sportConfig.hasWickets && (
        <div className="flex items-center gap-4 mt-4 text-muted-foreground">
          <span className="font-display text-xl">
            {wickets}/10 Wickets
          </span>
          <span className="text-border">•</span>
          <span className="font-display text-xl">
            {overs?.toFixed(1)} Overs
          </span>
        </div>
      )}

      {/* Sets display */}
      {sportConfig.hasSets && sets !== undefined && (
        <div className="mt-4 text-muted-foreground font-display text-xl">
          Sets: {sets}
        </div>
      )}
    </div>
  );
}
