// Religious-themed mock data with gods, goddesses, spiritual content from all religions

export const AVATARS = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1488161628813-04466f0016e4?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop&crop=face',
];

// Hindu Gods & Temples, Mosques, Churches, Golden Temple, Buddhist temples
export const POST_IMAGES = [
  'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=800&fit=crop', // Taj Mahal
  'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&h=800&fit=crop', // Buddha
  'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=800&h=800&fit=crop', // Church stained glass
  'https://images.unsplash.com/photo-1585036156171-384164a8c159?w=800&h=800&fit=crop', // Mosque (Sheikh Zayed)
  'https://images.unsplash.com/photo-1545987796-200e06b0e6d3?w=800&h=800&fit=crop', // Mosque domes
  'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=800&h=800&fit=crop', // Mosque sunset
  'https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=800&h=800&fit=crop', // Church interior
  'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=800&h=800&fit=crop', // Temple golden
  'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=800&h=800&fit=crop', // Temple bells
  'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&h=800&fit=crop', // Prayer candles
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=800&fit=crop', // Person praying
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=800&fit=crop', // Nature spiritual
];

// Explore grid - temples, mosques, churches, gurudwaras
export const EXPLORE_IMAGES = [
  'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1585036156171-384164a8c159?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1545987796-200e06b0e6d3?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop',
];

// Story images - spiritual, devotional
export const STORY_IMAGES = [
  'https://images.unsplash.com/photo-1548013146-72479768bada?w=400&h=700&fit=crop',
  'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=400&h=700&fit=crop',
  'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=400&h=700&fit=crop',
  'https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=400&h=700&fit=crop',
  'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=400&h=700&fit=crop',
  'https://images.unsplash.com/photo-1585036156171-384164a8c159?w=400&h=700&fit=crop',
];

// Reel thumbnails - devotional/spiritual
export const REEL_IMAGES = [
  'https://images.unsplash.com/photo-1545987796-200e06b0e6d3?w=400&h=700&fit=crop',
  'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=400&h=700&fit=crop',
  'https://images.unsplash.com/photo-1585036156171-384164a8c159?w=400&h=700&fit=crop',
  'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=400&h=700&fit=crop',
  'https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=400&h=700&fit=crop',
];

export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  bio: string;
  isVerified: boolean;
  isPrivate: boolean;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
}

export interface Post {
  id: string;
  user: User;
  mediaUrl: string;
  caption: string;
  location?: string;
  likesCount: number;
  commentsCount: number;
  savesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string;
  hashtags: string[];
}

export interface Story {
  id: string;
  user: User;
  mediaUrl: string;
  seen: boolean;
  createdAt: string;
}

export interface Reel {
  id: string;
  user: User;
  thumbnailUrl: string;
  caption: string;
  audioTitle: string;
  audioArtist: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  user: User;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  online: boolean;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  actor: User;
  target?: string;
  content: string;
  time: string;
  read: boolean;
  postImage?: string;
}

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  plays: number;
  duration: string;
  category: string;
  isPlaying?: boolean;
}

// ---- USERS (Spiritual / Religious accounts) ----

