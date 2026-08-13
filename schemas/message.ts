import { z } from "zod";

export const createConversationSchema = z.object({
  participantId: z.string().min(1, { message: "A recipient is required." }),
});

export const sendMessageSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, { message: "Message content cannot be empty." })
    .max(2_000, { message: "Message content must not exceed 2000 characters." }),
});

export type CreateConversationInput = z.output<typeof createConversationSchema>;
export type SendMessageInput = z.output<typeof sendMessageSchema>;

export interface MessageParticipantDTO {
  id: string;
  displayName: string | null;
  username: string | null;
  avatar: string | null;
}

export interface MessageDTO {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  readAt: string | null;
}

export interface ConversationListItemDTO {
  id: string;
  participant: MessageParticipantDTO;
  latestMessage: MessageDTO | null;
  lastMessageAt: string;
  unreadCount: number;
}

export interface ConversationDTO {
  id: string;
  participant: MessageParticipantDTO;
  messages: MessageDTO[];
}
