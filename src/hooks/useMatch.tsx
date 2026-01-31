import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Match, Player } from '@/types/match';
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

  // Score controls
  const addScore = (team: 1 | 2, points: number = 1) => {
    if (!match) return;
    const key = team === 1 ? 'team1_score' : 'team2_score';
    const newScore = Math.max(0, match[key] + points);
    updateMatch({ [key]: newScore });
  };

  const subtractScore = (team: 1 | 2, points: number = 1) => {
    if (!match) return;
    const key = team === 1 ? 'team1_score' : 'team2_score';
    const newScore = Math.max(0, match[key] - points);
    updateMatch({ [key]: newScore });
  };

  // Cricket controls
  const addWicket = (team: 1 | 2) => {
    if (!match) return;
    const key = team === 1 ? 'team1_wickets' : 'team2_wickets';
    const newWickets = Math.min(10, match[key] + 1);
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
    const key = team === 1 ? 'team1_overs' : 'team2_overs';
    let currentOvers = match[key];
    const wholePart = Math.floor(currentOvers);
    const ballsPart = Math.round((currentOvers - wholePart) * 10);
    
    const newBalls = ballsPart + balls;
    if (newBalls >= 6) {
      currentOvers = wholePart + 1;
    } else {
      currentOvers = wholePart + newBalls / 10;
    }
    
    updateMatch({ [key]: currentOvers });
  };

  // Set controls (volleyball/badminton)
  const addSet = (team: 1 | 2) => {
    if (!match) return;
    const key = team === 1 ? 'team1_sets' : 'team2_sets';
    updateMatch({ 
      [key]: match[key] + 1,
      team1_score: 0,
      team2_score: 0,
      current_set: match.current_set + 1,
    });
  };

  // Period controls
  const nextPeriod = () => {
    if (!match) return;
    updateMatch({ current_period: match.current_period + 1 });
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