export const USERS: User[] = [
  { id: '1', username: 'temple_vibes', name: 'Temple Vibes', avatar: AVATARS[0], bio: '🙏 Daily darshan & spiritual content\n📍 Varanasi, India\n🕉️ Har Har Mahadev', isVerified: true, isPrivate: false, postsCount: 1200, followersCount: 890000, followingCount: 120, isFollowing: true },
  { id: '2', username: 'sufi_sounds', name: 'Sufi Sounds', avatar: AVATARS[1], bio: '🎵 Qawwali & Sufi music\n🌙 Spreading love through music\n🤲 Ya Allah', isVerified: true, isPrivate: false, postsCount: 850, followersCount: 560000, followingCount: 200, isFollowing: false },
  { id: '3', username: 'buddha_path', name: 'Path of Buddha', avatar: AVATARS[2], bio: '☸️ Buddhism & Meditation\n🧘 Inner peace daily\n📿 Om Mani Padme Hum', isVerified: true, isPrivate: false, postsCount: 678, followersCount: 420000, followingCount: 89, isFollowing: true },
  { id: '4', username: 'church_bells', name: 'Church Bells', avatar: AVATARS[3], bio: '✝️ Gospel & Christian worship\n⛪ Sunday sermons\n🙏 God is love', isVerified: true, isPrivate: false, postsCount: 543, followersCount: 310000, followingCount: 150, isFollowing: false },
  { id: '5', username: 'golden_temple', name: 'Golden Temple', avatar: AVATARS[4], bio: '🙏 Sikh devotion & Gurbani\n📍 Amritsar\n🪯 Waheguru Ji Ka Khalsa', isVerified: true, isPrivate: false, postsCount: 920, followersCount: 750000, followingCount: 65, isFollowing: true },
  { id: '6', username: 'bhajan_lover', name: 'Bhajan Lover', avatar: AVATARS[5], bio: '🎶 Bhajans & Kirtans daily\n🙏 Ram Ram\n🕉️ Devotional music for the soul', isVerified: false, isPrivate: false, postsCount: 1500, followersCount: 230000, followingCount: 340, isFollowing: false },
  { id: '7', username: 'islamic_art', name: 'Islamic Art & Calligraphy', avatar: AVATARS[6], bio: '🕌 Islamic art, architecture & Nasheeds\n🌙 Bismillah\n📿 SubhanAllah', isVerified: true, isPrivate: false, postsCount: 780, followersCount: 480000, followingCount: 110, isFollowing: true },
  { id: '8', username: 'spiritual_guru', name: 'Spiritual Guru', avatar: AVATARS[7], bio: '🙏 All religions, one God\n🕉️☪️✝️☸️🪯\n🌍 Unity in diversity', isVerified: true, isPrivate: false, postsCount: 2100, followersCount: 1200000, followingCount: 50, isFollowing: false },
];

export const CURRENT_USER: User = {
  id: '0',
  username: 'devotee_soul',
  name: 'Divine Soul',
  avatar: AVATARS[0],
  bio: '🙏 Devotee | 🕉️ Spiritual Seeker | 🎵 Bhajan Lover\n📍 India\n🔗 vybe.app/divine',
  isVerified: true,
  isPrivate: false,
  postsCount: 456,
  followersCount: 125000,
  followingCount: 890,
};

