import { Card } from "@/components/ui/card";
import { Printer, Activity, Clock, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardStatsProps {
  level: number;
  lastUpdated: string;
  status: "normal" | "low" | "critical";
  trend?: "up" | "down" | "stable";
}

export const DashboardStats = ({ level, lastUpdated, status, trend = "stable" }: DashboardStatsProps) => {
  const getStatusColor = () => {
    if (status === "normal") return "text-status-normal border-status-normal";
    if (status === "low") return "text-status-low border-status-low";
    return "text-status-critical border-status-critical";
  };

  const stats = [
    {
      icon: Printer,
      label: "Current Level",
      value: `${Math.round(level)}%`,
      color: getStatusColor(),
    },
    {
      icon: Activity,
      label: "Status",
      value: status.charAt(0).toUpperCase() + status.slice(1),
      color: getStatusColor(),
    },
    {
      icon: Clock,
      label: "Last Updated",
      value: lastUpdated,
      color: "text-muted-foreground border-muted",
    },
    {
      icon: TrendingUp,
      label: "Trend",
      value: trend.charAt(0).toUpperCase() + trend.slice(1),
      color: "text-primary border-primary",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className={cn(
            "p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 animate-fade-in",
            stat.color
          )}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center gap-4">
            <div className={cn("p-3 rounded-full bg-primary/10", stat.color)}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={cn("text-2xl font-bold", stat.color)}>{stat.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
