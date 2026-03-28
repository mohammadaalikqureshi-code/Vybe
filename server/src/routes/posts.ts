import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, optionalAuth, type AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/posts — Feed
router.get('/', optionalAuth, async (req: AuthRequest, res) => {
  const take = Math.min(parseInt(req.query.limit as string) || 20, 50);
  const skip = parseInt(req.query.offset as string) || 0;

  let whereClause: any = {
    user: { isPrivate: false }
  };

  if (req.userId) {
    whereClause = {
      user: {
        AND: [
          { blockedBy: { none: { blockerId: req.userId } } },
          { blockedUsers: { none: { blockedId: req.userId } } },
          { mutedBy: { none: { muterId: req.userId } } },
          {
            OR: [
              { isPrivate: false },
              { followers: { some: { followerId: req.userId } } },
              { id: req.userId }
            ]
          }
        ]
      }
    };
  }

  const posts = await prisma.post.findMany({
    where: whereClause,
    include: {
      user: { select: { id: true, username: true, name: true, avatar: true, isVerified: true, isPrivate: true } },
      _count: { select: { comments: true, likes: true } },
      likes: req.userId ? { where: { userId: req.userId }, select: { id: true } } : false,
    },
    orderBy: { createdAt: 'desc' },
    take, skip,
  });

  res.json(posts.map(p => ({
    id: p.id,
    user: p.user,
    mediaUrl: p.mediaUrl,
    caption: p.caption,
    location: p.location,
    hashtags: p.hashtags ? p.hashtags.split(',').filter(Boolean) : [],
    likesCount: p._count.likes,
    commentsCount: p._count.comments,
    isLiked: req.userId ? (p.likes as any[]).length > 0 : false,
    createdAt: p.createdAt,
  })));
});

// POST /api/posts — Create
const createPostSchema = z.object({
  mediaUrl: z.string().url(),
  caption: z.string().min(1).max(2200),
  location: z.string().max(100).optional(),
  hashtags: z.array(z.string()).optional(),
});

router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const data = createPostSchema.parse(req.body);
    const post = await prisma.post.create({
      data: {
        userId: req.userId!,
        mediaUrl: data.mediaUrl,
        caption: data.caption,
        location: data.location || '',
        hashtags: (data.hashtags || []).join(','),
      },
      include: {
        user: { select: { id: true, username: true, name: true, avatar: true, isVerified: true } },
      },
    });
    res.status(201).json(post);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: err.errors });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/posts/:id/like — Toggle like
router.post('/:id/like', authMiddleware, async (req: AuthRequest, res) => {
  const existing = await prisma.like.findUnique({
    where: { postId_userId: { postId: (req.params.id as string), userId: req.userId! } }
  });
  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    res.json({ liked: false });
  } else {
    await prisma.like.create({ data: { postId: (req.params.id as string), userId: req.userId! } });
    // Create notification for post owner
    const post = await prisma.post.findUnique({ where: { id: (req.params.id as string) }, select: { userId: true } });
    if (post && post.userId !== req.userId) {
      await prisma.notification.create({
        data: {
          userId: post.userId, actorId: req.userId!, type: 'like',
          content: 'liked your post', postId: (req.params.id as string),
        }
      });
    }
    res.json({ liked: true });
  }
});

// GET /api/posts/:id/comments
router.get('/:id/comments', async (req, res) => {
  const comments = await prisma.comment.findMany({
    where: { postId: (req.params.id as string) },
    include: { user: { select: { id: true, username: true, name: true, avatar: true, isVerified: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  res.json(comments);
});

// POST /api/posts/:id/comments
const commentSchema = z.object({ content: z.string().min(1).max(500) });

router.post('/:id/comments', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const data = commentSchema.parse(req.body);
    const comment = await prisma.comment.create({
      data: { postId: (req.params.id as string), userId: req.userId!, content: data.content },
      include: { user: { select: { id: true, username: true, name: true, avatar: true, isVerified: true } } },
    });
    // Notification
    const post = await prisma.post.findUnique({ where: { id: (req.params.id as string) }, select: { userId: true } });
    if (post && post.userId !== req.userId) {
      await prisma.notification.create({
        data: {
          userId: post.userId, actorId: req.userId!, type: 'comment',
          content: `commented: "${data.content.slice(0, 50)}"`, postId: (req.params.id as string),
        }
      });
    }
    res.status(201).json(comment);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: err.errors });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/posts/:id
router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  const post = await prisma.post.findUnique({ where: { id: (req.params.id as string) } });
  if (!post) { res.status(404).json({ error: 'Post not found' }); return; }
  if (post.userId !== req.userId) { res.status(403).json({ error: 'Not authorized' }); return; }
  await prisma.post.delete({ where: { id: (req.params.id as string) } });
  res.json({ deleted: true });
});

export default router;