export const POSTS: Post[] = [
  {
    id: 'p1', user: USERS[0], mediaUrl: POST_IMAGES[0],
    caption: '🙏 Morning darshan at the temple. The divine energy here is beyond words. Har Har Mahadev 🕉️ #temple #hinduism #darshan #spiritual',
    location: 'Varanasi, India', likesCount: 45000, commentsCount: 1200, savesCount: 8900, isLiked: false, isSaved: false,
    createdAt: '1h ago', hashtags: ['temple', 'hinduism', 'darshan', 'spiritual']
  },
  {
    id: 'p2', user: USERS[1], mediaUrl: POST_IMAGES[1],
    caption: '🙏 Ganesh Chaturthi celebrations! Ganpati Bappa Morya! May Lord Ganesha remove all obstacles from your life 🐘✨ #ganesh #ganapati #blessings',
    location: 'Mumbai, India', likesCount: 78000, commentsCount: 3400, savesCount: 12000, isLiked: true, isSaved: false,
    createdAt: '2h ago', hashtags: ['ganesh', 'ganapati', 'blessings']
  },
  {
    id: 'p3', user: USERS[6], mediaUrl: POST_IMAGES[3],
    caption: '🕌 The beauty of the mosque at sunset. SubhanAllah! The call to prayer echoes through the evening sky 🌙 #mosque #islam #prayer #beautiful',
    location: 'Istanbul, Turkey', likesCount: 56000, commentsCount: 2100, savesCount: 9500, isLiked: false, isSaved: true,
    createdAt: '3h ago', hashtags: ['mosque', 'islam', 'prayer', 'beautiful']
  },
  {
    id: 'p4', user: USERS[2], mediaUrl: POST_IMAGES[4],
    caption: '☸️ Finding inner peace in the presence of Lord Buddha. Meditation is the path to enlightenment 🧘‍♂️ #buddha #meditation #peace #zen',
    location: 'Bodh Gaya, India', likesCount: 34000, commentsCount: 890, savesCount: 6700, isLiked: false, isSaved: false,
    createdAt: '4h ago', hashtags: ['buddha', 'meditation', 'peace', 'zen']
  },
  {
    id: 'p5', user: USERS[4], mediaUrl: POST_IMAGES[7],
    caption: '🙏 The Golden Temple at dawn — a sight that fills every heart with devotion. Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh 🪯✨ #goldentemple #sikhism #waheguru',
    location: 'Amritsar, India', likesCount: 92000, commentsCount: 4500, savesCount: 15000, isLiked: true, isSaved: false,
    createdAt: '5h ago', hashtags: ['goldentemple', 'sikhism', 'waheguru']
  },
  {
    id: 'p6', user: USERS[3], mediaUrl: POST_IMAGES[6],
    caption: '✝️ The beauty of stained glass windows telling stories of faith. God is love ❤️ #church #christianity #faith #stainedglass',
    location: 'Vatican City', likesCount: 41000, commentsCount: 1500, savesCount: 7200, isLiked: false, isSaved: false,
    createdAt: '6h ago', hashtags: ['church', 'christianity', 'faith', 'stainedglass']
  },
  {
    id: 'p7', user: USERS[5], mediaUrl: POST_IMAGES[8],
    caption: '🪔 The beauty of diyas illuminating the darkness. Happy Diwali to all! May light triumph over darkness 🙏✨ #diwali #diyas #festival #light',
    location: 'Jaipur, India', likesCount: 120000, commentsCount: 6700, savesCount: 25000, isLiked: false, isSaved: false,
    createdAt: '8h ago', hashtags: ['diwali', 'diyas', 'festival', 'light']
  },
  {
    id: 'p8', user: USERS[7], mediaUrl: POST_IMAGES[5],
    caption: '🕌 The Taj Mahal — a monument of eternal love and devotion. Every brick tells a story of faith and dedication 🤲 #tajmahal #love #devotion #india',
    location: 'Agra, India', likesCount: 150000, commentsCount: 8900, savesCount: 30000, isLiked: true, isSaved: true,
    createdAt: '12h ago', hashtags: ['tajmahal', 'love', 'devotion', 'india']
  },
];

export const STORIES: Story[] = USERS.map((user, i) => ({
  id: `s${i}`,
  user,
  mediaUrl: STORY_IMAGES[i % STORY_IMAGES.length],
  seen: i > 3,
  createdAt: `${i + 1}h ago`,
}));

export const REELS: Reel[] = [
  { id: 'r1', user: USERS[0], thumbnailUrl: REEL_IMAGES[0], caption: '🙏 Ganesh Vandana — divine aarti at the temple #ganesh #aarti #devotion', audioTitle: 'Ganesh Aarti', audioArtist: 'Temple Vibes', likesCount: 125000, commentsCount: 4500, sharesCount: 8900, isLiked: false },
  { id: 'r2', user: USERS[1], thumbnailUrl: REEL_IMAGES[2], caption: '🕌 Beautiful Azaan at sunset — SubhanAllah! #azaan #islam #prayer', audioTitle: 'Azaan', audioArtist: 'Sufi Sounds', likesCount: 98000, commentsCount: 3200, sharesCount: 6700, isLiked: true },
  { id: 'r3', user: USERS[5], thumbnailUrl: REEL_IMAGES[1], caption: '🕉️ Om Namah Shivaya — powerful Shiva mantra chanting #shiva #mantra #om', audioTitle: 'Om Namah Shivaya', audioArtist: 'Bhajan Lover', likesCount: 210000, commentsCount: 7800, sharesCount: 15000, isLiked: false },
  { id: 'r4', user: USERS[3], thumbnailUrl: REEL_IMAGES[3], caption: '⛪ Amazing Grace — a hymn that touches the soul ✝️ #gospel #hymn #grace', audioTitle: 'Amazing Grace', audioArtist: 'Church Bells', likesCount: 67000, commentsCount: 2100, sharesCount: 4500, isLiked: false },
  { id: 'r5', user: USERS[6], thumbnailUrl: REEL_IMAGES[4], caption: '🌙 Beautiful Qawwali by Nusrat Fateh Ali Khan sahab 🤲 #qawwali #sufi #nfak', audioTitle: 'Allah Hoo', audioArtist: 'Nusrat Fateh Ali Khan', likesCount: 180000, commentsCount: 6500, sharesCount: 12000, isLiked: true },
];

