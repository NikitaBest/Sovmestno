interface TelegramWebApp {
  ready(): void;
  expand(): void;
  close(): void;
  sendData(data: string): void;
  MainButton: {
    show(): void;
    hide(): void;
    setText(text: string): void;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
  };
  initDataUnsafe: {
    user?: {
      id: number;
      first_name?: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export function getTelegramWebApp(): TelegramWebApp | null {
  return window.Telegram?.WebApp || null;
}

export function initTelegramWebApp(): TelegramWebApp | null {
  const tg = getTelegramWebApp();
  if (tg) {
    tg.ready();
    tg.expand();
    tg.MainButton.hide();
  }
  return tg;
}

export function getTelegramUserId(): string | undefined {
  const tg = getTelegramWebApp();
  return tg?.initDataUnsafe.user?.id?.toString();
}

export function shareCompatibilityResults(results: any): void {
  const tg = getTelegramWebApp();
  if (tg && results) {
    const message = `🎯 Наша совместимость: ${results.overall_compatibility}%\n\n` +
                  `♈ Зодиакальная: ${results.zodiac_compatibility}%\n` +
                  `🌟 По стихиям: ${results.elemental_compatibility}%\n` +
                  `🔢 Нумерологическая: ${results.numerological_compatibility}%\n` +
                  `💕 Эмоциональная: ${results.emotional_compatibility}%\n` +
                  `🧠 Интеллектуальная: ${results.intellectual_compatibility}%`;
    
    tg.sendData(message);
  }
}
