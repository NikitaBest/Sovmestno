import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { CompatibilityForm } from "@/components/compatibility-form";
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
    <div className="min-h-screen pb-4">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <header className="telegram-gradient text-white p-4 sticky top-0 z-10 shadow-lg">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">💫 Совместимость</h1>
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-sm">⚡</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4">
          {currentScreen === "input" && (
            <CompatibilityForm
              onSubmit={handleSubmit}
              isLoading={compatibilityMutation.isPending}
              error={error}
            />
          )}

          {currentScreen === "loading" && (
            <div className="text-center py-12 animate-fade-in-up">
              <div className="space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 mx-auto telegram-gradient rounded-full flex items-center justify-center animate-bounce-in">
                    <span className="text-white text-3xl">🔮</span>
                  </div>
                  <div className="absolute -top-2 -right-2 floating-heart">💫</div>
                  <div className="absolute -bottom-2 -left-2 floating-heart" style={{ animationDelay: '1s' }}>✨</div>
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
