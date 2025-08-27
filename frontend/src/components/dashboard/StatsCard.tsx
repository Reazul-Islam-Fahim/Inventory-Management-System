import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "primary" | "success" | "warning" | "info" | "destructive" | "secondary" | "accent" | "muted";
}

export const StatsCard = ({ title, value, icon: Icon, trend, variant = "primary" }: StatsCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:border-emerald-900/30 dark:from-emerald-900/20 dark:to-emerald-800/20";
      case "warning":
        return "border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100 dark:border-amber-900/30 dark:from-amber-900/20 dark:to-amber-800/20";
      case "info":
        return "border-cyan-200 bg-gradient-to-br from-cyan-50 to-cyan-100 dark:border-cyan-900/30 dark:from-cyan-900/20 dark:to-cyan-800/20";
      case "destructive":
        return "border-rose-200 bg-gradient-to-br from-rose-50 to-rose-100 dark:border-rose-900/30 dark:from-rose-900/20 dark:to-rose-800/20";
      case "secondary":
        return "border-violet-200 bg-gradient-to-br from-violet-50 to-violet-100 dark:border-violet-900/30 dark:from-violet-900/20 dark:to-violet-800/20";
      case "accent":
        return "border-indigo-200 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:border-indigo-900/30 dark:from-indigo-900/20 dark:to-indigo-800/20";
      case "muted":
        return "border-pink-200 bg-gradient-to-br from-pink-50 to-pink-100 dark:border-pink-900/30 dark:from-pink-900/20 dark:to-pink-800/20";
      case "primary":
      default:
        return "border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 dark:border-blue-900/30 dark:from-blue-900/20 dark:to-blue-800/20";
    }
  };

  const getIconStyles = () => {
    switch (variant) {
      case "success":
        return "text-success bg-success/10";
      case "warning":
        return "text-warning bg-warning/10";
      case "info":
        return "text-info bg-info/10";
      case "destructive":
        return "text-destructive bg-destructive/10";
      case "secondary":
        return "text-secondary bg-secondary/10";
      case "accent":
        return "text-accent bg-accent/10";
      case "muted":
        return "text-muted-foreground bg-muted/10";
      case "primary":
      default:
        return "text-primary bg-primary/10";
    }
  };

  const getTrendStyles = () => {
    switch (variant) {
      case "success":
        return trend?.isPositive ? "text-success" : "text-destructive";
      case "warning":
        return trend?.isPositive ? "text-warning" : "text-destructive";
      case "info":
        return trend?.isPositive ? "text-info" : "text-destructive";
      case "destructive":
        return trend?.isPositive ? "text-destructive" : "text-success";
      case "secondary":
        return trend?.isPositive ? "text-secondary" : "text-destructive";
      case "accent":
        return trend?.isPositive ? "text-accent" : "text-destructive";
      case "muted":
        return trend?.isPositive ? "text-muted-foreground" : "text-destructive";
      case "primary":
      default:
        return trend?.isPositive ? "text-primary" : "text-destructive";
    }
  };

  return (
    <Card className={`${getVariantStyles()} shadow-sm hover:shadow-md transition-shadow`}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1 sm:space-y-2">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-xl sm:text-2xl font-bold text-foreground">{value}</p>
            {trend && (
              <p className={`text-xs flex items-center gap-1 ${getTrendStyles()}`}>
                {trend.isPositive ? "↗" : "↘"} {Math.abs(trend.value)}%
              </p>
            )}
          </div>
          <div className={`p-2 sm:p-3 rounded-full ${getIconStyles()}`}>
            <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};