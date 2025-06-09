import type { CompatibilityResults } from "@shared/schema";
import JSON5 from "json5";

// Removed generateTestCompatibilityData function

export async function calculateCompatibility(
  person1Date: string,
  person1Time: string,
  person2Date: string,
  person2Time: string
): Promise<CompatibilityResults> {
  console.log("Attempting to calculate compatibility using LLM7 API...");
  
  const prompt = `Рассчитай совместимость между двумя людьми на основе их дат и времени рождения. Входные данные:

- Человек 1: Дата рождения = ${person1Date}, Время рождения = ${person1Time}
- Человек 2: Дата рождения = ${person2Date}, Время рождения = ${person2Time}

Определи знаки зодиака для обоих людей, используя следующие границы дат:
- Овен: 21 марта - 19 апреля
- Телец: 20 апреля - 20 мая
- Близнецы: 21 мая - 20 июня
- Рак: 21 июня - 22 июля
- Лев: 23 июля - 22 августа
- Дева: 23 августа - 22 сентября
- Весы: 23 сентября - 22 октября
- Скорпион: 23 октября - 21 ноября
- Стрелец: 22 ноября - 21 декабря
- Козерог: 22 декабря - 19 января
- Водолей: 20 января - 18 февраля
- Рыбы: 19 февраля - 20 марта

Рассчитай совместимость по следующим категориям:
1. Совместимость по знакам зодиака (на основе знаков зодиака, вес 30%)
2. Элементарная совместимость (на основе стихий огня, земли, воздуха, воды, вес 20%)
3. Нумерологическая совместимость (на основе чисел даты рождения, вес 20%)
4. Эмоциональная совместимость (на основе времени рождения или асцендента, вес 20%)
5. Интеллектуальная совместимость (на основе знаков зодиака или других факторов, вес 10%)

Предоставь результат в следующем JSON формате:
{
  "zodiac_signs": { "person1": "<знак зодиака>", "person2": "<знак зодиака>" },
  "zodiac_compatibility": <процент>,
  "elemental_compatibility": <процент>,
  "numerological_compatibility": <процент>,
  "emotional_compatibility": <процент>,
  "intellectual_compatibility": <процент>,
  "overall_compatibility": <взвешенный средний процент>
}

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
    const compatibilityResults: CompatibilityResults & { zodiac_signs: { person1: string; person2: string } } = {
      zodiac_signs: { 
        person1: result.zodiac_signs?.person1 || "Неизвестно", 
        person2: result.zodiac_signs?.person2 || "Неизвестно" 
      },
      zodiac_compatibility: Math.max(0, Math.min(100, Math.round(result.zodiac_compatibility || 0))),
      elemental_compatibility: Math.max(0, Math.min(100, Math.round(result.elemental_compatibility || 0))),
      numerological_compatibility: Math.max(0, Math.min(100, Math.round(result.numerological_compatibility || 0))),
      emotional_compatibility: Math.max(0, Math.min(100, Math.round(result.emotional_compatibility || 0))),
      intellectual_compatibility: Math.max(0, Math.min(100, Math.round(result.intellectual_compatibility || 0))),
      overall_compatibility: Math.max(0, Math.min(100, Math.round(result.overall_compatibility || 0))),
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
