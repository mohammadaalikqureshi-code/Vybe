import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EXPLORE_IMAGES, TRENDING_TAGS, USERS, POST_IMAGES, formatCount } from '../data';
import type { User, Post, AudioTrack } from '../data';
import { Search, TrendingUp, Hash, Film, X, Music, Users as UsersIcon, FileText, CheckCircle, Play } from 'lucide-react';
import { useUIStore } from '../stores';
import { useQuery } from '@tanstack/react-query';
import { searchApi } from '../lib/api';

export function ExplorePage() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const setActiveTab = useUIStore(s => s.setActiveTab);
  const setSelectedUserId = useUIStore(s => s.setSelectedUserId);

  const filters = [
    { id: 'all', label: 'All', icon: Search },
    { id: 'users', label: 'Users', icon: UsersIcon },
    { id: 'posts', label: 'Posts', icon: FileText },
    { id: 'tags', label: 'Tags', icon: Hash },
    { id: 'audio', label: 'Audio', icon: Music },
    { id: 'reels', label: 'Reels', icon: Film },
  ];

  const q = query.toLowerCase().trim();
  const isSearching = q.length > 0;

  const { data, isLoading } = useQuery({
    queryKey: ['search', q, activeFilter],
    queryFn: () => searchApi(q, activeFilter as any),
    enabled: isSearching,
  });

  const filteredUsers = data?.users || [];
  const filteredPosts = data?.posts || [];
  const filteredTags = data?.tags || [];
  const filteredAudio = data?.audio || [];
  const filteredReels = data?.reels || [];

  const totalResults = filteredUsers.length + filteredPosts.length + filteredTags.length + filteredAudio.length + filteredReels.length;

  const allImages = [...EXPLORE_IMAGES, ...POST_IMAGES.slice(0, 6)];

  const goToProfile = (userId: string) => {
    setSelectedUserId(userId);
    setActiveTab('profile');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-4 pb-24">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-vybe-text-muted w-5 h-5" />
        <input value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Search users, posts, hashtags, audio..."
          className="w-full bg-vybe-card border border-vybe-border rounded-2xl pl-12 pr-10 py-3 text-vybe-text placeholder-vybe-text-muted focus:outline-none focus:border-vybe-primary focus:ring-1 focus:ring-vybe-primary/30 transition-all" />
        {query && <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-vybe-text-muted hover:text-vybe-text transition-colors"><X className="w-5 h-5" /></button>}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {filters.map(f => (
          <button key={f.id} onClick={() => setActiveFilter(f.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeFilter === f.id ? 'bg-vybe-primary text-white shadow-lg shadow-vybe-primary/25' : 'bg-vybe-card text-vybe-text-muted hover:text-vybe-text border border-vybe-border'
            }`}>
            <f.icon className="w-3.5 h-3.5" />
            {f.label}
            {isSearching && f.id === 'users' && filteredUsers.length > 0 && <span className="ml-1 text-xs opacity-70">({filteredUsers.length})</span>}
            {isSearching && f.id === 'posts' && filteredPosts.length > 0 && <span className="ml-1 text-xs opacity-70">({filteredPosts.length})</span>}
            {isSearching && f.id === 'tags' && filteredTags.length > 0 && <span className="ml-1 text-xs opacity-70">({filteredTags.length})</span>}
            {isSearching && f.id === 'audio' && filteredAudio.length > 0 && <span className="ml-1 text-xs opacity-70">({filteredAudio.length})</span>}
            {isSearching && f.id === 'reels' && filteredReels.length > 0 && <span className="ml-1 text-xs opacity-70">({filteredReels.length})</span>}
          </button>
        ))}
      </div>

      {/* Search Results */}
      {isSearching ? (
        <AnimatePresence mode="wait">
          <motion.div key={`${q}-${activeFilter}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {isLoading ? (
              <div className="text-center py-16">
                <div className="w-8 h-8 border-4 border-vybe-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-vybe-text-muted text-sm font-medium">Searching for "{query}"...</p>
              </div>
            ) : totalResults === 0 ? (
              <div className="text-center py-16">
                <Search className="w-12 h-12 text-vybe-text-muted mx-auto mb-4 opacity-50" />
                <p className="text-vybe-text-muted text-lg font-medium">No results for "{query}"</p>
                <p className="text-vybe-text-muted text-sm mt-1">Try searching for something else</p>
              </div>
            ) : (
              <>
                {/* Users */}
                {(activeFilter === 'all' || activeFilter === 'users') && filteredUsers.length > 0 && (
                  <div className="mb-8">
                    <h3 className="flex items-center gap-2 font-semibold text-vybe-text mb-3">
                      <UsersIcon className="w-4 h-4 text-vybe-primary" /> Users
                      <span className="text-xs text-vybe-text-muted">({filteredUsers.length})</span>
                    </h3>
                    <div className="space-y-2">
                      {filteredUsers.map((user: any) => (
                        <UserSearchResult key={user.id} user={user} onSelect={() => goToProfile(user.id)} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Posts */}
                {(activeFilter === 'all' || activeFilter === 'posts') && filteredPosts.length > 0 && (
                  <div className="mb-8">
                    <h3 className="flex items-center gap-2 font-semibold text-vybe-text mb-3">
                      <FileText className="w-4 h-4 text-vybe-primary" /> Posts
                      <span className="text-xs text-vybe-text-muted">({filteredPosts.length})</span>
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {filteredPosts.map((post: any) => (
                        <PostSearchResult key={post.id} post={post} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {(activeFilter === 'all' || activeFilter === 'tags') && filteredTags.length > 0 && (
                  <div className="mb-8">
                    <h3 className="flex items-center gap-2 font-semibold text-vybe-text mb-3">
                      <Hash className="w-4 h-4 text-vybe-primary" /> Hashtags
                      <span className="text-xs text-vybe-text-muted">({filteredTags.length})</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {filteredTags.map((tag: any) => (
                        <motion.button key={tag.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-vybe-card border border-vybe-border hover:border-vybe-primary/30 transition-colors">
                          <Hash className="w-4 h-4 text-vybe-primary" />
                          <span className="text-sm font-medium text-vybe-text">{tag.name}</span>
                          <span className="text-xs text-vybe-text-muted">{tag.postsCount} posts</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Audio */}
                {(activeFilter === 'all' || activeFilter === 'audio') && filteredAudio.length > 0 && (
                  <div className="mb-8">
                    <h3 className="flex items-center gap-2 font-semibold text-vybe-text mb-3">
                      <Music className="w-4 h-4 text-vybe-primary" /> Audio
                      <span className="text-xs text-vybe-text-muted">({filteredAudio.length})</span>
                    </h3>
                    <div className="space-y-2">
                      {filteredAudio.map((track: any) => (
                        <AudioSearchResult key={track.id} track={track} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Reels */}
                {(activeFilter === 'all' || activeFilter === 'reels') && filteredReels.length > 0 && (
                  <div className="mb-8">
                    <h3 className="flex items-center gap-2 font-semibold text-vybe-text mb-3">
                      <Film className="w-4 h-4 text-vybe-primary" /> Reels
                      <span className="text-xs text-vybe-text-muted">({filteredReels.length})</span>
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {filteredReels.map((reel: any) => (
                        <motion.div key={reel.id} whileHover={{ scale: 0.98 }} className="relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer group">
                          <img src={reel.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                          <div className="absolute bottom-2 left-2 right-2">
                            <p className="text-white text-xs line-clamp-2">{reel.caption}</p>
                            <p className="text-white/60 text-[10px] mt-0.5">♫ {reel.audioTitle}</p>
                          </div>
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Play className="w-8 h-8 text-white fill-white" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      ) : (
        /* Default Explore View */
        <>
          {/* Trending tags */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-vybe-primary" />
              <h2 className="font-semibold text-vybe-text">Trending</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {TRENDING_TAGS.map(tag => (
                <motion.button key={tag.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => { setQuery(tag.name); setActiveFilter('all'); }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-vybe-card border border-vybe-border hover:border-vybe-primary/30 transition-colors">
                  <Hash className="w-3.5 h-3.5 text-vybe-primary" />
                  <span className="text-sm text-vybe-text">{tag.name}</span>
                  <span className="text-xs text-vybe-text-muted">{tag.postsCount}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Suggested users */}
          <div className="mb-6">
            <h3 className="font-semibold text-vybe-text mb-3">Suggested for you</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {USERS.slice(0, 5).map(user => (
                <motion.button key={user.id} whileHover={{ y: -4 }}
                  onClick={() => goToProfile(user.id)}
                  className="flex-shrink-0 bg-vybe-card border border-vybe-border rounded-2xl p-4 w-36 text-center hover:border-vybe-primary/30 transition-colors">
                  <img src={user.avatar} alt="" className="w-16 h-16 rounded-full object-cover mx-auto mb-2 ring-2 ring-vybe-primary/20" />
                  <p className="text-sm font-semibold text-vybe-text truncate">{user.username}</p>
                  <p className="text-xs text-vybe-text-muted mb-3">{formatCount(user.followersCount)} followers</p>
                  <button className="w-full py-1.5 rounded-lg bg-vybe-primary/15 text-vybe-primary text-xs font-semibold hover:bg-vybe-primary/25 transition-colors">Follow</button>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Masonry Grid */}
          <div className="columns-2 md:columns-3 gap-2 space-y-2">
            {allImages.map((img, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="relative group rounded-xl overflow-hidden break-inside-avoid">
                <img src={img} alt="" className="w-full object-cover rounded-xl hover:scale-105 transition-transform duration-500" loading="lazy"
                  style={{ aspectRatio: i % 3 === 0 ? '3/4' : i % 3 === 1 ? '1/1' : '4/3' }} />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-4 text-white font-semibold text-sm">
                    <span>❤ {Math.floor(Math.random() * 9000 + 1000)}</span>
                    <span>💬 {Math.floor(Math.random() * 500 + 50)}</span>
                  </div>
                </div>
                {i % 4 === 0 && <div className="absolute top-2 right-2 bg-black/50 rounded-lg p-1"><Film className="w-4 h-4 text-white" /></div>}
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Search Result Components ──

function UserSearchResult({ user, onSelect }: { user: User; onSelect: () => void }) {
  return (
    <motion.button onClick={onSelect} whileHover={{ x: 4 }}
      className="w-full flex items-center gap-3 p-3 rounded-xl bg-vybe-card border border-vybe-border hover:border-vybe-primary/20 transition-all">
      <img src={user.avatar} alt="" className="w-12 h-12 rounded-full object-cover ring-2 ring-vybe-primary/10" />
      <div className="flex-1 text-left min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-sm text-vybe-text truncate">{user.username}</span>
          {user.isVerified && <CheckCircle className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />}
        </div>
        <p className="text-xs text-vybe-text-muted truncate">{user.name} · {user.followersCount} followers</p>
      </div>
      <button className="px-3 py-1.5 rounded-lg bg-vybe-primary/15 text-vybe-primary text-xs font-semibold hover:bg-vybe-primary/25 transition-colors flex-shrink-0">
        {user.isFollowing ? 'Following' : 'Follow'}
      </button>
    </motion.button>
  );
}

function PostSearchResult({ post }: { post: Post }) {
  return (
    <motion.div whileHover={{ scale: 0.98 }} className="relative group aspect-square rounded-xl overflow-hidden cursor-pointer">
      <img src={post.mediaUrl} alt="" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-white text-xs line-clamp-2">{post.caption}</p>
        <div className="flex gap-3 mt-1 text-white/80 text-[10px]">
          <span>❤ {formatCount(post.likesCount)}</span>
          <span>💬 {post.commentsCount}</span>
        </div>
      </div>
    </motion.div>
  );
}

function AudioSearchResult({ track }: { track: AudioTrack }) {
  return (
    <motion.div whileHover={{ x: 4 }}
      className="flex items-center gap-3 p-3 rounded-xl bg-vybe-card border border-vybe-border hover:border-vybe-primary/20 transition-all cursor-pointer">
      <img src={track.coverUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-vybe-text truncate">{track.title}</p>
        <p className="text-xs text-vybe-text-muted truncate">{track.artist} · {track.category}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-xs text-vybe-text-muted">{track.duration}</p>
        <p className="text-[10px] text-vybe-text-muted">{formatCount(track.plays)} plays</p>
      </div>
      <button className="w-8 h-8 rounded-full bg-vybe-primary/15 flex items-center justify-center text-vybe-primary hover:bg-vybe-primary/25 transition-colors">
        <Play className="w-3.5 h-3.5 fill-current" />
      </button>
    </motion.div>
  );
}
