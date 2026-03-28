import { useState } from 'react';
import { motion } from 'framer-motion';
import { CURRENT_USER, POST_IMAGES, STORY_IMAGES, USERS, formatCount } from '../data';
import type { User } from '../data';
import { Settings, Grid3X3, Film, Bookmark, Heart, MessageCircle, UserPlus, UserMinus, ArrowLeft, CheckCircle, Lock } from 'lucide-react';
import { useUIStore, useFollowStore, useFeedStore, useAuthStore } from '../stores';
import { toggleBlockUser, toggleMuteUser } from '../lib/api';

const HIGHLIGHTS = [
  { name: 'Prayers', image: STORY_IMAGES[0] },
  { name: 'Temples', image: STORY_IMAGES[1] },
  { name: 'Qawwali', image: STORY_IMAGES[2] },
  { name: 'Devotion', image: STORY_IMAGES[3] },
  { name: 'Peace', image: STORY_IMAGES[4] },
];

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState('posts');
  const selectedUserId = useUIStore(s => s.selectedUserId);
  const setSelectedUserId = useUIStore(s => s.setSelectedUserId);
  const setActiveNavTab = useUIStore(s => s.setActiveTab);
  const { following, toggleFollow } = useFollowStore();
  const posts = useFeedStore(s => s.posts);
  const { user: currentUser } = useAuthStore();

  // Show selected user's profile or current user's
  const isOwnProfile = !selectedUserId || selectedUserId === CURRENT_USER.id;
  const user: User = isOwnProfile ? CURRENT_USER : (USERS.find(u => u.id === selectedUserId) || CURRENT_USER);
  const isFollowing = following.has(user.id);

  // Get user's posts
  const userPosts = isOwnProfile ? POST_IMAGES : posts.filter(p => p.user.id === user.id).map(p => p.mediaUrl);
  const displayPosts = userPosts.length > 0 ? userPosts : POST_IMAGES.slice(0, 6);

  const goBack = () => {
    setSelectedUserId(null);
    setActiveNavTab('feed');
  };

  const handleBlock = async () => {
    if (currentUser && user) {
      await toggleBlockUser(currentUser.id, user.id);
      alert('Toggled block status. They cannot interact with you anymore.');
      goBack();
    }
  };

  const handleMute = async () => {
    if (currentUser && user) {
      await toggleMuteUser(currentUser.id, user.id);
      alert('Toggled mute status. You will not see their posts.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-24">
      {/* Back button for other profiles */}
      {!isOwnProfile && (
        <button onClick={goBack} className="flex items-center gap-2 text-vybe-text-muted hover:text-vybe-text mb-4 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>
      )}

      {/* Header */}
      <div className="flex items-start gap-6 md:gap-10 mb-6">
        <div className="story-ring flex-shrink-0">
          <div className="bg-vybe-darker p-1 rounded-full">
            <img src={user.avatar} alt="" className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover" />
          </div>
        </div>
        <div className="flex-1 pt-2">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <h1 className="text-xl font-bold text-vybe-text">{user.username}</h1>
            {user.isVerified && (
              <span className="flex items-center gap-1 bg-blue-500/10 text-blue-500 text-xs px-2 py-0.5 rounded-full">
                <CheckCircle className="w-3 h-3" /> Verified
              </span>
            )}
            {isOwnProfile ? (
              <>
                <button className="px-4 py-1.5 rounded-lg bg-vybe-card border border-vybe-border text-sm text-vybe-text font-medium hover:bg-vybe-card-hover transition-colors">Edit profile</button>
                <button onClick={() => setActiveNavTab('settings')} className="text-vybe-text-muted hover:text-vybe-text transition-colors"><Settings className="w-5 h-5" /></button>
              </>
            ) : (
              <>
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => toggleFollow(user.id)}
                  className={`px-5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    isFollowing
                      ? 'bg-vybe-card border border-vybe-border text-vybe-text hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30'
                      : 'bg-vybe-primary text-white hover:bg-vybe-primary/90 shadow-lg shadow-vybe-primary/20'
                  }`}>
                  {isFollowing ? (
                    <span className="flex items-center gap-1.5"><UserMinus className="w-3.5 h-3.5" /> Following</span>
                  ) : (
                    <span className="flex items-center gap-1.5"><UserPlus className="w-3.5 h-3.5" /> Follow</span>
                  )}
                </motion.button>
                <button onClick={() => setActiveNavTab('messages')}
                  className="px-4 py-1.5 rounded-lg bg-vybe-card border border-vybe-border text-sm text-vybe-text font-medium hover:bg-vybe-card-hover transition-colors">
                  Message
                </button>
                <div className="flex gap-2">
                  <button onClick={handleBlock} className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 text-sm font-semibold hover:bg-red-500/20">Block</button>
                  <button onClick={handleMute} className="px-3 py-1.5 rounded-lg bg-vybe-card border border-vybe-border text-vybe-text text-sm font-semibold hover:bg-vybe-card-hover">Mute</button>
                </div>
              </>
            )}
          </div>
          <div className="flex gap-6 mb-3 text-sm">
            <div><span className="font-bold text-vybe-text">{user.postsCount}</span> <span className="text-vybe-text-muted">posts</span></div>
            <div>
              <span className="font-bold text-vybe-text">{formatCount(isFollowing && !isOwnProfile ? user.followersCount + 1 : user.followersCount)}</span>
              <span className="text-vybe-text-muted"> followers</span>
            </div>
            <div><span className="font-bold text-vybe-text">{user.followingCount}</span> <span className="text-vybe-text-muted">following</span></div>
          </div>
          <div className="text-sm">
            <p className="font-semibold text-vybe-text">{user.name}</p>
            <p className="text-vybe-text-muted whitespace-pre-line">{user.bio}</p>
          </div>
        </div>
      </div>

      {/* Mutual followers (for other profiles only) */}
      {!isOwnProfile && (
        <div className="flex items-center gap-2 mb-4 px-1">
          <div className="flex -space-x-2">
            {USERS.slice(0, 3).map(u => (
              <img key={u.id} src={u.avatar} alt="" className="w-6 h-6 rounded-full object-cover ring-2 ring-vybe-darker" />
            ))}
          </div>
          <p className="text-xs text-vybe-text-muted">
            Followed by <span className="font-semibold text-vybe-text">{USERS[0].username}</span> and <span className="font-semibold text-vybe-text">{USERS[1].username}</span> + 12 more
          </p>
        </div>
      )}

      {/* Highlights */}
      <div className="flex gap-4 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {HIGHLIGHTS.map(h => (
          <motion.button key={h.name} whileTap={{ scale: 0.9 }} className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-vybe-card border-2 border-vybe-border overflow-hidden p-0.5">
              <img src={h.image} alt="" className="w-full h-full rounded-full object-cover" />
            </div>
            <span className="text-xs text-vybe-text-muted">{h.name}</span>
          </motion.button>
        ))}
        {isOwnProfile && (
          <button className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className="w-16 h-16 rounded-full border-2 border-vybe-border border-dashed flex items-center justify-center text-vybe-text-muted text-2xl">+</div>
            <span className="text-xs text-vybe-text-muted">New</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-vybe-border mb-4">
        {[{ id: 'posts', icon: Grid3X3, label: 'Posts' }, { id: 'reels', icon: Film, label: 'Reels' }, { id: 'saved', icon: Bookmark, label: 'Saved' }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id ? 'border-vybe-primary text-vybe-text' : 'border-transparent text-vybe-text-muted hover:text-vybe-text'
            }`}><tab.icon className="w-4 h-4" /><span className="hidden sm:block">{tab.label}</span></button>
        ))}
      </div>

      {/* Grid */}
      {(user as any).isPrivate && !isFollowing && !isOwnProfile ? (
        <div className="flex flex-col items-center justify-center py-20 text-vybe-text-muted">
          <div className="w-16 h-16 rounded-full border-2 border-vybe-border flex items-center justify-center mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-vybe-text mb-2">This Account is Private</h2>
          <p className="text-sm">Follow this account to see their photos and videos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1">
          {displayPosts.map((img, i) => (
            <motion.div key={i} whileHover={{ scale: 0.98 }} className="relative group aspect-square overflow-hidden rounded-sm cursor-pointer">
              <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-4 text-white text-sm font-semibold">
                  <span className="flex items-center gap-1"><Heart className="w-4 h-4 fill-white" /> {Math.floor(Math.random() * 5000 + 500)}</span>
                  <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /> {Math.floor(Math.random() * 200 + 20)}</span>
                </div>
              </div>
              {i % 3 === 0 && <div className="absolute top-2 right-2"><Film className="w-4 h-4 text-white drop-shadow" /></div>}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
