// import { LucideIcon } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";

// interface StatsCardProps {
//   title: string;
//   value: string | number;
//   icon: LucideIcon;
//   trend?: {
//     value: number;
//     isPositive: boolean;
//   };
//   variant?: "default" | "success" | "warning" | "info";
// }

// export const StatsCard = ({ title, value, icon: Icon, trend, variant = "default" }: StatsCardProps) => {
//   const getVariantStyles = () => {
//     switch (variant) {
//       case "success":
//         return "border-success/20 bg-gradient-to-br from-success/5 to-success/10";
//       case "warning":
//         return "border-warning/20 bg-gradient-to-br from-warning/5 to-warning/10";
//       case "info":
//         return "border-info/20 bg-gradient-to-br from-info/5 to-info/10";
//       default:
//         return "border-border bg-gradient-card";
//     }
//   };

//   const getIconStyles = () => {
//     switch (variant) {
//       case "success":
//         return "text-success bg-success/10";
//       case "warning":
//         return "text-warning bg-warning/10";
//       case "info":
//         return "text-info bg-info/10";
//       default:
//         return "text-primary bg-primary/10";
//     }
//   };

//   return (
//     <Card className={`${getVariantStyles()} shadow-sm hover:shadow-md transition-shadow`}>
//       <CardContent className="p-6">
//         <div className="flex items-center justify-between">
//           <div className="space-y-2">
//             <p className="text-sm font-medium text-muted-foreground">{title}</p>
//             <p className="text-2xl font-bold text-foreground">{value}</p>
//             {trend && (
//               <p className={`text-xs flex items-center gap-1 ${
//                 trend.isPositive ? "text-success" : "text-destructive"
//               }`}>
//                 {trend.isPositive ? "↗" : "↘"} {Math.abs(trend.value)}%
//               </p>
//             )}
//           </div>
//           <div className={`p-3 rounded-full ${getIconStyles()}`}>
//             <Icon className="h-6 w-6" />
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };


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
  variant?: "blue" | "green" | "orange" | "purple" | "red" | "cyan" | "pink" | "indigo";
}

export const StatsCard = ({ title, value, icon: Icon, trend, variant = "blue" }: StatsCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "green":
        return "border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:border-emerald-900/30 dark:from-emerald-900/20 dark:to-emerald-800/20";
      case "orange":
        return "border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100 dark:border-amber-900/30 dark:from-amber-900/20 dark:to-amber-800/20";
      case "purple":
        return "border-violet-200 bg-gradient-to-br from-violet-50 to-violet-100 dark:border-violet-900/30 dark:from-violet-900/20 dark:to-violet-800/20";
      case "red":
        return "border-rose-200 bg-gradient-to-br from-rose-50 to-rose-100 dark:border-rose-900/30 dark:from-rose-900/20 dark:to-rose-800/20";
      case "cyan":
        return "border-cyan-200 bg-gradient-to-br from-cyan-50 to-cyan-100 dark:border-cyan-900/30 dark:from-cyan-900/20 dark:to-cyan-800/20";
      case "pink":
        return "border-pink-200 bg-gradient-to-br from-pink-50 to-pink-100 dark:border-pink-900/30 dark:from-pink-900/20 dark:to-pink-800/20";
      case "indigo":
        return "border-indigo-200 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:border-indigo-900/30 dark:from-indigo-900/20 dark:to-indigo-800/20";
      case "blue":
      default:
        return "border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 dark:border-blue-900/30 dark:from-blue-900/20 dark:to-blue-800/20";
    }
  };

  const getIconStyles = () => {
    switch (variant) {
      case "green":
        return "text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30";
      case "orange":
        return "text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30";
      case "purple":
        return "text-violet-600 bg-violet-100 dark:text-violet-400 dark:bg-violet-900/30";
      case "red":
        return "text-rose-600 bg-rose-100 dark:text-rose-400 dark:bg-rose-900/30";
      case "cyan":
        return "text-cyan-600 bg-cyan-100 dark:text-cyan-400 dark:bg-cyan-900/30";
      case "pink":
        return "text-pink-600 bg-pink-100 dark:text-pink-400 dark:bg-pink-900/30";
      case "indigo":
        return "text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/30";
      case "blue":
      default:
        return "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30";
    }
  };

  const getTrendStyles = () => {
    switch (variant) {
      case "green":
        return trend?.isPositive ? "text-emerald-600" : "text-rose-600";
      case "orange":
        return trend?.isPositive ? "text-amber-600" : "text-rose-600";
      case "purple":
        return trend?.isPositive ? "text-violet-600" : "text-rose-600";
      case "red":
        return trend?.isPositive ? "text-rose-600" : "text-emerald-600";
      case "cyan":
        return trend?.isPositive ? "text-cyan-600" : "text-rose-600";
      case "pink":
        return trend?.isPositive ? "text-pink-600" : "text-rose-600";
      case "indigo":
        return trend?.isPositive ? "text-indigo-600" : "text-rose-600";
      case "blue":
      default:
        return trend?.isPositive ? "text-blue-600" : "text-rose-600";
    }
  };

  return (
    <Card className={`${getVariantStyles()} shadow-sm hover:shadow-md transition-shadow border`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {trend && (
              <p className={`text-xs flex items-center gap-1 ${getTrendStyles()}`}>
                {trend.isPositive ? "↗" : "↘"} {Math.abs(trend.value)}%
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full ${getIconStyles()}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};