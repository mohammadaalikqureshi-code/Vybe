import { motion } from 'framer-motion';
import { useUIStore, useNotifStore } from '../stores';
import { CURRENT_USER } from '../data';
import { Home, Search, Film, Music, MessageCircle, User, Settings, Bell, Plus, LayoutDashboard } from 'lucide-react';

const BOTTOM_NAV = [
  { id: 'feed', label: 'Home', Icon: Home },
  { id: 'explore', label: 'Search', Icon: Search },
  { id: 'reels', label: 'Reels', Icon: Film },
  { id: 'messages', label: 'Chat', Icon: MessageCircle },
  { id: 'profile', label: 'Profile', Icon: User },
];

const MORE_TABS = [
  { id: 'audio', label: 'Audio', Icon: Music },
  { id: 'dashboard', label: 'Stats', Icon: LayoutDashboard },
  { id: 'settings', label: 'Settings', Icon: Settings },
];

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { activeTab, setActiveTab, showNotifications, setShowNotifications, setShowCreatePost } = useUIStore();
  const unreadCount = useNotifStore(s => s.unreadCount);

  return (
    <div className="flex flex-col h-screen bg-vybe-darker theme-transition">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-vybe-border bg-vybe-darker/90 backdrop-blur-xl sticky top-0 z-30">
        <h1 className="text-2xl font-black gradient-text tracking-tight cursor-pointer" onClick={() => setActiveTab('feed')}>VYBE</h1>

        <div className="flex items-center gap-1">
          {/* Quick access tabs */}
          {MORE_TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`p-2 rounded-full transition-all ${activeTab === tab.id ? 'text-vybe-primary bg-vybe-primary/10' : 'text-vybe-text-muted hover:text-vybe-text hover:bg-vybe-card'}`}
              title={tab.label}>
              <tab.Icon className="w-5 h-5" />
            </button>
          ))}

          {/* Create post */}
          <button onClick={() => setShowCreatePost(true)}
            className="p-2 rounded-full bg-vybe-primary/10 text-vybe-primary hover:bg-vybe-primary/20 transition-colors mx-1"
            title="Create Post">
            <Plus className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <button onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full hover:bg-vybe-card text-vybe-text-muted hover:text-vybe-text transition-colors"
            title="Notifications">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-vybe-danger text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Theme toggle */}
          <button 
            onClick={() => useUIStore.getState().toggleTheme()} 
            className="p-2 rounded-full hover:bg-vybe-card text-vybe-text-muted hover:text-vybe-text transition-colors"
            title="Toggle Theme">
            {useUIStore.getState().theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Avatar */}
          <button onClick={() => setActiveTab('profile')} className="relative ml-1">
            <img src={CURRENT_USER.avatar} alt="" className={`w-8 h-8 rounded-full object-cover ring-2 transition-all ${activeTab === 'profile' ? 'ring-vybe-primary' : 'ring-vybe-primary/40'}`} />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      {/* Books panel edge tab (for desktop) */}
      <button
        onClick={() => useUIStore.getState().setShowBooksPanel(true)}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-20 bg-vybe-primary/90 hover:bg-vybe-primary text-white px-1.5 py-3 rounded-r-xl shadow-lg transition-all hover:px-2.5 group"
        title="Sacred Library — Swipe right or click"
      >
        <span className="text-lg">📚</span>
      </button>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-vybe-darker/95 backdrop-blur-xl border-t border-vybe-border z-30">
        <div className="flex justify-around items-center h-16 px-1 max-w-lg mx-auto">
          {BOTTOM_NAV.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 relative transition-all duration-300 ${
                activeTab === item.id ? 'text-vybe-primary' : 'text-vybe-text-muted hover:text-vybe-text'
              }`}>
              <div className={`relative ${activeTab === item.id ? 'scale-110' : ''} transition-transform duration-300`}>
                <item.Icon className="w-6 h-6" strokeWidth={activeTab === item.id ? 2.5 : 1.5} />
                {activeTab === item.id && (
                  <motion.div layoutId="navGlow"
                    className="absolute -inset-2 rounded-full bg-vybe-primary/15 -z-10"
                    transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }} />
                )}
                {/* Unread badge for messages */}
                {item.id === 'messages' && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-vybe-primary rounded-full" />
                )}
              </div>
              <span className={`text-[10px] font-medium ${activeTab === item.id ? 'text-vybe-primary' : ''}`}>{item.label}</span>
              {activeTab === item.id && (
                <motion.div layoutId="bottomDot"
                  className="absolute -top-0.5 w-1 h-1 bg-vybe-primary rounded-full"
                  transition={{ type: 'spring', bounce: 0.4 }} />
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
