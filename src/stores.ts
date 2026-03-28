import { create } from 'zustand';
import type { Post, Reel, Notification, Conversation, AudioTrack, User } from './data';
import { POSTS, REELS, NOTIFICATIONS, CONVERSATIONS, AUDIO_TRACKS, USERS } from './data';

// ── UI Store ──
interface UIStore {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  showCreatePost: boolean;
  setShowCreatePost: (show: boolean) => void;
  showStoryViewer: boolean;
  activeStoryIndex: number;
  openStory: (index: number) => void;
  closeStory: () => void;
  selectedUserId: string | null;
  setSelectedUserId: (id: string | null) => void;
  showComments: string | null; // postId or null
  setShowComments: (postId: string | null) => void;
  showBooksPanel: boolean;
  setShowBooksPanel: (show: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  activeTab: 'feed',
  setActiveTab: (tab) => set({ activeTab: tab, selectedUserId: null }),
  theme: 'light',
  toggleTheme: () => set((s) => {
    const next = s.theme === 'dark' ? 'light' : 'dark';
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { theme: next };
  }),
  showNotifications: false,
  setShowNotifications: (show) => set({ showNotifications: show }),
  showCreatePost: false,
  setShowCreatePost: (show) => set({ showCreatePost: show }),
  showStoryViewer: false,
  activeStoryIndex: 0,
  openStory: (index) => set({ showStoryViewer: true, activeStoryIndex: index }),
  closeStory: () => set({ showStoryViewer: false }),
  selectedUserId: null,
  setSelectedUserId: (id) => set({ selectedUserId: id }),
  showComments: null,
  setShowComments: (postId) => set({ showComments: postId }),
  showBooksPanel: false,
  setShowBooksPanel: (show) => set({ showBooksPanel: show }),
}));

// ── Feed Store ──
export interface Comment {
  id: string;
  user: User;
  content: string;
  time: string;
  likes: number;
}

const MOCK_COMMENTS: Record<string, Comment[]> = {
  p1: [
    { id: 'cm1', user: USERS[1], content: 'SubhanAllah! The temple looks stunning 🙏', time: '45m', likes: 23 },
    { id: 'cm2', user: USERS[2], content: 'Beautiful vibes! Om Shanti 🙏', time: '30m', likes: 15 },
    { id: 'cm3', user: USERS[4], content: 'Waheguru Ji! What divine energy ✨', time: '20m', likes: 42 },
  ],
  p2: [
    { id: 'cm4', user: USERS[0], content: 'Ganpati Bappa Morya! 🐘🙏', time: '1h', likes: 67 },
    { id: 'cm5', user: USERS[5], content: 'Incredible celebrations! Joy everywhere 🎉', time: '50m', likes: 31 },
  ],
  p3: [
    { id: 'cm6', user: USERS[7], content: 'MashaAllah! The mosque is breathtaking 🕌', time: '2h', likes: 89 },
    { id: 'cm7', user: USERS[1], content: 'SubhanAllah! The sunset colors are magical 🌅', time: '1h', likes: 45 },
  ],
  p4: [
    { id: 'cm8', user: USERS[3], content: 'Peace be upon all 🙏', time: '3h', likes: 12 },
    { id: 'cm9', user: USERS[7], content: 'Beautiful meditation spot ☸️', time: '2h', likes: 28 },
  ],
  p5: [
    { id: 'cm10', user: USERS[0], content: 'The Golden Temple shines like gold! 🌟', time: '4h', likes: 120 },
    { id: 'cm11', user: USERS[6], content: 'Breathtaking architecture! SubhanAllah 🙏', time: '3h', likes: 56 },
  ],
};

interface FeedStore {
  posts: Post[];
  comments: Record<string, Comment[]>;
  toggleLike: (postId: string) => void;
  toggleSave: (postId: string) => void;
  addPost: (post: Post) => void;
  addComment: (postId: string, comment: Comment) => void;
  getComments: (postId: string) => Comment[];
}

export const useFeedStore = create<FeedStore>((set, get) => ({
  posts: POSTS,
  comments: MOCK_COMMENTS,
  toggleLike: (postId) => set((s) => ({
    posts: s.posts.map(p => p.id === postId ? {
      ...p,
      isLiked: !p.isLiked,
      likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1
    } : p)
  })),
  toggleSave: (postId) => set((s) => ({
    posts: s.posts.map(p => p.id === postId ? { ...p, isSaved: !p.isSaved } : p)
  })),
  addPost: (post) => set((s) => ({ posts: [post, ...s.posts] })),
  addComment: (postId, comment) => set((s) => ({
    comments: {
      ...s.comments,
      [postId]: [...(s.comments[postId] || []), comment],
    }
  })),
  getComments: (postId) => get().comments[postId] || [],
}));

// ── Follow Store ──
interface FollowStore {
  following: Set<string>;
  toggleFollow: (userId: string) => void;
  isFollowing: (userId: string) => boolean;
}

