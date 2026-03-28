import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, optionalAuth, type AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/users/:id — Get user profile
router.get('/:id', optionalAuth, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: (req.params.id as string) },
    select: {
      id: true, username: true, name: true, avatar: true, bio: true,
      isVerified: true, isPrivate: true, createdAt: true,
      _count: { select: { posts: true, followers: true, following: true } }
    },
  });
  if (!user) { res.status(404).json({ error: 'User not found' }); return; }

  let isFollowing = false;
  if (req.userId) {
    const follow = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: req.userId, followingId: (req.params.targetId as string) } }
    });
    isFollowing = !!follow;
  }

  res.json({
    ...user,
    postsCount: user._count.posts,
    followersCount: user._count.followers,
    followingCount: user._count.following,
    isFollowing,
  });
});

// GET /api/users/:id/posts
router.get('/:id/posts', async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { userId: (req.params.id as string) },
    include: {
      user: { select: { id: true, username: true, name: true, avatar: true, isVerified: true } },
      _count: { select: { comments: true, likes: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
  res.json(posts.map(p => ({
    ...p,
    hashtags: p.hashtags ? p.hashtags.split(',').filter(Boolean) : [],
    likesCount: p._count.likes,
    commentsCount: p._count.comments,
  })));
});

// POST /api/users/:id/follow — Toggle follow or send request
router.post('/:id/follow', authMiddleware, async (req: AuthRequest, res) => {
  if (req.userId === (req.params.id as string)) {
    res.status(400).json({ error: "Can't follow yourself" });
    return;
  }
  const targetUser = await prisma.user.findUnique({ where: { id: (req.params.id as string) } });
  if (!targetUser) { res.status(404).json({ error: 'User not found' }); return; }

  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId: req.userId!, followingId: (req.params.targetId as string) } }
  });
  
  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
    res.json({ following: false, requested: false });
  } else {
    // Check if target is private
    if (targetUser.isPrivate) {
      const existingReq = await prisma.followRequest.findUnique({
        where: { senderId_receiverId: { senderId: req.userId!, receiverId: (req.params.id as string) } }
      });
      if (existingReq) {
        // Cancel request
        await prisma.followRequest.delete({ where: { id: existingReq.id } });
        res.json({ following: false, requested: false });
      } else {
        await prisma.followRequest.create({ data: { senderId: req.userId!, receiverId: (req.params.id as string) } });
        res.json({ following: false, requested: true });
      }
    } else {
      await prisma.follow.create({ data: { followerId: req.userId!, followingId: (req.params.targetId as string) } });
      await prisma.notification.create({
        data: { userId: (req.params.id as string), actorId: req.userId!, type: 'follow', content: 'started following you' }
      });
      res.json({ following: true, requested: false });
    }
  }
});

// GET /api/users/:id/followers
router.get('/:id/followers', async (req, res) => {
  const follows = await prisma.follow.findMany({
    where: { followingId: (req.params.id as string) },
    include: { follower: { select: { id: true, username: true, name: true, avatar: true, isVerified: true } } },
    take: 50,
  });
  res.json(follows.map(f => f.follower));
});

// GET /api/users/:id/following
router.get('/:id/following', async (req, res) => {
  const follows = await prisma.follow.findMany({
    where: { followerId: (req.params.id as string) },
    include: { following: { select: { id: true, username: true, name: true, avatar: true, isVerified: true } } },
    take: 50,
  });
  res.json(follows.map(f => f.following));
});

// --- Privacy, Blocks, Mutes & Requests ---

router.put('/:id/privacy', authMiddleware, async (req: AuthRequest, res) => {
  if (req.userId !== (req.params.id as string)) { res.status(403).json({ error: 'Unauthorized' }); return; }
  const { isPrivate } = req.body;
  const user = await prisma.user.update({
    where: { id: req.userId },
    data: { isPrivate: Boolean(isPrivate) }
  });
  res.json({ isPrivate: user.isPrivate });
});

router.get('/:id/blocks', authMiddleware, async (req: AuthRequest, res) => {
  if (req.userId !== (req.params.id as string)) { res.status(403).json({ error: 'Unauthorized' }); return; }
  const blocks = await prisma.block.findMany({
    where: { blockerId: req.userId },
    include: { blocked: { select: { id: true, username: true, name: true, avatar: true } } }
  });
  res.json(blocks.map(b => b.blocked));
});

router.post('/:id/block/:targetId', authMiddleware, async (req: AuthRequest, res) => {
  if (req.userId !== (req.params.id as string)) { res.status(403).json({ error: 'Unauthorized' }); return; }
  const existing = await prisma.block.findUnique({
    where: { blockerId_blockedId: { blockerId: req.userId, blockedId: (req.params.targetId as string) } }
  });
  if (existing) {
    await prisma.block.delete({ where: { id: existing.id } });
    res.json({ blocked: false });
  } else {
    await prisma.follow.deleteMany({
      where: {
        OR: [
          { followerId: req.userId, followingId: (req.params.targetId as string) },
          { followerId: (req.params.targetId as string), followingId: req.userId }
        ]
      }
    });
    await prisma.block.create({ data: { blockerId: req.userId, blockedId: (req.params.targetId as string) } });
    res.json({ blocked: true });
  }
});

router.get('/:id/mutes', authMiddleware, async (req: AuthRequest, res) => {
  if (req.userId !== (req.params.id as string)) { res.status(403).json({ error: 'Unauthorized' }); return; }
  const mutes = await prisma.mute.findMany({
    where: { muterId: req.userId },
    include: { muted: { select: { id: true, username: true, name: true, avatar: true } } }
  });
  res.json(mutes.map(m => m.muted));
});

router.post('/:id/mute/:targetId', authMiddleware, async (req: AuthRequest, res) => {
  if (req.userId !== (req.params.id as string)) { res.status(403).json({ error: 'Unauthorized' }); return; }
  const existing = await prisma.mute.findUnique({
    where: { muterId_mutedId: { muterId: req.userId, mutedId: (req.params.targetId as string) } }
  });
  if (existing) {
    await prisma.mute.delete({ where: { id: existing.id } });
    res.json({ muted: false });
  } else {
    await prisma.mute.create({ data: { muterId: req.userId, mutedId: (req.params.targetId as string) } });
    res.json({ muted: true });
  }
});

router.get('/:id/follow-requests', authMiddleware, async (req: AuthRequest, res) => {
  if (req.userId !== (req.params.id as string)) { res.status(403).json({ error: 'Unauthorized' }); return; }
  const requests = await prisma.followRequest.findMany({
    where: { receiverId: req.userId },
    include: { sender: { select: { id: true, username: true, name: true, avatar: true } } }
  });
  res.json(requests);
});

router.post('/:id/follow-requests/:senderId/accept', authMiddleware, async (req: AuthRequest, res) => {
  if (req.userId !== (req.params.id as string)) { res.status(403).json({ error: 'Unauthorized' }); return; }
  const request = await prisma.followRequest.findUnique({
    where: { senderId_receiverId: { senderId: (req.params.senderId as string), receiverId: req.userId } }
  });
  if (request) {
    await prisma.followRequest.delete({ where: { id: request.id } });
    await prisma.follow.create({ data: { followerId: (req.params.targetId as string), followingId: req.userId } });
    res.json({ accepted: true });
  } else {
    res.status(404).json({ error: 'Request not found' });
  }
});

export default router;
