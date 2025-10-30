import { cn } from "@/lib/utils";

interface InkLevelProps {
  level: number; // 0-100
  className?: string;
}

export const InkLevel = ({ level, className }: InkLevelProps) => {
  const getStatusColor = () => {
    if (level > 60) return "bg-status-normal";
    if (level > 30) return "bg-status-low";
    return "bg-status-critical";
  };

  const getStatusText = () => {
    if (level > 60) return "Normal";
    if (level > 30) return "Low";
    return "Critical";
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {/* Ink Cartridge Container */}
      <div className="relative w-64 h-96 bg-card border-4 border-primary rounded-3xl overflow-hidden shadow-2xl">
        {/* Ink Fill */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-out",
            getStatusColor()
          )}
          style={{ height: `${level}%` }}
        >
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
          
          {/* Glossy Effect */}
          <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white/30 to-transparent" />
        </div>

        {/* Level Markers */}
        {[25, 50, 75].map((marker) => (
          <div
            key={marker}
            className="absolute left-0 right-0 border-t border-primary/20"
            style={{ bottom: `${marker}%` }}
          >
            <span className="absolute -left-12 -top-3 text-sm text-muted-foreground">
              {marker}%
            </span>
          </div>
        ))}

        {/* Level Display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center z-10">
            <div className="text-6xl font-bold text-foreground drop-shadow-lg">
              {Math.round(level)}%
            </div>
            <div className="text-xl font-semibold mt-2 text-foreground drop-shadow-md">
              {getStatusText()}
            </div>
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div
        className={cn(
          "px-6 py-3 rounded-full font-semibold text-white shadow-lg",
          getStatusColor()
        )}
      >
        Ink Level: {getStatusText()}
      </div>
    </div>
  );
};
