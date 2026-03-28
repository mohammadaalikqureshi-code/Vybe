import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { generateToken, authMiddleware, type AuthRequest } from '../middleware/auth.js';

const router = Router();

const registerSchema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).max(100),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email: data.email }, { username: data.username }] }
    });
    if (existing) {
      res.status(400).json({ error: 'Email or username already taken' });
      return;
    }
    const hashed = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: { ...data, password: hashed, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}` },
      select: { id: true, username: true, name: true, email: true, avatar: true, bio: true, isVerified: true },
    });
    const token = generateToken(user.id);
    res.status(201).json({ user, token });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: err.errors });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }
    const token = generateToken(user.id);
    res.json({
      user: { id: user.id, username: user.username, name: user.name, email: user.email, avatar: user.avatar, bio: user.bio, isVerified: user.isVerified },
      token,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: err.errors });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: {
      id: true, username: true, name: true, email: true, avatar: true, bio: true,
      isVerified: true, isPrivate: true, createdAt: true,
      _count: { select: { posts: true, followers: true, following: true } }
    },
  });
  if (!user) { res.status(404).json({ error: 'User not found' }); return; }
  res.json({
    ...user,
    postsCount: user._count.posts,
    followersCount: user._count.followers,
    followingCount: user._count.following,
  });
});

export default router;
