import { useParams } from 'react-router-dom';
import { useMatch } from '@/hooks/useMatch';
import { PublicScoreboard } from '@/components/scoreboard/PublicScoreboard';

export default function MatchView() {
  const { matchId } = useParams<{ matchId: string }>();
  const { match, loading, error } = useMatch(matchId || null);

  if (loading) {
    return (
      <div className="stadium-bg min-h-screen flex items-center justify-center">
        <div className="text-xl font-display text-muted-foreground animate-pulse">
          Loading scoreboard...
        </div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="stadium-bg min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold text-destructive mb-4">
            Match Not Found
          </h1>
          <p className="text-muted-foreground">
            The match you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return <PublicScoreboard match={match} />;
}
