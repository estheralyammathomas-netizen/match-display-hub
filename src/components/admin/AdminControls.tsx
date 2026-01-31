import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Match, SPORT_CONFIG } from '@/types/match';
import { TimerDisplay } from '@/components/scoreboard/TimerDisplay';
import { StatusBadge } from '@/components/scoreboard/StatusBadge';
import { SportBadge } from '@/components/scoreboard/SportBadge';
import { 
  Plus, 
  Minus, 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee, 
  Flag,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminControlsProps {
  match: Match;
  onAddScore: (team: 1 | 2, points?: number) => void;
  onSubtractScore: (team: 1 | 2, points?: number) => void;
  onAddWicket: (team: 1 | 2) => void;
  onSubtractWicket: (team: 1 | 2) => void;
  onAddOver: (team: 1 | 2, balls?: number) => void;
  onAddSet: (team: 1 | 2) => void;
  onNextPeriod: () => void;
  onStartTimer: () => void;
  onStopTimer: () => void;
  onResetTimer: (seconds?: number) => void;
  onSetTimer: (seconds: number) => void;
  onSetStatus: (status: Match['status']) => void;
  onToggleBreak: (show: boolean, message?: string) => void;
  onUpdateMatch: (updates: Partial<Match>) => void;
}

export function AdminControls({
  match,
  onAddScore,
  onSubtractScore,
  onAddWicket,
  onSubtractWicket,
  onAddOver,
  onAddSet,
  onNextPeriod,
  onStartTimer,
  onStopTimer,
  onResetTimer,
  onSetTimer,
  onSetStatus,
  onToggleBreak,
  onUpdateMatch,
}: AdminControlsProps) {
  const sportConfig = SPORT_CONFIG[match.sport];
  const [breakMessage, setBreakMessage] = useState('HALF TIME');
  const [timerSeconds, setTimerSeconds] = useState(match.timer_seconds);
  const [timerInput, setTimerInput] = useState('');

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

  const handleSetTimer = () => {
    const parts = timerInput.split(':');
    let seconds = 0;
    if (parts.length === 2) {
      seconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
    } else {
      seconds = parseInt(timerInput) || 0;
    }
    onSetTimer(seconds);
    setTimerInput('');
  };

  return (
    <div className="space-y-6">
      {/* Match Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SportBadge sport={match.sport} />
          <StatusBadge status={match.status} />
        </div>
        {(sportConfig.hasPeriods || sportConfig.hasSets) && (
          <span className="font-display text-lg text-muted-foreground">
            {sportConfig.hasSets 
              ? sportConfig.periodNames[match.current_set - 1]
              : sportConfig.periodNames[match.current_period - 1]
            }
          </span>
        )}
      </div>

      {/* Timer Controls */}
      {sportConfig.hasTimer && (
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-display">Timer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center">
              <TimerDisplay 
                seconds={timerSeconds} 
                running={match.timer_running}
                size="lg"
              />
            </div>
            <div className="flex items-center justify-center gap-3">
              {match.timer_running ? (
                <Button 
                  onClick={onStopTimer}
                  variant="destructive"
                  size="lg"
                  className="gap-2"
                >
                  <Pause className="w-5 h-5" />
                  Stop
                </Button>
              ) : (
                <Button 
                  onClick={onStartTimer}
                  className="gap-2 bg-timer-active hover:bg-timer-active/90"
                  size="lg"
                >
                  <Play className="w-5 h-5" />
                  Start
                </Button>
              )}
              <Button 
                onClick={() => onResetTimer(sportConfig.defaultTimerSeconds)}
                variant="outline"
                size="lg"
                className="gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="MM:SS or seconds"
                value={timerInput}
                onChange={(e) => setTimerInput(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSetTimer} variant="secondary">
                Set
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Score Controls */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Team 1 */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle 
              className="text-xl font-display"
              style={{ color: match.team1_color }}
            >
              {match.team1_name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Score */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Score</p>
              <div className="flex items-center justify-center gap-4">
                <Button 
                  onClick={() => onSubtractScore(1)}
                  className="score-btn score-btn-subtract"
                >
                  <Minus className="w-6 h-6" />
                </Button>
                <span 
                  className="text-5xl font-display font-bold min-w-[80px]"
                  style={{ color: match.team1_color }}
                >
                  {match.team1_score}
                </span>
                <Button 
                  onClick={() => onAddScore(1)}
                  className="score-btn score-btn-add"
                >
                  <Plus className="w-6 h-6" />
                </Button>
              </div>
              {/* Quick add buttons for basketball */}
              {match.sport === 'basketball' && (
                <div className="flex justify-center gap-2 mt-3">
                  <Button size="sm" variant="secondary" onClick={() => onAddScore(1, 2)}>
                    +2
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => onAddScore(1, 3)}>
                    +3
                  </Button>
                </div>
              )}
            </div>

            {/* Cricket controls */}
            {sportConfig.hasWickets && (
              <>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Wickets</p>
                  <div className="flex items-center justify-center gap-4">
                    <Button 
                      onClick={() => onSubtractWicket(1)}
                      variant="outline"
                      size="icon"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="text-2xl font-display min-w-[60px]">
                      {match.team1_wickets}/10
                    </span>
                    <Button 
                      onClick={() => onAddWicket(1)}
                      variant="outline"
                      size="icon"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Overs</p>
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-2xl font-display">
                      {match.team1_overs.toFixed(1)}
                    </span>
                    <Button 
                      onClick={() => onAddOver(1)}
                      variant="secondary"
                      size="sm"
                    >
                      +1 Ball
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Sets controls */}
            {sportConfig.hasSets && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Sets Won</p>
                <div className="flex items-center justify-center gap-4">
                  <span className="text-2xl font-display">
                    {match.team1_sets}
                  </span>
                  <Button 
                    onClick={() => onAddSet(1)}
                    variant="secondary"
                    size="sm"
                    className="gap-1"
                  >
                    <Flag className="w-4 h-4" />
                    Win Set
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Team 2 */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle 
              className="text-xl font-display"
              style={{ color: match.team2_color }}
            >
              {match.team2_name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Score */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Score</p>
              <div className="flex items-center justify-center gap-4">
                <Button 
                  onClick={() => onSubtractScore(2)}
                  className="score-btn score-btn-subtract"
                >
                  <Minus className="w-6 h-6" />
                </Button>
                <span 
                  className="text-5xl font-display font-bold min-w-[80px]"
                  style={{ color: match.team2_color }}
                >
                  {match.team2_score}
                </span>
                <Button 
                  onClick={() => onAddScore(2)}
                  className="score-btn score-btn-add"
                >
                  <Plus className="w-6 h-6" />
                </Button>
              </div>
              {match.sport === 'basketball' && (
                <div className="flex justify-center gap-2 mt-3">
                  <Button size="sm" variant="secondary" onClick={() => onAddScore(2, 2)}>
                    +2
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => onAddScore(2, 3)}>
                    +3
                  </Button>
                </div>
              )}
            </div>

            {/* Cricket controls */}
            {sportConfig.hasWickets && (
              <>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Wickets</p>
                  <div className="flex items-center justify-center gap-4">
                    <Button 
                      onClick={() => onSubtractWicket(2)}
                      variant="outline"
                      size="icon"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="text-2xl font-display min-w-[60px]">
                      {match.team2_wickets}/10
                    </span>
                    <Button 
                      onClick={() => onAddWicket(2)}
                      variant="outline"
                      size="icon"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Overs</p>
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-2xl font-display">
                      {match.team2_overs.toFixed(1)}
                    </span>
                    <Button 
                      onClick={() => onAddOver(2)}
                      variant="secondary"
                      size="sm"
                    >
                      +1 Ball
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Sets controls */}
            {sportConfig.hasSets && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Sets Won</p>
                <div className="flex items-center justify-center gap-4">
                  <span className="text-2xl font-display">
                    {match.team2_sets}
                  </span>
                  <Button 
                    onClick={() => onAddSet(2)}
                    variant="secondary"
                    size="sm"
                    className="gap-1"
                  >
                    <Flag className="w-4 h-4" />
                    Win Set
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Period/Match Controls */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-display">Match Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Period controls */}
          {sportConfig.hasPeriods && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Current: {sportConfig.periodNames[match.current_period - 1]}
              </span>
              <Button onClick={onNextPeriod} variant="secondary" className="gap-2">
                Next Period
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Cricket batting toggle */}
          {sportConfig.hasWickets && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Batting: {match.current_batting_team === 1 ? match.team1_name : match.team2_name}
              </span>
              <Button 
                onClick={() => onUpdateMatch({ 
                  current_batting_team: match.current_batting_team === 1 ? 2 : 1 
                })}
                variant="secondary"
              >
                Switch Batting
              </Button>
            </div>
          )}

          {/* Status controls */}
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => onSetStatus('live')}
              variant={match.status === 'live' ? 'default' : 'outline'}
              className={cn(match.status === 'live' && 'bg-destructive hover:bg-destructive/90')}
            >
              Go Live
            </Button>
            <Button 
              onClick={() => onSetStatus('halftime')}
              variant={match.status === 'halftime' ? 'default' : 'outline'}
            >
              Half Time
            </Button>
            <Button 
              onClick={() => onSetStatus('finished')}
              variant={match.status === 'finished' ? 'default' : 'outline'}
            >
              End Match
            </Button>
          </div>

          {/* Break screen */}
          <div className="border-t border-border pt-4 mt-4">
            <p className="text-sm text-muted-foreground mb-3">Break Screen</p>
            <div className="flex gap-2">
              <Input
                placeholder="Break message..."
                value={breakMessage}
                onChange={(e) => setBreakMessage(e.target.value)}
                className="flex-1"
              />
              {match.show_break_screen ? (
                <Button 
                  onClick={() => onToggleBreak(false)}
                  variant="destructive"
                >
                  Hide Break
                </Button>
              ) : (
                <Button 
                  onClick={() => onToggleBreak(true, breakMessage)}
                  className="gap-2"
                >
                  <Coffee className="w-4 h-4" />
                  Show Break
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
