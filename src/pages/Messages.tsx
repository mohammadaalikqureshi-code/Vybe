import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMessageStore } from '../stores';

import { Search, Send, Image, Smile, Phone, Video, MoreVertical, ArrowLeft, CheckCheck } from 'lucide-react';

export function MessagesPage() {
  const { conversations, activeChat, setActiveChat, chatMessages, sendMessage } = useMessageStore();
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const activeConvo = conversations.find(c => c.id === activeChat);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredConversations = searchQuery.trim()
    ? conversations.filter(c =>
      c.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : conversations;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, activeChat]);

  const handleSend = () => {
    if (!message.trim() || !activeChat) return;
    sendMessage(activeChat, message);
    setMessage('');
  };

  // ── Chat View ──
  if (activeChat && activeConvo) {
    const messages = chatMessages[activeChat] || [];
    return (
      <div className="flex flex-col h-[calc(100vh-64px)] bg-vybe-darker">
        {/* Chat header */}
        <div className="flex items-center gap-3 p-4 border-b border-vybe-border bg-vybe-card/50 backdrop-blur-xl flex-shrink-0">
          <button onClick={() => setActiveChat(null)} className="text-vybe-text-muted hover:text-vybe-text transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="relative">
            <img src={activeConvo.user.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
            {activeConvo.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-vybe-darker" />}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-vybe-text text-sm">{activeConvo.user.name}</p>
            <p className={`text-xs ${activeConvo.online ? 'text-green-400' : 'text-vybe-text-muted'}`}>
              {activeConvo.online ? 'Active now' : 'Last seen recently'}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-full text-vybe-text-muted hover:text-vybe-text hover:bg-vybe-card transition-all"><Phone className="w-5 h-5" /></button>
            <button className="p-2 rounded-full text-vybe-text-muted hover:text-vybe-text hover:bg-vybe-card transition-all"><Video className="w-5 h-5" /></button>
            <button className="p-2 rounded-full text-vybe-text-muted hover:text-vybe-text hover:bg-vybe-card transition-all"><MoreVertical className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Date separator */}
          <div className="flex items-center gap-2 my-2">
            <div className="flex-1 h-px bg-vybe-border" />
            <span className="text-xs text-vybe-text-muted px-2">Today</span>
            <div className="flex-1 h-px bg-vybe-border" />
          </div>

          {messages.map((msg, i) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
              {msg.senderId !== 'me' && (
                <img src={activeConvo.user.avatar} alt="" className="w-7 h-7 rounded-full object-cover mr-2 mt-1 flex-shrink-0" />
              )}
              <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                msg.senderId === 'me'
                  ? 'bg-gradient-to-r from-vybe-primary to-purple-500 text-white rounded-br-sm'
                  : 'bg-vybe-card border border-vybe-border text-vybe-text rounded-bl-sm'
              }`}>
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <div className={`flex items-center gap-1 justify-end mt-1 ${msg.senderId === 'me' ? 'text-white/50' : 'text-vybe-text-muted'}`}>
                  <span className="text-[10px]">{msg.time}</span>
                  {msg.senderId === 'me' && <CheckCheck className="w-3 h-3" />}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          {activeConvo.online && (
            <div className="flex items-center gap-2">
              <img src={activeConvo.user.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
              <div className="bg-vybe-card border border-vybe-border rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-vybe-text-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-vybe-text-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-vybe-text-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-vybe-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <button className="p-2 text-vybe-text-muted hover:text-vybe-text transition-colors"><Image className="w-6 h-6" /></button>
            <div className="flex-1 relative">
              <input value={message} onChange={e => setMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="w-full bg-vybe-card border border-vybe-border rounded-full px-4 pr-10 py-2.5 text-sm text-vybe-text placeholder-vybe-text-muted focus:outline-none focus:border-vybe-primary focus:ring-1 focus:ring-vybe-primary/30 transition-all" />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-vybe-text-muted hover:text-vybe-text transition-colors"><Smile className="w-5 h-5" /></button>
            </div>
            <motion.button whileTap={{ scale: 0.9 }} onClick={handleSend}
              disabled={!message.trim()}
              className="w-10 h-10 rounded-full bg-vybe-primary flex items-center justify-center text-white disabled:opacity-40 hover:bg-vybe-primary/90 transition-all shadow-lg shadow-vybe-primary/20">
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  // ── Conversation List ──
  return (
    <div className="max-w-2xl mx-auto px-4 pt-4 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-vybe-text">Messages</h1>
        <button className="text-vybe-primary text-sm font-semibold hover:opacity-80 transition-opacity">Requests (2)</button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-vybe-text-muted w-4 h-4" />
        <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search conversations..."
          className="w-full bg-vybe-card border border-vybe-border rounded-xl pl-11 pr-4 py-2.5 text-sm text-vybe-text placeholder-vybe-text-muted focus:outline-none focus:border-vybe-primary focus:ring-1 focus:ring-vybe-primary/30 transition-all" />
      </div>

      {/* Online users strip */}
      <div className="flex gap-3 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        {conversations.filter(c => c.online).map(convo => (
          <button key={convo.id} onClick={() => setActiveChat(convo.id)} className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className="relative">
              <img src={convo.user.avatar} alt="" className="w-14 h-14 rounded-full object-cover ring-2 ring-green-500/30" />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full ring-2 ring-vybe-darker" />
            </div>
            <span className="text-[10px] text-vybe-text-muted max-w-[56px] truncate">{convo.user.username.split('_')[0]}</span>
          </button>
        ))}
      </div>

      {/* Conversation list */}
      {filteredConversations.length === 0 ? (
        <div className="text-center py-12">
          <Search className="w-10 h-10 text-vybe-text-muted mx-auto mb-3 opacity-40" />
          <p className="text-vybe-text-muted text-sm">No conversations found for "{searchQuery}"</p>
        </div>
      ) : (
        <div className="space-y-1">
          {filteredConversations.map(convo => (
            <motion.button key={convo.id} whileHover={{ x: 4 }} onClick={() => setActiveChat(convo.id)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-vybe-card transition-colors">
              <div className="relative flex-shrink-0">
                <img src={convo.user.avatar} alt="" className="w-14 h-14 rounded-full object-cover" />
                {convo.online && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full ring-2 ring-vybe-darker" />}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex justify-between items-center">
                  <span className={`font-semibold text-sm ${convo.unread > 0 ? 'text-vybe-text' : 'text-vybe-text-muted'}`}>{convo.user.name}</span>
                  <span className="text-xs text-vybe-text-muted">{convo.lastMessageTime}</span>
                </div>
                <p className={`text-sm truncate ${convo.unread > 0 ? 'text-vybe-text font-medium' : 'text-vybe-text-muted'}`}>{convo.lastMessage}</p>
              </div>
              {convo.unread > 0 && <span className="bg-vybe-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 font-bold">{convo.unread}</span>}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
