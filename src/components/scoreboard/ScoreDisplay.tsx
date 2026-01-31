import { cn } from '@/lib/utils';

interface ScoreDisplayProps {
  score: number;
  teamColor?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

export function ScoreDisplay({ 
  score, 
  teamColor = 'hsl(var(--primary))', 
  size = 'lg',
  animated = false
}: ScoreDisplayProps) {
  const sizeClasses = {
    sm: 'text-4xl',
    md: 'text-6xl',
    lg: 'text-8xl',
    xl: 'text-[10rem]',
  };

  return (
    <div 
      className={cn(
        'score-display transition-all duration-300',
        sizeClasses[size],
        animated && 'animate-score-update'
      )}
      style={{ 
        color: teamColor,
        textShadow: `0 0 40px ${teamColor}40, 0 0 80px ${teamColor}20`
      }}
    >
      {score}
    </div>
  );
}
