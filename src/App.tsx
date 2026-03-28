import { useAuthStore, useUIStore } from './stores';
import { AuthLanding } from './pages/Landing';
import { MainLayout } from './pages/Layout';
import { FeedPage, StoryViewer, CommentDrawer } from './pages/Feed';
import { ExplorePage } from './pages/Explore';
import { ReelsPage } from './pages/Reels';
import { AudioPage } from './pages/Audio';
import { DashboardPage } from './pages/Dashboard';
import { MessagesPage } from './pages/Messages';
import { ProfilePage } from './pages/Profile';
import { SettingsPage, NotificationsPanel } from './pages/Settings';
import { CreatePostModal } from './pages/CreatePost';
import { BooksPanel } from './pages/Books';

function ActivePage() {
  const activeTab = useUIStore(s => s.activeTab);
  switch (activeTab) {
    case 'feed': return <FeedPage />;
    case 'explore': return <ExplorePage />;
    case 'reels': return <ReelsPage />;
    case 'audio': return <AudioPage />;
    case 'dashboard': return <DashboardPage />;
    case 'messages': return <MessagesPage />;
    case 'profile': return <ProfilePage />;
    case 'settings': return <SettingsPage />;
    default: return <FeedPage />;
  }
}

import { useEffect, useRef, useCallback } from 'react';

export default function App() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const checkAuth = useAuthStore(s => s.checkAuth);
  const setShowBooksPanel = useUIStore(s => s.setShowBooksPanel);
  const showBooksPanel = useUIStore(s => s.showBooksPanel);
  const activeTab = useUIStore(s => s.activeTab);
  const setActiveTab = useUIStore(s => s.setActiveTab);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current || showBooksPanel) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartRef.current.y);
    
    // Horizontal swipe threshold: dx > 80px, mostly horizontal (dx > dy*2)
    if (Math.abs(dx) > 80 && Math.abs(dx) > dy * 2) {
      if (dx > 0) {
        // Swipe Right
        if (activeTab === 'messages') {
          setActiveTab('feed');
        } else {
          setShowBooksPanel(true);
        }
      } else {
        // Swipe Left
        if (activeTab === 'feed') {
          setActiveTab('messages');
        }
      }
    }
    touchStartRef.current = null;
  }, [showBooksPanel, setShowBooksPanel, activeTab, setActiveTab]);

  if (!isAuthenticated) {
    return <AuthLanding />;
  }

  return (
    <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <MainLayout>
        <ActivePage />
      </MainLayout>
      <StoryViewer />
      <NotificationsPanel />
      <CreatePostModal />
      <CommentDrawer />
      <BooksPanel />
    </div>
  );
}
