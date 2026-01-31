import { motion } from 'framer-motion';
import { Player } from '@/types/match';
import { User } from 'lucide-react';

interface BreakScreenProps {
  message?: string;
  team1Name: string;
  team2Name: string;
  team1Players: Player[];
  team2Players: Player[];
  team1Color: string;
  team2Color: string;
}

export function BreakScreen({
  message = 'BREAK',
  team1Name,
  team2Name,
  team1Players,
  team2Players,
  team1Color,
  team2Color,
}: BreakScreenProps) {
  return (
    <motion.div 
      className="break-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Break message */}
        <motion.h1 
          className="text-5xl md:text-7xl font-display font-black text-center text-white mb-12"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {message}
        </motion.h1>

        {/* Players showcase */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Team 1 */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 
              className="text-3xl font-display font-bold mb-6 text-center"
              style={{ color: team1Color }}
            >
              {team1Name}
            </h2>
            <div className="grid gap-3">
              {team1Players.map((player, index) => (
                <motion.div
                  key={player.id}
                  className="player-card flex items-center gap-4"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  {player.photoUrl ? (
                    <img 
                      src={player.photoUrl} 
                      alt={player.name}
                      className="w-12 h-12 rounded-full object-cover border-2"
                      style={{ borderColor: team1Color }}
                    />
                  ) : (
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: team1Color }}
                    >
                      <User className="w-6 h-6 text-background" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-foreground">{player.name}</p>
                    {player.number && (
                      <p className="text-sm text-muted-foreground">#{player.number}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Team 2 */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 
              className="text-3xl font-display font-bold mb-6 text-center"
              style={{ color: team2Color }}
            >
              {team2Name}
            </h2>
            <div className="grid gap-3">
              {team2Players.map((player, index) => (
                <motion.div
                  key={player.id}
                  className="player-card flex items-center gap-4"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  {player.photoUrl ? (
                    <img 
                      src={player.photoUrl} 
                      alt={player.name}
                      className="w-12 h-12 rounded-full object-cover border-2"
                      style={{ borderColor: team2Color }}
                    />
                  ) : (
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: team2Color }}
                    >
                      <User className="w-6 h-6 text-background" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-foreground">{player.name}</p>
                    {player.number && (
                      <p className="text-sm text-muted-foreground">#{player.number}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