export const CONVERSATIONS: Conversation[] = [
  { id: 'c1', user: USERS[0], lastMessage: 'Har Har Mahadev! 🙏 Did you see the morning aarti?', lastMessageTime: '2m', unread: 3, online: true },
  { id: 'c2', user: USERS[1], lastMessage: 'The new qawwali is amazing! 🎵', lastMessageTime: '15m', unread: 1, online: true },
  { id: 'c3', user: USERS[2], lastMessage: 'Om Mani Padme Hum 🧘', lastMessageTime: '1h', unread: 0, online: false },
  { id: 'c4', user: USERS[4], lastMessage: 'Waheguru Ji! Golden Temple photos are incredible 🙏', lastMessageTime: '3h', unread: 0, online: true },
  { id: 'c5', user: USERS[6], lastMessage: 'The calligraphy art is beautiful! MashaAllah 🕌', lastMessageTime: '5h', unread: 0, online: false },
  { id: 'c6', user: USERS[3], lastMessage: 'Sunday service was wonderful! God bless ✝️', lastMessageTime: '1d', unread: 0, online: false },
  { id: 'c7', user: USERS[5], lastMessage: 'That bhajan was soul-stirring 🎶🙏', lastMessageTime: '2d', unread: 0, online: false },
  { id: 'c8', user: USERS[7], lastMessage: 'All religions teach love and peace 🌍🙏', lastMessageTime: '3d', unread: 0, online: false },
];

export const NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'like', actor: USERS[1], content: 'liked your temple photo', time: '2m', read: false, postImage: POST_IMAGES[0] },
  { id: 'n2', type: 'follow', actor: USERS[7], content: 'started following you', time: '5m', read: false },
  { id: 'n3', type: 'comment', actor: USERS[5], content: 'commented: "Beautiful bhajan! 🙏🎵"', time: '15m', read: false, postImage: POST_IMAGES[1] },
  { id: 'n4', type: 'like', actor: USERS[2], content: 'liked your meditation reel', time: '1h', read: true, postImage: REEL_IMAGES[0] },
  { id: 'n5', type: 'mention', actor: USERS[0], content: 'mentioned you in a prayer post', time: '2h', read: true, postImage: POST_IMAGES[2] },
  { id: 'n6', type: 'follow', actor: USERS[3], content: 'started following you', time: '4h', read: true },
  { id: 'n7', type: 'like', actor: USERS[6], content: 'and 50 others liked your qawwali post', time: '6h', read: true, postImage: POST_IMAGES[3] },
  { id: 'n8', type: 'comment', actor: USERS[4], content: 'commented: "Waheguru Ji! 🙏🪯"', time: '1d', read: true, postImage: POST_IMAGES[7] },
];

