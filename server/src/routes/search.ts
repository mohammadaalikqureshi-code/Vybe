import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

// GET /api/search?q=query&type=all|users|posts|tags|audio
router.get('/', async (req, res) => {
  const q = (req.query.q as string || '').trim();
  const type = (req.query.type as string) || 'all';

  if (!q) {
    res.json({ users: [], posts: [], tags: [], audio: [] });
    return;
  }

  const result: any = {};

  if (type === 'all' || type === 'users') {
    result.users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: q } },
          { name: { contains: q } },
          { bio: { contains: q } },
        ]
      },
      select: { id: true, username: true, name: true, avatar: true, isVerified: true, bio: true,
        _count: { select: { followers: true } }
      },
      take: 10,
    });
    result.users = result.users.map((u: any) => ({
      ...u, followersCount: u._count.followers,
    }));
  }

  if (type === 'all' || type === 'posts') {
    result.posts = await prisma.post.findMany({
      where: {
        OR: [
          { caption: { contains: q } },
          { hashtags: { contains: q } },
          { location: { contains: q } },
        ]
      },
      include: {
        user: { select: { id: true, username: true, name: true, avatar: true, isVerified: true } },
        _count: { select: { likes: true, comments: true } },
      },
      take: 12,
      orderBy: { createdAt: 'desc' },
    });
    result.posts = result.posts.map((p: any) => ({
      ...p,
      hashtags: p.hashtags ? p.hashtags.split(',').filter(Boolean) : [],
      likesCount: p._count.likes,
      commentsCount: p._count.comments,
    }));
  }

  if (type === 'all' || type === 'tags') {
    // Get unique hashtags containing the query
    const posts = await prisma.post.findMany({
      where: { hashtags: { contains: q } },
      select: { hashtags: true },
    });
    const tagMap = new Map<string, number>();
    posts.forEach(p => {
      p.hashtags.split(',').filter(Boolean).forEach(tag => {
        if (tag.toLowerCase().includes(q.toLowerCase())) {
          tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
        }
      });
    });
    result.tags = Array.from(tagMap.entries())
      .map(([name, count]) => ({ name, postsCount: count }))
      .sort((a, b) => b.postsCount - a.postsCount)
      .slice(0, 10);
  }

  if (type === 'all' || type === 'audio') {
    result.audio = await prisma.audioTrack.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { artist: { contains: q } },
          { category: { contains: q } },
        ]
      },
      take: 10,
    });
  }

  res.json(result);
});

export default router;
