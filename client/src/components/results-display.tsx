import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "./progress-bar";
import { shareCompatibilityResults } from "@/lib/telegram";
import type { CompatibilityResults } from "@shared/schema";

interface ResultsDisplayProps {
  results: CompatibilityResults;
  onRestart: () => void;
}

const compatibilityCategories = [
  {
    key: "zodiac_compatibility" as keyof CompatibilityResults,
    icon: "♈",
    title: "Зодиакальная совместимость",
    weight: "30% от общего результата",
  },
  {
    key: "elemental_compatibility" as keyof CompatibilityResults,
    icon: "🌟",
    title: "Совместимость по стихиям",
    weight: "20% от общего результата",
  },
  {
    key: "numerological_compatibility" as keyof CompatibilityResults,
    icon: "🔢",
    title: "Нумерологическая совместимость",
    weight: "20% от общего результата",
  },
  {
    key: "emotional_compatibility" as keyof CompatibilityResults,
    icon: "💕",
    title: "Эмоциональная совместимость",
    weight: "20% от общего результата",
  },
  {
    key: "intellectual_compatibility" as keyof CompatibilityResults,
    icon: "🧠",
    title: "Интеллектуальная совместимость",
    weight: "10% от общего результата",
  },
];

export function ResultsDisplay({ results, onRestart }: ResultsDisplayProps) {
  const handleShare = () => {
    shareCompatibilityResults(results);
  };

  return (
    <div className="space-y-6">
      {/* Overall Compatibility Card */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Результаты совместимости</h2>
          <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {results.overall_compatibility}%
          </div>
          <p className="text-gray-600 text-sm">Общая совместимость</p>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="space-y-4">
        {compatibilityCategories.map((category) => {
          const percentage = results[category.key];
          return (
            <Card key={category.key} className="bg-white shadow-sm border border-gray-100">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{category.icon}</span>
                    <div>
                      <h4 className="font-medium text-gray-800">{category.title}</h4>
                      <p className="text-xs text-gray-500">{category.weight}</p>
                    </div>
                  </div>
                  <span className="text-lg font-semibold text-blue-600">
                    {percentage}%
                  </span>
                </div>
                <ProgressBar percentage={percentage} />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4">
        <Button
          onClick={handleShare}
          className="w-full telegram-gradient text-white py-4 px-6 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 active:scale-[0.98]"
        >
          <span className="flex items-center justify-center">
            <span className="mr-2">📤</span>
            Поделиться результатом
          </span>
        </Button>
        
        <Button
          onClick={onRestart}
          variant="secondary"
          className="w-full bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-semibold text-base hover:bg-gray-200 transform hover:scale-[1.02] transition-all duration-200 active:scale-[0.98]"
        >
          <span className="flex items-center justify-center">
            <span className="mr-2">🔄</span>
            Попробовать снова
          </span>
        </Button>
      </div>
    </div>
  );
}
