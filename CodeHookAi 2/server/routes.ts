import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import Anthropic from '@anthropic-ai/sdk';
import { insertProjectSchema, insertMessageSchema } from "@shared/schema";
import { z } from "zod";

const messageRequestSchema = z.object({
  message: z.string(),
  projectId: z.number(),
  history: z.array(z.object({
    role: z.string(),
    content: z.string()
  })).optional()
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Debug API key (safely)
  const apiKey = process.env.CLAUDE_API_KEY || '';
  if (!apiKey) {
    console.error('API key is missing!');
  } else {
    console.log('API Key Debug:', {
      length: apiKey.length,
      prefix: apiKey.substring(0, 3),
      suffix: apiKey.substring(apiKey.length - 3),
      startsWithSk: apiKey.startsWith('sk-')
    });
  }

  const anthropic = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY,
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const project = insertProjectSchema.parse(req.body);
      const result = await storage.createProject(project);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid project data" });
    }
  });

  app.patch("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = insertProjectSchema.parse(req.body);
      const result = await storage.updateProject(id, project);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid project data" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      if (!project) {
        res.status(404).json({ error: "Project not found" });
        return;
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  app.get("/api/messages/:projectId", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const messages = await storage.getMessages(projectId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to get messages" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { message, projectId, history } = messageRequestSchema.parse(req.body);

      // Format conversation history
      const messages = [];
      if (history && history.length > 0) {
        for (const entry of history) {
          messages.push({
            role: entry.role,
            content: entry.content
          });
        }
      }

      // Add current message
      messages.push({
        role: "user",
        content: message
      });

      // Store user message first
      await storage.createMessage({
        role: "user",
        content: message,
        hasCode: false,
        projectId
      });

      // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
      const response = await anthropic.messages.create({
        model: "claude-3-7-sonnet-20250219",
        messages: messages,
        max_tokens: 4000
      });

      if (!response.content || !response.content[0]) {
        throw new Error('Invalid response format from Claude API');
      }

      const responseContent = response.content[0].text;
      const hasCode = responseContent.includes('```');

      // Create and store the message
      const newMessage = await storage.createMessage({
        role: "assistant",
        content: responseContent,
        hasCode,
        projectId
      });

      res.json(newMessage);

    } catch (error: any) {
      console.error('Error calling Claude API:', {
        name: error.name,
        message: error.message,
        type: error.type,
        status: error.status,
        stack: error.stack
      });

      if (error.status === 401) {
        res.status(401).json({
          error: 'Authentication failed',
          details: 'Please check if your Claude API key is valid and properly configured'
        });
        return;
      }

      if (error.message?.includes('credit balance is too low')) {
        res.status(402).json({
          error: 'Insufficient credits',
          details: 'Your Claude API account needs additional credits. Please visit https://console.anthropic.com/ to add credits to your account.'
        });
        return;
      }

      res.status(500).json({
        error: 'Failed to get AI response',
        details: error.message
      });
    }
  });

  app.post("/api/langchain", async (req, res) => {
    try {
      const { code, projectId } = req.body;
      // This is explicitly requested to be simulated
      res.json({
        success: true,
        result: "LangChain har modtaget koden og er ved at bearbejde den...",
        simulatedResponse: true
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to process code with LangChain" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}