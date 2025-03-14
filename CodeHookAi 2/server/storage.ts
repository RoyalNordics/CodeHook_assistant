import { messages, type Message, type InsertMessage, projects, type Project, type InsertProject } from "@shared/schema";

export interface IStorage {
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: InsertProject): Promise<Project>;
  getMessages(projectId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
}

export class MemStorage implements IStorage {
  private projects: Map<number, Project>;
  private messages: Map<number, Message>;
  private currentProjectId: number;
  private currentMessageId: number;

  constructor() {
    this.projects = new Map();
    this.messages = new Map();
    this.currentProjectId = 1;
    this.currentMessageId = 1;
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(project: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const newProject = { ...project, id };
    this.projects.set(id, newProject);
    return newProject;
  }

  async updateProject(id: number, project: InsertProject): Promise<Project> {
    const updatedProject = { ...project, id };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async getMessages(projectId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      (message) => message.projectId === projectId
    );
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const newMessage = { ...message, id };
    this.messages.set(id, newMessage);
    return newMessage;
  }
}

export const storage = new MemStorage();
