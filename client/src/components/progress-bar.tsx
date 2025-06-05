import { cn } from "@/lib/utils";

interface ProgressBarProps {
  percentage: number;
  className?: string;
}

export function ProgressBar({ percentage, className }: ProgressBarProps) {
  const getColorClass = (value: number) => {
    if (value >= 75) return "progress-success";
    if (value >= 60) return "progress-warning";
    return "progress-danger";
  };

  return (
    <div className={cn("w-full bg-gray-200 rounded-full h-3 overflow-hidden", className)}>
      <div 
        className={cn("h-3 rounded-full transition-all duration-1000", getColorClass(percentage))}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
