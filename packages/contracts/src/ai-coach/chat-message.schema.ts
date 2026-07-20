import { z } from "zod";

export const chatRoleSchema = z.enum(["USER", "ASSISTANT", "SYSTEM", "TOOL"]);
export type ChatRole = z.infer<typeof chatRoleSchema>;

export const sendMessageSchema = z.object({
  content: z.string().min(1).max(4000),
});
export type SendMessageInput = z.infer<typeof sendMessageSchema>;

export const chatMessageSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  role: chatRoleSchema,
  content: z.string(),
  createdAt: z.string().datetime(),
});
export type ChatMessage = z.infer<typeof chatMessageSchema>;

export const chatConversationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string().nullable(),
  createdAt: z.string().datetime(),
});
export type ChatConversation = z.infer<typeof chatConversationSchema>;
