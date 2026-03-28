import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAudioStore } from '../stores';
import { formatCount, AUDIO_TRACKS } from '../data';
import { Play, Pause, TrendingUp, Music, Disc3, BarChart3, Search, Heart, Plus, SkipForward, SkipBack, Volume2 } from 'lucide-react';

function WaveformBars({ playing }: { playing: boolean }) {
  return (
    <div className="flex items-end gap-0.5 h-8">
      {[...Array(20)].map((_, i) => (
        <motion.div key={i}
          animate={{ height: playing ? [4 + Math.random() * 4, 12 + Math.random() * 16, 4 + Math.random() * 4] : 6 }}
          transition={{ duration: 0.4 + Math.random() * 0.3, repeat: Infinity, delay: i * 0.05 }}
          className="w-1 bg-gradient-to-t from-vybe-primary to-pink-500 rounded-full" style={{ height: 6 }} />
      ))}
    </div>
  );
}

export function AudioPage() {
  const { tracks, currentTrack, isPlaying, play, pause, toggle } = useAudioStore();
  const [activeTab, setActiveTab] = useState('trending');
  const categories = ['trending', 'bhajan', 'qawwali', 'gospel', 'kirtan', 'nasheed', 'chant'];

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-32">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-vybe-primary to-pink-500 flex items-center justify-center">
          <Music className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Audio Hub</h1>
          <p className="text-sm text-vybe-text-muted">Discover trending sounds</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-vybe-text-muted w-4 h-4" />
        <input placeholder="Search audio, artists..." className="w-full bg-vybe-card border border-vybe-border rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-vybe-text-muted focus:outline-none focus:border-vybe-primary" />
      </div>

      {/* Categories */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveTab(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === cat ? 'bg-gradient-to-r from-vybe-primary to-pink-500 text-white' : 'bg-vybe-card text-vybe-text-muted border border-vybe-border hover:text-white'
            }`}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</button>
        ))}
      </div>

      {/* Top chart */}
      <div className="bg-gradient-to-br from-vybe-primary/10 to-pink-500/10 border border-vybe-primary/20 rounded-2xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-vybe-primary" />
          <h2 className="font-bold text-white">Top Charts</h2>
          <BarChart3 className="w-4 h-4 text-vybe-text-muted ml-auto" />
        </div>
        <div className="space-y-3">
          {tracks.slice(0, 3).map((track, i) => (
            <motion.div key={track.id} whileHover={{ x: 4 }}
              className="flex items-center gap-3 bg-black/20 rounded-xl p-3 cursor-pointer hover:bg-black/30 transition-colors"
              onClick={() => currentTrack?.id === track.id ? toggle() : play(track)}>
              <span className="text-lg font-bold text-vybe-primary w-6 text-center">{i + 1}</span>
              <img src={track.coverUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm truncate">{track.title}</p>
                <p className="text-xs text-vybe-text-muted">{track.artist} · {formatCount(track.plays)} plays</p>
              </div>
              {currentTrack?.id === track.id && isPlaying ? (
                <WaveformBars playing={true} />
              ) : (
                <span className="text-xs text-vybe-text-muted">{track.duration}</span>
              )}
              <button className="text-vybe-text-muted hover:text-white"><Plus className="w-5 h-5" /></button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* All tracks */}
      <h2 className="font-bold text-white mb-4">Browse All</h2>
      <div className="space-y-2">
        {tracks.map((track, i) => (
          <motion.div key={track.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
              currentTrack?.id === track.id ? 'bg-vybe-primary/10 border border-vybe-primary/30' : 'bg-vybe-card border border-vybe-border hover:border-vybe-primary/20'
            }`} onClick={() => currentTrack?.id === track.id ? toggle() : play(track)}>
            <div className="relative flex-shrink-0">
              <img src={track.coverUrl} alt="" className="w-14 h-14 rounded-xl object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl opacity-0 hover:opacity-100 transition-opacity">
                {currentTrack?.id === track.id && isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white fill-white" />}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white text-sm truncate">{track.title}</p>
              <p className="text-xs text-vybe-text-muted">{track.artist}</p>
            </div>
            <div className="flex items-center gap-3 text-vybe-text-muted">
              <span className="text-xs hidden sm:block">{formatCount(track.plays)} plays</span>
              <span className="text-xs">{track.duration}</span>
              <Heart className="w-4 h-4 hover:text-red-400 cursor-pointer" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Now playing bar */}
      {currentTrack && (
        <motion.div initial={{ y: 80 }} animate={{ y: 0 }}
          className="fixed bottom-16 md:bottom-0 left-0 md:left-64 right-0 bg-vybe-card/95 backdrop-blur-xl border-t border-vybe-border p-3 z-20">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <img src={currentTrack.coverUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white text-sm truncate">{currentTrack.title}</p>
              <p className="text-xs text-vybe-text-muted">{currentTrack.artist}</p>
              <div className="w-full h-1 bg-vybe-border rounded-full mt-1.5">
                <motion.div className="h-full bg-gradient-to-r from-vybe-primary to-pink-500 rounded-full"
                  animate={{ width: isPlaying ? '100%' : '30%' }} transition={{ duration: isPlaying ? 15 : 0 }} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-vybe-text-muted hover:text-white"><SkipBack className="w-5 h-5" /></button>
              <button onClick={toggle} className="w-10 h-10 rounded-full bg-vybe-primary flex items-center justify-center text-white hover:scale-105 transition-transform">
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
              </button>
              <button className="text-vybe-text-muted hover:text-white"><SkipForward className="w-5 h-5" /></button>
              <button className="text-vybe-text-muted hover:text-white hidden sm:block"><Volume2 className="w-5 h-5" /></button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
