import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Match, SPORT_CONFIG } from '@/types/match';
import { SportBadge } from '@/components/scoreboard/SportBadge';
import { StatusBadge } from '@/components/scoreboard/StatusBadge';
import { Plus, LogOut, ExternalLink, Settings } from 'lucide-react';
import { Json } from '@/integrations/supabase/types';
import { Player } from '@/types/match';

// Helper to convert JSON to Player array
const parsePlayersJson = (json: Json | null): Player[] => {
  if (!json) return [];
  if (Array.isArray(json)) {
    return json as unknown as Player[];
  }
  return [];
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchMatches = async () => {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (data) {
        const parsed = data.map((m) => ({
          ...m,
          team1_players: parsePlayersJson(m.team1_players),
          team2_players: parsePlayersJson(m.team2_players),
        })) as Match[];
        setMatches(parsed);
      }
      setLoading(false);
    };

    fetchMatches();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading || !user) {
    return (
      <div className="stadium-bg min-h-screen flex items-center justify-center">
        <div className="text-xl font-display text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="stadium-bg min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">Manage your matches</p>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild>
              <Link to="/admin/create">
                <Plus className="w-4 h-4 mr-2" />
                New Match
              </Link>
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Matches list */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">Loading matches...</div>
          </div>
        ) : matches.length === 0 ? (
          <Card className="bg-card/50 border-border/50">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                You haven't created any matches yet
              </p>
              <Button asChild>
                <Link to="/admin/create">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Match
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {matches.map((match) => (
              <Card 
                key={match.id} 
                className="bg-card/50 border-border/50 hover:bg-card/70 transition-colors"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Match info */}
                    <div className="flex items-center gap-4">
                      <SportBadge sport={match.sport} />
                      <div>
                        <h3 className="text-lg font-semibold">
                          <span style={{ color: match.team1_color }}>{match.team1_name}</span>
                          <span className="text-muted-foreground mx-2">vs</span>
                          <span style={{ color: match.team2_color }}>{match.team2_name}</span>
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <StatusBadge status={match.status} />
                          <span>•</span>
                          <span>Code: {match.access_code}</span>
                        </div>
                      </div>
                    </div>

                    {/* Score preview */}
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <span 
                          className="text-3xl font-display font-bold"
                          style={{ color: match.team1_color }}
                        >
                          {match.team1_score}
                        </span>
                        <span className="text-2xl font-display text-muted-foreground mx-3">-</span>
                        <span 
                          className="text-3xl font-display font-bold"
                          style={{ color: match.team2_color }}
                        >
                          {match.team2_score}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/match/${match.id}`} target="_blank">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button asChild size="sm">
                        <Link to={`/admin/${match.id}`}>
                          <Settings className="w-4 h-4 mr-1" />
                          Control
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
