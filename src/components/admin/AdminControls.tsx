import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Match, SPORT_CONFIG, getSetPointTarget, canWinSet, isInningsOver } from '@/types/match';
import { TimerDisplay } from '@/components/scoreboard/TimerDisplay';
import { StatusBadge } from '@/components/scoreboard/StatusBadge';
import { SportBadge } from '@/components/scoreboard/SportBadge';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Minus, 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee, 
  Flag,
  ChevronRight,
  AlertTriangle,
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

  // Check game state for sets-based sports
  const getSetStatus = (team: 1 | 2) => {
    const teamScore = team === 1 ? match.team1_score : match.team2_score;
    const opponentScore = team === 1 ? match.team2_score : match.team1_score;
    const targetPoints = getSetPointTarget(match.sport, match.current_set);
    
    if (canWinSet(match.sport, match.current_set, teamScore, opponentScore)) {
      return 'set-point';
    }
    
    if (teamScore >= targetPoints - 1 && opponentScore >= targetPoints - 1) {
      return 'deuce';
    }
    
    return null;
  };

  // Check if innings is over for cricket
  const team1InningsOver = match.sport === 'cricket' && 
    isInningsOver(match.sport, match.team1_wickets, match.team1_overs);
  const team2InningsOver = match.sport === 'cricket' && 
    isInningsOver(match.sport, match.team2_wickets, match.team2_overs);

  return (
    <div className="space-y-6">
      {/* Match Info */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <SportBadge sport={match.sport} />
          <StatusBadge status={match.status} />
        </div>
        <div className="flex items-center gap-2">
          {sportConfig.hasSets && (
            <Badge variant="outline" className="font-display">
              Target: {getSetPointTarget(match.sport, match.current_set)} pts
              {sportConfig.winByTwo && ' (win by 2)'}
            </Badge>
          )}
          {(sportConfig.hasPeriods || sportConfig.hasSets) && (
            <span className="font-display text-lg text-muted-foreground">
              {sportConfig.hasSets 
                ? sportConfig.periodNames[match.current_set - 1]
                : sportConfig.periodNames[match.current_period - 1]
              }
            </span>
          )}
        </div>
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
        <Card className={cn(
          "bg-card/50 border-border/50",
          team1InningsOver && "opacity-60"
        )}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle 
                className="text-xl font-display"
                style={{ color: match.team1_color }}
              >
                {match.team1_name}
              </CardTitle>
              {getSetStatus(1) === 'set-point' && (
                <Badge className="bg-sport-volleyball text-white animate-pulse">
                  SET POINT
                </Badge>
              )}
              {team1InningsOver && (
                <Badge variant="destructive" className="gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  INNINGS OVER
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Score */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Score</p>
              <div className="flex items-center justify-center gap-4">
                <Button 
                  onClick={() => onSubtractScore(1)}
                  className="score-btn score-btn-subtract"
                  disabled={team1InningsOver}
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
                  disabled={team1InningsOver}
                >
                  <Plus className="w-6 h-6" />
                </Button>
              </div>
              {/* Quick add buttons based on sport */}
              {sportConfig.pointsPerScore.length > 1 && (
                <div className="flex justify-center gap-2 mt-3">
                  {sportConfig.pointsPerScore.map((pts) => (
                    <Button 
                      key={pts} 
                      size="sm" 
                      variant="secondary" 
                      onClick={() => onAddScore(1, pts)}
                      disabled={team1InningsOver}
                    >
                      +{pts}
                    </Button>
                  ))}
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
                    <span className={cn(
                      "text-2xl font-display min-w-[60px]",
                      match.team1_wickets >= (sportConfig.maxWickets || 10) && "text-destructive"
                    )}>
                      {match.team1_wickets}/{sportConfig.maxWickets || 10}
                    </span>
                    <Button 
                      onClick={() => onAddWicket(1)}
                      variant="outline"
                      size="icon"
                      disabled={match.team1_wickets >= (sportConfig.maxWickets || 10)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Overs (max {sportConfig.maxOvers || 20})
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <span className={cn(
                      "text-2xl font-display",
                      match.team1_overs >= (sportConfig.maxOvers || 20) && "text-destructive"
                    )}>
                      {match.team1_overs.toFixed(1)}
                    </span>
                    <Button 
                      onClick={() => onAddOver(1)}
                      variant="secondary"
                      size="sm"
                      disabled={team1InningsOver}
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
                <p className="text-sm text-muted-foreground mb-2">
                  Sets Won (need {sportConfig.setsToWin} to win)
                </p>
                <div className="flex items-center justify-center gap-4">
                  <span className="text-2xl font-display">
                    {match.team1_sets}
                  </span>
                  <Button 
                    onClick={() => onAddSet(1)}
                    variant="secondary"
                    size="sm"
                    className="gap-1"
                    disabled={!canWinSet(match.sport, match.current_set, match.team1_score, match.team2_score)}
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
        <Card className={cn(
          "bg-card/50 border-border/50",
          team2InningsOver && "opacity-60"
        )}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle 
                className="text-xl font-display"
                style={{ color: match.team2_color }}
              >
                {match.team2_name}
              </CardTitle>
              {getSetStatus(2) === 'set-point' && (
                <Badge className="bg-sport-volleyball text-white animate-pulse">
                  SET POINT
                </Badge>
              )}
              {team2InningsOver && (
                <Badge variant="destructive" className="gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  INNINGS OVER
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Score */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Score</p>
              <div className="flex items-center justify-center gap-4">
                <Button 
                  onClick={() => onSubtractScore(2)}
                  className="score-btn score-btn-subtract"
                  disabled={team2InningsOver}
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
                  disabled={team2InningsOver}
                >
                  <Plus className="w-6 h-6" />
                </Button>
              </div>
              {sportConfig.pointsPerScore.length > 1 && (
                <div className="flex justify-center gap-2 mt-3">
                  {sportConfig.pointsPerScore.map((pts) => (
                    <Button 
                      key={pts} 
                      size="sm" 
                      variant="secondary" 
                      onClick={() => onAddScore(2, pts)}
                      disabled={team2InningsOver}
                    >
                      +{pts}
                    </Button>
                  ))}
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
                    <span className={cn(
                      "text-2xl font-display min-w-[60px]",
                      match.team2_wickets >= (sportConfig.maxWickets || 10) && "text-destructive"
                    )}>
                      {match.team2_wickets}/{sportConfig.maxWickets || 10}
                    </span>
                    <Button 
                      onClick={() => onAddWicket(2)}
                      variant="outline"
                      size="icon"
                      disabled={match.team2_wickets >= (sportConfig.maxWickets || 10)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Overs (max {sportConfig.maxOvers || 20})
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <span className={cn(
                      "text-2xl font-display",
                      match.team2_overs >= (sportConfig.maxOvers || 20) && "text-destructive"
                    )}>
                      {match.team2_overs.toFixed(1)}
                    </span>
                    <Button 
                      onClick={() => onAddOver(2)}
                      variant="secondary"
                      size="sm"
                      disabled={team2InningsOver}
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
                <p className="text-sm text-muted-foreground mb-2">
                  Sets Won (need {sportConfig.setsToWin} to win)
                </p>
                <div className="flex items-center justify-center gap-4">
                  <span className="text-2xl font-display">
                    {match.team2_sets}
                  </span>
                  <Button 
                    onClick={() => onAddSet(2)}
                    variant="secondary"
                    size="sm"
                    className="gap-1"
                    disabled={!canWinSet(match.sport, match.current_set, match.team2_score, match.team1_score)}
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
                {sportConfig.maxPeriods && ` (${match.current_period}/${sportConfig.maxPeriods})`}
              </span>
              <Button 
                onClick={onNextPeriod} 
                variant="secondary" 
                className="gap-2"
                disabled={match.current_period >= (sportConfig.maxPeriods || sportConfig.periodNames.length)}
              >
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
