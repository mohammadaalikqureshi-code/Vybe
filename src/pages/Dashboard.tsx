import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUIStore, useNotifStore, useAuthStore } from '../stores';
import { DASHBOARD_STATS, CURRENT_USER, formatCount, NOTIFICATIONS, CONVERSATIONS } from '../data';
import { TrendingUp, Eye, Heart, MessageCircle, Share2, Users, BarChart3, ArrowUpRight, ArrowDownRight, Calendar, Zap, Bell, User, Settings, LogOut, ChevronRight, Shield, Lock, Palette, HelpCircle, Moon, Sun, Globe, Volume2, Download, Trash2, Info } from 'lucide-react';

type DashSubPage = 'main' | 'messages' | 'profile' | 'settings' | 'notifications';

function StatCard({ icon: Icon, label, value, change, positive }: { icon: any; label: string; value: string; change: string; positive: boolean }) {
  return (
    <motion.div whileHover={{ y: -2 }} className="bg-vybe-card border border-vybe-border rounded-2xl p-4 hover:border-vybe-primary/20 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="w-9 h-9 rounded-xl bg-vybe-primary/15 flex items-center justify-center"><Icon className="w-4 h-4 text-vybe-primary" /></div>
        <div className={`flex items-center gap-0.5 text-xs font-medium ${positive ? 'text-green-400' : 'text-red-400'}`}>
          {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}{change}
        </div>
      </div>
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-xs text-vybe-text-muted">{label}</p>
    </motion.div>
  );
}

