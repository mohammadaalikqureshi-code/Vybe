import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const AVATARS = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1488161628813-04466f0016e4?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop&crop=face',
];

const POST_IMAGES = [
  'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1585036156171-384164a8c159?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1545987796-200e06b0e6d3?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=800&h=800&fit=crop',
];

async function main() {
  console.log('🌱 Seeding VYBE database...\n');

  // Clean existing data
  await prisma.notification.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.message.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.story.deleteMany();
  await prisma.reel.deleteMany();
  await prisma.post.deleteMany();
  await prisma.audioTrack.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash('password123', 12);

  // Create users
  const users = await Promise.all([
    prisma.user.create({ data: { username: 'devotee_soul', email: 'devotee@vybe.app', password, name: 'Divine Soul', avatar: AVATARS[0], bio: '🙏 Devotee | 🕉️ Spiritual Seeker', isVerified: true } }),
    prisma.user.create({ data: { username: 'temple_vibes', email: 'temple@vybe.app', password, name: 'Temple Vibes', avatar: AVATARS[1], bio: '🙏 Daily darshan & spiritual content', isVerified: true } }),
    prisma.user.create({ data: { username: 'sufi_sounds', email: 'sufi@vybe.app', password, name: 'Sufi Sounds', avatar: AVATARS[2], bio: '🎵 Qawwali & Sufi music', isVerified: true } }),
    prisma.user.create({ data: { username: 'buddha_path', email: 'buddha@vybe.app', password, name: 'Path of Buddha', avatar: AVATARS[3], bio: '☸️ Buddhism & Meditation', isVerified: true } }),
    prisma.user.create({ data: { username: 'church_bells', email: 'church@vybe.app', password, name: 'Church Bells', avatar: AVATARS[4], bio: '✝️ Gospel & Christian worship', isVerified: true } }),
    prisma.user.create({ data: { username: 'golden_temple', email: 'golden@vybe.app', password, name: 'Golden Temple', avatar: AVATARS[5], bio: '🙏 Sikh devotion & Gurbani', isVerified: true } }),
    prisma.user.create({ data: { username: 'bhajan_lover', email: 'bhajan@vybe.app', password, name: 'Bhajan Lover', avatar: AVATARS[6], bio: '🎶 Bhajans & Kirtans daily', isVerified: false } }),
    prisma.user.create({ data: { username: 'islamic_art', email: 'islamic@vybe.app', password, name: 'Islamic Art', avatar: AVATARS[7], bio: '🕌 Islamic art & calligraphy', isVerified: true } }),
  ]);
  console.log(`✅ Created ${users.length} users`);

  // Create posts
  const postData = [
    { userId: users[1].id, mediaUrl: POST_IMAGES[0], caption: '🙏 Morning darshan at the temple. Har Har Mahadev 🕉️', location: 'Varanasi, India', hashtags: 'temple,hinduism,darshan,spiritual' },
    { userId: users[2].id, mediaUrl: POST_IMAGES[3], caption: '🕌 The mosque at sunset. SubhanAllah! 🌙', location: 'Istanbul, Turkey', hashtags: 'mosque,islam,prayer,beautiful' },
    { userId: users[3].id, mediaUrl: POST_IMAGES[1], caption: '☸️ Finding inner peace with Lord Buddha 🧘', location: 'Bodh Gaya, India', hashtags: 'buddha,meditation,peace,zen' },
    { userId: users[4].id, mediaUrl: POST_IMAGES[6], caption: '✝️ Stained glass windows telling stories of faith ❤️', location: 'Vatican City', hashtags: 'church,christianity,faith' },
    { userId: users[5].id, mediaUrl: POST_IMAGES[7], caption: '🙏 The Golden Temple at dawn — Waheguru Ji 🪯✨', location: 'Amritsar, India', hashtags: 'goldentemple,sikhism,waheguru' },
    { userId: users[6].id, mediaUrl: POST_IMAGES[2], caption: '🪔 Diyas illuminating the darkness. Happy Diwali! 🙏✨', location: 'Jaipur, India', hashtags: 'diwali,diyas,festival,light' },
    { userId: users[7].id, mediaUrl: POST_IMAGES[5], caption: '🕌 Taj Mahal — a monument of eternal love and devotion 🤲', location: 'Agra, India', hashtags: 'tajmahal,love,devotion,india' },
    { userId: users[0].id, mediaUrl: POST_IMAGES[4], caption: '🙏 All religions teach one thing — Love and Peace 🌍', location: 'Delhi, India', hashtags: 'spiritual,peace,love,unity' },
  ];
  const posts = await Promise.all(postData.map(d => prisma.post.create({ data: d })));
  console.log(`✅ Created ${posts.length} posts`);

  // Create some follows
  const followPairs = [[0,1],[0,2],[0,4],[1,0],[1,2],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]];
  await Promise.all(followPairs.map(([a, b]) =>
    prisma.follow.create({ data: { followerId: users[a].id, followingId: users[b].id } })
  ));
  console.log(`✅ Created ${followPairs.length} follows`);

  // Create comments
  await prisma.comment.createMany({
    data: [
      { postId: posts[0].id, userId: users[2].id, content: 'SubhanAllah! Beautiful 🙏' },
      { postId: posts[0].id, userId: users[3].id, content: 'Peaceful vibes ☸️' },
      { postId: posts[1].id, userId: users[0].id, content: 'MashaAllah! 🕌' },
      { postId: posts[2].id, userId: users[7].id, content: 'Om Mani Padme Hum 🧘' },
      { postId: posts[4].id, userId: users[0].id, content: 'Waheguru Ji! 🙏🪯' },
    ],
  });
  console.log('✅ Created comments');

  // Create likes
  await Promise.all([
    prisma.like.create({ data: { postId: posts[0].id, userId: users[0].id } }),
    prisma.like.create({ data: { postId: posts[0].id, userId: users[2].id } }),
    prisma.like.create({ data: { postId: posts[1].id, userId: users[0].id } }),
    prisma.like.create({ data: { postId: posts[4].id, userId: users[0].id } }),
  ]);
  console.log('✅ Created likes');

  // Create messages
  await prisma.message.createMany({
    data: [
      { senderId: users[1].id, receiverId: users[0].id, content: 'Har Har Mahadev! 🙏' },
      { senderId: users[0].id, receiverId: users[1].id, content: 'Mahadev! Beautiful aarti today' },
      { senderId: users[2].id, receiverId: users[0].id, content: 'Have you heard the new qawwali? 🎵' },
      { senderId: users[0].id, receiverId: users[2].id, content: 'SubhanAllah! Amazing! 🤲' },
    ],
  });
  console.log('✅ Created messages');

  // Create audio tracks
  await prisma.audioTrack.createMany({
    data: [
      { title: 'Om Jai Jagdish Hare', artist: 'Anuradha Paudwal', coverUrl: POST_IMAGES[0], plays: 15000000, duration: '5:42', category: 'bhajan' },
      { title: 'Hanuman Chalisa', artist: 'Hariharan', coverUrl: POST_IMAGES[7], plays: 50000000, duration: '8:30', category: 'bhajan' },
      { title: 'Allah Hoo Allah Hoo', artist: 'Nusrat Fateh Ali Khan', coverUrl: POST_IMAGES[5], plays: 25000000, duration: '12:45', category: 'qawwali' },
      { title: 'Amazing Grace', artist: 'Traditional Hymn', coverUrl: POST_IMAGES[6], plays: 20000000, duration: '4:35', category: 'gospel' },
      { title: 'Waheguru Simran', artist: 'Bhai Harjinder Singh', coverUrl: POST_IMAGES[7], plays: 9500000, duration: '10:15', category: 'kirtan' },
      { title: 'Om Mani Padme Hum', artist: 'Buddhist Monks', coverUrl: POST_IMAGES[1], plays: 35000000, duration: '15:00', category: 'chant' },
      { title: 'Tala Al Badru Alayna', artist: 'Maher Zain', coverUrl: POST_IMAGES[5], plays: 22000000, duration: '4:50', category: 'nasheed' },
    ],
  });
  console.log('✅ Created audio tracks');

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📝 Login credentials for all users:');
  console.log('   Email: devotee@vybe.app (or any other)');
  console.log('   Password: password123\n');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
