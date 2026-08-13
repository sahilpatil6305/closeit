import { prisma } from "@/lib/prisma";
import type {
  ConversationDTO,
  ConversationListItemDTO,
  CreateConversationInput,
  MessageDTO,
  MessageParticipantDTO,
  SendMessageInput,
} from "@/schemas/message";

const participantSelect = {
  id: true,
  displayName: true,
  username: true,
  avatar: true,
} as const;

const messageSelect = {
  id: true,
  content: true,
  senderId: true,
  createdAt: true,
  readAt: true,
} as const;

function conversationParticipantWhere(userId: string) {
  return {
    OR: [{ participantOneId: userId }, { participantTwoId: userId }],
  };
}

function mapParticipant(user: {
  id: string;
  displayName: string | null;
  username: string | null;
  avatar: string | null;
}): MessageParticipantDTO {
  return user;
}

function mapMessage(message: {
  id: string;
  content: string;
  senderId: string;
  createdAt: Date;
  readAt: Date | null;
}): MessageDTO {
  return {
    id: message.id,
    content: message.content,
    senderId: message.senderId,
    createdAt: message.createdAt.toISOString(),
    readAt: message.readAt?.toISOString() ?? null,
  };
}

function getCanonicalParticipantIds(firstUserId: string, secondUserId: string) {
  return firstUserId < secondUserId
    ? [firstUserId, secondUserId] as const
    : [secondUserId, firstUserId] as const;
}

export async function createConversation(
  userId: string,
  input: CreateConversationInput
): Promise<string> {
  if (input.participantId === userId) {
    throw new Error("You cannot start a conversation with yourself.");
  }

  const recipient = await prisma.user.findUnique({
    where: { id: input.participantId },
    select: { id: true },
  });

  if (!recipient) {
    throw new Error("Recipient not found.");
  }

  const [participantOneId, participantTwoId] = getCanonicalParticipantIds(
    userId,
    recipient.id
  );

  const conversation = await prisma.conversation.upsert({
    where: {
      participantOneId_participantTwoId: {
        participantOneId,
        participantTwoId,
      },
    },
    create: { participantOneId, participantTwoId },
    update: {},
    select: { id: true },
  });

  return conversation.id;
}

export async function getInbox(
  userId: string
): Promise<ConversationListItemDTO[]> {
  const conversations = await prisma.conversation.findMany({
    where: conversationParticipantWhere(userId),
    orderBy: { lastMessageAt: "desc" },
    select: {
      id: true,
      participantOne: { select: participantSelect },
      participantTwo: { select: participantSelect },
      lastMessageAt: true,
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: messageSelect,
      },
      _count: {
        select: {
          messages: {
            where: {
              senderId: { not: userId },
              readAt: null,
            },
          },
        },
      },
    },
  });

  return conversations.map((conversation) => ({
    id: conversation.id,
    participant: mapParticipant(
      conversation.participantOne.id === userId
        ? conversation.participantTwo
        : conversation.participantOne
    ),
    latestMessage: conversation.messages[0]
      ? mapMessage(conversation.messages[0])
      : null,
    lastMessageAt: conversation.lastMessageAt.toISOString(),
    unreadCount: conversation._count.messages,
  }));
}

export async function getUnreadMessageCount(userId: string): Promise<number> {
  return prisma.message.count({
    where: {
      readAt: null,
      senderId: { not: userId },
      conversation: conversationParticipantWhere(userId),
    },
  });
}

export async function getConversation(
  userId: string,
  conversationId: string
): Promise<ConversationDTO | null> {
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      ...conversationParticipantWhere(userId),
    },
    select: {
      id: true,
      participantOne: { select: participantSelect },
      participantTwo: { select: participantSelect },
      messages: {
        orderBy: { createdAt: "asc" },
        take: 100,
        select: messageSelect,
      },
    },
  });

  if (!conversation) {
    return null;
  }

  await prisma.message.updateMany({
    where: {
      conversationId: conversation.id,
      senderId: { not: userId },
      readAt: null,
    },
    data: { readAt: new Date() },
  });

  const readAtNow = new Date();

  return {
    id: conversation.id,
    participant: mapParticipant(
      conversation.participantOne.id === userId
        ? conversation.participantTwo
        : conversation.participantOne
    ),
    messages: conversation.messages.map((message) =>
      mapMessage({
        ...message,
        readAt:
          message.senderId !== userId && message.readAt === null
            ? readAtNow
            : message.readAt,
      })
    ),
  };
}

export async function sendMessage(
  userId: string,
  conversationId: string,
  input: SendMessageInput
): Promise<MessageDTO> {
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      ...conversationParticipantWhere(userId),
    },
    select: { id: true },
  });

  if (!conversation) {
    throw new Error("Conversation not found.");
  }

  const message = await prisma.$transaction(async (tx) => {
    const createdMessage = await tx.message.create({
      data: {
        conversationId: conversation.id,
        senderId: userId,
        content: input.content,
      },
      select: messageSelect,
    });

    await tx.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: createdMessage.createdAt },
    });

    return createdMessage;
  });

  return mapMessage(message);
}