export function DashboardPage() {
  const [subPage, setSubPage] = useState<DashSubPage>('main');
  const stats = DASHBOARD_STATS;
  const maxReach = Math.max(...stats.reachByHour);
  const { notifications, unreadCount, markAllRead } = useNotifStore();
  const logout = useAuthStore(s => s.logout);
  const { theme, toggleTheme } = useUIStore();

  // Sub-pages rendered inside dashboard
  if (subPage === 'notifications') {
    return (
      <div className="max-w-2xl mx-auto px-4 pt-4 pb-8">
        <button onClick={() => setSubPage('main')} className="flex items-center gap-2 text-vybe-text-muted hover:text-white mb-4 text-sm">← Back to Dashboard</button>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Notifications</h2>
          <button onClick={markAllRead} className="text-sm text-vybe-primary font-medium">Mark all read</button>
        </div>
        <div className="space-y-1">
          {notifications.map(n => (
            <div key={n.id} className={`flex items-center gap-3 p-3 rounded-xl ${!n.read ? 'bg-vybe-primary/5' : 'hover:bg-white/5'} transition-colors`}>
              <img src={n.actor.avatar} alt="" className="w-11 h-11 rounded-full object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm"><span className="font-semibold text-white">{n.actor.username}</span>{' '}<span className="text-vybe-text-muted">{n.content}</span></p>
                <p className="text-xs text-vybe-text-muted">{n.time}</p>
              </div>
              {n.postImage && <img src={n.postImage} alt="" className="w-11 h-11 rounded-lg object-cover flex-shrink-0" />}
              {n.type === 'follow' && <button className="px-3 py-1 rounded-lg bg-vybe-primary text-white text-xs font-semibold">Follow</button>}
              {!n.read && <div className="w-2 h-2 bg-vybe-primary rounded-full flex-shrink-0" />}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (subPage === 'messages') {
    return (
      <div className="max-w-2xl mx-auto px-4 pt-4 pb-8">
        <button onClick={() => setSubPage('main')} className="flex items-center gap-2 text-vybe-text-muted hover:text-white mb-4 text-sm">← Back to Dashboard</button>
        <h2 className="text-xl font-bold text-white mb-4">Messages</h2>
        <div className="space-y-1">
          {CONVERSATIONS.map(convo => (
            <div key={convo.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-vybe-card transition-colors">
              <div className="relative flex-shrink-0">
                <img src={convo.user.avatar} alt="" className="w-13 h-13 rounded-full object-cover" style={{width:52,height:52}} />
                {convo.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-vybe-darker" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between"><span className={`font-semibold text-sm ${convo.unread > 0 ? 'text-white' : 'text-vybe-text-muted'}`}>{convo.user.name}</span><span className="text-xs text-vybe-text-muted">{convo.lastMessageTime}</span></div>
                <p className={`text-sm truncate ${convo.unread > 0 ? 'text-white font-medium' : 'text-vybe-text-muted'}`}>{convo.lastMessage}</p>
              </div>
              {convo.unread > 0 && <span className="bg-vybe-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{convo.unread}</span>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (subPage === 'settings') {
    const SETTING_GROUPS = [
      { title: 'Account', items: [{ icon: User, label: 'Edit Profile', desc: 'Name, bio, avatar' }, { icon: Lock, label: 'Privacy', desc: 'Account privacy' }, { icon: Shield, label: 'Security', desc: 'Password, 2FA' }] },
      { title: 'Preferences', items: [{ icon: Bell, label: 'Notifications', desc: 'Push, email alerts' }, { icon: Palette, label: 'Appearance', desc: 'Theme, colors' }, { icon: Globe, label: 'Language', desc: 'English (US)' }] },
      { title: 'Support', items: [{ icon: HelpCircle, label: 'Help Center', desc: 'FAQs' }, { icon: Info, label: 'About', desc: 'Version 2.0.1' }] },
    ];
    return (
      <div className="max-w-2xl mx-auto px-4 pt-4 pb-8">
        <button onClick={() => setSubPage('main')} className="flex items-center gap-2 text-vybe-text-muted hover:text-white mb-4 text-sm">← Back to Dashboard</button>
        <h2 className="text-xl font-bold text-white mb-4">Settings</h2>
        <div className="bg-vybe-card border border-vybe-border rounded-2xl p-4 flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {theme === 'dark' ? <Moon className="w-5 h-5 text-vybe-primary" /> : <Sun className="w-5 h-5 text-amber-400" />}
            <span className="text-white font-medium">Dark Mode</span>
          </div>
          <button onClick={toggleTheme} className={`w-12 h-6 rounded-full transition-colors relative ${theme === 'dark' ? 'bg-vybe-primary' : 'bg-vybe-border'}`}>
            <motion.div layout className={`w-5 h-5 rounded-full bg-white absolute top-0.5 ${theme === 'dark' ? 'right-0.5' : 'left-0.5'}`} />
          </button>
        </div>
        {SETTING_GROUPS.map(group => (
          <div key={group.title} className="mb-5">
            <h3 className="text-xs font-semibold text-vybe-text-muted uppercase tracking-wider mb-2">{group.title}</h3>
            <div className="bg-vybe-card border border-vybe-border rounded-2xl overflow-hidden">
              {group.items.map((item, i) => (
                <button key={item.label} className={`w-full flex items-center gap-3 p-3.5 text-left hover:bg-white/5 transition-colors ${i < group.items.length - 1 ? 'border-b border-vybe-border' : ''}`}>
                  <item.icon className="w-5 h-5 text-vybe-text-muted" /><div className="flex-1"><p className="text-sm font-medium text-white">{item.label}</p><p className="text-xs text-vybe-text-muted">{item.desc}</p></div><ChevronRight className="w-4 h-4 text-vybe-text-muted" />
                </button>
              ))}
            </div>
          </div>
        ))}
        <button onClick={logout} className="w-full py-3 rounded-xl border border-red-500/30 text-red-400 font-semibold hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"><LogOut className="w-5 h-5" /> Log Out</button>
      </div>
    );
  }

  if (subPage === 'profile') {
    return (
      <div className="max-w-2xl mx-auto px-4 pt-4 pb-8">
        <button onClick={() => setSubPage('main')} className="flex items-center gap-2 text-vybe-text-muted hover:text-white mb-4 text-sm">← Back to Dashboard</button>
        <div className="bg-gradient-to-br from-vybe-primary/10 to-pink-500/10 border border-vybe-primary/20 rounded-2xl p-6 text-center mb-6">
          <div className="story-ring inline-block mb-3"><div className="bg-vybe-darker p-1 rounded-full"><img src={CURRENT_USER.avatar} alt="" className="w-24 h-24 rounded-full object-cover" /></div></div>
          <h2 className="text-xl font-bold text-white">{CURRENT_USER.name}</h2>
          <p className="text-sm text-vybe-text-muted">@{CURRENT_USER.username}</p>
          <p className="text-sm text-vybe-text-muted mt-2 whitespace-pre-line">{CURRENT_USER.bio}</p>
          <div className="flex justify-center gap-8 mt-4">
            <div><span className="font-bold text-white">{CURRENT_USER.postsCount}</span><p className="text-xs text-vybe-text-muted">Posts</p></div>
            <div><span className="font-bold text-white">{formatCount(CURRENT_USER.followersCount)}</span><p className="text-xs text-vybe-text-muted">Followers</p></div>
            <div><span className="font-bold text-white">{CURRENT_USER.followingCount}</span><p className="text-xs text-vybe-text-muted">Following</p></div>
          </div>
          <button className="mt-4 px-6 py-2 rounded-xl bg-vybe-card border border-vybe-border text-white text-sm font-medium hover:bg-vybe-card-hover transition-colors">Edit Profile</button>
        </div>
      </div>
    );
  }

  // Main dashboard
  return (
    <div className="max-w-4xl mx-auto px-4 pt-4 pb-8">
      {/* Profile card on LEFT - attractive design */}
      <div className="flex gap-4 mb-6">
        <motion.div whileHover={{ scale: 1.02 }} className="flex-shrink-0 bg-gradient-to-br from-vybe-primary/15 to-pink-500/15 border border-vybe-primary/20 rounded-2xl p-4 flex flex-col items-center w-44">
          <div className="story-ring mb-2">
            <div className="bg-vybe-darker p-0.5 rounded-full">
              <img src={CURRENT_USER.avatar} alt="" className="w-16 h-16 rounded-full object-cover" />
            </div>
          </div>
          <h3 className="font-bold text-white text-sm text-center">{CURRENT_USER.name}</h3>
          <p className="text-xs text-vybe-primary mb-2">@{CURRENT_USER.username}</p>
          <div className="flex gap-3 text-center mb-3">
            <div><p className="text-sm font-bold text-white">{formatCount(CURRENT_USER.followersCount)}</p><p className="text-[10px] text-vybe-text-muted">Followers</p></div>
            <div className="w-px bg-vybe-border" />
            <div><p className="text-sm font-bold text-white">{CURRENT_USER.postsCount}</p><p className="text-[10px] text-vybe-text-muted">Posts</p></div>
          </div>
          <div className="w-full h-px bg-vybe-border my-1" />
          <p className="text-[10px] text-vybe-text-muted text-center mt-1 leading-relaxed">🙏 Devotee | 🕉️ Seeker</p>
        </motion.div>

        {/* Welcome + Quick Stats */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-white">Dashboard</h1>
              <p className="text-xs text-vybe-text-muted">🙏 Welcome back, {CURRENT_USER.name}</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-vybe-card border border-vybe-border text-xs text-vybe-text-muted">
              <Calendar className="w-3 h-3" /> Last 7 days
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <StatCard icon={Eye} label="Views" value={formatCount(stats.totalViews)} change="+12.5%" positive />
            <StatCard icon={Heart} label="Likes" value={formatCount(stats.totalLikes)} change="+8.3%" positive />
            <StatCard icon={MessageCircle} label="Comments" value={formatCount(stats.totalComments)} change="+5.1%" positive />
            <StatCard icon={Share2} label="Shares" value={formatCount(stats.totalShares)} change="+15.7%" positive />
          </div>
        </div>
      </div>

      {/* Quick links - Messages, Profile, Settings, Notifications */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { id: 'messages' as DashSubPage, icon: MessageCircle, label: 'Messages', badge: '4', color: 'from-blue-500/15 to-cyan-500/15 border-blue-500/20' },
          { id: 'profile' as DashSubPage, icon: User, label: 'Profile', color: 'from-vybe-primary/15 to-purple-500/15 border-vybe-primary/20' },
          { id: 'notifications' as DashSubPage, icon: Bell, label: 'Alerts', badge: unreadCount > 0 ? String(unreadCount) : undefined, color: 'from-amber-500/15 to-orange-500/15 border-amber-500/20' },
          { id: 'settings' as DashSubPage, icon: Settings, label: 'Settings', color: 'from-green-500/15 to-emerald-500/15 border-green-500/20' },
        ].map(item => (
          <motion.button key={item.id} whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }}
            onClick={() => setSubPage(item.id)}
            className={`bg-gradient-to-br ${item.color} border rounded-2xl p-4 flex flex-col items-center gap-2 relative`}>
            <item.icon className="w-6 h-6 text-white" />
            <span className="text-xs text-white font-medium">{item.label}</span>
            {item.badge && <span className="absolute top-2 right-2 bg-vybe-danger text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{item.badge}</span>}
          </motion.button>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-vybe-card border border-vybe-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-vybe-primary" />
            <h3 className="font-semibold text-white text-sm">Followers Growth</h3>
            <span className="ml-auto text-xs text-green-400 font-medium">+8,130</span>
          </div>
          <div className="flex items-end gap-2 h-32">
            {stats.followersGrowth.map((d, i) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <motion.div initial={{ height: 0 }} animate={{ height: `${(d.count / 2100) * 100}%` }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="w-full rounded-lg bg-gradient-to-t from-vybe-primary to-purple-400 min-h-[6px]" />
                <span className="text-[10px] text-vybe-text-muted">{d.day}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-vybe-card border border-vybe-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="font-semibold text-white text-sm">Reach by Hour</h3>
          </div>
          <div className="h-32 flex items-end gap-0.5">
            {stats.reachByHour.map((val, i) => (
              <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${(val / maxReach) * 100}%` }}
                transition={{ delay: i * 0.02, duration: 0.3 }}
                className="flex-1 rounded-t bg-gradient-to-t from-amber-500/50 to-amber-400 min-h-[3px] hover:from-amber-500 hover:to-amber-300 transition-colors cursor-pointer" />
            ))}
          </div>
          <div className="flex justify-between mt-1"><span className="text-[10px] text-vybe-text-muted">12AM</span><span className="text-[10px] text-vybe-text-muted">12PM</span><span className="text-[10px] text-vybe-text-muted">11PM</span></div>
        </div>
      </div>

      {/* Engagement + Top Posts */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-vybe-card border border-vybe-border rounded-2xl p-4">
          <h3 className="font-semibold text-white text-sm mb-3">Engagement</h3>
          <div className="relative w-28 h-28 mx-auto mb-2">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#2A2A45" strokeWidth="8" />
              <motion.circle cx="50" cy="50" r="40" fill="none" stroke="url(#grad2)" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${stats.engagementRate * 25.13} 251.3`}
                initial={{ strokeDasharray: '0 251.3' }} animate={{ strokeDasharray: `${stats.engagementRate * 25.13} 251.3` }}
                transition={{ duration: 1.5 }} />
              <defs><linearGradient id="grad2"><stop offset="0%" stopColor="#8B5CF6" /><stop offset="100%" stopColor="#EC4899" /></linearGradient></defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center"><span className="text-xl font-bold text-white">{stats.engagementRate}%</span></div>
          </div>
          <p className="text-center text-xs text-vybe-text-muted">Above average 🙏</p>
        </div>
        <div className="md:col-span-2 bg-vybe-card border border-vybe-border rounded-2xl p-4">
          <h3 className="font-semibold text-white text-sm mb-3">Top Performing Posts</h3>
          <div className="space-y-2">
            {stats.topPosts.map((post, i) => (
              <div key={post.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors">
                <span className="text-sm font-bold text-vybe-primary w-5">{i + 1}</span>
                <img src={post.mediaUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1 min-w-0"><p className="text-xs text-white truncate">{post.caption.slice(0, 45)}...</p><p className="text-[10px] text-vybe-text-muted">{post.createdAt}</p></div>
                <div className="text-right"><p className="text-sm font-semibold text-white">{formatCount(post.likesCount)}</p><p className="text-[10px] text-vybe-text-muted">likes</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
