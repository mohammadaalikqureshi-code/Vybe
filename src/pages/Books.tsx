import { useState, useRef } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useUIStore } from '../stores';

const GHOST = "#F7F7FF";
const PERSIAN = "#27187E";
const PL = "rgba(39,24,126,0.08)";
const PL2 = "rgba(39,24,126,0.15)";

const RELIGIONS = [
  {
    id: "islam", name: "Islam", emoji: "☪️", color: "#1a5276", bg: "#eaf4fb",
    origin: "7th century CE · Arabia", followers: "1.9 Billion",
    desc: "The world's second-largest religion, based on monotheism and the teachings of Prophet Muhammad.",
    books: [
      { id: "quran", title: "The Holy Quran", author: "Revelation to Prophet Muhammad", chapters: 114, type: "live-quran", language: "Arabic / English", desc: "The central religious text of Islam, regarded as a revelation from God." },
      { id: "hadith", title: "Sahih Al-Bukhari", author: "Imam Bukhari", chapters: 97, type: "ai", language: "Arabic / English", desc: "The most authentic collection of Prophet Muhammad's sayings and actions." },
      { id: "hadith2", title: "Sahih Muslim", author: "Imam Muslim", chapters: 56, type: "ai", language: "Arabic / English", desc: "Second most authentic hadith collection in Sunni Islam." },
    ]
  },
  {
    id: "christianity", name: "Christianity", emoji: "✝️", color: "#6e2c00", bg: "#fdf2e9",
    origin: "1st century CE · Jerusalem", followers: "2.4 Billion",
    desc: "The world's largest religion, centred on the life and teachings of Jesus Christ.",
    books: [
      { id: "bible-kjv", title: "The Holy Bible (KJV)", author: "Various prophets & apostles", chapters: 66, type: "live-bible", language: "English", desc: "The King James Version — one of the most influential texts in the English language." },
      { id: "bible-nt", title: "New Testament", author: "Apostles of Jesus", chapters: 27, type: "live-bible", language: "English", desc: "Contains the four Gospels, Acts, Epistles, and Revelation." },
      { id: "didache", title: "The Didache", author: "Early Christian community", chapters: 16, type: "ai", language: "Greek / English", desc: "One of the earliest Christian writings outside the New Testament." },
    ]
  },
  {
    id: "hinduism", name: "Hinduism", emoji: "🕉️", color: "#7d6608", bg: "#fef9e7",
    origin: "~1500 BCE · Indian subcontinent", followers: "1.2 Billion",
    desc: "One of the world's oldest religions, with a diverse range of philosophies, rituals and practices.",
    books: [
      { id: "gita", title: "Bhagavad Gita", author: "Vyasa (attributed)", chapters: 18, type: "ai", language: "Sanskrit / English", desc: "700-verse Hindu scripture that is part of the Mahabharata." },
      { id: "rigveda", title: "Rig Veda", author: "Various Rishis", chapters: 10, type: "ai", language: "Sanskrit / English", desc: "The oldest of the four Vedas — hymns to the gods." },
      { id: "upanishads", title: "The Upanishads", author: "Ancient Rishis", chapters: 108, type: "ai", language: "Sanskrit / English", desc: "Philosophical texts forming the core of Hindu philosophy." },
      { id: "ramayana", title: "Ramayana", author: "Valmiki", chapters: 7, type: "ai", language: "Sanskrit / English", desc: "Epic poem narrating the journey of Rama to rescue Sita." },
      { id: "mahabharata", title: "Mahabharata", author: "Vyasa", chapters: 18, type: "ai", language: "Sanskrit / English", desc: "The longest epic poem in the world — over 100,000 verses." },
    ]
  },
  {
    id: "buddhism", name: "Buddhism", emoji: "☸️", color: "#1d8348", bg: "#eafaf1",
    origin: "5th century BCE · Nepal/India", followers: "500 Million",
    desc: "A path of practice and spiritual development leading to Insight into the true nature of reality.",
    books: [
      { id: "dhammapada", title: "Dhammapada", author: "The Buddha (attributed)", chapters: 26, type: "ai", language: "Pali / English", desc: "A collection of 423 verses uttered by the Buddha on various occasions." },
      { id: "tripitaka", title: "Pali Tipitaka", author: "Buddhist community", chapters: 3, type: "ai", language: "Pali / English", desc: "The complete collection of Theravada Buddhist scriptures." },
      { id: "lotus", title: "Lotus Sutra", author: "Mahayana tradition", chapters: 28, type: "ai", language: "Sanskrit / English", desc: "One of the most influential and revered Mahayana scriptures." },
      { id: "heartsutra", title: "Heart Sutra", author: "Mahayana tradition", chapters: 1, type: "ai", language: "Sanskrit / English", desc: "A condensed expression of Mahayana Buddhist philosophy." },
    ]
  },
  {
    id: "judaism", name: "Judaism", emoji: "✡️", color: "#154360", bg: "#eaf4fb",
    origin: "~2000 BCE · Canaan", followers: "15 Million",
    desc: "One of the oldest monotheistic religions, the religious, philosophical, and cultural practice of the Jewish people.",
    books: [
      { id: "torah", title: "The Torah", author: "Moses (attributed)", chapters: 5, type: "ai", language: "Hebrew / English", desc: "The five books of Moses — the central text of Judaism." },
      { id: "talmud", title: "The Talmud", author: "Rabbinic scholars", chapters: 63, type: "ai", language: "Hebrew-Aramaic / English", desc: "The central text of Rabbinic Judaism, comprising Mishnah and Gemara." },
      { id: "zohar", title: "The Zohar", author: "Shimon bar Yochai (attributed)", chapters: 23, type: "ai", language: "Aramaic / English", desc: "Foundational work of Jewish mystical thought — Kabbalah." },
    ]
  },
  {
    id: "sikhism", name: "Sikhism", emoji: "🪬", color: "#7e5109", bg: "#fef5e7",
    origin: "15th century CE · Punjab", followers: "30 Million",
    desc: "A monotheistic religion founded in the Punjab region, emphasising equality, service and devotion to one God.",
    books: [
      { id: "ggsahib", title: "Guru Granth Sahib", author: "Ten Sikh Gurus", chapters: 1430, type: "ai", language: "Gurmukhi / English", desc: "The eternal, living Guru of the Sikhs — the central holy scripture." },
      { id: "dasam", title: "Dasam Granth", author: "Guru Gobind Singh", chapters: 18, type: "ai", language: "Braj Bhasha / English", desc: "A scripture of compositions attributed to the tenth Guru." },
    ]
  },
  {
    id: "taoism", name: "Taoism", emoji: "☯️", color: "#1a5276", bg: "#eaf2fb",
    origin: "4th century BCE · China", followers: "20 Million",
    desc: "A philosophical and spiritual tradition emphasising living in harmony with the Tao.",
    books: [
      { id: "taoteching", title: "Tao Te Ching", author: "Laozi", chapters: 81, type: "ai", language: "Classical Chinese / English", desc: "The foundational text of Taoist philosophy — 81 short poetic chapters." },
      { id: "zhuangzi", title: "Zhuangzi", author: "Zhuangzi", chapters: 33, type: "ai", language: "Classical Chinese / English", desc: "An ancient Chinese text central to Taoism." },
    ]
  },
  {
    id: "zoroastrianism", name: "Zoroastrianism", emoji: "🔥", color: "#7b241c", bg: "#fdedec",
    origin: "~1500 BCE · Persia", followers: "2.6 Million",
    desc: "One of the world's oldest religions, founded by Zoroaster in ancient Persia.",
    books: [
      { id: "avesta", title: "The Avesta", author: "Zoroaster & disciples", chapters: 21, type: "ai", language: "Avestan / English", desc: "The primary collection of religious texts of Zoroastrianism." },
      { id: "gathas", title: "The Gathas", author: "Zoroaster", chapters: 17, type: "ai", language: "Old Avestan / English", desc: "17 hymns composed by the prophet Zoroaster himself." },
    ]
  },
  {
    id: "jainism", name: "Jainism", emoji: "🫲", color: "#145a32", bg: "#eafaf1",
    origin: "6th century BCE · India", followers: "4.5 Million",
    desc: "An ancient Indian religion emphasising non-violence, truth and non-possessiveness.",
    books: [
      { id: "agamas", title: "The Agamas", author: "Lord Mahavira's disciples", chapters: 45, type: "ai", language: "Prakrit / English", desc: "The canonical scriptures of Jainism compiled after Mahavira's teachings." },
      { id: "tattvartha", title: "Tattvartha Sutra", author: "Umasvati", chapters: 10, type: "ai", language: "Sanskrit / English", desc: "First text to explain Jain philosophy in Sanskrit — accepted by all sects." },
    ]
  },
  {
    id: "confucianism", name: "Confucianism", emoji: "📖", color: "#4a235a", bg: "#f9ebff",
    origin: "5th century BCE · China", followers: "6 Million",
    desc: "A system of thought and behaviour based on the teachings of Confucius.",
    books: [
      { id: "analects", title: "The Analects", author: "Confucius (via disciples)", chapters: 20, type: "ai", language: "Classical Chinese / English", desc: "A collection of sayings and ideas attributed to Confucius." },
      { id: "iching", title: "I Ching (Book of Changes)", author: "Ancient Chinese sages", chapters: 64, type: "ai", language: "Classical Chinese / English", desc: "An ancient divination text and the oldest of the Chinese classics." },
      { id: "fiveclassics", title: "The Five Classics", author: "Confucius (compiled)", chapters: 5, type: "ai", language: "Classical Chinese / English", desc: "Five ancient Chinese books associated with Confucianism." },
    ]
  },
  {
    id: "bahai", name: "Bahai Faith", emoji: "⭐", color: "#117a65", bg: "#e8f8f5",
    origin: "19th century CE · Persia", followers: "7.5 Million",
    desc: "A religion teaching the essential worth of all religions and unity of all people.",
    books: [
      { id: "kitabiaqdas", title: "Kitab-i-Aqdas", author: "Bahaullah", chapters: 190, type: "ai", language: "Arabic / English", desc: "The Most Holy Book — the central book of the Bahai Faith." },
      { id: "hiddenwords", title: "The Hidden Words", author: "Bahaullah", chapters: 153, type: "ai", language: "Arabic/Persian / English", desc: "A compilation of divine utterances from Bahaullah." },
    ]
  },
  {
    id: "shinto", name: "Shinto", emoji: "⛩️", color: "#cb4335", bg: "#fdedec",
    origin: "~300 BCE · Japan", followers: "3-4 Million",
    desc: "The indigenous religion of Japan, involving reverence for kami (spirits) and the natural world.",
    books: [
      { id: "kojiki", title: "Kojiki", author: "O no Yasumaro", chapters: 3, type: "ai", language: "Old Japanese / English", desc: "Record of Ancient Matters — the oldest chronicle of Japan." },
      { id: "nihonshoki", title: "Nihon Shoki", author: "Prince Toneri et al.", chapters: 30, type: "ai", language: "Classical Chinese / English", desc: "The second oldest chronicle of Japan and Japanese mythology." },
    ]
  },
];

