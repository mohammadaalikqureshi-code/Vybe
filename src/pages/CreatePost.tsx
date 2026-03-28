import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore, useFeedStore } from '../stores';
import { CURRENT_USER, POST_IMAGES } from '../data';
import type { Post } from '../data';
import { X, Image, MapPin, Hash, Sparkles } from 'lucide-react';

export function CreatePostModal() {
  const { showCreatePost, setShowCreatePost } = useUIStore();
  const addPost = useFeedStore(s => s.addPost);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);

  const availableImages = POST_IMAGES;

  const handlePost = () => {
    if (!caption.trim()) return;
    const hashtags = caption.match(/#\w+/g)?.map(h => h.slice(1)) || [];
    const newPost: Post = {
      id: `p${Date.now()}`,
      user: CURRENT_USER,
      mediaUrl: availableImages[selectedImage],
      caption,
      location: location || undefined,
      likesCount: 0,
      commentsCount: 0,
      savesCount: 0,
      isLiked: false,
      isSaved: false,
      createdAt: 'Just now',
      hashtags,
    };
    addPost(newPost);
    setCaption('');
    setLocation('');
    setSelectedImage(0);
    setShowCreatePost(false);
  };

  return (
    <AnimatePresence>
      {showCreatePost && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowCreatePost(false)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-vybe-card border border-vybe-border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-vybe-border">
              <h2 className="text-lg font-bold text-vybe-text">Create Post</h2>
              <div className="flex items-center gap-3">
                <button onClick={handlePost} disabled={!caption.trim()}
                  className="px-4 py-1.5 rounded-lg bg-vybe-primary text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-vybe-primary/90 transition-colors">
                  Share
                </button>
                <button onClick={() => setShowCreatePost(false)} className="text-vybe-text-muted hover:text-vybe-text">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* User info */}
            <div className="flex items-center gap-3 p-4 pb-2">
              <img src={CURRENT_USER.avatar} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-vybe-primary/20" />
              <div>
                <p className="font-semibold text-sm text-vybe-text">{CURRENT_USER.username}</p>
                {location && <p className="text-xs text-vybe-text-muted flex items-center gap-1"><MapPin className="w-3 h-3" />{location}</p>}
              </div>
            </div>

            {/* Caption */}
            <div className="px-4 pb-3">
              <textarea
                value={caption} onChange={e => setCaption(e.target.value)}
                placeholder="Share something spiritual... 🙏"
                className="w-full bg-transparent text-vybe-text placeholder-vybe-text-muted text-sm resize-none focus:outline-none min-h-[80px]"
                rows={3} />
            </div>

            {/* Image selector */}
            <div className="px-4 pb-3">
              <p className="text-xs font-semibold text-vybe-text-muted uppercase tracking-wider mb-2 flex items-center gap-1">
                <Image className="w-3.5 h-3.5" /> Choose Image
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {availableImages.slice(0, 8).map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden ring-2 transition-all ${selectedImage === i ? 'ring-vybe-primary scale-105' : 'ring-transparent opacity-60 hover:opacity-100'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Selected image preview */}
            <div className="px-4 pb-4">
              <div className="relative rounded-xl overflow-hidden aspect-square max-h-64">
                <img src={availableImages[selectedImage]} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            </div>

            {/* Action bar */}
            <div className="flex items-center gap-4 px-4 py-3 border-t border-vybe-border">
              <div className="flex-1 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-vybe-text-muted" />
                <input value={location} onChange={e => setLocation(e.target.value)}
                  placeholder="Add location..."
                  className="bg-transparent text-sm text-vybe-text placeholder-vybe-text-muted focus:outline-none flex-1" />
              </div>
              <div className="flex items-center gap-1 text-vybe-text-muted">
                <Hash className="w-4 h-4" />
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
