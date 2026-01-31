import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { MatchStatus } from '@/types/match';

interface StatusBadgeProps {
  status: MatchStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    upcoming: { label: 'UPCOMING', class: 'status-upcoming' },
    live: { label: '● LIVE', class: 'status-live' },
    halftime: { label: 'HALF TIME', class: 'status-break' },
    break: { label: 'BREAK', class: 'status-break' },
    finished: { label: 'FINISHED', class: 'bg-muted text-muted-foreground' },
  };

  const config = statusConfig[status];

  return (
    <Badge 
      className={cn(
        'px-4 py-1 text-sm font-bold font-display tracking-wider',
        config.class,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}