export const useFollowStore = create<FollowStore>((set, get) => ({
  following: new Set(USERS.filter(u => u.isFollowing).map(u => u.id)),
  toggleFollow: (userId) => set((s) => {
    const next = new Set(s.following);
    if (next.has(userId)) next.delete(userId);
    else next.add(userId);
    return { following: next };
  }),
  isFollowing: (userId) => get().following.has(userId),
}));

// ── Reel Store ──
interface ReelStore {
  reels: Reel[];
  currentIndex: number;
  setCurrentIndex: (i: number) => void;
  toggleLike: (reelId: string) => void;
}

export const useReelStore = create<ReelStore>((set) => ({
  reels: REELS,
  currentIndex: 0,
  setCurrentIndex: (i) => set({ currentIndex: i }),
  toggleLike: (reelId) => set((s) => ({
    reels: s.reels.map(r => r.id === reelId ? {
      ...r,
      isLiked: !r.isLiked,
      likesCount: r.isLiked ? r.likesCount - 1 : r.likesCount + 1
    } : r)
  })),
}));

// ── Notification Store ──
interface NotifStore {
  notifications: Notification[];
  unreadCount: number;
  markAllRead: () => void;
}

export const useNotifStore = create<NotifStore>((set) => ({
  notifications: NOTIFICATIONS,
  unreadCount: NOTIFICATIONS.filter(n => !n.read).length,
  markAllRead: () => set((s) => ({
    notifications: s.notifications.map(n => ({ ...n, read: true })),
    unreadCount: 0,
  })),
}));

// ── Message Store ──
interface MessageStore {
  conversations: Conversation[];
  activeChat: string | null;
  chatMessages: Record<string, Array<{ id: string; content: string; senderId: string; time: string }>>;
  setActiveChat: (id: string | null) => void;
  sendMessage: (convoId: string, content: string) => void;
}

const INITIAL_CHAT_MESSAGES: Record<string, Array<{ id: string; content: string; senderId: string; time: string }>> = {
  c1: [
    { id: 'm1', content: 'Har Har Mahadev! 🙏', senderId: 'other', time: '10:00 AM' },
    { id: 'm2', content: 'Mahadev! Did you see the morning aarti?', senderId: 'other', time: '10:01 AM' },
    { id: 'm3', content: 'Yes! It was divine ✨ The atmosphere was magical', senderId: 'me', time: '10:03 AM' },
    { id: 'm4', content: 'I recorded it! Will share the reel soon 📱', senderId: 'other', time: '10:05 AM' },
    { id: 'm5', content: 'Can\'t wait to see it! 🙏🔥', senderId: 'me', time: '10:06 AM' },
  ],
  c2: [
    { id: 'm6', content: 'Have you heard the new qawwali? 🎵', senderId: 'other', time: '9:00 AM' },
    { id: 'm7', content: 'Which one?', senderId: 'me', time: '9:05 AM' },
    { id: 'm8', content: 'The new qawwali is amazing! 🎵', senderId: 'other', time: '9:10 AM' },
    { id: 'm9', content: 'SubhanAllah! Sending it now 🤲', senderId: 'me', time: '9:12 AM' },
  ],
  c3: [
    { id: 'm10', content: 'Om Mani Padme Hum 🧘', senderId: 'other', time: '8:00 AM' },
    { id: 'm11', content: 'Peace and love 🙏☸️', senderId: 'me', time: '8:30 AM' },
  ],
};

export const useMessageStore = create<MessageStore>((set) => ({
  conversations: CONVERSATIONS,
  activeChat: null,
  chatMessages: INITIAL_CHAT_MESSAGES,
  setActiveChat: (id) => set({ activeChat: id }),
  sendMessage: (convoId, content) => set((s) => {
    const newMsg = {
      id: `m${Date.now()}`,
      content,
      senderId: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    return {
      chatMessages: {
        ...s.chatMessages,
        [convoId]: [...(s.chatMessages[convoId] || []), newMsg],
      },
      conversations: s.conversations.map(c =>
        c.id === convoId ? { ...c, lastMessage: content, lastMessageTime: 'now' } : c
      ),
    };
  }),
}));

// ── Audio Store ──
interface AudioStore {
  tracks: AudioTrack[];
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  play: (track: AudioTrack) => void;
  pause: () => void;
  toggle: () => void;
}

export const useAudioStore = create<AudioStore>((set) => ({
  tracks: AUDIO_TRACKS,
  currentTrack: null,
  isPlaying: false,
  play: (track) => set({ currentTrack: track, isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  toggle: () => set((s) => ({ isPlaying: !s.isPlaying })),
}));

// ── Auth Store ──
interface AuthStore {
  isAuthenticated: boolean;
  user: any | null;
  login: (userData: any) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  user: null,
  login: (userData) => set({ isAuthenticated: true, user: userData }),
  logout: () => {
    localStorage.removeItem('vybe_token');
    set({ isAuthenticated: false, user: null });
  },
  checkAuth: async () => {
    const token = localStorage.getItem('vybe_token');
    if (!token) return;
    try {
      const { api } = await import('./lib/api');
      const res = await api.get('/auth/me');
      set({ isAuthenticated: true, user: res.data });
    } catch (e) {
      localStorage.removeItem('vybe_token');
      set({ isAuthenticated: false, user: null });
    }
  }
}));
