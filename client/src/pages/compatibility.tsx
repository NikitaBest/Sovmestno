import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { EnhancedForm } from "@/components/enhanced-form";
import { ResultsDisplay } from "@/components/results-display";
import { apiRequest } from "@/lib/queryClient";
import { initTelegramWebApp } from "@/lib/telegram";
import type { CompatibilityRequest, CompatibilityResults } from "@shared/schema";

type Screen = "input" | "loading" | "results";

export default function CompatibilityPage() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("input");
  const [results, setResults] = useState<CompatibilityResults | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    initTelegramWebApp();
  }, []);

  const compatibilityMutation = useMutation({
    mutationFn: async (data: CompatibilityRequest) => {
      const response = await apiRequest("POST", "/api/compatibility", data);
      return response.json();
    },
    onSuccess: (data) => {
      setResults(data.results);
      setCurrentScreen("results");
      setError("");
    },
    onError: (error: Error) => {
      setError(error.message || "Произошла ошибка при расчете совместимости");
      setCurrentScreen("input");
    },
  });

  const handleSubmit = async (data: CompatibilityRequest) => {
    setError("");
    setCurrentScreen("loading");
    compatibilityMutation.mutate(data);
  };

  const handleRestart = () => {
    setResults(null);
    setError("");
    setCurrentScreen("input");
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      <div className="max-w-md mx-auto min-h-screen">
        {/* Header */}
        <header className="magic-gradient text-white p-6 sticky top-0 z-10 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-xl">❤️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Совместимость</h1>
                <p className="text-white/80 text-xs">Узнай свою пару</p>
              </div>
            </div>
            <div className="floating-heart">✨</div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6" style={{ background: 'linear-gradient(180deg, rgba(248, 250, 252, 0.8) 0%, rgba(255, 255, 255, 0.9) 100%)' }}>
          {currentScreen === "input" && (
            <EnhancedForm
              onSubmit={handleSubmit}
              isLoading={compatibilityMutation.isPending}
              error={error}
            />
          )}

          {currentScreen === "loading" && (
            <div className="text-center py-12 animate-fade-in-up">
              <div className="space-y-6">
                <div className="relative">
                  <div className="w-12 h-12 cosmic-gradient rounded-2xl flex items-center justify-center pulse-glow">
                    <div className="relative w-8 h-8">
                      <span className="absolute top-0 left-0 text-lg floating-element" style={{ animationDelay: '0s' }}>⭐</span>
                      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg floating-element" style={{ animationDelay: '0.5s' }}>✨</span>
                      <span className="absolute bottom-0 right-0 text-lg floating-element" style={{ animationDelay: '1s' }}>🌟</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-800">Анализируем совместимость</h3>
                  <div className="space-y-1">
                    <p className="text-gray-600 text-sm">🌟 Изучаем зодиакальные знаки</p>
                    <p className="text-gray-600 text-sm">🔮 Рассчитываем нумерологию</p>
                    <p className="text-gray-600 text-sm">💫 Анализируем энергетику</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className="telegram-gradient h-3 rounded-full transition-all duration-1000" style={{ width: "85%" }}></div>
                  </div>
                  <p className="text-xs text-gray-500 loading-dots">Почти готово</p>
                </div>
              </div>
            </div>
          )}

          {currentScreen === "results" && results && (
            <ResultsDisplay results={results} onRestart={handleRestart} />
          )}
        </main>
      </div>
    </div>
  );
}
