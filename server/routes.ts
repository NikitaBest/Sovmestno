import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { compatibilityRequestSchema, type CompatibilityResults } from "@shared/schema";
import { calculateCompatibility } from "./lib/llm";

export async function registerRoutes(app: Express): Promise<Server> {
  // Calculate compatibility endpoint
  app.post("/api/compatibility", async (req, res) => {
    try {
      const validatedData = compatibilityRequestSchema.parse(req.body);
      
      const results: CompatibilityResults = await calculateCompatibility(
        validatedData.person1Date,
        validatedData.person1Time,
        validatedData.person2Date,
        validatedData.person2Time
      );

      // Store the session
      const session = await storage.createCompatibilitySession({
        telegramUserId: validatedData.telegramUserId,
        person1Date: validatedData.person1Date,
        person1Time: validatedData.person1Time,
        person2Date: validatedData.person2Date,
        person2Time: validatedData.person2Time,
        results: results as any, // jsonb type
      });

      res.json({
        sessionId: session.id,
        results,
      });
    } catch (error) {
      console.error("Compatibility calculation error:", error);
      
      if (error instanceof Error) {
        if (error.message.includes("parse")) {
          res.status(400).json({ 
            error: "Неверный формат данных. Проверьте даты и время." 
          });
        } else if (error.message.includes("Failed to analyze")) {
          res.status(500).json({ 
            error: "Ошибка анализа совместимости. Попробуйте позже." 
          });
        } else {
          res.status(500).json({ 
            error: "Произошла внутренняя ошибка сервера." 
          });
        }
      } else {
        res.status(500).json({ 
          error: "Произошла неизвестная ошибка." 
        });
      }
    }
  });

  // Get compatibility session by ID
  app.get("/api/compatibility/:id", async (req, res) => {
    try {
      const sessionId = parseInt(req.params.id);
      const session = await storage.getCompatibilitySession(sessionId);
      
      if (!session) {
        res.status(404).json({ error: "Сессия не найдена" });
        return;
      }

      res.json(session);
    } catch (error) {
      console.error("Get session error:", error);
      res.status(500).json({ error: "Ошибка получения данных сессии" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
