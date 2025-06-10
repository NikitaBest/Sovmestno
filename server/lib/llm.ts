import type { CompatibilityResults } from "@shared/schema";
import JSON5 from "json5";

function getZodiacSign(date: string): string {
  const [day, month] = date.split('.').map(Number);
  
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Овен";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Телец";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Близнецы";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Рак";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Лев";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Дева";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Весы";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Скорпион";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Стрелец";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Козерог";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Водолей";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Рыбы";
  
  return "Неизвестно";
}

export async function calculateCompatibility(
  person1Date: string,
  person1Time: string,
  person2Date: string,
  person2Time: string
): Promise<CompatibilityResults> {
  console.log("Attempting to calculate compatibility using LLM7 API...");
  
  // Определяем знаки зодиака на сервере
  const person1ZodiacSign = getZodiacSign(person1Date);
  const person2ZodiacSign = getZodiacSign(person2Date);
  
  const prompt = `ВАЖНО: Верни ВСЕ поля из формата и примера ниже, даже если они пустые! Если не вернёшь все поля, результат будет считаться некорректным.

Рассчитай совместимость между двумя людьми на основе их дат и времени рождения. Входные данные:

- Человек 1: Дата рождения = ${person1Date}, Время рождения = ${person1Time}, Знак зодиака = ${person1ZodiacSign}
- Человек 2: Дата рождения = ${person2Date}, Время рождения = ${person2Time}, Знак зодиака = ${person2ZodiacSign}

Рассчитай совместимость по следующим категориям:
1. Совместимость по знакам зодиака (на основе знаков зодиака, вес 30%)
2. Элементарная совместимость (на основе стихий огня, земли, воздуха, воды, вес 20%)
3. Нумерологическая совместимость (на основе чисел даты рождения, вес 20%)
4. Эмоциональная совместимость (на основе времени рождения или асцендента, вес 20%)
5. Интеллектуальная совместимость (на основе знаков зодиака или других факторов, вес 10%)

Для каждой категории предоставь подробное описание совместимости, объясняющее сильные и слабые стороны пары в этой области.

Дополнительно:
- Укажи лучшие даты для совместных дел (например, свиданий, путешествий, важных разговоров) на ближайший месяц на основе астрологии. Приведи 2-3 конкретные даты и коротко поясни почему они благоприятны.
- Дай персональные советы для этой пары, как улучшить отношения, на что обратить внимание, как гармонизировать союз.

Предоставь результат в следующем JSON формате:
{
  "zodiac_compatibility": <процент>,
  "elemental_compatibility": <процент>,
  "numerological_compatibility": <процент>,
  "emotional_compatibility": <процент>,
  "intellectual_compatibility": <процент>,
  "overall_compatibility": <взвешенный средний процент>,
  "compatibility_message": "<краткое общее описание совместимости>",
  "detailed_description": "<подробное описание совместимости, включая анализ каждой категории>",
  "lucky_colors": ["<цвет1>", "<цвет2>", "<цвет3>"],
  "best_activities": ["<активность1>", "<активность2>", "<активность3>"],
  "best_dates": ["<дата1>", "<дата2>", "<дата3>"],
  "best_dates_comment": "<пояснение к выбору дат>",
  "relationship_tips": "<советы для пары>"
}

Пример ответа:
{
  "zodiac_compatibility": 70,
  "elemental_compatibility": 65,
  "numerological_compatibility": 70,
  "emotional_compatibility": 75,
  "intellectual_compatibility": 80,
  "overall_compatibility": 72,
  "compatibility_message": "Ваша пара гармонична и перспективна.",
  "detailed_description": "Пара отличается гармонией в эмоциональной сфере...",
  "lucky_colors": ["синий", "зеленый", "белый"],
  "best_activities": ["путешествия", "совместное обучение", "спорт"],
  "best_dates": ["12.06.2024", "18.06.2024", "25.06.2024"],
  "best_dates_comment": "В эти дни Луна и Венера благоприятствуют отношениям.",
  "relationship_tips": "Больше разговаривайте друг с другом, поддерживайте инициативу партнера."
}

ОБЯЗАТЕЛЬНО верни все поля, даже если для некоторых нет информации — пусть будут пустые строки или пустые массивы. Если не вернёшь все поля, результат будет считаться некорректным.

Пожалуйста, верни только JSON-объект в одну строку, без пояснений и лишнего текста.`;

  try {
    console.log("Sending request to LLM7 API...");
    const response = await fetch('https://api.llm7.io/v1/chat/completions', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'origin': 'https://llm7.io',
        'referer': 'https://llm7.io/',
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: "Ты эксперт в астрологии и нумерологии. Твоя задача - рассчитывать совместимость между людьми на основе их дат и времени рождения."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 1,
        stream: false
      })
    });

    console.log("Received response from LLM7 API, status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API request failed. Status:", response.status);
      console.error("Error response:", errorText);
      throw new Error("Что-то пошло не так, попробуйте позже");
    }

    const data = await response.json();
    console.log("API response data:", JSON.stringify(data, null, 2));

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Invalid API response format:", data);
      throw new Error("Что-то пошло не так, попробуйте позже");
    }

    const content = data.choices[0].message.content;
    console.log("API response content:", content);

    let result;
    try {
      let jsonStr;
      if (content.trim().startsWith('{') && content.trim().endsWith('}')) {
        jsonStr = content.trim();
      } else {
        const first = content.indexOf('{');
        const last = content.lastIndexOf('}');
        if (first === -1 || last === -1 || last <= first) {
          throw new Error("No JSON found in response");
        }
        jsonStr = content.substring(first, last + 1);
      }
      // Aggressively clean: remove all newlines, extra spaces, and any comma before a closing bracket
      jsonStr = jsonStr.replace(/\n/g, '').replace(/\s{2,}/g, ' ').replace(/,\s*([}\]])/g, '$1');
      console.log("Final jsonStr for parsing:", jsonStr);
      try {
        result = JSON5.parse(jsonStr);
      } catch (json5err) {
        // fallback to standard JSON.parse if JSON5 fails
        result = JSON.parse(jsonStr);
      }
      console.log("Parsed result:", result);
    } catch (e) {
      console.error("Failed to parse API response as JSON:", e);
      console.error("Raw content:", content);
      throw new Error("Что-то пошло не так, попробуйте позже");
    }

    // Validate and ensure proper format
    const compatibilityResults: CompatibilityResults & { zodiac_signs: { person1: string; person2: string }, best_dates?: string[], best_dates_comment?: string, relationship_tips?: string } = {
      zodiac_signs: { 
        person1: person1ZodiacSign,
        person2: person2ZodiacSign
      },
      zodiac_compatibility: Math.max(0, Math.min(100, Math.round(result.zodiac_compatibility || 0))),
      elemental_compatibility: Math.max(0, Math.min(100, Math.round(result.elemental_compatibility || 0))),
      numerological_compatibility: Math.max(0, Math.min(100, Math.round(result.numerological_compatibility || 0))),
      emotional_compatibility: Math.max(0, Math.min(100, Math.round(result.emotional_compatibility || 0))),
      intellectual_compatibility: Math.max(0, Math.min(100, Math.round(result.intellectual_compatibility || 0))),
      overall_compatibility: Math.max(0, Math.min(100, Math.round(result.overall_compatibility || 0))),
      compatibility_message: result.compatibility_message || "",
      detailed_description: result.detailed_description || "",
      lucky_colors: result.lucky_colors || [],
      best_activities: result.best_activities || [],
      best_dates: result.best_dates || [],
      best_dates_comment: result.best_dates_comment || "",
      relationship_tips: result.relationship_tips || ""
    };

    console.log("Final compatibility results:", compatibilityResults);

    // Calculate weighted average if overall_compatibility is not properly calculated
    if (!result.overall_compatibility) {
      compatibilityResults.overall_compatibility = Math.round(
        compatibilityResults.zodiac_compatibility * 0.3 +
        compatibilityResults.elemental_compatibility * 0.2 +
        compatibilityResults.numerological_compatibility * 0.2 +
        compatibilityResults.emotional_compatibility * 0.2 +
        compatibilityResults.intellectual_compatibility * 0.1
      );
    }

    return compatibilityResults;
  } catch (error) {
    console.error("Failed to calculate compatibility:", error);
    throw new Error("Что-то пошло не так, попробуйте позже");
  }
}
