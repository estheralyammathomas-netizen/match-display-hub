import { useAuth } from '@/hooks/useAuth';
import { CreateMatchForm } from '@/components/admin/CreateMatchForm';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function CreateMatch() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
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
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="ghost" size="icon">
            <Link to="/admin">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Create New Match
            </h1>
            <p className="text-muted-foreground">Set up a new scoreboard</p>
          </div>
        </div>

        <CreateMatchForm />
      </div>
    </div>
  );
}
