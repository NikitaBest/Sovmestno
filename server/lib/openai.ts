import OpenAI from "openai";
import type { CompatibilityResults } from "@shared/schema";

// Use environment variable with fallback
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export async function calculateCompatibility(
  person1Date: string,
  person1Time: string,
  person2Date: string,
  person2Time: string
): Promise<CompatibilityResults> {
  const prompt = `You are an expert in astrology and numerology. Your task is to calculate the compatibility between two people based on their birth dates and times. The input data is:

- Person 1: Date of birth = ${person1Date}, Time of birth = ${person1Time}
- Person 2: Date of birth = ${person2Date}, Time of birth = ${person2Time}

Calculate compatibility in the following categories:
1. Zodiac compatibility (based on zodiac signs, 30% weight)
2. Elemental compatibility (based on fire, earth, air, water elements, 20% weight)
3. Numerological compatibility (based on birth date numbers, 20% weight)
4. Emotional compatibility (based on time of birth or ascendant, 20% weight)
5. Intellectual compatibility (based on zodiac or arbitrary factors, 10% weight)

Provide the result in the following JSON format:
{
  "zodiac_compatibility": <percentage>,
  "elemental_compatibility": <percentage>,
  "numerological_compatibility": <percentage>,
  "emotional_compatibility": <percentage>,
  "intellectual_compatibility": <percentage>,
  "overall_compatibility": <weighted average percentage>
}

Each percentage should be an integer between 0 and 100. Use astrological and numerological principles to make the results realistic and engaging. If precise calculations are not possible, use reasonable approximations based on zodiac signs, elements, and birth numbers. Ensure the overall compatibility is a weighted average of the categories.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    // Validate and ensure proper format
    const compatibilityResults: CompatibilityResults = {
      zodiac_compatibility: Math.max(0, Math.min(100, Math.round(result.zodiac_compatibility || 0))),
      elemental_compatibility: Math.max(0, Math.min(100, Math.round(result.elemental_compatibility || 0))),
      numerological_compatibility: Math.max(0, Math.min(100, Math.round(result.numerological_compatibility || 0))),
      emotional_compatibility: Math.max(0, Math.min(100, Math.round(result.emotional_compatibility || 0))),
      intellectual_compatibility: Math.max(0, Math.min(100, Math.round(result.intellectual_compatibility || 0))),
      overall_compatibility: Math.max(0, Math.min(100, Math.round(result.overall_compatibility || 0))),
    };

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
    throw new Error("Failed to analyze compatibility data");
  }
}
