import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedProgress } from "./animated-progress";
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
    const text = encodeURIComponent(
      `🎯 Наша совместимость: ${results.overall_compatibility}%\n` +
      `Знаки: ${results.zodiac_signs?.person1 ?? ''} + ${results.zodiac_signs?.person2 ?? ''}\n` +
      (results.compatibility_message ? `\n${results.compatibility_message}\n` : '') +
      (results.detailed_description ? `\n${results.detailed_description}\n` : '')
    );
    const url = `https://t.me/share/url?text=${text}`;
    window.open(url, "_blank");
  };

  const getCompatibilityLevel = (percentage: number) => {
    if (percentage >= 80) return { level: "Превосходно", color: "bg-green-100 text-green-800" };
    if (percentage >= 70) return { level: "Отлично", color: "bg-blue-100 text-blue-800" };
    if (percentage >= 60) return { level: "Хорошо", color: "bg-yellow-100 text-yellow-800" };
    return { level: "Средне", color: "bg-gray-100 text-gray-800" };
  };

  const compatibilityLevel = getCompatibilityLevel(results.overall_compatibility);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Overall Compatibility Card */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-400 opacity-10 rounded-full -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-400 opacity-10 rounded-full -ml-8 -mb-8"></div>
        
        <div className="text-center relative z-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Результаты совместимости</h2>
          <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 animate-bounce-in">
            {results.overall_compatibility}%
          </div>
          <Badge className={`mb-3 ${compatibilityLevel.color}`}>
            {compatibilityLevel.level}
          </Badge>
          <p className="text-gray-600 text-sm">Общая совместимость</p>
          
          {/* Zodiac Signs Display */}
          {results.zodiac_signs && (
            <div className="mt-4 flex justify-center items-center gap-4">
              <div className="text-center">
                <div className="text-2xl mb-1">👤</div>
                <div className="font-medium text-gray-800">{results.zodiac_signs.person1}</div>
              </div>
              <div className="text-2xl">❤️</div>
              <div className="text-center">
                <div className="text-2xl mb-1">👤</div>
                <div className="font-medium text-gray-800">{results.zodiac_signs.person2}</div>
              </div>
            </div>
          )}
          
          {/* Floating hearts */}
          {results.overall_compatibility >= 75 && (
            <>
              <div className="absolute top-4 left-4 floating-heart">💕</div>
              <div className="absolute top-6 right-6 floating-heart" style={{ animationDelay: '0.5s' }}>💖</div>
              <div className="absolute bottom-8 left-8 floating-heart" style={{ animationDelay: '1s' }}>💝</div>
            </>
          )}
        </div>
      </div>

      {/* Compatibility Message */}
      {results.compatibility_message && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
          <CardContent className="p-5">
            <div className="flex items-start">
              <span className="text-2xl mr-3 mt-1">💫</span>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Астрологическое заключение</h4>
                <p className="text-gray-700 text-sm leading-relaxed">{results.compatibility_message}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Zodiac Signs */}
      {results.zodiac_signs && (
        <Card className="bg-white shadow-sm border border-gray-100">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <div className="text-3xl mb-2">⭐</div>
                <p className="text-sm text-gray-500">Ваш знак</p>
                <p className="font-semibold text-gray-800">{results.zodiac_signs.person1}</p>
              </div>
              <div className="mx-4">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">💝</span>
                </div>
              </div>
              <div className="text-center flex-1">
                <div className="text-3xl mb-2">✨</div>
                <p className="text-sm text-gray-500">Знак партнера</p>
                <p className="font-semibold text-gray-800">{results.zodiac_signs.person2}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Results */}
      <div className="space-y-4">
        {compatibilityCategories.map((category, index) => {
          const percentage = results[category.key] as number;
          return (
            <Card key={category.key} className="bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
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
                <AnimatedProgress percentage={percentage} delay={index * 200} />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Lucky Colors */}
      {results.lucky_colors && results.lucky_colors.length > 0 && (
        <Card className="bg-white shadow-sm border border-gray-100">
          <CardContent className="p-5">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-3">🎨</span>
              <h4 className="font-medium text-gray-800">Счастливые цвета</h4>
            </div>
            <div className="flex gap-2">
              {results.lucky_colors.map((color, index) => (
                <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800">
                  {color}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Best Activities */}
      {results.best_activities && results.best_activities.length > 0 && (
        <Card className="bg-white shadow-sm border border-gray-100">
          <CardContent className="p-5">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-3">🌟</span>
              <h4 className="font-medium text-gray-800">Рекомендуемые активности</h4>
            </div>
            <div className="space-y-2">
              {results.best_activities.map((activity, index) => (
                <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg">
                  <span className="text-pink-500 mr-2">•</span>
                  <p className="text-sm text-gray-700">{activity}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Compatibility Description */}
      {results.detailed_description && (
        <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100">
          <CardContent className="p-6">
            <div className="flex items-start">
              <span className="text-2xl mr-3 mt-1">📝</span>
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Подробный анализ совместимости</h4>
                <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                  {results.detailed_description}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Best Dates for Activities */}
      {Array.isArray(results.best_dates) && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-100">
          <CardContent className="p-6">
            <div className="flex items-start">
              <span className="text-2xl mr-3 mt-1">📅</span>
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Лучшие даты для совместных дел</h4>
                <div className="text-gray-700 text-sm mb-2">
                  {results.best_dates?.map((date, idx) => (
                    <span key={date} className="inline-block mr-2 font-medium text-blue-700">{date}{idx < (results.best_dates?.length ?? 0) - 1 ? ',' : ''}</span>
                  ))}
                </div>
                {results.best_dates_comment && (
                  <div className="text-gray-600 text-xs italic">{results.best_dates_comment}</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Relationship Tips */}
      {results.relationship_tips && (
        <Card className="bg-gradient-to-r from-yellow-50 to-pink-50 border border-yellow-100">
          <CardContent className="p-6">
            <div className="flex items-start">
              <span className="text-2xl mr-3 mt-1">💡</span>
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Советы для вашей пары</h4>
                <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                  {results.relationship_tips}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="space-y-3 pt-6">
        <Button
          onClick={handleShare}
          className="w-full telegram-gradient text-white py-4 px-6 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 active:scale-[0.98]"
        >
          <span className="flex items-center justify-center">
            <span className="mr-2">📤</span>
            Поделиться
          </span>
        </Button>
        <Button
          onClick={onRestart}
          variant="secondary"
          className="w-full bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-semibold text-base hover:bg-gray-200 transform hover:scale-[1.02] transition-all duration-200 active:scale-[0.98]"
        >
          <span className="flex items-center justify-center">
            <span className="mr-2">🔄</span>
            Новый расчет
          </span>
        </Button>
      </div>
    </div>
  );
}