const QURAN_SURAHS = [
  "Al-Fatihah","Al-Baqarah","Ali Imran","An-Nisa","Al-Maidah","Al-Anam","Al-Araf","Al-Anfal",
  "At-Tawbah","Yunus","Hud","Yusuf","Ar-Rad","Ibrahim","Al-Hijr","An-Nahl","Al-Isra","Al-Kahf",
  "Maryam","Ta-Ha","Al-Anbya","Al-Hajj","Al-Muminun","An-Nur","Al-Furqan","Ash-Shuara","An-Naml",
  "Al-Qasas","Al-Ankabut","Ar-Rum","Luqman","As-Sajdah","Al-Ahzab","Saba","Fatir","Ya-Sin",
  "As-Saffat","Sad","Az-Zumar","Ghafir","Fussilat","Ash-Shura","Az-Zukhruf","Ad-Dukhan","Al-Jathiyah",
  "Al-Ahqaf","Muhammad","Al-Fath","Al-Hujurat","Qaf","Adh-Dhariyat","At-Tur","An-Najm","Al-Qamar",
  "Ar-Rahman","Al-Waqiah","Al-Hadid","Al-Mujadila","Al-Hashr","Al-Mumtahanah","As-Saf","Al-Jumuah",
  "Al-Munafiqun","At-Taghabun","At-Talaq","At-Tahrim","Al-Mulk","Al-Qalam","Al-Haqqah","Al-Maarij",
  "Nuh","Al-Jinn","Al-Muzzammil","Al-Muddaththir","Al-Qiyamah","Al-Insan","Al-Mursalat","An-Naba",
  "An-Naziat","Abasa","At-Takwir","Al-Infitar","Al-Mutaffifin","Al-Inshiqaq","Al-Buruj","At-Tariq",
  "Al-Ala","Al-Ghashiyah","Al-Fajr","Al-Balad","Ash-Shams","Al-Layl","Ad-Duha","Ash-Sharh",
  "At-Tin","Al-Alaq","Al-Qadr","Al-Bayyinah","Az-Zalzalah","Al-Adiyat","Al-Qariah","At-Takathur",
  "Al-Asr","Al-Humazah","Al-Fil","Quraysh","Al-Maun","Al-Kawthar","Al-Kafirun","An-Nasr",
  "Al-Masad","Al-Ikhlas","Al-Falaq","An-Nas"
];

