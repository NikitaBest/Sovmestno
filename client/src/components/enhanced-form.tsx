import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { compatibilityRequestSchema, type CompatibilityRequest } from "@shared/schema";
import { getTelegramUserId } from "@/lib/telegram";

interface EnhancedFormProps {
  onSubmit: (data: CompatibilityRequest) => Promise<void>;
  isLoading: boolean;
  error?: string;
}

export function EnhancedForm({ onSubmit, isLoading, error }: EnhancedFormProps) {
  const form = useForm<CompatibilityRequest>({
    resolver: zodResolver(compatibilityRequestSchema),
    defaultValues: {
      person1Date: "",
      person1Time: "",
      person2Date: "",
      person2Time: "",
      telegramUserId: getTelegramUserId(),
    },
  });

  const formatDateInput = (value: string) => {
    let formatted = value.replace(/\D/g, '');
    if (formatted.length >= 2) {
      formatted = formatted.substring(0, 2) + '.' + formatted.substring(2);
    }
    if (formatted.length >= 5) {
      formatted = formatted.substring(0, 5) + '.' + formatted.substring(5, 9);
    }
    return formatted;
  };

  const formatTimeInput = (value: string) => {
    let formatted = value.replace(/\D/g, '');
    if (formatted.length >= 2) {
      formatted = formatted.substring(0, 2) + ':' + formatted.substring(2, 4);
    }
    return formatted;
  };

  const handleFormSubmit = async (data: CompatibilityRequest) => {
    await onSubmit(data);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <div className="aurora-gradient p-8 rounded-3xl glass-card hover-lift">
        <div className="text-center">
          <div className="relative mb-4">
            <div className="text-5xl mb-3">🌟</div>
            <div className="absolute -top-2 -right-2 floating-heart">💫</div>
            <div className="absolute -bottom-2 -left-2 floating-heart" style={{ animationDelay: '1s' }}>✨</div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Откройте тайны совместимости</h2>
          <p className="text-gray-600 leading-relaxed">Узнайте, что говорят звезды о ваших отношениях через астрологию и нумерологию</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Person 1 Data */}
          <Card className="neo-card hover-lift border-0">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 magic-gradient rounded-2xl flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">👤</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Ваши данные</h3>
                  <p className="text-gray-500 text-sm">Введите информацию о себе</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="person1Date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        📅 Дата рождения
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="ДД.ММ.ГГГГ"
                          maxLength={10}
                          className="p-5 border-2 border-gray-100 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-300 transition-all duration-300 text-base bg-gray-50 hover:bg-white font-medium"
                          onChange={(e) => {
                            const formatted = formatDateInput(e.target.value);
                            field.onChange(formatted);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="person1Time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        🕐 Время рождения
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="ЧЧ:ММ"
                          maxLength={5}
                          className="p-5 border-2 border-gray-100 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-300 transition-all duration-300 text-base bg-gray-50 hover:bg-white font-medium"
                          onChange={(e) => {
                            const formatted = formatTimeInput(e.target.value);
                            field.onChange(formatted);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Person 2 Data */}
          <Card className="neo-card hover-lift border-0">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 cosmic-gradient rounded-2xl flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">💕</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Данные партнера</h3>
                  <p className="text-gray-500 text-sm">Информация о вашей второй половинке</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="person2Date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        📅 Дата рождения
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="ДД.ММ.ГГГГ"
                          maxLength={10}
                          className="p-5 border-2 border-gray-100 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-300 transition-all duration-300 text-base bg-gray-50 hover:bg-white font-medium"
                          onChange={(e) => {
                            const formatted = formatDateInput(e.target.value);
                            field.onChange(formatted);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="person2Time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        🕐 Время рождения
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="ЧЧ:ММ"
                          maxLength={5}
                          className="p-5 border-2 border-gray-100 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-300 transition-all duration-300 text-base bg-gray-50 hover:bg-white font-medium"
                          onChange={(e) => {
                            const formatted = formatTimeInput(e.target.value);
                            field.onChange(formatted);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-2xl text-sm">
              <div className="flex items-center">
                <span className="mr-3 text-lg">⚠️</span>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full magic-gradient text-white py-6 px-8 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center justify-center">
              <span className="mr-3 text-xl">✨</span>
              {isLoading ? "Анализируем магию..." : "Раскрыть тайны совместимости"}
            </span>
          </Button>
        </form>
      </Form>
    </div>
  );
}