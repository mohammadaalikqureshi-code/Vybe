import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReelStore } from '../stores';
import { formatCount } from '../data';
import { Heart, MessageCircle, Send, Music, Play, Pause, MoreVertical, Bookmark } from 'lucide-react';

export function ReelsPage() {
  const { reels, toggleLike } = useReelStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const height = e.currentTarget.clientHeight;
    const newIndex = Math.round(scrollTop / height);
    if (newIndex !== currentIndex) setCurrentIndex(newIndex);
  };

  return (
    <div className="h-screen overflow-y-auto snap-y-mandatory" onScroll={handleScroll}>
      {reels.map((reel, index) => (
        <div key={reel.id} className="h-screen snap-start relative flex items-center justify-center bg-black">
          {/* Background image (simulating video) */}
          <img src={reel.thumbnailUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />

          {/* Play/Pause overlay */}
          <motion.button onClick={() => setPlaying(!playing)} className="absolute inset-0 z-10 flex items-center justify-center">
            <AnimatePresence>
              {!playing && (
                <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 0.7 }} exit={{ scale: 0, opacity: 0 }}>
                  <Play className="w-20 h-20 text-white fill-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Right sidebar actions */}
          <div className="absolute right-3 bottom-32 z-20 flex flex-col items-center gap-6">
            <div className="flex flex-col items-center">
              <img src={reel.user.avatar} alt="" className="w-12 h-12 rounded-full object-cover ring-2 ring-vybe-primary mb-1" />
              <div className="w-6 h-6 -mt-3 bg-vybe-primary rounded-full flex items-center justify-center text-white text-xs font-bold">+</div>
            </div>
            <motion.button whileTap={{ scale: 1.3 }} onClick={() => toggleLike(reel.id)} className="flex flex-col items-center gap-1">
              <Heart className={`w-7 h-7 ${reel.isLiked ? 'text-red-500 fill-red-500' : 'text-white'}`} />
              <span className="text-xs text-white font-medium">{formatCount(reel.likesCount)}</span>
            </motion.button>
            <button className="flex flex-col items-center gap-1">
              <MessageCircle className="w-7 h-7 text-white" />
              <span className="text-xs text-white font-medium">{formatCount(reel.commentsCount)}</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <Send className="w-7 h-7 text-white" />
              <span className="text-xs text-white font-medium">{formatCount(reel.sharesCount)}</span>
            </button>
            <button><Bookmark className="w-7 h-7 text-white" /></button>
            <button><MoreVertical className="w-7 h-7 text-white" /></button>
            {/* Audio disc */}
            <motion.div animate={{ rotate: playing ? 360 : 0 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-vybe-primary to-pink-500 flex items-center justify-center ring-2 ring-white/20">
              <Music className="w-4 h-4 text-white" />
            </motion.div>
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-6 left-4 right-20 z-20">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-white">{reel.user.username}</span>
              {reel.user.isVerified && <span className="text-blue-400 text-xs">✓</span>}
            </div>
            <p className="text-sm text-white/90 mb-3">{reel.caption}</p>
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5 w-fit">
              <Music className="w-3.5 h-3.5 text-white" />
              <span className="text-xs text-white">{reel.audioTitle} — {reel.audioArtist}</span>
              <div className="flex gap-0.5 ml-2">
                {[...Array(4)].map((_, i) => (
                  <motion.div key={i} animate={{ height: playing ? [4, 12, 4] : 4 }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
                    className="w-0.5 bg-white rounded-full" style={{ height: 4 }} />
                ))}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20 z-20">
            <motion.div className="h-full bg-white" initial={{ width: '0%' }}
              animate={{ width: index === currentIndex && playing ? '100%' : '0%' }}
              transition={{ duration: 15, ease: 'linear' }} />
          </div>
        </div>
      ))}
    </div>
  );
}
