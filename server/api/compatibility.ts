import { Router } from "express";
import { calculateCompatibility, calculateDetailedCompatibility, calculateDetailedCompatibilityFull } from "../lib/llm";
import { z } from "zod";

const router = Router();

const compatibilityRequestSchema = z.object({
  person1Date: z.string(),
  person1Time: z.string(),
  person2Date: z.string(),
  person2Time: z.string(),
});

router.post("/", async (req, res) => {
  try {
    const { person1Date, person1Time, person2Date, person2Time } = compatibilityRequestSchema.parse(req.body);
    const results = await calculateCompatibility(person1Date, person1Time, person2Date, person2Time);
    res.json({ results });
  } catch (error) {
    console.error("Error in compatibility calculation:", error);
    res.status(500).json({ error: "Что-то пошло не так, попробуйте позже" });
  }
});

router.post("/detailed", async (req, res) => {
  try {
    const { person1Date, person1Time, person2Date, person2Time } = compatibilityRequestSchema.parse(req.body);
    const results = await calculateDetailedCompatibilityFull(person1Date, person1Time, person2Date, person2Time);
    res.json(results);
  } catch (error) {
    console.error("Error in detailed compatibility calculation:", error);
    res.status(500).json({ error: "Что-то пошло не так, попробуйте позже" });
  }
});

export default router; 