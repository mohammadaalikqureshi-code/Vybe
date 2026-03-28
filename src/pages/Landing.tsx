import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores';
import { api } from '../lib/api';
import { Zap, Eye, EyeOff, ArrowRight, Sparkles, Users, Heart, Music, Loader2 } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-vybe-darker flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-600/20 rounded-full blur-3xl float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl float" style={{ animationDelay: '2s' }} />
      </div>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 text-center px-6 max-w-2xl">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-sm text-vybe-text-muted">The Next Generation Social Platform</span>
        </motion.div>
        <h1 className="text-7xl md:text-8xl font-black mb-6 tracking-tight">
          <span className="gradient-text">VYBE</span>
        </h1>
        <p className="text-xl text-vybe-text-muted mb-10 leading-relaxed">Share your moments. Connect with creators. Discover what's trending. Your vibe, your world.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => document.getElementById('auth-form')?.scrollIntoView({ behavior: 'smooth' })} className="btn-gradient px-8 py-4 rounded-2xl text-white font-semibold text-lg flex items-center justify-center gap-2">
            <span>Get Started</span><ArrowRight className="w-5 h-5" />
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => document.getElementById('auth-form')?.scrollIntoView({ behavior: 'smooth' })} className="glass px-8 py-4 rounded-2xl text-white font-semibold text-lg hover:bg-white/10 transition-colors">
            Sign In
          </motion.button>
        </div>
        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3">
          {[{ icon: Users, label: '10M+ Users' }, { icon: Heart, label: '1B+ Likes' }, { icon: Music, label: '50K+ Audio' }, { icon: Zap, label: 'Real-time' }].map((f, i) => (
            <motion.div key={f.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full glass-light text-sm text-vybe-text-muted">
              <f.icon className="w-4 h-4 text-vybe-primary" />{f.label}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  
  const login = useAuthStore(s => s.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      let res;
      if (isLogin) {
        res = await api.post('/auth/login', { email, password });
      } else {
        res = await api.post('/auth/register', { email, password, name, username });
      }
      localStorage.setItem('vybe_token', res.data.token);
      login(res.data.user);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth-form" className="min-h-screen bg-vybe-darker flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl" />
      </div>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative glass rounded-3xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold gradient-text mb-2">VYBE</h2>
          <p className="text-vybe-text-muted text-sm">{isLogin ? 'Welcome back! Sign in to continue' : 'Create your account'}</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Full Name" className="w-full bg-white/5 border border-vybe-border rounded-xl px-4 py-3 text-vybe-text placeholder-vybe-text-muted focus:outline-none focus:border-vybe-primary transition-colors" />}
          <input type={isLogin ? "text" : "email"} value={email} onChange={e => setEmail(e.target.value)} required placeholder={isLogin ? 'Email (e.g. devotee@vybe.app)' : 'Email'} className="w-full bg-white/5 border border-vybe-border rounded-xl px-4 py-3 text-vybe-text placeholder-vybe-text-muted focus:outline-none focus:border-vybe-primary transition-colors" />
          {!isLogin && <input type="text" value={username} onChange={e => setUsername(e.target.value)} required placeholder="Username" className="w-full bg-white/5 border border-vybe-border rounded-xl px-4 py-3 text-vybe-text placeholder-vybe-text-muted focus:outline-none focus:border-vybe-primary transition-colors" />}
          <div className="relative">
            <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="Password (e.g. password123)" className="w-full bg-white/5 border border-vybe-border rounded-xl px-4 py-3 pr-12 text-vybe-text placeholder-vybe-text-muted focus:outline-none focus:border-vybe-primary transition-colors" />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-vybe-text-muted hover:text-white">
              {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {isLogin && <div className="text-right"><button type="button" className="text-sm text-vybe-primary hover:underline">Forgot password?</button></div>}
          <motion.button disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full btn-gradient py-3 rounded-xl text-white font-semibold text-lg flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>{isLogin ? 'Sign In' : 'Create Account'}</span>}
          </motion.button>
        </form>
        <div className="mt-6 text-center text-sm text-vybe-text-muted">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-vybe-primary font-semibold hover:underline">{isLogin ? 'Sign Up' : 'Sign In'}</button>
        </div>
      </motion.div>
    </div>
  );
}

// Ensure LandingPage exposes AuthPage
export function AuthLanding() {
  return (
    <>
      <LandingPage />
      <AuthPage />
    </>
  );
}
