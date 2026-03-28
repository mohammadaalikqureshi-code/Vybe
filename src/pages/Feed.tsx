import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore, useFeedStore } from '../stores';
import { STORIES, CURRENT_USER, formatCount } from '../data';
import type { Comment } from '../stores';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';

export function FeedPage() {
  const posts = useFeedStore(s => s.posts);
  const openStory = useUIStore(s => s.openStory);
  const setActiveTab = useUIStore(s => s.setActiveTab);
  const setSelectedUserId = useUIStore(s => s.setSelectedUserId);

  const goToProfile = (userId: string) => {
    setSelectedUserId(userId);
    setActiveTab('profile');
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Stories bar */}
      <div className="flex gap-3 px-4 py-4 overflow-x-auto scrollbar-hide">
        {/* Your story */}
        <button className="flex flex-col items-center gap-1 flex-shrink-0">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-vybe-border overflow-hidden">
              <img src={CURRENT_USER.avatar} alt="" className="w-full h-full object-cover opacity-70" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-vybe-primary rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-vybe-darker">+</div>
          </div>
          <span className="text-[10px] text-vybe-text-muted">Your story</span>
        </button>
        {STORIES.map((story, i) => (
          <button key={story.id} onClick={() => openStory(i)} className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className={story.seen ? 'story-ring-seen' : 'story-ring'}>
              <div className="bg-vybe-darker p-0.5 rounded-full">
                <img src={story.user.avatar} alt="" className="w-14 h-14 rounded-full object-cover" />
              </div>
            </div>
            <span className="text-[10px] text-vybe-text-muted max-w-[56px] truncate">{story.user.username}</span>
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-6 pb-24">
        {posts.map(post => (
          <PostCard key={post.id} post={post} onProfileClick={() => goToProfile(post.user.id)} />
        ))}
      </div>
    </div>
  );
}

function PostCard({ post, onProfileClick }: { post: typeof import('../data').POSTS[0]; onProfileClick: () => void }) {
  const toggleLike = useFeedStore(s => s.toggleLike);
  const toggleSave = useFeedStore(s => s.toggleSave);
  const setShowComments = useUIStore(s => s.setShowComments);
  const [showDoubleTapHeart, setShowDoubleTapHeart] = useState(false);
  const lastTap = useRef(0);

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      if (!post.isLiked) toggleLike(post.id);
      setShowDoubleTapHeart(true);
      setTimeout(() => setShowDoubleTapHeart(false), 800);
    }
    lastTap.current = now;
  };

  return (
    <article className="border-b border-vybe-border pb-4">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <button onClick={onProfileClick} className="story-ring flex-shrink-0" style={{ padding: '2px' }}>
          <div className="bg-vybe-darker p-0.5 rounded-full">
            <img src={post.user.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
          </div>
        </button>
        <div className="flex-1 min-w-0">
          <button onClick={onProfileClick} className="text-sm font-semibold text-vybe-text hover:underline">{post.user.username}</button>
          {post.location && <p className="text-xs text-vybe-text-muted">{post.location}</p>}
        </div>
        <button className="text-vybe-text-muted"><MoreHorizontal className="w-5 h-5" /></button>
      </div>

      {/* Image with double-tap */}
      <div className="relative cursor-pointer select-none" onClick={handleDoubleTap}>
        <img src={post.mediaUrl} alt="" className="w-full aspect-square object-cover" />
        <AnimatePresence>
          {showDoubleTapHeart && (
            <motion.div initial={{ scale: 0, opacity: 1 }} animate={{ scale: 1.2 }} exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Heart className="w-24 h-24 text-white fill-white drop-shadow-2xl" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 pt-3">
        <div className="flex items-center gap-4">
          <motion.button whileTap={{ scale: 0.8 }} onClick={() => toggleLike(post.id)}>
            <Heart className={`w-6 h-6 transition-colors ${post.isLiked ? 'text-red-500 fill-red-500' : 'text-vybe-text hover:text-vybe-text-muted'}`} />
          </motion.button>
          <button onClick={() => setShowComments(post.id)} className="text-vybe-text hover:text-vybe-text-muted transition-colors">
            <MessageCircle className="w-6 h-6" />
          </button>
          <button className="text-vybe-text hover:text-vybe-text-muted transition-colors">
            <Send className="w-6 h-6" />
          </button>
        </div>
        <motion.button whileTap={{ scale: 0.8 }} onClick={() => toggleSave(post.id)}>
          <Bookmark className={`w-6 h-6 transition-colors ${post.isSaved ? 'text-vybe-primary fill-vybe-primary' : 'text-vybe-text hover:text-vybe-text-muted'}`} />
        </motion.button>
      </div>

      {/* Likes */}
      <div className="px-4 mt-2">
        <p className="text-sm font-semibold text-vybe-text">{formatCount(post.likesCount)} likes</p>
      </div>

      {/* Caption */}
      <div className="px-4 mt-1">
        <p className="text-sm text-vybe-text">
          <button onClick={onProfileClick} className="font-semibold mr-1.5 hover:underline">{post.user.username}</button>
          {post.caption}
        </p>
      </div>

      {/* Comments */}
      <button onClick={() => setShowComments(post.id)} className="px-4 mt-1">
        <p className="text-sm text-vybe-text-muted">View all {post.commentsCount} comments</p>
      </button>

      <p className="px-4 mt-1 text-[10px] text-vybe-text-muted uppercase">{post.createdAt}</p>
    </article>
  );
}

// ── Comment Drawer ──
export function CommentDrawer() {
  const { showComments, setShowComments } = useUIStore();
  const { comments, addComment } = useFeedStore();
  const [newComment, setNewComment] = useState('');

  if (!showComments) return null;

  const postComments = comments[showComments] || [];

  const handleSend = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: `cm${Date.now()}`,
      user: CURRENT_USER,
      content: newComment,
      time: 'now',
      likes: 0,
    };
    addComment(showComments, comment);
    setNewComment('');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center"
      onClick={() => setShowComments(null)}>
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
        className="bg-vybe-card border-t border-vybe-border rounded-t-3xl w-full max-w-lg max-h-[70vh] flex flex-col"
        onClick={e => e.stopPropagation()}>

        {/* Handle */}
        <div className="flex justify-center py-3">
          <div className="w-10 h-1 bg-vybe-border rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-3 border-b border-vybe-border">
          <h3 className="font-bold text-vybe-text">Comments</h3>
          <button onClick={() => setShowComments(null)} className="text-vybe-text-muted"><X className="w-5 h-5" /></button>
        </div>

        {/* Comments list */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {postComments.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-vybe-text-muted mx-auto mb-3 opacity-40" />
              <p className="text-vybe-text-muted text-sm">No comments yet. Be the first! 🙏</p>
            </div>
          ) : (
            postComments.map(c => (
              <div key={c.id} className="flex gap-3">
                <img src={c.user.avatar} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-semibold text-vybe-text mr-1.5">{c.user.username}</span>
                    <span className="text-vybe-text">{c.content}</span>
                  </p>
                  <div className="flex gap-3 mt-1 text-xs text-vybe-text-muted">
                    <span>{c.time}</span>
                    <button className="font-medium hover:text-vybe-text">{c.likes} likes</button>
                    <button className="font-medium hover:text-vybe-text">Reply</button>
                  </div>
                </div>
                <button className="text-vybe-text-muted hover:text-red-400 mt-1">
                  <Heart className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="flex items-center gap-3 p-4 border-t border-vybe-border">
          <img src={CURRENT_USER.avatar} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
          <input value={newComment} onChange={e => setNewComment(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Add a comment..."
            className="flex-1 bg-transparent text-sm text-vybe-text placeholder-vybe-text-muted focus:outline-none" />
          <button onClick={handleSend} disabled={!newComment.trim()}
            className="text-vybe-primary font-semibold text-sm disabled:opacity-40 hover:opacity-80 transition-opacity">
            Post
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Story Viewer ──
export function StoryViewer() {
  const { showStoryViewer, activeStoryIndex, closeStory, openStory } = useUIStore();
  if (!showStoryViewer) return null;
  const story = STORIES[activeStoryIndex];
  if (!story) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <button onClick={closeStory} className="absolute top-4 right-4 text-white z-10"><X className="w-6 h-6" /></button>
      {/* Progress bars */}
      <div className="absolute top-2 left-2 right-2 flex gap-1 z-10">
        {STORIES.map((_, i) => (
          <div key={i} className="flex-1 h-0.5 rounded-full overflow-hidden bg-white/30">
            {i <= activeStoryIndex && <div className="h-full bg-white rounded-full" style={{ width: i < activeStoryIndex ? '100%' : '50%' }} />}
          </div>
        ))}
      </div>
      {/* User info */}
      <div className="absolute top-6 left-4 flex items-center gap-2 z-10">
        <img src={story.user.avatar} alt="" className="w-8 h-8 rounded-full object-cover ring-2 ring-white/50" />
        <span className="text-white text-sm font-semibold">{story.user.username}</span>
        <span className="text-white/60 text-xs">{story.createdAt}</span>
      </div>
      {/* Story image */}
      <img src={story.mediaUrl} alt="" className="max-h-full max-w-full object-contain" />
      {/* Nav arrows */}
      {activeStoryIndex > 0 && (
        <button onClick={() => openStory(activeStoryIndex - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white">
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}
      {activeStoryIndex < STORIES.length - 1 && (
        <button onClick={() => openStory(activeStoryIndex + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white">
          <ChevronRight className="w-8 h-8" />
        </button>
      )}
    </motion.div>
  );
}