// Religious / Devotional Audio Tracks
export const AUDIO_TRACKS: AudioTrack[] = [
  // Bhajans
  { id: 'a1', title: 'Om Jai Jagdish Hare', artist: 'Anuradha Paudwal', coverUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=200&h=200&fit=crop', plays: 15000000, duration: '5:42', category: 'bhajan' },
  { id: 'a2', title: 'Achyutam Keshavam', artist: 'Art of Living', coverUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=200&h=200&fit=crop', plays: 12000000, duration: '6:15', category: 'bhajan' },
  { id: 'a3', title: 'Hanuman Chalisa', artist: 'Hariharan', coverUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=200&h=200&fit=crop', plays: 50000000, duration: '8:30', category: 'bhajan' },
  // Qawwalis
  { id: 'a4', title: 'Allah Hoo Allah Hoo', artist: 'Nusrat Fateh Ali Khan', coverUrl: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=200&h=200&fit=crop', plays: 25000000, duration: '12:45', category: 'qawwali' },
  { id: 'a5', title: 'Mere Rashke Qamar', artist: 'Nusrat Fateh Ali Khan', coverUrl: 'https://images.unsplash.com/photo-1585036156171-384164a8c159?w=200&h=200&fit=crop', plays: 30000000, duration: '9:20', category: 'qawwali' },
  { id: 'a6', title: 'Khwaja Mere Khwaja', artist: 'A.R. Rahman', coverUrl: 'https://images.unsplash.com/photo-1545987796-200e06b0e6d3?w=200&h=200&fit=crop', plays: 18000000, duration: '7:10', category: 'qawwali' },
  // Gospel
  { id: 'a7', title: 'Amazing Grace', artist: 'Traditional Hymn', coverUrl: 'https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=200&h=200&fit=crop', plays: 20000000, duration: '4:35', category: 'gospel' },
  { id: 'a8', title: 'How Great Thou Art', artist: 'Carrie Underwood', coverUrl: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=200&h=200&fit=crop', plays: 8000000, duration: '4:20', category: 'gospel' },
  // Kirtan / Gurbani
  { id: 'a9', title: 'Waheguru Simran', artist: 'Bhai Harjinder Singh', coverUrl: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=200&h=200&fit=crop', plays: 9500000, duration: '10:15', category: 'kirtan' },
  { id: 'a10', title: 'Deh Shiva Bar Mohe', artist: 'Bhai Ravinder Singh', coverUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=200&h=200&fit=crop', plays: 7200000, duration: '8:45', category: 'kirtan' },
  // Buddhist Chants
  { id: 'a11', title: 'Om Mani Padme Hum', artist: 'Buddhist Monks', coverUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=200&h=200&fit=crop', plays: 35000000, duration: '15:00', category: 'chant' },
  // Nasheeds
  { id: 'a12', title: 'Tala Al Badru Alayna', artist: 'Maher Zain', coverUrl: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=200&h=200&fit=crop', plays: 22000000, duration: '4:50', category: 'nasheed' },
];

export const TRENDING_TAGS = [
  { name: 'bhajan', postsCount: '8.2M' },
  { name: 'qawwali', postsCount: '5.1M' },
  { name: 'temple', postsCount: '12.4M' },
  { name: 'mosque', postsCount: '9.8M' },
  { name: 'meditation', postsCount: '15.6M' },
  { name: 'kirtan', postsCount: '3.9M' },
  { name: 'gospel', postsCount: '7.3M' },
  { name: 'spiritual', postsCount: '18.2M' },
];

export const DASHBOARD_STATS = {
  totalViews: 5678000,
  totalLikes: 342000,
  totalComments: 89000,
  totalShares: 45000,
  followersGrowth: [
    { day: 'Mon', count: 520 },
    { day: 'Tue', count: 780 },
    { day: 'Wed', count: 650 },
    { day: 'Thu', count: 980 },
    { day: 'Fri', count: 1200 },
    { day: 'Sat', count: 1800 },
    { day: 'Sun', count: 2100 },
  ],
  engagementRate: 6.8,
  topPosts: [] as Post[],
  reachByHour: [30, 45, 20, 15, 10, 8, 12, 35, 60, 85, 92, 88, 90, 95, 78, 65, 72, 80, 85, 70, 55, 42, 38, 32],
};

// Initialize topPosts after POSTS is defined
DASHBOARD_STATS.topPosts = POSTS.slice(0, 3);

export function formatCount(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}
