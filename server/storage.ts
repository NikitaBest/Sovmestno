import { users, compatibilitySessions, type User, type InsertUser, type CompatibilitySession, type InsertCompatibilitySession } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createCompatibilitySession(session: InsertCompatibilitySession): Promise<CompatibilitySession>;
  getCompatibilitySession(id: number): Promise<CompatibilitySession | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private compatibilitySessions: Map<number, CompatibilitySession>;
  private currentUserId: number;
  private currentSessionId: number;

  constructor() {
    this.users = new Map();
    this.compatibilitySessions = new Map();
    this.currentUserId = 1;
    this.currentSessionId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createCompatibilitySession(insertSession: InsertCompatibilitySession): Promise<CompatibilitySession> {
    const id = this.currentSessionId++;
    const session: CompatibilitySession = {
      ...insertSession,
      id,
      createdAt: new Date(),
    };
    this.compatibilitySessions.set(id, session);
    return session;
  }

  async getCompatibilitySession(id: number): Promise<CompatibilitySession | undefined> {
    return this.compatibilitySessions.get(id);
  }
}

export const storage = new MemStorage();
