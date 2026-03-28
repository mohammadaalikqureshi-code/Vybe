import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore, useNotifStore, useAuthStore } from '../stores';
import { CURRENT_USER, NOTIFICATIONS } from '../data';
import { User, Lock, Bell as BellIcon, Palette, Shield, HelpCircle, Info, LogOut, Moon, Sun, ChevronRight, ChevronLeft, Globe, Eye, Volume2, Download, Trash2, Heart, Check, Smartphone, Mail } from 'lucide-react';
import { useEffect } from 'react';
import { togglePrivacy, getBlockedUsers, getMutedUsers, toggleBlockUser, toggleMuteUser } from '../lib/api';

const SETTING_GROUPS = [
  {
    title: 'Account',
    items: [
      { id: 'edit-profile', icon: User, label: 'Edit Profile', desc: 'Name, bio, avatar' },
      { id: 'privacy', icon: Lock, label: 'Privacy', desc: 'Account privacy, blocked users' },
      { id: 'security', icon: Shield, label: 'Security', desc: 'Password, 2FA, login activity' },
    ]
  },
  {
    title: 'Preferences',
    items: [
      { id: 'notifications', icon: BellIcon, label: 'Notifications', desc: 'Push, email, in-app notifications' },
      { id: 'appearance', icon: Palette, label: 'Appearance', desc: 'Theme, font size, colors' },
      { id: 'language', icon: Globe, label: 'Language', desc: 'English (US)' },
      { id: 'sound', icon: Volume2, label: 'Sound', desc: 'Notification sounds, in-app sounds' },
    ]
  },
  {
    title: 'Data & Storage',
    items: [
      { id: 'download-data', icon: Download, label: 'Download Data', desc: 'Request a copy of your data' },
      { id: 'activity-status', icon: Eye, label: 'Activity Status', desc: 'Show when you\'re active' },
      { id: 'delete-account', icon: Trash2, label: 'Delete Account', desc: 'Permanently delete your account' },
    ]
  },
  {
    title: 'Support',
    items: [
      { id: 'help-center', icon: HelpCircle, label: 'Help Center', desc: 'FAQs and support' },
      { id: 'about', icon: Info, label: 'About', desc: 'Version 2.1.0' },
    ]
  },
];

