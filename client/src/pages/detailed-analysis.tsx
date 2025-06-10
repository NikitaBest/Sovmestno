import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";

interface DetailedResults {
  zodiac_signs: { person1: string; person2: string };
  detailed_text: string;
  detailed_description: string;
  zodiac_compatibility: number;
  elemental_compatibility: number;
  numerological_compatibility: number;
  emotional_compatibility: number;
  intellectual_compatibility: number;
  overall_compatibility: number;
  advice: string[];
  lucky_colors: string[];
  best_activities: string[];
}

export default function DetailedAnalysisPage() {
  const [location, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<DetailedResults | null>(null);

  // Получаем данные из location.state или localStorage
  let locationState = (location as any)?.state;
  if (!locationState || !locationState.person1Date) {
    try {
      locationState = JSON.parse(localStorage.getItem('compat-input') || '{}');
    } catch {}
  }

  useEffect(() => {
    if (!locationState || !locationState.person1Date) {
      setLocation("/");
      return;
    }
    
    // Получаем сохраненные результаты
    try {
      const savedResults = JSON.parse(localStorage.getItem('compat-results') || '{}');
      if (savedResults && savedResults.zodiac_signs) {
        setResults(savedResults);
        setLoading(false);
        return;
      }
    } catch (e) {
      console.error("Error parsing saved results:", e);
    }
    
    setLocation("/");
  }, [setLocation, locationState]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4 md:p-8 animate-fade-in-up">
      <div className="w-full max-w-md">
        <Card className="glass-card p-6 md:p-8 flex flex-col items-center shadow-2xl backdrop-blur-md bg-white/70 dark:bg-white/10 border-none animate-fade-in-up rounded-3xl">
          <div className="flex items-center w-full mb-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-purple-300 bg-transparent"
              onClick={() => setLocation("/")}
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="flex-1 text-xl md:text-2xl font-bold text-center text-gray-800 dark:text-white opacity-90">
              Подробный анализ
            </h1>
            <div className="w-8" />
          </div>
          {/* Loader */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-10 md:py-16 w-full">
              <Loader2 className="w-10 h-10 text-purple-400 animate-spin mb-4" />
              <div className="text-gray-600 dark:text-gray-200 text-base md:text-lg opacity-80 text-center mb-2 animate-fade-in delay-100">
                Получаем подробный астрологический расклад…
              </div>
            </div>
          )}
          {/* Error */}
          {error && (
            <div className="flex flex-col items-center justify-center py-10 w-full">
              <div className="text-red-400 text-center mb-2">{error}</div>
              <Button onClick={() => setLocation("/")}>На главную</Button>
            </div>
          )}
          {/* Results */}
          {results && !loading && !error && (
            <div className="flex flex-col items-center w-full animate-fade-in">
              <div className="mb-4 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">{results.zodiac_signs.person1} &amp; {results.zodiac_signs.person2}</div>
                <div className="text-gray-700 dark:text-gray-200 text-base mb-2">{results.detailed_text}</div>
              </div>
              
              {/* Detailed Description Section */}
              <div className="w-full mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <h3 className="text-lg font-semibold text-purple-600 mb-2">Подробный анализ совместимости</h3>
                <div className="text-gray-700 dark:text-gray-200 text-sm whitespace-pre-line">
                  {results.detailed_description}
                </div>
              </div>

              <div className="w-full mb-4">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-sm">
                    <span>Зодиакальная совместимость</span>
                    <span className="font-semibold">{results.zodiac_compatibility}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Стихийная совместимость</span>
                    <span className="font-semibold">{results.elemental_compatibility}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Нумерологическая совместимость</span>
                    <span className="font-semibold">{results.numerological_compatibility}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Эмоциональная совместимость</span>
                    <span className="font-semibold">{results.emotional_compatibility}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Интеллектуальная совместимость</span>
                    <span className="font-semibold">{results.intellectual_compatibility}%</span>
                  </div>
                  <div className="flex justify-between text-base mt-2">
                    <span className="font-bold">Общая совместимость</span>
                    <span className="font-bold text-purple-600">{results.overall_compatibility}%</span>
                  </div>
                </div>
              </div>
              {Array.isArray(results.advice) && results.advice.length > 0 && (
                <div className="w-full mb-4">
                  <div className="font-semibold text-purple-500 mb-1">Советы для гармонии:</div>
                  <ul className="list-disc pl-5 text-gray-700 dark:text-gray-200 text-sm">
                    {results.advice.map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
                </div>
              )}
              {Array.isArray(results.lucky_colors) && results.lucky_colors.length > 0 && (
                <div className="w-full mb-4">
                  <div className="font-semibold text-purple-500 mb-1">Счастливые цвета:</div>
                  <div className="flex flex-wrap gap-2">
                    {results.lucky_colors.map((color, i) => <span key={i} className="px-3 py-1 rounded-xl bg-purple-100 text-purple-700 text-xs">{color}</span>)}
                  </div>
                </div>
              )}
              {Array.isArray(results.best_activities) && results.best_activities.length > 0 && (
                <div className="w-full">
                  <div className="font-semibold text-purple-500 mb-1">Рекомендуемые занятия:</div>
                  <div className="flex flex-wrap gap-2">
                    {results.best_activities.map((act, i) => <span key={i} className="px-3 py-1 rounded-xl bg-pink-100 text-pink-700 text-xs">{act}</span>)}
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
} 