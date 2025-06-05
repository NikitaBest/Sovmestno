import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedProgressProps {
  percentage: number;
  className?: string;
  delay?: number;
}

export function AnimatedProgress({ percentage, className, delay = 0 }: AnimatedProgressProps) {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentValue(percentage);
    }, delay);

    return () => clearTimeout(timer);
  }, [percentage, delay]);

  const getColorClass = (value: number) => {
    if (value >= 75) return "progress-success";
    if (value >= 60) return "progress-warning";
    return "progress-danger";
  };

  return (
    <div className={cn("w-full bg-gray-200 rounded-full h-3 overflow-hidden", className)}>
      <div 
        className={cn("h-3 rounded-full transition-all duration-2000 ease-out", getColorClass(percentage))}
        style={{ width: `${currentValue}%` }}
      />
    </div>
  );
}