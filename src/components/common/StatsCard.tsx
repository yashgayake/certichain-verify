import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  iconClassName?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  className,
  iconClassName,
}) => {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl border border-border/50 bg-card p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-primary/30",
      className
    )}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
      
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value.toLocaleString()}</p>
          {trend && (
            <div className={cn(
              "flex items-center gap-1 mt-2 text-sm font-medium",
              trend.isPositive ? "text-success" : "text-destructive"
            )}>
              <span>{trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
              <span className="text-muted-foreground font-normal">vs last month</span>
            </div>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-xl bg-primary/10",
          iconClassName
        )}>
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
