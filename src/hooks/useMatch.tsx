import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Match, Player, SPORT_CONFIG, canWinSet, isMatchOver, isInningsOver } from '@/types/match';
import { useToast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

// Helper to convert JSON to Player array
const parsePlayersJson = (json: Json | null): Player[] => {
  if (!json) return [];
  if (Array.isArray(json)) {
    return json as unknown as Player[];
  }
  return [];
};

// Helper to convert Match from DB format
const parseMatch = (dbMatch: any): Match => ({
  ...dbMatch,
  team1_players: parsePlayersJson(dbMatch.team1_players),
  team2_players: parsePlayersJson(dbMatch.team2_players),
});

export function useMatch(matchId: string | null) {
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch match data
  const fetchMatch = useCallback(async () => {
    if (!matchId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .eq('id', matchId)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setMatch(parseMatch(data));
      } else {
        setError('Match not found');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!matchId) return;

    fetchMatch();

    const channel = supabase
      .channel(`match-${matchId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches',
          filter: `id=eq.${matchId}`,
        },
        (payload) => {
          if (payload.new && typeof payload.new === 'object') {
            setMatch(parseMatch(payload.new));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId, fetchMatch]);

  // Update match
  const updateMatch = async (updates: Partial<Match>) => {
    if (!matchId) return;

    try {
      // Convert Player arrays to Json compatible format
      const dbUpdates: Record<string, unknown> = { ...updates };
      if (updates.team1_players) {
        dbUpdates.team1_players = JSON.parse(JSON.stringify(updates.team1_players));
      }
      if (updates.team2_players) {
        dbUpdates.team2_players = JSON.parse(JSON.stringify(updates.team2_players));
      }

      const { error } = await supabase
        .from('matches')
        .update(dbUpdates)
        .eq('id', matchId);

      if (error) throw error;
    } catch (err: any) {
      toast({
        title: 'Error updating match',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  // Score controls with validation
  const addScore = (team: 1 | 2, points: number = 1) => {
    if (!match) return;
    
    const config = SPORT_CONFIG[match.sport];
    const scoreKey = team === 1 ? 'team1_score' : 'team2_score';
    const currentScore = match[scoreKey];
    const opponentScore = team === 1 ? match.team2_score : match.team1_score;
    
    // Validate points increment for the sport
    if (!config.pointsPerScore.includes(points)) {
      toast({
        title: 'Invalid points',
        description: `${config.name} allows ${config.pointsPerScore.join(', ')} point(s) per score`,
        variant: 'destructive',
      });
      return;
    }
    
    let newScore = currentScore + points;
    
    // Check for set/game completion in volleyball/badminton
    if (config.hasSets && config.maxPointsPerSet) {
      // For badminton, cap at 30
      if (config.maxPointsCap && newScore > config.maxPointsCap) {
        newScore = config.maxPointsCap;
      }
      
      // Check if this score wins the set
      if (canWinSet(match.sport, match.current_set, newScore, opponentScore)) {
        toast({
          title: `${team === 1 ? match.team1_name : match.team2_name} wins the set!`,
          description: `Score: ${newScore} - ${opponentScore}`,
        });
      }
    }
    
    // For cricket, check if innings is over
    if (match.sport === 'cricket') {
      const wickets = team === 1 ? match.team1_wickets : match.team2_wickets;
      const overs = team === 1 ? match.team1_overs : match.team2_overs;
      
      if (isInningsOver(match.sport, wickets, overs)) {
        toast({
          title: 'Innings over',
          description: 'Cannot add more runs - innings has ended',
          variant: 'destructive',
        });
        return;
      }
    }
    
    updateMatch({ [scoreKey]: newScore });
  };

  const subtractScore = (team: 1 | 2, points: number = 1) => {
    if (!match) return;
    const key = team === 1 ? 'team1_score' : 'team2_score';
    const newScore = Math.max(0, match[key] - points);
    updateMatch({ [key]: newScore });
  };

  // Cricket controls with validation
  const addWicket = (team: 1 | 2) => {
    if (!match) return;
    
    const config = SPORT_CONFIG[match.sport];
    const key = team === 1 ? 'team1_wickets' : 'team2_wickets';
    const maxWickets = config.maxWickets || 10;
    
    if (match[key] >= maxWickets) {
      toast({
        title: 'Maximum wickets reached',
        description: `Team is all out (${maxWickets} wickets)`,
        variant: 'destructive',
      });
      return;
    }
    
    const newWickets = match[key] + 1;
    
    // Check if team is all out
    if (newWickets >= maxWickets) {
      toast({
        title: `${team === 1 ? match.team1_name : match.team2_name} is ALL OUT!`,
        description: `${newWickets} wickets down`,
      });
    }
    
    updateMatch({ [key]: newWickets });
  };

  const subtractWicket = (team: 1 | 2) => {
    if (!match) return;
    const key = team === 1 ? 'team1_wickets' : 'team2_wickets';
    const newWickets = Math.max(0, match[key] - 1);
    updateMatch({ [key]: newWickets });
  };

  const addOver = (team: 1 | 2, balls: number = 1) => {
    if (!match) return;
    
    const config = SPORT_CONFIG[match.sport];
    const key = team === 1 ? 'team1_overs' : 'team2_overs';
    const wicketKey = team === 1 ? 'team1_wickets' : 'team2_wickets';
    let currentOvers = match[key];
    const maxOvers = config.maxOvers || 20;
    
    // Check if team is all out
    if (match[wicketKey] >= (config.maxWickets || 10)) {
      toast({
        title: 'Team is all out',
        description: 'Cannot add more balls',
        variant: 'destructive',
      });
      return;
    }
    
    const wholePart = Math.floor(currentOvers);
    const ballsPart = Math.round((currentOvers - wholePart) * 10);
    
    const newBalls = ballsPart + balls;
    let newOvers: number;
    
    if (newBalls >= 6) {
      newOvers = wholePart + 1;
    } else {
      newOvers = wholePart + newBalls / 10;
    }
    
    // Check max overs
    if (newOvers > maxOvers) {
      toast({
        title: 'Maximum overs reached',
        description: `Innings limited to ${maxOvers} overs`,
        variant: 'destructive',
      });
      return;
    }
    
    // Check if innings is complete
    if (newOvers >= maxOvers) {
      toast({
        title: 'Innings complete',
        description: `${maxOvers} overs bowled`,
      });
    }
    
    updateMatch({ [key]: newOvers });
  };

  // Set controls (volleyball/badminton) with validation
  const addSet = (team: 1 | 2) => {
    if (!match) return;
    
    const config = SPORT_CONFIG[match.sport];
    const setsKey = team === 1 ? 'team1_sets' : 'team2_sets';
    const opponentSetsKey = team === 1 ? 'team2_sets' : 'team1_sets';
    const teamScore = team === 1 ? match.team1_score : match.team2_score;
    const opponentScore = team === 1 ? match.team2_score : match.team1_score;
    
    // Validate set win conditions
    if (!canWinSet(match.sport, match.current_set, teamScore, opponentScore)) {
      const targetPoints = match.sport === 'volleyball' && match.current_set === 5 
        ? config.finalSetPoints 
        : config.maxPointsPerSet;
      
      let message = `Need ${targetPoints} points to win`;
      if (config.winByTwo) {
        message += ' (win by 2)';
      }
      
      toast({
        title: 'Cannot win set yet',
        description: message,
        variant: 'destructive',
      });
      return;
    }
    
    const newSets = match[setsKey] + 1;
    const newSetNumber = match.current_set + 1;
    
    // Check if match is won
    if (newSets >= (config.setsToWin || 3)) {
      toast({
        title: `🏆 ${team === 1 ? match.team1_name : match.team2_name} WINS THE MATCH!`,
        description: `Final: ${newSets} - ${match[opponentSetsKey]}`,
      });
      
      updateMatch({ 
        [setsKey]: newSets,
        team1_score: 0,
        team2_score: 0,
        status: 'finished',
      });
      return;
    }
    
    // Check if max sets reached (shouldn't happen but safety check)
    if (newSetNumber > (config.maxSets || 5)) {
      return;
    }
    
    updateMatch({ 
      [setsKey]: newSets,
      team1_score: 0,
      team2_score: 0,
      current_set: newSetNumber,
    });
  };

  // Period controls with validation
  const nextPeriod = () => {
    if (!match) return;
    
    const config = SPORT_CONFIG[match.sport];
    const maxPeriods = config.maxPeriods || config.periodNames.length;
    
    if (match.current_period >= maxPeriods) {
      toast({
        title: 'Maximum periods reached',
        description: 'Cannot advance further',
        variant: 'destructive',
      });
      return;
    }
    
    const newPeriod = match.current_period + 1;
    
    // Reset timer for new period if applicable
    const updates: Partial<Match> = { 
      current_period: newPeriod,
    };
    
    if (config.hasTimer) {
      updates.timer_seconds = config.defaultTimerSeconds;
      updates.timer_running = false;
    }
    
    updateMatch(updates);
  };

  // Timer controls
  const startTimer = () => updateMatch({ timer_running: true });
  const stopTimer = () => updateMatch({ timer_running: false });
  const resetTimer = (seconds: number = 0) => updateMatch({ timer_seconds: seconds, timer_running: false });
  const setTimer = (seconds: number) => updateMatch({ timer_seconds: seconds });

  // Status controls
  const setStatus = (status: Match['status']) => updateMatch({ status });
  const toggleBreak = (show: boolean, message?: string) => {
    updateMatch({ 
      show_break_screen: show,
      break_message: message || null,
      status: show ? 'break' : 'live',
    });
  };

  return {
    match,
    loading,
    error,
    updateMatch,
    addScore,
    subtractScore,
    addWicket,
    subtractWicket,
    addOver,
    addSet,
    nextPeriod,
    startTimer,
    stopTimer,
    resetTimer,
    setTimer,
    setStatus,
    toggleBreak,
  };
}