const BIBLE_BOOKS = [
  "Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth",
  "1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah",
  "Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon","Isaiah","Jeremiah",
  "Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah",
  "Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi",
  "Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians",
  "Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians",
  "1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter",
  "1 John","2 John","3 John","Jude","Revelation"
];

export function BooksPanel() {
  const showBooksPanel = useUIStore(s => s.showBooksPanel);
  const setShowBooksPanel = useUIStore(s => s.setShowBooksPanel);
  const touchStartX = useRef(0);

  const [view, setView] = useState("home");
  const [selectedReligion, setSelectedReligion] = useState<any>(null);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [readerContent, setReaderContent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [quranSurah, setQuranSurah] = useState(1);
  const [bibleBook, setBibleBook] = useState("John");
  const [bibleChapter, setBibleChapter] = useState(1);
  const [aiChapter, setAiChapter] = useState(1);
  const [aiContent, setAiContent] = useState("");
  const [aiStreaming, setAiStreaming] = useState(false);
  const [notification, setNotification] = useState("");

  if (!showBooksPanel) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff < -80) setShowBooksPanel(false);
  };

  const toast = (msg: string) => { setNotification(msg); setTimeout(() => setNotification(""), 2500); };

  const addBookmark = () => {
    const key = selectedBook?.id + "-" + aiChapter;
    setBookmarks(b => b.find(x => x.key === key) ? b : [...b, { key, book: selectedBook?.title, chapter: aiChapter, religion: selectedReligion?.name }]);
    toast("Bookmarked");
  };

  const fetchQuran = async (surah: number) => {
    setLoading(true); setReaderContent(null);
    try {
      const r = await fetch("https://api.alquran.cloud/v1/surah/" + surah + "/en.asad");
      const d = await r.json();
      setReaderContent({ type: "quran", data: d.data });
    } catch { toast("Failed to load. Please check connection."); }
    setLoading(false);
  };

  const fetchBible = async (book: string, chapter: number) => {
    setLoading(true); setReaderContent(null);
    try {
      const r = await fetch("https://bible-api.com/" + encodeURIComponent(book) + "+" + chapter + "?translation=kjv");
      const d = await r.json();
      setReaderContent({ type: "bible", data: d });
    } catch { toast("Failed to load. Please check connection."); }
    setLoading(false);
  };

  const fetchAI = async (book: any, chapter: number, religion: any) => {
    setAiStreaming(true); setAiContent("");
    try {
      const prompt = "You are a scholarly religious text expert. Provide the content of Chapter/Section " + chapter + ' of "' + book.title + '" from ' + religion.name + ". Include: 1. Chapter Title 2. Original Language Note 3. Full Text (several paragraphs) 4. Key Themes 5. Historical Context 6. Commentary. Format beautifully. Be accurate and respectful.";

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          stream: true,
          messages: [{ role: "user", content: prompt }]
        })
      });

      if (!response.ok) throw new Error("API call failed");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const json = JSON.parse(data);
              if (json.type === "content_block_delta" && json.delta?.text) {
                setAiContent(c => c + json.delta.text);
              }
            } catch {}
          }
        }
      }
    } catch (e) {
      setAiContent("Unable to load content directly from AI (API Key required). You are on the right path seeking knowledge!");
    }
    setAiStreaming(false);
  };

  const openBook = (book: any, religion: any) => {
    setSelectedBook(book); setSelectedReligion(religion);
    setReaderContent(null); setAiContent(""); setAiChapter(1);
    setQuranSurah(1); setBibleBook("John"); setBibleChapter(1);
    setView("reader");
    if (book.type === "live-quran") fetchQuran(1);
    else if (book.type === "live-bible") fetchBible("John", 1);
    else fetchAI(book, 1, religion);
  };

  const searchResults = RELIGIONS.flatMap(r =>
    r.books.filter(b =>
      b.title.toLowerCase().includes(searchQ.toLowerCase()) ||
      r.name.toLowerCase().includes(searchQ.toLowerCase()) ||
      b.desc.toLowerCase().includes(searchQ.toLowerCase())
    ).map(b => ({ ...b, religion: r }))
  );

  return (
    <AnimatePresence>
      {showBooksPanel && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', bounce: 0.12, duration: 0.6 }}
          className="fixed inset-0 z-50 overflow-auto"
          style={{ background: "#EBEBF5", fontFamily: "'Outfit',sans-serif" }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <style dangerouslySetInnerHTML={{ __html: cssText }} />
          {notification && <div style={S.toast}>{notification}</div>}

          {view === "home" && (
            <HomeView
              onSelectReligion={(r: any) => { setSelectedReligion(r); setView("religion"); }}
              onSearch={() => setView("search")}
              bookmarks={bookmarks}
              onOpenBookmark={(bm: any) => {
                const rel = RELIGIONS.find(r => r.name === bm.religion);
                const book = rel?.books.find(b => b.title === bm.book);
                if (rel && book) { setSelectedReligion(rel); setSelectedBook(book); setAiChapter(bm.chapter); fetchAI(book, bm.chapter, rel); setView("reader"); }
              }}
              onClose={() => setShowBooksPanel(false)}
            />
          )}

          {view === "religion" && selectedReligion && (
            <ReligionView
              religion={selectedReligion}
              onBack={() => setView("home")}
              onOpenBook={(b: any) => openBook(b, selectedReligion)}
            />
          )}

          {view === "reader" && selectedBook && selectedReligion && (
            <ReaderView
              book={selectedBook} religion={selectedReligion}
              readerContent={readerContent} loading={loading}
              quranSurah={quranSurah} setQuranSurah={setQuranSurah}
              bibleBook={bibleBook} setBibleBook={setBibleBook}
              bibleChapter={bibleChapter} setBibleChapter={setBibleChapter}
              aiChapter={aiChapter} setAiChapter={setAiChapter}
              aiContent={aiContent} aiStreaming={aiStreaming}
              onFetchQuran={fetchQuran} onFetchBible={fetchBible} onFetchAI={fetchAI}
              onBack={() => setView("religion")}
              onBookmark={addBookmark}
              onShare={() => toast("Link copied!")}
            />
          )}

          {view === "search" && (
            <SearchView
              query={searchQ} setQuery={setSearchQ}
              results={searchResults}
              onOpenBook={(b: any) => openBook(b, b.religion)}
              onBack={() => setView("home")}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function HomeView({ onSelectReligion, onSearch, bookmarks, onOpenBookmark, onClose }: any) {
  return (
    <div style={S.screen}>
      <div style={S.header}>
        <div>
          <div style={S.headerLogo}>📚 SACRED LIBRARY</div>
          <div style={S.headerSub}>All World's Holy Scriptures</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={S.searchIconBtn} onClick={onSearch}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={GHOST} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          </button>
          <button style={S.searchIconBtn} onClick={onClose}>
            <X size={20} color={GHOST} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div style={{ background: PERSIAN, color: 'rgba(255,255,255,0.6)', fontSize: 11, textAlign: 'center', padding: '6px 0' }}>
        Swipe left to go back
      </div>

      <div style={S.statsBanner}>
        {[["12", "Religions"], ["50+", "Holy Books"], ["100+", "Languages"]].map(([n, l]) => (
          <div key={l} style={S.statItem}>
            <div style={S.statNum}>{n}</div>
            <div style={S.statLabel}>{l}</div>
          </div>
        ))}
      </div>

      {bookmarks.length > 0 && (
        <div style={S.section}>
          <div style={S.sectionTitle}>Your Bookmarks</div>
          <div style={{display:"flex",gap:10,overflowX:"auto",padding:"0 0 6px",scrollbarWidth:"none"}}>
            {bookmarks.map((bm: any) => (
              <div key={bm.key} style={S.bookmarkChip} onClick={() => onOpenBookmark(bm)}>
                <div style={S.bookmarkTitle}>{bm.book}</div>
                <div style={S.bookmarkSub}>{bm.religion} Ch.{bm.chapter}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={S.section}>
        <div style={S.sectionTitle}>Explore by Religion</div>
        <div style={S.religionsGrid}>
          {RELIGIONS.map(r => (
            <div key={r.id} style={{...S.religionCard, background: r.bg, borderLeft: "4px solid " + r.color}} onClick={() => onSelectReligion(r)} className="card-hover">
              <div style={S.religionEmoji}>{r.emoji}</div>
              <div style={{...S.religionName, color: r.color}}>{r.name}</div>
              <div style={S.religionBooks}>{r.books.length} texts</div>
              <div style={S.religionOrigin}>{r.origin}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={S.section}>
        <div style={S.sectionTitle}>Popular Sacred Texts</div>
        {[
          { title: "Holy Quran", religion: RELIGIONS[0], book: RELIGIONS[0].books[0], badge: "Live API" },
          { title: "Holy Bible (KJV)", religion: RELIGIONS[1], book: RELIGIONS[1].books[0], badge: "Live API" },
          { title: "Bhagavad Gita", religion: RELIGIONS[2], book: RELIGIONS[2].books[0], badge: "AI Powered" },
          { title: "Dhammapada", religion: RELIGIONS[3], book: RELIGIONS[3].books[0], badge: "AI Powered" },
          { title: "Tao Te Ching", religion: RELIGIONS[6], book: RELIGIONS[6].books[0], badge: "AI Powered" },
        ].map(({ title, religion, badge }) => (
          <div key={title} style={S.featuredRow} onClick={() => onSelectReligion(religion)} className="card-hover">
            <div style={{...S.featuredEmoji, background: religion.bg}}>{religion.emoji}</div>
            <div style={{flex:1}}>
              <div style={S.featuredTitle}>{title}</div>
              <div style={S.featuredMeta}>{religion.name}</div>
            </div>
            <span style={S.featuredBadge}>{badge}</span>
          </div>
        ))}
      </div>
      <div style={{height: 32}}/>
    </div>
  );
}

function ReligionView({ religion, onBack, onOpenBook }: any) {
  return (
    <div style={S.screen}>
      <div style={{...S.header, background: religion.color}}>
        <button style={{...S.backBtn, color: GHOST}} onClick={onBack}>Back</button>
        <div style={S.headerLogo}>{religion.emoji} {religion.name}</div>
        <div style={{width:60}}/>
      </div>
      <div style={{...S.religionHero, background: religion.bg}}>
        <div style={{fontSize:56, textAlign:"center", marginBottom:12}}>{religion.emoji}</div>
        <div style={{...S.heroTitle, color: religion.color}}>{religion.name}</div>
        <div style={S.heroBadgesRow}>
          <span style={{...S.heroBadge, background: religion.color + "20", color: religion.color}}>{religion.origin}</span>
          <span style={{...S.heroBadge, background: religion.color + "20", color: religion.color}}>{religion.followers} followers</span>
        </div>
        <p style={S.heroDesc}>{religion.desc}</p>
      </div>
      <div style={S.section}>
        <div style={S.sectionTitle}>Sacred Texts ({religion.books.length})</div>
        {religion.books.map((book: any) => (
          <div key={book.id} style={S.bookCard} onClick={() => onOpenBook(book)} className="card-hover">
            <div style={S.bookCardHeader}>
              <div style={S.bookCardTitle}>{book.title}</div>
              <div style={{...S.bookTypeBadge, background: book.type === "live-quran" || book.type === "live-bible" ? "#e8f8f0" : "#f0f0ff", color: book.type === "live-quran" || book.type === "live-bible" ? "#1a7a4a" : "#5234b8"}}>
                {book.type === "live-quran" || book.type === "live-bible" ? "Live" : "AI"}
              </div>
            </div>
            <div style={S.bookCardAuthor}>By {book.author}</div>
            <div style={S.bookCardDesc}>{book.desc}</div>
            <div style={S.bookCardFooter}>
              <span style={S.bookCardMeta}>{book.chapters} chapters</span>
              <span style={S.bookCardMeta}>{book.language}</span>
              <span style={{...S.readBtn, background: religion.color, color: GHOST}}>Read Now</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{height:32}}/>
    </div>
  );
}

function ReaderView({ book, religion, readerContent, loading, quranSurah, setQuranSurah, bibleBook, setBibleBook, bibleChapter, setBibleChapter, aiChapter, setAiChapter, aiContent, aiStreaming, onFetchQuran, onFetchBible, onFetchAI, onBack, onBookmark, onShare }: any) {
  const contentRef = useRef(null);

  const renderQuranContent = () => {
    if (!readerContent?.data) return null;
    const { name, englishName, englishNameTranslation, numberOfAyahs, ayahs } = readerContent.data;
    return (
      <div>
        <div style={S.chapterHeader}>
          <div style={S.arabicTitle}>{name}</div>
          <div style={S.chapterTitle}>{englishName}</div>
          <div style={S.chapterSub}>{englishNameTranslation} - {numberOfAyahs} verses</div>
        </div>
        {ayahs?.map((a: any) => (
          <div key={a.numberInSurah} style={S.verse}>
            <span style={S.verseNumber}>{a.numberInSurah}</span>
            <span style={S.verseText}>{a.text}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderBibleContent = () => {
    if (!readerContent?.data) return null;
    const { reference, verses } = readerContent.data;
    return (
      <div>
        <div style={S.chapterHeader}>
          <div style={S.chapterTitle}>{reference}</div>
          <div style={S.chapterSub}>King James Version</div>
        </div>
        {verses?.map((v: any) => (
          <div key={v.verse} style={S.verse}>
            <span style={S.verseNumber}>{v.verse}</span>
            <span style={S.verseText}>{v.text}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderAIContent = () => {
    if (!aiContent && !aiStreaming) return null;
    const lines = aiContent.split("\n");
    return (
      <div>
        <div style={S.chapterHeader}>
          <div style={S.chapterTitle}>{book.title}</div>
          <div style={S.chapterSub}>Section {aiChapter} - Powered by AI</div>
        </div>
        <div style={S.aiContent}>
          {lines.map((line: string, i: number) => {
            if (line.startsWith('**') && line.endsWith('**')) return <div key={i} style={S.aiHeading}>{line.replace(/\*\*/g,'')}</div>;
            if (line.startsWith('**')) {
              const parts = line.split('**').filter(Boolean);
              return <p key={i} style={S.aiPara}>{parts.map((p: string,j: number) => j%2===0 ? <strong key={j}>{p}</strong> : p)}</p>;
            }
            if (!line.trim()) return <div key={i} style={{height:10}}/>;
            return <p key={i} style={S.aiPara}>{line.replace(/\*\*/g,'')}</p>;
          })}
          {aiStreaming && <span style={S.cursor}>|</span>}
        </div>
      </div>
    );
  };

  return (
    <div style={S.screen}>
      <div style={{...S.header, background: religion.color}}>
        <button style={{...S.backBtn, color: GHOST}} onClick={onBack}>Back</button>
        <div style={{...S.headerLogo, fontSize:14, maxWidth:180, textAlign:"center", lineHeight:"1.3"}}>{book.title}</div>
        <div style={{display:"flex",gap:4}}>
          <button style={S.iconBtnLight} onClick={onBookmark} title="Bookmark">Bookmark</button>
          <button style={S.iconBtnLight} onClick={onShare} title="Share">Share</button>
        </div>
      </div>

      <div style={{...S.controlsBar, borderBottom: "2px solid " + religion.color + "30"}}>
        {book.type === "live-quran" && (
          <div>
            <label style={S.ctrlLabel}>Surah</label>
            <select style={S.select} value={quranSurah} onChange={(e: any) => { const v=+e.target.value; setQuranSurah(v); onFetchQuran(v); }}>
              {QURAN_SURAHS.map((name, i) => <option key={i+1} value={i+1}>{i+1}. {name}</option>)}
            </select>
          </div>
        )}
        {book.type === "live-bible" && (
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <div>
              <label style={S.ctrlLabel}>Book</label>
              <select style={S.select} value={bibleBook} onChange={(e: any) => { setBibleBook(e.target.value); setBibleChapter(1); onFetchBible(e.target.value, 1); }}>
                {BIBLE_BOOKS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label style={S.ctrlLabel}>Chapter</label>
              <select style={S.select} value={bibleChapter} onChange={(e: any) => { const v=+e.target.value; setBibleChapter(v); onFetchBible(bibleBook, v); }}>
                {Array.from({length:50},(_,i)=>i+1).map(n=><option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
        )}
        {book.type === "ai" && (
          <div>
            <label style={S.ctrlLabel}>Section / Chapter</label>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <button style={{...S.navBtn, background: religion.color + "15"}} onClick={() => { if(aiChapter>1){const n=aiChapter-1; setAiChapter(n); onFetchAI(book,n,{name:religion.name}); }}} disabled={aiChapter<=1}>Prev</button>
              <span style={{fontWeight:700,color:religion.color,minWidth:30,textAlign:"center"}}>{aiChapter}</span>
              <button style={{...S.navBtn, background: religion.color + "15"}} onClick={() => { if(aiChapter<book.chapters){const n=aiChapter+1; setAiChapter(n); onFetchAI(book,n,{name:religion.name}); }}} disabled={aiChapter>=book.chapters}>Next</button>
              <select style={S.select} value={aiChapter} onChange={(e: any) => { const v=+e.target.value; setAiChapter(v); onFetchAI(book,v,{name:religion.name}); }}>
                {Array.from({length:book.chapters},(_,i)=>i+1).map(n=><option key={n} value={n}>Section {n}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

      <div style={S.readerBody} ref={contentRef}>
        {loading && (
          <div style={S.loadingBox}>
            <div style={{...S.loadingSpinner, borderTopColor: religion.color}} className="spin"/>
            <div style={{color:"#888",marginTop:12}}>Loading scripture...</div>
          </div>
        )}
        {!loading && book.type === "live-quran" && renderQuranContent()}
        {!loading && book.type === "live-bible" && renderBibleContent()}
        {book.type === "ai" && renderAIContent()}
        {!loading && !aiContent && !aiStreaming && book.type === "ai" && (
          <div style={S.loadingBox}>
            <div style={{...S.loadingSpinner, borderTopColor: religion.color}} className="spin"/>
            <div style={{color:"#888",marginTop:12}}>Fetching sacred text...</div>
          </div>
        )}
        <div style={{height:40}}/>
      </div>
    </div>
  );
}

function SearchView({ query, setQuery, results, onOpenBook, onBack }: any) {
  return (
    <div style={S.screen}>
      <div style={S.header}>
        <button style={{...S.backBtn, color: GHOST}} onClick={onBack}>Back</button>
        <div style={S.headerLogo}>Search</div>
        <div style={{width:60}}/>
      </div>
      <div style={{padding:"14px 16px"}}>
        <input style={S.searchInput} autoFocus placeholder="Search by religion, book name, or topic..." value={query} onChange={(e: any) => setQuery(e.target.value)}/>
      </div>
      {query && (
        <div style={{padding:"0 16px"}}>
          <div style={S.sectionTitle}>{results.length} results</div>
          {results.length === 0 ? (
            <div style={{textAlign:"center",color:"#aaa",padding:"40px 0"}}>No results found</div>
          ) : results.map((b: any) => (
            <div key={b.id + b.religion.id} style={S.searchResultCard} onClick={() => onOpenBook(b)} className="card-hover">
              <div style={{fontSize:24, marginRight:12}}>{b.religion.emoji}</div>
              <div style={{flex:1}}>
                <div style={S.bookCardTitle}>{b.title}</div>
                <div style={{...S.bookCardMeta, color: b.religion.color}}>{b.religion.name}</div>
                <div style={S.bookCardDesc}>{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {!query && (
        <div style={{padding:"20px 16px", textAlign:"center", color:"#aaa"}}>
          <div style={{fontSize:48, marginBottom:12}}>Search across {RELIGIONS.length} religions and 50+ texts</div>
        </div>
      )}
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  screen: { width:"100%", maxWidth:480, background:GHOST, minHeight:"100vh", display:"flex", flexDirection:"column", margin:"0 auto" },
  toast: { position:"fixed", top:20, left:"50%", transform:"translateX(-50%)", background:PERSIAN, color:GHOST, padding:"10px 20px", borderRadius:24, zIndex:9999, fontWeight:600, fontSize:14, boxShadow:"0 4px 24px rgba(39,24,126,0.3)" },
  header: { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 16px 16px", background:PERSIAN, position:"sticky", top:0, zIndex:10 },
  headerLogo: { fontSize:18, fontWeight:900, color:GHOST, letterSpacing:2, fontFamily:"'Bebas Neue',sans-serif" },
  headerSub: { fontSize:11, color:"rgba(247,247,255,0.7)", marginTop:2 },
  searchIconBtn: { background:"rgba(255,255,255,0.15)", border:"none", borderRadius:12, width:40, height:40, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" },
  backBtn: { background:"transparent", border:"none", cursor:"pointer", fontSize:14, fontWeight:600, color:GHOST, padding:"6px 0" },
  iconBtnLight: { background:"rgba(255,255,255,0.15)", border:"none", borderRadius:10, padding:"4px 10px", fontSize:12, cursor:"pointer", color: GHOST, fontWeight: 600 },
  statsBanner: { display:"flex", background:PERSIAN, padding:"0 16px 20px", gap:0 },
  statItem: { flex:1, textAlign:"center" },
  statNum: { fontSize:22, fontWeight:900, color:GHOST },
  statLabel: { fontSize:10, color:"rgba(247,247,255,0.6)", fontWeight:500 },
  section: { padding:"20px 16px 0" },
  sectionTitle: { fontSize:14, fontWeight:700, color:PERSIAN, marginBottom:12, letterSpacing:0.3 },
  religionsGrid: { display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12 },
  religionCard: { borderRadius:16, padding:"16px 14px", cursor:"pointer", transition:"transform .15s" },
  religionEmoji: { fontSize:28, marginBottom:8 },
  religionName: { fontSize:16, fontWeight:800, marginBottom:4 },
  religionBooks: { fontSize:11, color:"#666", fontWeight:500 },
  religionOrigin: { fontSize:10, color:"#999", marginTop:4 },
  bookmarkChip: { background:PL, borderRadius:14, padding:"10px 14px", minWidth:140, cursor:"pointer", flexShrink:0 },
  bookmarkTitle: { fontSize:13, fontWeight:700, color:PERSIAN },
  bookmarkSub: { fontSize:11, color:"#888", marginTop:3 },
  featuredRow: { display:"flex", alignItems:"center", gap:14, padding:"14px 0", borderBottom:"1px solid " + PL, cursor:"pointer" },
  featuredEmoji: { width:44, height:44, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 },
  featuredTitle: { fontSize:14, fontWeight:700, color:PERSIAN },
  featuredMeta: { fontSize:12, color:"#888", marginTop:2 },
  featuredBadge: { fontSize:11, fontWeight:600, color:"#555", whiteSpace:"nowrap" },
  religionHero: { padding:"28px 20px 20px", textAlign:"center" },
  heroTitle: { fontSize:28, fontWeight:900, fontFamily:"'Bebas Neue',sans-serif", letterSpacing:3, marginBottom:10 },
  heroBadgesRow: { display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap", marginBottom:12 },
  heroBadge: { fontSize:11, fontWeight:600, padding:"4px 12px", borderRadius:20 },
  heroDesc: { fontSize:14, color:"#555", lineHeight:1.6 },
  bookCard: { background:"#fff", borderRadius:16, padding:"16px", marginBottom:12, cursor:"pointer", border:"1px solid " + PL },
  bookCardHeader: { display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:6, gap:8 },
  bookCardTitle: { fontSize:15, fontWeight:800, color:PERSIAN },
  bookTypeBadge: { fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:20, flexShrink:0 },
  bookCardAuthor: { fontSize:12, color:"#888", marginBottom:6 },
  bookCardDesc: { fontSize:13, color:"#555", lineHeight:1.5, marginBottom:10 },
  bookCardFooter: { display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" },
  bookCardMeta: { fontSize:11, color:"#999" },
  readBtn: { marginLeft:"auto", fontSize:12, fontWeight:700, padding:"6px 14px", borderRadius:20, border:"none", cursor:"pointer" },
  controlsBar: { padding:"14px 16px", background:"#fff" },
  ctrlLabel: { fontSize:11, fontWeight:700, color:"#888", display:"block", marginBottom:6, letterSpacing:0.5 },
  select: { border:"1.5px solid " + PL2, borderRadius:10, padding:"8px 12px", fontSize:13, color:PERSIAN, fontWeight:600, outline:"none", background:"#fff", cursor:"pointer", fontFamily:"inherit" },
  navBtn: { border:"1.5px solid " + PL2, borderRadius:10, padding:"8px 14px", fontSize:12, fontWeight:700, cursor:"pointer", color:PERSIAN, fontFamily:"inherit" },
  readerBody: { flex:1, overflowY:"auto", padding:"0 0 20px" },
  chapterHeader: { padding:"24px 20px 16px", textAlign:"center", borderBottom:"1px solid " + PL },
  arabicTitle: { fontSize:28, fontFamily:"'Amiri',serif", color:PERSIAN, marginBottom:8, direction:"rtl" },
  chapterTitle: { fontSize:20, fontWeight:800, color:PERSIAN, marginBottom:4 },
  chapterSub: { fontSize:13, color:"#888" },
  verse: { display:"flex", gap:14, padding:"14px 20px", borderBottom:"1px solid " + PL },
  verseNumber: { fontSize:12, fontWeight:800, color:PERSIAN, minWidth:24, paddingTop:2 },
  verseText: { fontSize:15, color:"#333", lineHeight:1.8 },
  aiContent: { padding:"16px 20px" },
  aiHeading: { fontSize:16, fontWeight:800, color:PERSIAN, marginBottom:8, marginTop:20 },
  aiPara: { fontSize:15, color:"#333", lineHeight:1.8, marginBottom:12 },
  cursor: { color:PERSIAN, fontWeight:900 },
  loadingBox: { display:"flex", flexDirection:"column", alignItems:"center", padding:"60px 20px" },
  loadingSpinner: { width:36, height:36, borderRadius:"50%", border:"4px solid " + PL, borderTopColor:PERSIAN },
  searchInput: { width:"100%", border:"2px solid " + PL, borderRadius:14, padding:"14px 18px", fontSize:15, color:"#333", outline:"none", fontFamily:"inherit", boxSizing:"border-box" },
  searchResultCard: { display:"flex", alignItems:"flex-start", padding:"14px 0", borderBottom:"1px solid " + PL, cursor:"pointer" },
};

const cssText = [
  "@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Bebas+Neue&family=Amiri:ital@0;1&display=swap');",
  "@keyframes spin{to{transform:rotate(360deg);}}",
  ".spin{animation:spin 0.8s linear infinite;}",
  ".card-hover{transition:transform .15s,box-shadow .15s;}",
  ".card-hover:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(39,24,126,0.12);}",
  "select:focus{border-color:#27187E !important;}",
  "input:focus{border-color:#27187E !important;}",
].join("\n");
