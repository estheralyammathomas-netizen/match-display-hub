import { useParams, Link } from 'react-router-dom';
import { useMatch } from '@/hooks/useMatch';
import { useAuth } from '@/hooks/useAuth';
import { AdminControls } from '@/components/admin/AdminControls';
import { QRCodeDialog } from '@/components/admin/QRCodeDialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export default function AdminMatch() {
  const { matchId } = useParams<{ matchId: string }>();
  const { user, loading: authLoading } = useAuth();
  const {
    match,
    loading,
    error,
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
    updateMatch,
  } = useMatch(matchId || null);

  if (authLoading || loading) {
    return (
      <div className="stadium-bg min-h-screen flex items-center justify-center">
        <div className="text-xl font-display text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="stadium-bg min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-muted-foreground mb-4">Please sign in to access controls</p>
          <Button asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="stadium-bg min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-destructive mb-4">{error || 'Match not found'}</p>
          <Button asChild variant="outline">
            <Link to="/admin">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Check if user can edit
  if (match.created_by !== user.id) {
    return (
      <div className="stadium-bg min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-destructive mb-4">You don't have permission to control this match</p>
          <Button asChild variant="outline">
            <Link to="/admin">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="stadium-bg min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon">
              <Link to="/admin">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">
                Match Control
              </h1>
              <p className="text-muted-foreground text-sm">
                Access Code: <span className="font-mono">{match.access_code}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <QRCodeDialog matchId={matchId!} accessCode={match.access_code} />
            <Button asChild variant="outline" size="sm">
              <Link to={`/match/${matchId}`} target="_blank">
                <ExternalLink className="w-4 h-4 mr-1" />
                View Live
              </Link>
            </Button>
          </div>
        </div>

        {/* Admin Controls */}
        <AdminControls
          match={match}
          onAddScore={addScore}
          onSubtractScore={subtractScore}
          onAddWicket={addWicket}
          onSubtractWicket={subtractWicket}
          onAddOver={addOver}
          onAddSet={addSet}
          onNextPeriod={nextPeriod}
          onStartTimer={startTimer}
          onStopTimer={stopTimer}
          onResetTimer={resetTimer}
          onSetTimer={setTimer}
          onSetStatus={setStatus}
          onToggleBreak={toggleBreak}
          onUpdateMatch={updateMatch}
        />
      </div>
    </div>
  );
}
