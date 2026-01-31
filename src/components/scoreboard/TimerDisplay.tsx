import { cn } from '@/lib/utils';

interface TimerDisplayProps {
  seconds: number;
  running: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function TimerDisplay({ seconds, running, size = 'md' }: TimerDisplayProps) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formatted = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
  };

  return (
    <div 
      className={cn(
        'timer-display font-display tracking-widest',
        sizeClasses[size],
        running ? 'timer-running' : 'timer-stopped'
      )}
    >
      {formatted}
    </div>
  );
}