export function SettingsPage() {
  const { theme, toggleTheme } = useUIStore();
  const { user, logout } = useAuthStore();
  const [activeView, setActiveView] = useState<string | null>(null);

  const [blockedUsers, setBlockedUsers] = useState<any[]>([]);
  const [mutedUsers, setMutedUsers] = useState<any[]>([]);
  
  useEffect(() => {
    if (activeView === 'blocked-users' && user) {
      getBlockedUsers(user.id).then(setBlockedUsers).catch(console.error);
    }
    if (activeView === 'muted-users' && user) {
      getMutedUsers(user.id).then(setMutedUsers).catch(console.error);
    }
  }, [activeView, user]);

  const handlePrivacyChange = async () => {
    if (!user) return;
    try {
      await togglePrivacy(user.id, !user.isPrivate);
      user.isPrivate = !user.isPrivate;
    } catch (e) {
      console.error(e);
    }
  };

  const handleUnblock = async (targetId: string) => {
    if (!user) return;
    await toggleBlockUser(user.id, targetId);
    setBlockedUsers(prev => prev.filter(u => u.id !== targetId));
  };

  const handleUnmute = async (targetId: string) => {
    if (!user) return;
    await toggleMuteUser(user.id, targetId);
    setMutedUsers(prev => prev.filter(u => u.id !== targetId));
  };

  const currentUser = user || CURRENT_USER;

  // ── Render Main Menu ──
  const renderMainMenu = () => (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      className="max-w-2xl mx-auto px-4 pt-4 pb-24"
    >
      <h1 className="text-2xl font-bold text-vybe-text mb-6">Settings</h1>
      
      {/* User card */}
      <div className="bg-vybe-card border border-vybe-border rounded-2xl p-4 flex items-center gap-4 mb-6">
        <img src={currentUser.avatar || CURRENT_USER.avatar} alt="" className="w-16 h-16 rounded-full object-cover ring-2 ring-vybe-primary/30" />
        <div className="flex-1">
          <p className="font-semibold text-vybe-text">{currentUser.name}</p>
          <p className="text-sm text-vybe-text-muted">@{currentUser.username}</p>
        </div>
        <button onClick={() => setActiveView('edit-profile')} className="text-sm text-vybe-primary font-semibold hover:underline">Edit</button>
      </div>

      {/* Setting groups */}
      {SETTING_GROUPS.map(group => (
        <div key={group.title} className="mb-6">
          <h2 className="text-sm font-semibold text-vybe-text-muted uppercase tracking-wider mb-2">{group.title}</h2>
          <div className="bg-vybe-card border border-vybe-border rounded-2xl overflow-hidden">
            {group.items.map((item, i) => (
              <motion.button
                key={item.id}
                whileHover={{ x: 4 }}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 p-4 text-left hover:bg-vybe-card-hover transition-colors ${i < group.items.length - 1 ? 'border-b border-vybe-border' : ''}`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${item.id === 'delete-account' ? 'text-red-400' : 'text-vybe-text-muted'}`} />
                <div className="flex-1">
                  <p className={`text-sm font-medium ${item.id === 'delete-account' ? 'text-red-400' : 'text-vybe-text'}`}>{item.label}</p>
                  <p className="text-xs text-vybe-text-muted">{item.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-vybe-text-muted" />
              </motion.button>
            ))}
          </div>
        </div>
      ))}

      <button onClick={logout} className="w-full py-3 rounded-xl border border-red-500/30 text-red-400 font-semibold hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2">
        <LogOut className="w-5 h-5" /> Log Out
      </button>

      <p className="text-center text-xs text-vybe-text-muted mt-6">VYBE v2.1.0 • Made with <Heart className="w-3 h-3 inline text-red-400 fill-red-400" /></p>
    </motion.div>
  );

  // ── Render Sub-views ──
  const renderSubView = () => {
    let content = null;
    let title = '';

    switch (activeView) {
      case 'edit-profile':
        title = 'Edit Profile';
        content = (
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <img src={CURRENT_USER.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover ring-4 ring-vybe-primary/20" />
                <button className="absolute bottom-0 right-0 bg-vybe-primary text-white p-1.5 rounded-full ring-2 ring-vybe-darker">
                  <Palette className="w-4 h-4" />
                </button>
              </div>
              <button className="text-vybe-primary text-sm font-semibold">Change Profile Photo</button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-vybe-text-muted uppercase px-1">Name</label>
                <input type="text" defaultValue={currentUser.name} className="w-full bg-vybe-card border border-vybe-border rounded-xl px-4 py-3 mt-1 text-vybe-text focus:outline-none focus:border-vybe-primary" />
              </div>
              <div>
                <label className="text-xs font-semibold text-vybe-text-muted uppercase px-1">Username</label>
                <input type="text" defaultValue={currentUser.username} className="w-full bg-vybe-card border border-vybe-border rounded-xl px-4 py-3 mt-1 text-vybe-text focus:outline-none focus:border-vybe-primary" />
              </div>
              <div>
                <label className="text-xs font-semibold text-vybe-text-muted uppercase px-1">Bio</label>
                <textarea defaultValue={currentUser.bio || "Just vibing ✌️"} rows={3} className="w-full bg-vybe-card border border-vybe-border rounded-xl px-4 py-3 mt-1 text-vybe-text focus:outline-none focus:border-vybe-primary resize-none" />
              </div>
              <button className="w-full btn-gradient py-3 rounded-xl text-white font-semibold">Save Changes</button>
            </div>
          </div>
        );
        break;

      case 'privacy':
        title = 'Privacy';
        content = (
          <div className="space-y-6">
            <div className="bg-vybe-card border border-vybe-border rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-vybe-border">
                <div>
                  <p className="text-sm font-medium text-vybe-text">Private Account</p>
                  <p className="text-xs text-vybe-text-muted mt-0.5">Only approved followers can see your posts.</p>
                </div>
                <Toggle defaultChecked={currentUser.isPrivate || false} onChange={handlePrivacyChange} />
              </div>
              <div 
                onClick={() => setActiveView('blocked-users')}
                className="flex items-center justify-between p-4 border-b border-vybe-border hover:bg-vybe-card-hover cursor-pointer"
              >
                <p className="text-sm font-medium text-vybe-text">Blocked Users</p>
                <ChevronRight className="w-4 h-4 text-vybe-text-muted" />
              </div>
              <div 
                onClick={() => setActiveView('muted-users')}
                className="flex items-center justify-between p-4 hover:bg-vybe-card-hover cursor-pointer"
              >
                <p className="text-sm font-medium text-vybe-text">Muted Accounts</p>
                <ChevronRight className="w-4 h-4 text-vybe-text-muted" />
              </div>
            </div>
            <p className="text-xs text-vybe-text-muted px-2">
              Note: Business profiles cannot be set to private. If you want to make your account private, switch to a personal account first.
            </p>
          </div>
        );
        break;

      case 'blocked-users':
        title = 'Blocked Users';
        content = (
          <div className="space-y-4">
            {blockedUsers.length === 0 ? (
              <p className="text-sm text-vybe-text-muted text-center py-8">No blocked users.</p>
            ) : (
              blockedUsers.map(u => (
                <div key={u.id} className="flex items-center justify-between p-4 bg-vybe-card border border-vybe-border rounded-2xl">
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} alt="" className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="text-sm font-bold text-vybe-text">{u.username}</p>
                      <p className="text-xs text-vybe-text-muted">{u.name}</p>
                    </div>
                  </div>
                  <button onClick={() => handleUnblock(u.id)} className="px-4 py-1.5 bg-vybe-card border border-vybe-border rounded-lg text-sm font-semibold text-vybe-text hover:bg-vybe-card-hover">
                    Unblock
                  </button>
                </div>
              ))
            )}
          </div>
        );
        break;

      case 'muted-users':
        title = 'Muted Accounts';
        content = (
          <div className="space-y-4">
            {mutedUsers.length === 0 ? (
              <p className="text-sm text-vybe-text-muted text-center py-8">No muted accounts.</p>
            ) : (
              mutedUsers.map(u => (
                <div key={u.id} className="flex items-center justify-between p-4 bg-vybe-card border border-vybe-border rounded-2xl">
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} alt="" className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="text-sm font-bold text-vybe-text">{u.username}</p>
                      <p className="text-xs text-vybe-text-muted">{u.name}</p>
                    </div>
                  </div>
                  <button onClick={() => handleUnmute(u.id)} className="px-4 py-1.5 bg-vybe-card border border-vybe-border rounded-lg text-sm font-semibold text-vybe-text hover:bg-vybe-card-hover">
                    Unmute
                  </button>
                </div>
              ))
            )}
          </div>
        );
        break;

      case 'security':
        title = 'Security';
        content = (
          <div className="space-y-6">
            <div className="bg-vybe-card border border-vybe-border rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-vybe-border hover:bg-vybe-card-hover cursor-pointer">
                <p className="text-sm font-medium text-vybe-text">Password</p>
                <ChevronRight className="w-4 h-4 text-vybe-text-muted" />
              </div>
              <div className="flex items-center justify-between p-4 border-b border-vybe-border hover:bg-vybe-card-hover cursor-pointer">
                <div>
                  <p className="text-sm font-medium text-vybe-text">Two-Factor Authentication</p>
                  <p className="text-xs text-green-500 font-medium mt-0.5">On</p>
                </div>
                <ChevronRight className="w-4 h-4 text-vybe-text-muted" />
              </div>
              <div className="flex items-center justify-between p-4 hover:bg-vybe-card-hover cursor-pointer">
                <div>
                  <p className="text-sm font-medium text-vybe-text">Login Activity</p>
                  <p className="text-xs text-vybe-text-muted mt-0.5">Windows PC • India</p>
                </div>
                <ChevronRight className="w-4 h-4 text-vybe-text-muted" />
              </div>
            </div>
          </div>
        );
        break;

      case 'notifications':
        title = 'Notifications';
        content = (
          <div className="space-y-6">
            <div className="bg-vybe-card border border-vybe-border rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-vybe-border">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-vybe-primary" />
                  <div>
                    <p className="text-sm font-medium text-vybe-text">Push Notifications</p>
                    <p className="text-xs text-vybe-text-muted mt-0.5">Likes, Comments, Follows</p>
                  </div>
                </div>
                <Toggle defaultChecked={true} />
              </div>
              <div className="flex items-center justify-between p-4 border-b border-vybe-border">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-vybe-primary" />
                  <div>
                    <p className="text-sm font-medium text-vybe-text">Email Notifications</p>
                    <p className="text-xs text-vybe-text-muted mt-0.5">Security alerts and product digests</p>
                  </div>
                </div>
                <Toggle defaultChecked={false} />
              </div>
              <div className="flex items-center justify-between p-4 border-b border-vybe-border hover:bg-vybe-card-hover cursor-pointer">
                <p className="text-sm font-medium text-vybe-text">Messages & Calls</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-vybe-text-muted">From Everyone</span>
                  <ChevronRight className="w-4 h-4 text-vybe-text-muted" />
                </div>
              </div>
            </div>
          </div>
        );
        break;

      case 'appearance':
        title = 'Appearance';
        content = (
          <div className="space-y-6">
            <div className="bg-vybe-card border border-vybe-border rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? <Moon className="w-5 h-5 text-vybe-primary" /> : <Sun className="w-5 h-5 text-amber-400" />}
                <div>
                  <p className="text-vybe-text font-medium text-sm">Dark Mode</p>
                  <p className="text-xs text-vybe-text-muted">Turn off to use light theme</p>
                </div>
              </div>
              <Toggle defaultChecked={theme === 'dark'} onChange={toggleTheme} />
            </div>

            <div className="bg-vybe-card border border-vybe-border rounded-2xl overflow-hidden">
              {['Small', 'Medium (Default)', 'Large'].map((size, i) => (
                <div key={size} className={`flex items-center justify-between p-4 cursor-pointer hover:bg-vybe-card-hover ${i < 2 ? 'border-b border-vybe-border' : ''}`}>
                  <p className="text-sm font-medium text-vybe-text">{size}</p>
                  {i === 1 && <Check className="w-5 h-5 text-vybe-primary" />}
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case 'language':
        title = 'Language';
        content = (
          <div className="bg-vybe-card border border-vybe-border rounded-2xl overflow-hidden">
            {['English (US)', 'English (UK)', 'Español', 'Français', 'हिन्दी (Hindi)', 'العربية (Arabic)'].map((lang, i) => (
              <div key={lang} className={`flex items-center justify-between p-4 cursor-pointer hover:bg-vybe-card-hover ${i < 5 ? 'border-b border-vybe-border' : ''}`}>
                <p className="text-sm font-medium text-vybe-text">{lang}</p>
                {i === 0 && <Check className="w-5 h-5 text-vybe-primary" />}
              </div>
            ))}
          </div>
        );
        break;

      case 'sound':
        title = 'Sound & Feedback';
        content = (
          <div className="bg-vybe-card border border-vybe-border rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-vybe-border">
              <p className="text-sm font-medium text-vybe-text">In-App Sounds</p>
              <Toggle defaultChecked={true} />
            </div>
            <div className="flex items-center justify-between p-4 border-b border-vybe-border">
              <p className="text-sm font-medium text-vybe-text">Haptic Feedback</p>
              <Toggle defaultChecked={true} />
            </div>
          </div>
        );
        break;

      case 'download-data':
      case 'activity-status':
      case 'delete-account':
      case 'help-center':
      case 'about':
        title = SETTING_GROUPS.flatMap(g => g.items).find(i => i.id === activeView)?.label || 'Detail';
        content = (
          <div className="bg-vybe-card border border-vybe-border rounded-2xl p-6 text-center">
            <Info className="w-12 h-12 text-vybe-text-muted mx-auto mb-4 opacity-50" />
            <p className="text-vybe-text font-semibold mb-2">{title} Configuration</p>
            <p className="text-sm text-vybe-text-muted">This feature is fully simulated for the demo layout and requires backend integration to process.</p>
            {activeView === 'delete-account' && (
              <button onClick={logout} className="mt-6 w-full py-3 rounded-xl bg-red-500 text-white font-semibold flex items-center justify-center gap-2">
                <Trash2 className="w-5 h-5" /> Permanently Delete
              </button>
            )}
          </div>
        );
        break;

      default:
        return null;
    }

    return (
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 20, opacity: 0 }}
        className="max-w-2xl mx-auto flex flex-col h-full bg-vybe-darker fixed inset-0 z-40 md:static overflow-hidden pb-20"
      >
        <div className="flex items-center gap-3 p-4 border-b border-vybe-border bg-vybe-darker/90 backdrop-blur-xl sticky top-0 z-10 flex-shrink-0">
          <button onClick={() => setActiveView(null)} className="p-2 -ml-2 text-vybe-text-muted hover:text-vybe-text transition-colors rounded-full hover:bg-vybe-card">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-bold text-vybe-text flex-1">{title}</h2>
        </div>
        <div className="p-4 flex-1 overflow-y-auto">
          {content}
        </div>
      </motion.div>
    );
  };

  return (
    <AnimatePresence mode="wait">
      {activeView ? renderSubView() : renderMainMenu()}
    </AnimatePresence>
  );
}

function Toggle({ defaultChecked, onChange }: { defaultChecked: boolean, onChange?: () => void }) {
  const [checked, setChecked] = useState(defaultChecked);
  
  const handleToggle = () => {
    setChecked(!checked);
    if (onChange) onChange();
  };

  return (
    <button
      onClick={handleToggle}
      className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${checked ? 'bg-vybe-primary' : 'bg-vybe-border'}`}
    >
      <motion.div
        layout
        className={`w-5 h-5 rounded-full bg-white absolute top-0.5 ${checked ? 'right-0.5' : 'left-0.5'}`}
      />
    </button>
  );
}

export function NotificationsPanel() {
  const { notifications, markAllRead } = useNotifStore();
  const { showNotifications, setShowNotifications } = useUIStore();
  if (!showNotifications) return null;
  const today = notifications.filter(n => n.time.includes('m') || n.time === '1h' || n.time === '2h');
  const earlier = notifications.filter(n => !today.includes(n));
  return (
    <motion.div initial={{ opacity: 0, x: 300 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 300 }}
      className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-vybe-darker/95 backdrop-blur-xl border-l border-vybe-border z-40 overflow-y-auto">
      <div className="p-4 border-b border-vybe-border flex items-center justify-between sticky top-0 bg-vybe-darker/90 backdrop-blur-xl">
        <h2 className="text-lg font-bold text-vybe-text">Notifications</h2>
        <div className="flex gap-3">
          <button onClick={markAllRead} className="text-sm text-vybe-primary font-medium">Mark all read</button>
          <button onClick={() => setShowNotifications(false)} className="text-vybe-text-muted text-lg hover:text-vybe-text transition-colors">✕</button>
        </div>
      </div>
      {today.length > 0 && <><p className="px-4 pt-4 pb-2 text-sm font-semibold text-vybe-text-muted">Today</p>
        {today.map(n => <NotifItem key={n.id} n={n} />)}</>}
      {earlier.length > 0 && <><p className="px-4 pt-4 pb-2 text-sm font-semibold text-vybe-text-muted">Earlier</p>
        {earlier.map(n => <NotifItem key={n.id} n={n} />)}</>}
    </motion.div>
  );
}

function NotifItem({ n }: { n: typeof NOTIFICATIONS[0] }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 hover:bg-vybe-card-hover transition-colors ${!n.read ? 'bg-vybe-primary/5' : ''}`}>
      <img src={n.actor.avatar} alt="" className="w-11 h-11 rounded-full object-cover flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm"><span className="font-semibold text-vybe-text">{n.actor.username}</span>{' '}<span className="text-vybe-text-muted">{n.content}</span></p>
        <p className="text-xs text-vybe-text-muted">{n.time}</p>
      </div>
      {n.postImage && <img src={n.postImage} alt="" className="w-11 h-11 rounded-lg object-cover flex-shrink-0" />}
      {n.type === 'follow' && <button className="px-3 py-1 rounded-lg bg-vybe-primary text-white text-xs font-semibold">Follow</button>}
      {!n.read && <div className="w-2 h-2 bg-vybe-primary rounded-full flex-shrink-0" />}
    </div>
  );
}
