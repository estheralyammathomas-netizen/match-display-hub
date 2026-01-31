import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { SportType, SPORT_CONFIG } from '@/types/match';

interface SportBadgeProps {
  sport: SportType;
  className?: string;
  showIcon?: boolean;
}

export function SportBadge({ sport, className, showIcon = true }: SportBadgeProps) {
  const config = SPORT_CONFIG[sport];

  return (
    <Badge 
      className={cn(
        'px-3 py-1 text-sm font-semibold',
        `sport-${sport}`,
        className
      )}
    >
      {showIcon && <span className="mr-1">{config.icon}</span>}
      {config.name}
    </Badge>
  );
}
