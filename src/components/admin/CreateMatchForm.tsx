import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { SportType, SPORT_CONFIG, Player } from '@/types/match';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Plus, Trash2 } from 'lucide-react';

export function CreateMatchForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [sport, setSport] = useState<SportType>('football');
  const [team1Name, setTeam1Name] = useState('');
  const [team2Name, setTeam2Name] = useState('');
  const [team1Color, setTeam1Color] = useState('#3B82F6');
  const [team2Color, setTeam2Color] = useState('#EF4444');
  const [team1Players, setTeam1Players] = useState<Omit<Player, 'id'>[]>([]);
  const [team2Players, setTeam2Players] = useState<Omit<Player, 'id'>[]>([]);

  const addPlayer = (team: 1 | 2) => {
    const newPlayer = { name: '', number: '' };
    if (team === 1) {
      setTeam1Players([...team1Players, newPlayer]);
    } else {
      setTeam2Players([...team2Players, newPlayer]);
    }
  };

  const updatePlayer = (team: 1 | 2, index: number, field: string, value: string) => {
    if (team === 1) {
      const updated = [...team1Players];
      updated[index] = { ...updated[index], [field]: value };
      setTeam1Players(updated);
    } else {
      const updated = [...team2Players];
      updated[index] = { ...updated[index], [field]: value };
      setTeam2Players(updated);
    }
  };

  const removePlayer = (team: 1 | 2, index: number) => {
    if (team === 1) {
      setTeam1Players(team1Players.filter((_, i) => i !== index));
    } else {
      setTeam2Players(team2Players.filter((_, i) => i !== index));
    }
  };

  const generateAccessCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Not authenticated',
        description: 'Please sign in to create a match',
        variant: 'destructive',
      });
      return;
    }

    if (!team1Name.trim() || !team2Name.trim()) {
      toast({
        title: 'Missing team names',
        description: 'Please enter names for both teams',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const sportConfig = SPORT_CONFIG[sport];
      const accessCode = generateAccessCode();

      // Add IDs to players
      const team1PlayersWithIds: Player[] = team1Players
        .filter(p => p.name.trim())
        .map((p, i) => ({ ...p, id: `t1-${i}` }));
      
      const team2PlayersWithIds: Player[] = team2Players
        .filter(p => p.name.trim())
        .map((p, i) => ({ ...p, id: `t2-${i}` }));

      const { data, error } = await supabase
        .from('matches')
        .insert({
          sport: sport as string,
          team1_name: team1Name.trim(),
          team2_name: team2Name.trim(),
          team1_color: team1Color,
          team2_color: team2Color,
          team1_players: JSON.parse(JSON.stringify(team1PlayersWithIds)),
          team2_players: JSON.parse(JSON.stringify(team2PlayersWithIds)),
          timer_seconds: sportConfig.defaultTimerSeconds,
          timer_direction: sportConfig.timerDirection,
          access_code: accessCode,
          created_by: user.id,
          status: 'upcoming' as string,
        } as any)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Match created!',
        description: `Access code: ${accessCode}`,
      });

      navigate(`/admin/${data.id}`);
    } catch (err: any) {
      toast({
        title: 'Error creating match',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* Sport Selection */}
      <Card className="overflow-visible bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="font-display">Select Sport</CardTitle>
        </CardHeader>
        <CardContent className="overflow-visible">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 overflow-visible">
            {(Object.keys(SPORT_CONFIG) as SportType[]).map((sportType, index) => {
              const config = SPORT_CONFIG[sportType];
              const isSelected = sport === sportType;
              const tilt =
                index % 2 === 0 ? 'group-hover:rotate-12' : 'group-hover:-rotate-12';
              return (
                <Button
                  key={sportType}
                  type="button"
                  variant={isSelected ? 'default' : 'outline'}
                  className={cn(
                    'group relative h-20 flex-col gap-1 overflow-visible transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-2 hover:border-primary/45 hover:shadow-[0_20px_50px_-12px_hsl(217_91%_60%_/_0.25)]',
                    isSelected && `sport-${sportType}`,
                    !isSelected &&
                      'border-border/50 bg-card/50 hover:bg-card/85',
                  )}
                  onClick={() => setSport(sportType)}
                >
                  <div className="flex h-9 shrink-0 items-center justify-center overflow-visible md:h-10">
                    <span
                      className={cn(
                        'inline-block origin-center text-2xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] will-change-transform group-hover:scale-[2.2] group-hover:drop-shadow-[0_0_28px_hsl(217_91%_60%_/_0.55)] md:text-3xl',
                        tilt,
                      )}
                      aria-hidden
                    >
                      {config.icon}
                    </span>
                  </div>
                  <span className="text-sm transition-colors duration-300 group-hover:text-primary">
                    {config.name}
                  </span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Teams */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Team 1 */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="font-display" style={{ color: team1Color }}>
              Team 1
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Team Name</Label>
              <Input
                placeholder="e.g., Blue Eagles"
                value={team1Name}
                onChange={(e) => setTeam1Name(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Team Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={team1Color}
                  onChange={(e) => setTeam1Color(e.target.value)}
                  className="w-14 h-10 p-1 cursor-pointer"
                />
                <Input
                  value={team1Color}
                  onChange={(e) => setTeam1Color(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            
            {/* Players */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Players (Optional)</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => addPlayer(1)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
              {team1Players.map((player, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Name"
                    value={player.name}
                    onChange={(e) => updatePlayer(1, index, 'name', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="#"
                    value={player.number || ''}
                    onChange={(e) => updatePlayer(1, index, 'number', e.target.value)}
                    className="w-16"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removePlayer(1, index)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team 2 */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="font-display" style={{ color: team2Color }}>
              Team 2
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Team Name</Label>
              <Input
                placeholder="e.g., Red Hawks"
                value={team2Name}
                onChange={(e) => setTeam2Name(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Team Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={team2Color}
                  onChange={(e) => setTeam2Color(e.target.value)}
                  className="w-14 h-10 p-1 cursor-pointer"
                />
                <Input
                  value={team2Color}
                  onChange={(e) => setTeam2Color(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            
            {/* Players */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Players (Optional)</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => addPlayer(2)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
              {team2Players.map((player, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Name"
                    value={player.name}
                    onChange={(e) => updatePlayer(2, index, 'name', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="#"
                    value={player.number || ''}
                    onChange={(e) => updatePlayer(2, index, 'number', e.target.value)}
                    className="w-16"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removePlayer(2, index)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submit */}
      <Button 
        type="submit" 
        size="lg" 
        className="w-full font-display text-lg"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Match'}
      </Button>
    </form>
  );
}
