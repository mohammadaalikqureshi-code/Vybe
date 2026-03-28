import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, type AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/messages — Get conversations list
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  // Get all users that the current user has exchanged messages with
  const sentTo = await prisma.message.findMany({
    where: { senderId: req.userId },
    select: { receiverId: true },
    distinct: ['receiverId'],
  });
  const receivedFrom = await prisma.message.findMany({
    where: { receiverId: req.userId },
    select: { senderId: true },
    distinct: ['senderId'],
  });

  const otherUserIds = [...new Set([
    ...sentTo.map(m => m.receiverId),
    ...receivedFrom.map(m => m.senderId),
  ])];

  const conversations = await Promise.all(otherUserIds.map(async (otherId) => {
    const user = await prisma.user.findUnique({
      where: { id: otherId },
      select: { id: true, username: true, name: true, avatar: true, isVerified: true },
    });
    const lastMessage = await prisma.message.findFirst({
      where: {
        OR: [
          { senderId: req.userId, receiverId: otherId },
          { senderId: otherId, receiverId: req.userId },
        ]
      },
      orderBy: { createdAt: 'desc' },
    });
    const unread = await prisma.message.count({
      where: { senderId: otherId, receiverId: req.userId, read: false },
    });
    return {
      id: otherId,
      user,
      lastMessage: lastMessage?.content || '',
      lastMessageTime: lastMessage?.createdAt || new Date(),
      unread,
    };
  }));

  conversations.sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());
  res.json(conversations);
});

// GET /api/messages/:userId — Get messages with a specific user
router.get('/:userId', authMiddleware, async (req: AuthRequest, res) => {
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: req.userId, receiverId: (req.params.userId as string) },
        { senderId: (req.params.userId as string), receiverId: req.userId },
      ]
    },
    orderBy: { createdAt: 'asc' },
    take: 100,
  });

  // Mark as read
  await prisma.message.updateMany({
    where: { senderId: (req.params.userId as string), receiverId: req.userId, read: false },
    data: { read: true },
  });

  res.json(messages);
});

// POST /api/messages — Send a message
const messageSchema = z.object({
  receiverId: z.string(),
  content: z.string().min(1).max(2000),
});

router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const data = messageSchema.parse(req.body);
    const message = await prisma.message.create({
      data: { senderId: req.userId!, receiverId: data.receiverId, content: data.content },
    });
    res.status(201).json(message);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: err.errors });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
