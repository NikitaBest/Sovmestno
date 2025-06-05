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
            <div className="text-center py-12">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto telegram-gradient rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-white text-2xl">🔮</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Анализируем совместимость...</h3>
                <p className="text-gray-600 text-sm">Изучаем ваши астрологические данные</p>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="telegram-gradient h-2 rounded-full animate-pulse" style={{ width: "60%" }}></div>
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
