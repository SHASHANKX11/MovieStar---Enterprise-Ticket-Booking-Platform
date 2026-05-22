import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Movie, SportEvent, LiveEvent } from '../types';
import { MOVIES, SPORT_EVENTS, LIVE_EVENTS } from '../mockData';
import { Star, Trophy, PlayCircle, ChevronLeft, ChevronRight, Play, Clock, Calendar, Zap, MapPin, Tv, Sparkles, Newspaper, Volume2, VolumeX, Maximize, CheckCircle2, Pause, RotateCcw } from 'lucide-react';


interface HomeProps {
  onSelectMovie: (movie: Movie) => void;
  onSelectSport: (sport: SportEvent) => void;
  city: string;
  category: string;
  onSelectCategory: (category: string) => void;
}

interface RentalSuccess {
  transactionId: string;
  movieTitle: string | undefined;
  tier: 'rent' | 'buy';
  quality: 'SD' | 'HD' | '4K';
  language: string;
  price: number;
  expiry: string;
}

interface EventSuccess {
  ticketId: string;
  eventTitle: string | undefined;
  date: string | undefined;
  venue: string | undefined;
  quantity: number;
  totalAmount: number;
}

const LANGUAGES = ['All', 'Hindi', 'English', 'Tamil', 'Telugu', 'Kannada', 'Malayalam'] as const;
type LangFilter = typeof LANGUAGES[number];

const LANG_COLORS: Record<string, string> = {
  Hindi: 'lang-hindi',
  English: 'lang-english',
  Tamil: 'lang-tamil',
  Telugu: 'lang-telugu',
  Kannada: 'lang-kannada',
  Malayalam: 'lang-malayalam',
};

// Mock Buzz Articles data
const BUZZ_ARTICLES = [
  {
    id: 'art1',
    title: 'FOLKLORE IN THE MODERN CINEMA: The Making of Kantara: Chapter 1',
    summary: 'An exclusive conversation with director Rishab Shetty about tracing back the ancient roots of the Panjurli deity, shooting in dense Western Ghats, and creating a sensory mythology prequel.',
    image: 'https://media.themoviedb.org/t/p/original/w57nxiBIODAYHLRs1xmrCY9zEFe.jpg',
    readTime: '5 min read',
    tag: 'Spotlight Interview',
    likes: '14.5k',
  },
  {
    id: 'art2',
    title: 'Pushpa 2: The Rule Destroys Global Box Office Records with ₹150 Crore Opening',
    summary: 'Allu Arjun\'s red sandalwood smuggling epic smashes record books in North America, UAE, and domestic markets on Day 1. Critics call Sukumar\'s massive mass direction "an absolute adrenaline feast."',
    image: 'https://media.themoviedb.org/t/p/original/keC82cQ8q0ZHthrbvzWq04kGnbv.jpg',
    readTime: '3 min read',
    tag: 'Box Office News',
    likes: '28.9k',
  },
  {
    id: 'art3',
    title: 'Why Inside Out 2 Explores Teenage Anxiety & Empathy with Breathtaking Warmth',
    summary: 'Pixar psychologists and artists detail how the introduction of Anxiety, Envy, and Embarrassment was storyboarded. Inside Out 2 now ranks as the highest-grossing animated film of all time.',
    image: 'https://media.themoviedb.org/t/p/original/p5ozvmdgsmbWe0H8Xk7Rc8SCwAB.jpg',
    readTime: '4 min read',
    tag: 'Cinematic Analysis',
    likes: '9.2k',
  },
  {
    id: 'art4',
    title: 'Deadpool & Wolverine VFX Secrets: The Multiverse Cameo Breakdown',
    summary: 'Behind the scenes of the insane fourth-wall-breaking Marvel cameo scenes. How the creative crew combined physical sets with modern virtual stage rendering to capture nostalgic Wolverine variations.',
    image: 'https://media.themoviedb.org/t/p/original/ufpeVEM64uZHPpzzeiDNIAdaeOD.jpg',
    readTime: '6 min read',
    tag: 'VFX & Production',
    likes: '18.1k',
  }
];

// Mock Buzz Reviews
const CRITIC_REVIEWS = [
  {
    movieTitle: 'Stree 2',
    critic: 'Taran Adarsh (Bollywood Hungama)',
    rating: 4.5,
    summary: 'A golden blend of spooky horror and rip-roaring comedy. Rajkummar Rao and Shraddha Kapoor are pitch-perfect, but Sarkata\'s threat keeps you genuinely on edge.',
  },
  {
    movieTitle: 'Dune: Part Two',
    critic: 'Anupama Chopra (Film Companion)',
    rating: 5,
    summary: 'Denis Villeneuve delivers a sci-fi biblical masterpiece. Timothée Chalamet and Zendaya bring tragic emotional weight under Hans Zimmer\'s sandstorm-like roaring soundtrack.',
  }
];

export default function Home({ onSelectMovie, onSelectSport, city, category, onSelectCategory }: HomeProps) {
  const [heroIndex, setHeroIndex] = useState(0);
  const [langFilter, setLangFilter] = useState<LangFilter>('All');

  // Sub-category Filter states
  const [eventSubFilter, setEventSubFilter] = useState<string>('All');
  const [playSubFilter, setPlaySubFilter] = useState<string>('All');
  const [sportSubFilter, setSportSubFilter] = useState<string>('All');
  const [activitySubFilter, setActivitySubFilter] = useState<string>('All');
  const [streamSubFilter, setStreamSubFilter] = useState<string>('All');

  // Digital Streams Rent/Buy Modal States
  const [rentingMovie, setRentingMovie] = useState<Movie | null>(null);
  const [rentalTier, setRentalTier] = useState<'rent' | 'buy'>('rent');
  const [streamLanguage, setStreamLanguage] = useState<string>('English');
  const [streamQuality, setStreamQuality] = useState<'SD' | 'HD' | '4K'>('HD');
  const [rentalSuccessStub, setRentalSuccessStub] = useState<RentalSuccess | null>(null);
  const [watchingStream, setWatchingStream] = useState<Movie | null>(null);

  // Theater Player Interactive State
  const [isPlayerPlaying, setIsPlayerPlaying] = useState<boolean>(true);
  const [playerProgress, setPlayerProgress] = useState<number>(12);
  const [playerMuted, setPlayerMuted] = useState<boolean>(false);
  const [playerVolume, setPlayerVolume] = useState<number>(0.8);
  const [playerAmbientGlow, setPlayerAmbientGlow] = useState<boolean>(true);

  // Simulated playback time advancement
  useEffect(() => {
    if (!watchingStream || !isPlayerPlaying) return;
    const interval = setInterval(() => {
      setPlayerProgress(prev => {
        if (prev >= 100) {
          setIsPlayerPlaying(false);
          return 100;
        }
        return prev + 0.2;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [watchingStream, isPlayerPlaying]);


  // Digital Event/Play Booking States
  const [bookingLiveEvent, setBookingLiveEvent] = useState<LiveEvent | null>(null);
  const [eventTicketsCount, setEventTicketsCount] = useState<number>(1);
  const [eventSuccessStub, setEventSuccessStub] = useState<EventSuccess | null>(null);

  // Trivia Quiz States
  const [selectedTrivia, setSelectedTrivia] = useState<string | null>(null);

  const heroMovies = MOVIES.filter(m => !m.isComingSoon).slice(0, 5);
  const nowShowing = MOVIES.filter(m => !m.isComingSoon);
  const comingSoon = MOVIES.filter(m => m.isComingSoon);
  const premiereMovies = MOVIES.filter(m => m.isPremiere && !m.isComingSoon);

  const filteredNowShowing = langFilter === 'All'
    ? nowShowing
    : nowShowing.filter(m => m.languages?.includes(langFilter as never));

  // Dynamic Event Filters (Music, Comedy, Festivals)
  const rawCityEvents = LIVE_EVENTS.filter(s => (s.city === city || s.city === 'Bengaluru') && 
    (s.category === 'Music Shows' || s.category === 'Comedy Shows' || s.category === 'Food Festivals')
  );
  const filteredCityEvents = eventSubFilter === 'All'
    ? rawCityEvents
    : rawCityEvents.filter(s => s.category === eventSubFilter);

  // Dynamic Plays Filters (Theatre)
  const rawCityPlays = LIVE_EVENTS.filter(s => (s.city === city || s.city === 'Bengaluru') && s.category === 'Theatre');
  const playSubCategories = ['All', 'Ballet', 'Musical', 'Drama'];
  const filteredCityPlays = playSubFilter === 'All'
    ? rawCityPlays
    : rawCityPlays.filter(s => {
        if (playSubFilter === 'Ballet') return s.title.toLowerCase().includes('ballet');
        if (playSubFilter === 'Musical') return s.title.toLowerCase().includes('musical');
        if (playSubFilter === 'Drama') return s.title.toLowerCase().includes('macbeth') || s.title.toLowerCase().includes('drama');
        return true;
      });

  // Dynamic Sport Filters
  const citySports = SPORT_EVENTS.filter(s => s.city === city || s.city === 'Bengaluru');
  const filteredCitySports = sportSubFilter === 'All'
    ? citySports
    : citySports.filter(s => s.sportType === sportSubFilter);

  // Dynamic Activities Filters (Workshops, Adventure)
  const rawCityActivities = LIVE_EVENTS.filter(s => (s.city === city || s.city === 'Bengaluru') && 
    (s.category === 'Workshops' || s.category === 'Adventure')
  );
  const filteredCityActivities = activitySubFilter === 'All'
    ? rawCityActivities
    : rawCityActivities.filter(s => s.category === activitySubFilter);

  // Dynamic Streams Filters
  const streamGenres = ['All', 'Sci-Fi', 'Action', 'Comedy', 'Superhero', 'Animation'];
  const filteredStreams = streamSubFilter === 'All'
    ? premiereMovies
    : premiereMovies.filter(m => m.genre.includes(streamSubFilter));

  // Auto-advance hero carousel
  useEffect(() => {
    if (category !== 'ALL' && category !== 'MOVIES') return;
    const id = setInterval(() => {
      setHeroIndex(i => (i + 1) % heroMovies.length);
    }, 5000);
    return () => clearInterval(id);
  }, [heroMovies.length, category]);

  const prevHero = () => setHeroIndex(i => (i - 1 + heroMovies.length) % heroMovies.length);
  const nextHero = () => setHeroIndex(i => (i + 1) % heroMovies.length);

  const currentHeroMovie = heroMovies[heroIndex];

  // Prices based on Quality & Tier
  const getStreamPrice = () => {
    if (rentalTier === 'rent') {
      if (streamQuality === 'SD') return 99;
      if (streamQuality === 'HD') return 149;
      return 199;
    } else {
      if (streamQuality === 'SD') return 299;
      if (streamQuality === 'HD') return 499;
      return 699;
    }
  };

  const handleProcessRental = () => {
    const transactionId = 'MST-RENT-' + Math.floor(100000 + Math.random() * 900000);
    setRentalSuccessStub({
      transactionId,
      movieTitle: rentingMovie?.title,
      tier: rentalTier,
      quality: streamQuality,
      language: streamLanguage,
      price: getStreamPrice(),
      expiry: rentalTier === 'rent' ? 'Active for 30 days (48 hours once started)' : 'Lifetime Access'
    });
  };

  const handleProcessEventBooking = () => {
    const ticketId = 'MST-TKT-' + Math.floor(100000 + Math.random() * 900000);
    const rawPrice = parseInt(bookingLiveEvent?.price.replace(/\D/g, '') || '500');
    const totalAmount = rawPrice * eventTicketsCount;
    setEventSuccessStub({
      ticketId,
      eventTitle: bookingLiveEvent?.title,
      date: bookingLiveEvent?.date,
      venue: bookingLiveEvent?.venue,
      quantity: eventTicketsCount,
      totalAmount,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-16 bg-[#09090C] min-h-screen text-slate-100"
    >
      {/* ── DIGITAL STREAMS CINEMA PLAYER OVERLAY ───────────────── */}
      {watchingStream && (
        <div className="fixed inset-0 z-200 bg-black flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-6xl relative bg-[#07070A] rounded-3xl overflow-hidden border border-purple-500/20 shadow-[0_0_80px_rgba(139,92,246,0.3)]">
            {/* Embedded simulated cinema screen */}
            <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
              <iframe
                src={`https://www.youtube.com/embed/${watchingStream.trailerYoutubeId}?autoplay=1&controls=0&rel=0&modestbranding=1`}
                title={`${watchingStream.title} Cinema Watch`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
              
              {/* Top Bar overlay */}
              <div className="absolute top-0 inset-x-0 bg-linear-to-b from-black/85 via-black/40 to-transparent p-6 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-purple-600 text-white text-[10px] font-black px-2 py-0.5 rounded tracking-wide animate-pulse">STREAMING NOW</span>
                    <span className="text-white/60 text-xs">• 4K UHD Dolby Atmos</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-white">{watchingStream.title}</h3>
                </div>
                <button
                  onClick={() => setWatchingStream(null)}
                  className="bg-red-600 hover:bg-red-500 text-white font-extrabold px-6 py-2.5 rounded-xl shadow-lg transition-all border-none cursor-pointer"
                >
                  Exit Cinema
                </button>
              </div>

              {/* Bottom Playback HUD overlay */}
              <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/95 via-black/50 to-transparent p-6 flex flex-col gap-3">
                {/* Simulated Seek Bar */}
                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden relative">
                  <div className="absolute inset-y-0 left-0 bg-purple-500 rounded-full" style={{ width: '45%' }} />
                </div>
                <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
                  <div className="flex items-center gap-4">
                    <span className="text-white font-bold">01:14:38 / {watchingStream.duration}</span>
                    <Volume2 size={16} className="text-slate-400 hover:text-white transition-colors cursor-pointer" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-glow-purple font-bold">Active Rental Code Activated</span>
                    <Maximize size={16} className="text-slate-400 hover:text-white transition-colors cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 1. MAIN HERO CAROUSEL (MOVIES & ALL) ─────────────── */}
      {(category === 'ALL' || category === 'MOVIES') && (
        <div className="relative h-[55vh] md:h-[75vh] overflow-hidden bg-[#0A0A0F]">
          <AnimatePresence mode="crossfade">
            <motion.div
              key={heroIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <img
                src={currentHeroMovie.bgImage}
                alt={currentHeroMovie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 hero-gradient" />
            </motion.div>
          </AnimatePresence>

          {/* Hero Content */}
          <div className="absolute inset-0 flex items-end pb-12 px-4 sm:px-8 lg:px-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${heroIndex}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-w-2xl"
              >
                {/* Badges */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {currentHeroMovie.isPremiere && (
                    <span className="bg-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide animate-pulse-glow">
                      PREMIERE
                    </span>
                  )}
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${LANG_COLORS[currentHeroMovie.languages?.[0] ?? ''] ?? 'bg-white/20 text-white border-white/30'}`}>
                    {currentHeroMovie.languages?.[0] ?? currentHeroMovie.language}
                  </span>
                  <span className="bg-black/50 text-white text-xs px-2.5 py-1 rounded-md border border-white/20">
                    {currentHeroMovie.certificate ?? 'UA'}
                  </span>
                  <div className="flex items-center gap-1 bg-black/50 text-yellow-400 text-xs px-2.5 py-1 rounded-md border border-white/20 font-bold">
                    <Star size={11} className="fill-yellow-400" />
                    {currentHeroMovie.rating}/10
                  </div>
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight mb-3 drop-shadow-lg text-glow-rose">
                  {currentHeroMovie.title}
                </h1>
                <p className="text-slate-300 text-sm md:text-base max-w-lg leading-relaxed mb-6 line-clamp-2 hidden md:block">
                  {currentHeroMovie.synopsis}
                </p>
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => onSelectMovie(currentHeroMovie)}
                    className="bg-linear-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-extrabold py-3 px-7 rounded-xl shadow-lg shadow-rose-600/20 hover:shadow-rose-600/40 hover:scale-102 transition-all flex items-center gap-2 cursor-pointer border-none outline-none"
                  >
                    <Zap size={18} />
                    Book Tickets
                  </button>
                  <button
                    onClick={() => onSelectMovie(currentHeroMovie)}
                    className="glass text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center gap-2 hover:bg-white/10 hover:border-white/20 cursor-pointer border border-white/10"
                  >
                    <Play size={16} className="fill-white" />
                    View Details
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carousel Arrows */}
          <button
            onClick={prevHero}
            className="absolute left-4 top-1/2 -translate-y-1/2 glass-dark text-slate-300 hover:text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/10 border border-white/5 transition-all cursor-pointer shadow-lg"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextHero}
            className="absolute right-4 top-1/2 -translate-y-1/2 glass-dark text-slate-300 hover:text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/10 border border-white/5 transition-all cursor-pointer shadow-lg"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {heroMovies.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIndex(i)}
                className={`transition-all duration-300 rounded-full h-2 cursor-pointer border-none ${i === heroIndex ? 'w-8 bg-rose-500' : 'w-2 bg-white/30 hover:bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── LANGUAGE FILTER TABS (MOVIES & ALL) ─────────────── */}
      {(category === 'ALL' || category === 'MOVIES') && (
        <div className="sticky top-16 z-40 bg-[#09090C]/85 backdrop-blur-md border-b border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto">
            <div className="flex gap-2 py-3.5 min-w-max">
              {LANGUAGES.map(lang => (
                <button
                  key={lang}
                  onClick={() => setLangFilter(lang)}
                  className={`px-4.5 py-2 rounded-full text-xs font-bold border transition-all whitespace-nowrap cursor-pointer ${
                    langFilter === lang
                      ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/30'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:border-rose-500/50 hover:text-rose-400 hover:bg-white/10'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 2. NOW SHOWING CINEMA MOVIES ───────────────────── */}
      {(category === 'ALL' || category === 'MOVIES') && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-rose-600 rounded-full shadow-[0_0_12px_rgba(244,63,94,0.6)] animate-pulse" />
              <h3 className="text-2xl font-black text-white tracking-tight">Now Showing</h3>
              <span className="bg-rose-500/10 text-rose-400 text-xs font-bold px-3 py-1 rounded-full border border-rose-500/20">
                {filteredNowShowing.length} Films
              </span>
            </div>
            {category === 'ALL' && (
              <button 
                onClick={() => onSelectCategory('MOVIES')}
                className="text-xs font-black text-[#ff2a5f] hover:text-rose-400 transition-colors uppercase tracking-wider bg-transparent border-none cursor-pointer"
              >
                View All Movies →
              </button>
            )}
          </div>

          {filteredNowShowing.length === 0 ? (
            <div className="text-center py-20 bg-white/2 border border-white/5 rounded-2xl p-8">
              <p className="text-lg font-bold text-slate-400">No {langFilter} films currently showing in your city</p>
              <button 
                onClick={() => setLangFilter('All')} 
                className="mt-4 bg-rose-600/10 border border-rose-500/30 text-rose-400 font-bold px-5 py-2 rounded-xl hover:bg-rose-600/20 transition-all cursor-pointer"
              >
                Show all languages
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
              {filteredNowShowing.map((movie, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                  key={movie.id}
                  className="group cursor-pointer flex flex-col"
                  onClick={() => onSelectMovie(movie)}
                >
                  <div className="relative w-full aspect-2/3 rounded-xl overflow-hidden mb-3.5 border border-white/5 shadow-[0_4px_20px_rgba(0,0,0,0.5)] group-hover:border-rose-500/30 group-hover:shadow-[0_0_15px_rgba(244,63,94,0.15)] transition-all duration-300">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3.5">
                      <span className="w-full text-center bg-rose-600 text-white text-[11px] font-black py-2 rounded-lg shadow-lg shadow-rose-600/30 uppercase tracking-wide">
                        BOOK TICKETS
                      </span>
                    </div>
                    <div className="absolute top-2 right-2 glass-dark px-2 py-1 text-white rounded-lg flex items-center gap-1 text-[11px] font-bold border border-white/5">
                      <Star size={11} className="text-yellow-400 fill-yellow-400" />
                      {movie.rating}
                    </div>
                    <div className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded border ${LANG_COLORS[movie.languages?.[0] ?? ''] ?? 'bg-white/20 text-white border-white/30'}`}>
                      {movie.languages?.[0] ?? movie.language}
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-200 text-sm leading-snug mb-1 truncate group-hover:text-white transition-colors">{movie.title}</h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                    <Clock size={11} className="text-slate-500" />
                    <span>{movie.duration}</span>
                    <span className="text-slate-600">•</span>
                    <span className="truncate">{movie.genre[0]}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── curate PREMIERES Banner (MOVIES & ALL only) ───────── */}
      {(category === 'ALL' || category === 'MOVIES') && premiereMovies.length > 0 && (
        <div className="bg-linear-to-br from-[#12121A] via-[#1A102A] to-[#0A0A0F] border-y border-white/5 py-14 mt-16 text-white relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-violet-500/5 via-transparent to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-3">
                <PlayCircle className="text-violet-500 fill-violet-600/30" size={32} />
                <h3 className="text-3xl font-black text-white tracking-tight">Premieres</h3>
                <span className="bg-violet-500/20 text-violet-300 text-xs font-bold px-3 py-1 rounded-full border border-violet-500/30 ml-2 animate-pulse">
                  STREAMING SOON
                </span>
              </div>
              {category === 'ALL' && (
                <button 
                  onClick={() => onSelectCategory('STREAMS')}
                  className="text-xs font-black text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-wider bg-transparent border-none cursor-pointer"
                >
                  View All Streams →
                </button>
              )}
            </div>
            <p className="text-sm text-slate-400 font-semibold mb-8">Exclusive digital first releases right in the comfort of your home</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
              {premiereMovies.map((movie, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={movie.id}
                  className="group cursor-pointer flex flex-col"
                  onClick={() => onSelectMovie(movie)}
                >
                  <div className="relative w-full aspect-2/3 rounded-xl overflow-hidden mb-3.5 shadow-[0_8px_30px_rgb(0,0,0,0.6)] border border-white/10 group-hover:border-violet-500/30 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all duration-300">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 bg-violet-600 text-white px-2 py-0.5 rounded text-[10px] font-bold shadow-md">
                      PREMIERE
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-200 text-sm leading-tight mb-1 truncate group-hover:text-white transition-colors">{movie.title}</h4>
                  <p className="text-[11px] text-slate-400 font-medium">{movie.genre[0]} • {movie.duration}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}


      {/* ── COMING SOON (MOVIES & ALL only) ────────────────── */}
      {(category === 'ALL' || category === 'MOVIES') && comingSoon.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-8 bg-purple-600 rounded-full shadow-[0_0_12px_rgba(139,92,246,0.5)]" />
            <h3 className="text-2xl font-black text-white tracking-tight">Coming Soon</h3>
            <span className="bg-purple-500/10 text-purple-400 text-xs font-bold px-3 py-1 rounded-full border border-purple-500/20">
              Most Awaited
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
            {comingSoon.map((movie, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                key={movie.id}
                className="group cursor-pointer flex flex-col"
                onClick={() => onSelectMovie(movie)}
              >
                <div className="relative w-full aspect-2/3 rounded-xl overflow-hidden mb-3.5 border border-white/5 shadow-[0_4px_20px_rgba(0,0,0,0.5)] group-hover:border-purple-500/30 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] transition-all duration-300">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#09090C]/80 to-transparent" />
                  <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-0.5 rounded text-[10px] font-bold shadow-md">
                    COMING SOON
                  </div>
                </div>
                <h4 className="font-bold text-slate-200 text-sm leading-tight mb-1 truncate group-hover:text-white transition-colors">{movie.title}</h4>
                <p className="text-[11px] text-slate-400 font-medium">{movie.genre[0]}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}


      {/* ── 3. PREMIUM DIGITAL STREAMS (STREAMS CATEGORY ONLY) ──── */}
      {category === 'STREAMS' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          {/* Neon Purple Banner Header */}
          <div className="relative rounded-3xl overflow-hidden border border-purple-500/20 bg-linear-to-br from-[#120F24] via-[#0F0A1E] to-[#05050A] p-8 md:p-12 mb-10 shadow-[0_8px_40px_rgba(139,92,246,0.15)]">
            <div className="absolute top-4 right-4 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider animate-pulse flex items-center gap-1.5">
              <Tv size={12} /> PVOD Active Portal
            </div>
            <div className="max-w-2xl relative z-10">
              <span className="text-purple-400 text-xs font-black uppercase tracking-widest flex items-center gap-1.5 mb-2">
                <Sparkles size={14} className="text-purple-400" />
                Premium MovieStar Stream
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 tracking-tight drop-shadow-md">
                Cinema Exclusives, Rent or Buy <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-500">Direct to Your Home</span>
              </h2>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
                Skip the ticket queues! Stream authentic theatre releases in crystal clear 4K UHD, Dolby Vision, and immersive multi-channel Atmos audio on any screen immediately.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setRentingMovie(premiereMovies[0])}
                  className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold px-6 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer border-none outline-none"
                >
                  <PlayCircle size={18} />
                  Rent Deadpool & Wolverine
                </button>
              </div>
            </div>
            {/* Background glowing sphere */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-purple-500/5 rounded-full filter blur-3xl" />
          </div>

          {/* Stream Genre Tabs */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5 overflow-x-auto gap-4">
            <div className="flex gap-2.5">
              {streamGenres.map(genre => (
                <button
                  key={genre}
                  onClick={() => setStreamSubFilter(genre)}
                  className={`px-4.5 py-2 rounded-xl text-xs font-extrabold border transition-all whitespace-nowrap cursor-pointer ${
                    streamSubFilter === genre
                      ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/30'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:border-purple-500/40 hover:text-purple-300'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
            <span className="text-xs text-purple-400 font-bold shrink-0">{filteredStreams.length} Digital Titles Available</span>
          </div>

          {/* Grid of Rental Stream Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {filteredStreams.map((movie, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={movie.id}
                className="group flex flex-col bg-white/2 border border-white/5 hover:border-purple-500/30 rounded-2xl p-3.5 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
              >
                <div className="relative w-full aspect-2/3 rounded-xl overflow-hidden mb-3.5 shadow-md border border-white/5 group-hover:border-purple-500/20">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 bg-[#09090C]/80 border border-purple-500/40 backdrop-blur-md text-purple-300 text-[9px] font-black px-2.5 py-1 rounded shadow-lg uppercase tracking-wide">
                    Rent ₹149
                  </div>
                  <div className="absolute top-2 right-2 bg-purple-600/90 text-white text-[9px] font-black px-2.5 py-1 rounded shadow-lg uppercase tracking-wide">
                    Buy ₹499
                  </div>
                  {/* Action Overlay */}
                  <div className="absolute inset-0 bg-black/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 gap-2.5">
                    <button
                      onClick={() => { setRentingMovie(movie); setRentalTier('rent'); }}
                      className="w-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-black py-2.5 rounded-lg transition shadow-md border-none cursor-pointer"
                    >
                      RENT FOR 30 DAYS
                    </button>
                    <button
                      onClick={() => { setRentingMovie(movie); setRentalTier('buy'); }}
                      className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-black py-2.5 rounded-lg transition cursor-pointer"
                    >
                      BUY FOREVER
                    </button>
                  </div>
                </div>
                <h4 className="font-extrabold text-slate-200 text-sm mb-1 truncate group-hover:text-purple-300 transition-colors">{movie.title}</h4>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                  <span>{movie.genre[0]}</span>
                  <span>•</span>
                  <span>{movie.duration}</span>
                  <span>•</span>
                  <span className="text-yellow-500 flex items-center gap-0.5">
                    <Star size={10} className="fill-yellow-500" /> {movie.rating}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}


      {/* ── 4. EVENTS CATEGORY SECTION (EVENTS CATEGORY ONLY) ──── */}
      {category === 'EVENTS' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5 overflow-x-auto gap-4">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-amber-500 rounded-full" />
              <h3 className="text-2xl font-black text-white tracking-tight">Music Concerts & Comedy Shows</h3>
            </div>
            <div className="flex gap-2 shrink-0">
              {['All', 'Music Shows', 'Comedy Shows', 'Food Festivals'].map(sub => (
                <button
                  key={sub}
                  onClick={() => setEventSubFilter(sub)}
                  className={`px-4.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                    eventSubFilter === sub
                      ? 'bg-amber-500 text-white border-amber-400 shadow-md shadow-amber-500/20'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:text-amber-400 hover:border-amber-500/40'
                  }`}
                >
                  {sub === 'All' ? 'All Events' : sub}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {filteredCityEvents.map((ev, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={ev.id}
                onClick={() => setBookingLiveEvent(ev)}
                className="group cursor-pointer flex flex-col bg-white/2 border border-white/5 rounded-2xl p-3.5 hover:border-amber-500/30 transition-all duration-300"
              >
                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3.5 border border-white/5 shadow-md">
                  <img
                    src={ev.poster}
                    alt={ev.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 bg-amber-500 text-white text-[9px] font-black px-2.5 py-0.5 rounded shadow-lg">
                    {ev.category}
                  </div>
                </div>
                <h4 className="font-extrabold text-slate-200 text-sm leading-tight mb-1.5 truncate group-hover:text-amber-400 transition-colors">{ev.title}</h4>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-bold mb-1">
                  <Calendar size={11} className="text-slate-500" />
                  <span>{ev.date}</span>
                </div>
                <p className="text-[11px] text-slate-500 truncate font-semibold">{ev.venue}</p>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Prices From</span>
                  <span className="font-black text-amber-400 text-xs">{ev.price}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}


      {/* ── 5. PLAYS CATEGORY SECTION (PLAYS CATEGORY ONLY) ───── */}
      {category === 'PLAYS' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5 overflow-x-auto gap-4">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-rose-500 rounded-full" />
              <h3 className="text-2xl font-black text-white tracking-tight">Theatre Masterpieces & Ballets</h3>
            </div>
            <div className="flex gap-2 shrink-0">
              {playSubCategories.map(sub => (
                <button
                  key={sub}
                  onClick={() => setPlaySubFilter(sub)}
                  className={`px-4.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                    playSubFilter === sub
                      ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/20'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:text-rose-400 hover:border-rose-500/40'
                  }`}
                >
                  {sub === 'All' ? 'All Plays' : sub}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {filteredCityPlays.map((ev, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={ev.id}
                onClick={() => setBookingLiveEvent(ev)}
                className="group cursor-pointer flex flex-col bg-white/2 border border-white/5 rounded-2xl p-3.5 hover:border-rose-500/30 transition-all duration-300"
              >
                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3.5 border border-white/5 shadow-md">
                  <img
                    src={ev.poster}
                    alt={ev.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 bg-rose-600 text-white text-[9px] font-black px-2.5 py-0.5 rounded shadow-lg">
                    {ev.category}
                  </div>
                </div>
                <h4 className="font-extrabold text-slate-200 text-sm leading-tight mb-1.5 truncate group-hover:text-rose-400 transition-colors">{ev.title}</h4>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-bold mb-1">
                  <Calendar size={11} className="text-slate-500" />
                  <span>{ev.date}</span>
                </div>
                <p className="text-[11px] text-slate-500 truncate font-semibold">{ev.venue}</p>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Prices From</span>
                  <span className="font-black text-rose-400 text-xs">{ev.price}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}


      {/* ── 6. SPORTS CATEGORY SECTION (SPORTS CATEGORY ONLY) ──── */}
      {category === 'SPORTS' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5 overflow-x-auto gap-4">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-blue-500 rounded-full" />
              <h3 className="text-2xl font-black text-white tracking-tight">Active Athletic Fixtures</h3>
            </div>
            <div className="flex gap-2 shrink-0">
              {['All', 'Cricket', 'Kabaddi'].map(sub => (
                <button
                  key={sub}
                  onClick={() => setSportSubFilter(sub)}
                  className={`px-4.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                    sportSubFilter === sub
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:text-blue-400 hover:border-blue-500/40'
                  }`}
                >
                  {sub === 'All' ? 'All Sports' : sub}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCitySports.map((sport, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                key={sport.id}
                className="group cursor-pointer flex flex-col glass border border-white/5 rounded-2xl transition-all duration-300 overflow-hidden hover:border-blue-500/30 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] bg-[#12121A]/60"
                onClick={() => onSelectSport(sport)}
              >
                <div className="relative w-full h-48 overflow-hidden">
                  <img
                    src={sport.bgImage}
                    alt={sport.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#12121A] via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-black px-2.5 py-1 rounded shadow-lg uppercase tracking-wide">
                    {sport.tournament}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-black text-slate-100 text-base leading-tight mb-2 truncate group-hover:text-blue-400 transition-colors">{sport.title}</h4>
                    <p className="text-xs text-slate-400 font-bold mb-1">{sport.date} • {sport.time}</p>
                    <p className="text-xs text-slate-500 truncate font-semibold">{sport.venue}</p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Tickets From</span>
                    <span className="font-black text-blue-400 text-glow-blue text-lg">{sport.priceRange.split(' - ')[0]}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}


      {/* ── 7. ACTIVITIES SECTION (ACTIVITIES CATEGORY ONLY) ──── */}
      {category === 'ACTIVITIES' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5 overflow-x-auto gap-4">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-green-500 rounded-full" />
              <h3 className="text-2xl font-black text-white tracking-tight">Workshops & Outdoor Adventures</h3>
            </div>
            <div className="flex gap-2 shrink-0">
              {['All', 'Workshops', 'Adventure'].map(sub => (
                <button
                  key={sub}
                  onClick={() => setActivitySubFilter(sub)}
                  className={`px-4.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                    activitySubFilter === sub
                      ? 'bg-green-600 text-white border-green-500 shadow-md shadow-green-500/20'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:text-green-400 hover:border-green-500/40'
                  }`}
                >
                  {sub === 'All' ? 'All Activities' : sub}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {filteredCityActivities.map((ev, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={ev.id}
                onClick={() => setBookingLiveEvent(ev)}
                className="group cursor-pointer flex flex-col bg-white/2 border border-white/5 rounded-2xl p-3.5 hover:border-green-500/30 transition-all duration-300"
              >
                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3.5 border border-white/5 shadow-md">
                  <img
                    src={ev.poster}
                    alt={ev.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 bg-green-600 text-white text-[9px] font-black px-2.5 py-0.5 rounded shadow-lg">
                    {ev.category}
                  </div>
                </div>
                <h4 className="font-extrabold text-slate-200 text-sm leading-tight mb-1.5 truncate group-hover:text-green-400 transition-colors">{ev.title}</h4>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-bold mb-1">
                  <Calendar size={11} className="text-slate-500" />
                  <span>{ev.date}</span>
                </div>
                <p className="text-[11px] text-slate-500 truncate font-semibold">{ev.venue}</p>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Prices From</span>
                  <span className="font-black text-green-400 text-xs">{ev.price}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}


      {/* ── 8. MOVIESTAR BUZZ CINEMATIC BLOG & NEWS (BUZZ ONLY) ──── */}
      {category === 'BUZZ' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
            <Newspaper className="text-rose-500 animate-pulse" size={28} />
            <h3 className="text-2xl font-black text-white tracking-tight">MovieStar Buzz — Entertainment News, Trends & Reviews</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left/Center Columns: News Feed */}
            <div className="lg:col-span-2 space-y-6">
              {BUZZ_ARTICLES.map((art, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  key={art.id}
                  className="glass border border-white/5 hover:border-rose-500/25 bg-[#12121A]/50 rounded-2xl overflow-hidden flex flex-col md:flex-row transition-all duration-300 shadow-xl group cursor-pointer"
                >
                  <div className="w-full md:w-56 h-48 md:h-auto shrink-0 relative overflow-hidden">
                    <img
                      src={art.image}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-rose-600 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase">
                      {art.tag}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                      <h4 className="font-black text-white text-base leading-snug group-hover:text-rose-400 transition-colors mb-2.5">
                        {art.title}
                      </h4>
                      <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-3">
                        {art.summary}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-white/5 text-[10px] text-slate-500 font-bold">
                      <div className="flex gap-4">
                        <span>{art.readTime}</span>
                        <span>🔥 {art.likes} likes</span>
                      </div>
                      <span className="text-rose-500 flex items-center gap-1 group-hover:translate-x-1 transition-transform">Read Story →</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right Column: Widgets */}
            <div className="space-y-8">
              {/* Widget 1: Box Office Scoreboard */}
              <div className="glass border border-white/5 bg-[#12121A]/70 rounded-2xl p-5 shadow-xl">
                <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Trophy size={15} className="text-yellow-400" />
                  India Weekly Box Office Rankings
                </h4>
                <div className="space-y-3.5">
                  {[
                    { rank: '1', title: 'Pushpa 2: The Rule', gross: '₹140 Cr (Wk 2)', trend: 'up', color: 'text-rose-500' },
                    { rank: '2', title: 'Stree 2', gross: '₹34 Cr (Wk 4)', trend: 'steady', color: 'text-amber-500' },
                    { rank: '3', title: 'Kalki 2898 AD', gross: '₹12 Cr (Wk 6)', trend: 'down', color: 'text-slate-500' },
                    { rank: '4', title: 'Deadpool & Wolverine', gross: '₹8 Cr (Wk 3)', trend: 'steady', color: 'text-slate-500' },
                  ].map(item => (
                    <div key={item.rank} className="flex justify-between items-center text-xs border-b border-white/5 pb-2.5 last:border-none">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded bg-white/5 flex items-center justify-center font-extrabold ${item.rank === '1' ? 'text-yellow-400 bg-yellow-500/10' : 'text-slate-400'}`}>
                          {item.rank}
                        </span>
                        <span className="font-extrabold text-slate-300">{item.title}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-white">{item.gross}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Widget 2: Critic Mini-Reviews */}
              <div className="glass border border-white/5 bg-[#12121A]/70 rounded-2xl p-5 shadow-xl">
                <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Star size={15} className="text-yellow-400" />
                  Critic Corner Reviews
                </h4>
                <div className="space-y-4">
                  {CRITIC_REVIEWS.map((rev, i) => (
                    <div key={i} className="border-b border-white/5 pb-4 last:border-none last:pb-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-black text-slate-200 text-xs">{rev.movieTitle}</span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: Math.floor(rev.rating) }).map((_, idx) => (
                            <Star key={idx} size={9} className="fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed italic mb-2">"{rev.summary}"</p>
                      <span className="text-[9px] text-rose-500 font-extrabold">{rev.critic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Widget 3: Interactive Trivia Game */}
              <div className="glass border border-purple-500/20 bg-linear-to-b from-[#161226]/50 to-[#0B0814]/80 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                <div className="absolute -right-20 -bottom-20 w-36 h-36 bg-purple-500/5 rounded-full filter blur-3xl" />
                <h4 className="text-xs font-black text-purple-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Sparkles size={12} className="animate-pulse" /> Pop Trivia Quiz
                </h4>
                <p className="text-xs font-black text-white mb-4">
                  Who directed the spectacular Indian mythological sci-fi epic Kalki 2898 AD?
                </p>

                <div className="space-y-2 relative z-10">
                  {[
                    { id: 'a', text: 'Sukumar', correct: false },
                    { id: 'b', text: 'Nag Ashwin', correct: true },
                    { id: 'c', text: 'S.S. Rajamouli', correct: false },
                    { id: 'd', text: 'Prashanth Neel', correct: false }
                  ].map(option => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedTrivia(option.id)}
                      className={`w-full text-left p-3 rounded-xl text-xs font-extrabold border transition-all cursor-pointer border-solid ${
                        selectedTrivia === option.id
                          ? option.correct
                            ? 'bg-green-600/20 border-green-500 text-green-300'
                            : 'bg-red-600/20 border-red-500 text-red-300'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:border-purple-500/50 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{option.text}</span>
                        {selectedTrivia === option.id && (
                          <span className="text-[10px] font-black uppercase">
                            {option.correct ? 'Correct! ✓' : 'Wrong! ✗'}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                {selectedTrivia && (
                  <p className="text-[10px] text-slate-400 font-bold mt-4 leading-relaxed animate-fade-in">
                    {selectedTrivia === 'b' 
                      ? 'Spot on! Nag Ashwin directed the box office titan starring Prabhas, Amitabh Bachchan, and Deepika Padukone.' 
                      : 'Not quite! Try again: He also directed the national-award winning masterpiece biopic Mahanati.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}


      {/* ── 9. CURATED LIVE EVENTS ROW (ALL CATEGORY ONLY) ────────── */}
      {category === 'ALL' && rawCityEvents.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-amber-500 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.5)]" />
              <h3 className="text-2xl font-black text-white tracking-tight">Curated Live Events</h3>
              <span className="text-slate-500 text-xs font-bold hidden sm:inline">
                Bengaluru • Doddaballapur • Mumbai
              </span>
            </div>
            <button 
              onClick={() => onSelectCategory('EVENTS')}
              className="text-xs font-black text-amber-500 hover:text-amber-400 transition-colors uppercase tracking-wider bg-transparent border-none cursor-pointer"
            >
              View All Events →
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {rawCityEvents.slice(0, 4).map((ev, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                key={ev.id}
                onClick={() => setBookingLiveEvent(ev)}
                className="group cursor-pointer flex flex-col bg-white/1.5 border border-white/5 rounded-2xl p-3 hover:border-amber-500/20"
              >
                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3.5 border border-white/5 shadow-lg group-hover:border-amber-500/30 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] transition-all duration-300">
                  <img
                    src={ev.poster}
                    alt={ev.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h4 className="font-bold text-slate-200 text-sm leading-tight mb-1 truncate group-hover:text-white transition-colors">{ev.title}</h4>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                  <Calendar size={11} className="text-slate-500" />
                  <span>{ev.date}</span>
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">{ev.venue}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ── 9.5 CURATED PLAYS ROW (ALL CATEGORY ONLY) ───────────── */}
      {category === 'ALL' && rawCityPlays.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-rose-500 rounded-full shadow-[0_0_12px_rgba(244,63,94,0.5)]" />
              <h3 className="text-2xl font-black text-white tracking-tight">Theatre & Plays</h3>
            </div>
            <button 
              onClick={() => onSelectCategory('PLAYS')}
              className="text-xs font-black text-rose-500 hover:text-rose-400 transition-colors uppercase tracking-wider bg-transparent border-none cursor-pointer"
            >
              View All Plays →
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {rawCityPlays.slice(0, 4).map((ev, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                key={ev.id}
                onClick={() => setBookingLiveEvent(ev)}
                className="group cursor-pointer flex flex-col bg-white/1.5 border border-white/5 rounded-2xl p-3 hover:border-rose-500/20"
              >
                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3.5 border border-white/5 shadow-lg group-hover:border-rose-500/30 group-hover:shadow-[0_0_15px_rgba(244,63,94,0.15)] transition-all duration-300">
                  <img
                    src={ev.poster}
                    alt={ev.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h4 className="font-bold text-slate-200 text-sm leading-tight mb-1 truncate group-hover:text-white transition-colors">{ev.title}</h4>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                  <Calendar size={11} className="text-slate-500" />
                  <span>{ev.date}</span>
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">{ev.venue}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ── 10. CURATED SPORTS ROW (ALL CATEGORY ONLY) ─────────── */}
      {category === 'ALL' && citySports.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shadow-[0_0_12px_rgba(59,130,246,0.15)]">
                <Trophy size={16} />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight">Top Sports Events in {city || 'Your City'}</h3>
            </div>
            <button 
              onClick={() => onSelectCategory('SPORTS')}
              className="text-xs font-black text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-wider bg-transparent border-none cursor-pointer"
            >
              View All Sports →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {citySports.map((sport, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                key={sport.id}
                className="group cursor-pointer flex flex-col glass border border-white/5 rounded-2xl transition-all duration-300 overflow-hidden hover:border-blue-500/30 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] bg-[#12121A]/60 animate-hover"
                onClick={() => onSelectSport(sport)}
              >
                <div className="relative w-full h-48 overflow-hidden">
                  <img
                    src={sport.bgImage}
                    alt={sport.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#12121A] via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-black px-2.5 py-1 rounded shadow-lg uppercase tracking-wide">
                    {sport.tournament}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-black text-slate-100 text-base leading-tight mb-2 truncate group-hover:text-blue-400 transition-colors">{sport.title}</h4>
                    <p className="text-xs text-slate-400 font-bold mb-1">{sport.date} • {sport.time}</p>
                    <p className="text-xs text-slate-500 truncate font-semibold">{sport.venue}</p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Tickets From</span>
                    <span className="font-black text-blue-400 text-glow-blue text-lg">{sport.priceRange.split(' - ')[0]}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ── 10.3 CURATED ACTIVITIES ROW (ALL CATEGORY ONLY) ───────── */}
      {category === 'ALL' && rawCityActivities.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-green-500 rounded-full shadow-[0_0_12px_rgba(34,197,94,0.5)]" />
              <h3 className="text-2xl font-black text-white tracking-tight">Workshops & Activities</h3>
            </div>
            <button 
              onClick={() => onSelectCategory('ACTIVITIES')}
              className="text-xs font-black text-green-500 hover:text-green-400 transition-colors uppercase tracking-wider bg-transparent border-none cursor-pointer"
            >
              View All Activities →
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {rawCityActivities.slice(0, 4).map((ev, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                key={ev.id}
                onClick={() => setBookingLiveEvent(ev)}
                className="group cursor-pointer flex flex-col bg-white/1.5 border border-white/5 rounded-2xl p-3 hover:border-green-500/20"
              >
                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3.5 border border-white/5 shadow-lg group-hover:border-green-500/30 group-hover:shadow-[0_0_15px_rgba(34,197,94,0.15)] transition-all duration-300">
                  <img
                    src={ev.poster}
                    alt={ev.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h4 className="font-bold text-slate-200 text-sm leading-tight mb-1 truncate group-hover:text-white transition-colors">{ev.title}</h4>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                  <Calendar size={11} className="text-slate-500" />
                  <span>{ev.date}</span>
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">{ev.venue}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ── 10.7 MOVIESTAR BUZZ SPOTLIGHT ROW (ALL CATEGORY ONLY) ──── */}
      {category === 'ALL' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-rose-500 rounded-full shadow-[0_0_12px_rgba(244,63,94,0.5)]" />
              <h3 className="text-2xl font-black text-white tracking-tight">MovieStar Buzz Spotlight</h3>
            </div>
            <button 
              onClick={() => onSelectCategory('BUZZ')}
              className="text-xs font-black text-rose-500 hover:text-rose-400 transition-colors uppercase tracking-wider bg-transparent border-none cursor-pointer"
            >
              Go to Buzz Dashboard →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BUZZ_ARTICLES.slice(0, 2).map((art, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                key={art.id}
                onClick={() => onSelectCategory('BUZZ')}
                className="group cursor-pointer bg-white/1.5 border border-white/5 rounded-2xl p-4 hover:border-rose-500/20 flex gap-4 transition-all duration-300"
              >
                <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                  <img src={art.image} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded font-black uppercase tracking-wider">
                      {art.tag}
                    </span>
                    <h4 className="font-extrabold text-slate-200 text-xs sm:text-sm leading-snug mt-1.5 line-clamp-2 group-hover:text-white transition-colors">
                      {art.title}
                    </h4>
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold">{art.readTime} • Click to read</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}


      {/* ── 11. LOCATION & PRACTICAL BOOKING STEPS (ALL ONLY) ── */}
      {(category === 'ALL') && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 mb-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shadow-[0_0_12px_rgba(244,63,94,0.15)]">
              <Zap size={16} className="text-rose-500 animate-pulse" />
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight">Location & Practical Booking Guide</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Box: Step-by-Step Stepper */}
            <div className="glass border border-white/5 rounded-2xl p-6 md:p-8 bg-[#12121A]/40 flex flex-col justify-between shadow-2xl">
              <div>
                <h4 className="text-lg font-black text-white mb-6 flex items-center gap-2">
                  <span className="bg-rose-500/10 text-rose-400 p-1.5 rounded-lg border border-rose-500/20">01</span>
                  Simple Booking Sequence
                </h4>
                
                <div className="space-y-6 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/5">
                  <div className="flex gap-4 relative group">
                    <div className="w-9 h-9 rounded-full bg-[#1A1A26] border border-white/10 flex items-center justify-center shrink-0 text-slate-300 font-bold group-hover:border-rose-500 group-hover:text-rose-400 transition-all duration-300">
                      1
                    </div>
                    <div>
                      <h5 className="font-extrabold text-white text-sm">Select Your Preferred City</h5>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">Choose from our list of active regions. Doddaballapur is actively loaded for direct maps routing.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 relative group">
                    <div className="w-9 h-9 rounded-full bg-[#1A1A26] border border-white/10 flex items-center justify-center shrink-0 text-slate-300 font-bold group-hover:border-rose-500 group-hover:text-rose-400 transition-all duration-300">
                      2
                    </div>
                    <div>
                      <h5 className="font-extrabold text-white text-sm">Pick a Movie & Showtime</h5>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">Explore official TMDB titles and pick a theatre showtime. Theatre details link to live directions.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 relative group">
                    <div className="w-9 h-9 rounded-full bg-[#1A1A26] border border-white/10 flex items-center justify-center shrink-0 text-slate-300 font-bold group-hover:border-rose-500 group-hover:text-rose-400 transition-all duration-300">
                      3
                    </div>
                    <div>
                      <h5 className="font-extrabold text-white text-sm">Auditorium Seat Selection</h5>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">Use our fully responsive interactive curve layout to reserve VIP, Gold, or Silver tier recliners.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 relative group">
                    <div className="w-9 h-9 rounded-full bg-[#1A1A26] border border-white/10 flex items-center justify-center shrink-0 text-slate-300 font-bold group-hover:border-rose-500 group-hover:text-rose-400 transition-all duration-300">
                      4
                    </div>
                    <div>
                      <h5 className="font-extrabold text-white text-sm">Simulated Instant Checkout</h5>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">Input contact info, pick a payment provider (PhonePe, GPay, Paytm, Card), and get your custom ticket stub.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Box: Dynamic Theater Location Mapping */}
            <div className="glass border border-white/5 rounded-2xl p-6 md:p-8 bg-[#12121A]/40 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-rose-500/5 rounded-full filter blur-3xl pointer-events-none group-hover:bg-rose-500/10 transition-all duration-700" />
              
              <div>
                <h4 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                  <span className="bg-rose-500/10 text-rose-400 p-1.5 rounded-lg border border-rose-500/20">02</span>
                  Interactive Maps Routing
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  Every theater has dedicated mapping integration. Clicking a cinema theater or a city pin in our platform opens driving navigations instantly in your browser:
                </p>

                <div className="space-y-4">
                  {/* Doddaballapur Custom Coordinates Card */}
                  <a 
                    href="https://www.google.com/maps/@13.2939776,77.5258112,14z?entry=ttu&g_ep=EgoyMDI2MDUxMy4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 rounded-xl bg-white/2 border border-white/5 hover:bg-white/5 hover:border-rose-500/30 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <h5 className="font-extrabold text-white text-xs flex items-center gap-1.5">
                          Doddaballapur Coordinates
                          <span className="text-[9px] bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded font-black">Active Coordinates</span>
                        </h5>
                        <p className="text-[10px] text-slate-400 mt-0.5">Maps Location: Giri Cinema & Sangam Theatre @13.2939776, 77.5258112</p>
                      </div>
                    </div>
                  </a>

                  {/* Fallback Cities Card */}
                  <div className="p-4 rounded-xl bg-white/1.5 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <h5 className="font-extrabold text-slate-300 text-xs">Other Regional Cities</h5>
                        <p className="text-[10px] text-slate-500 mt-0.5">Maps Location: Dynamically compiles name + region keywords on demand.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-black text-rose-400 tracking-wider uppercase flex items-center gap-1.5 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 block"></span> Live Navigations Operational
                </span>
                <span className="text-[10px] text-slate-500 font-bold">Vite Production Verified</span>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* ── DIGITAL RENTAL CHECKOUT MODAL ───────────────────────── */}
      <AnimatePresence>
        {rentingMovie && (
          <div className="fixed inset-0 z-150 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-dark border border-purple-500/30 rounded-3xl w-full max-w-xl overflow-hidden shadow-[0_8px_50px_rgba(139,92,246,0.3)] flex flex-col max-h-[90vh]"
            >
              <div className="p-6 md:p-8 flex-1 overflow-y-auto space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-purple-400 text-[10px] font-black uppercase tracking-widest bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded">
                      DIGITAL RENTAL & BUY
                    </span>
                    <h3 className="text-2xl font-black text-white mt-3">{rentingMovie.title}</h3>
                  </div>
                  <button
                    onClick={() => { setRentingMovie(null); setRentalSuccessStub(null); }}
                    className="text-slate-400 hover:text-white font-black text-xs cursor-pointer bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg border-solid"
                  >
                    Cancel
                  </button>
                </div>

                {!rentalSuccessStub ? (
                  <>
                    {/* Buy vs Rent Selection */}
                    <div className="grid grid-cols-2 gap-4 p-1 bg-white/5 border border-white/10 rounded-2xl">
                      <button
                        onClick={() => setRentalTier('rent')}
                        className={`py-3.5 text-xs font-black rounded-xl transition-all cursor-pointer border-none ${
                          rentalTier === 'rent'
                            ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                            : 'text-slate-400 hover:text-white bg-transparent'
                        }`}
                      >
                        Rent Film (₹149)
                        <span className="block text-[9px] font-normal text-slate-300 mt-0.5">30-day access</span>
                      </button>
                      <button
                        onClick={() => setRentalTier('buy')}
                        className={`py-3.5 text-xs font-black rounded-xl transition-all cursor-pointer border-none ${
                          rentalTier === 'buy'
                            ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                            : 'text-slate-400 hover:text-white bg-transparent'
                        }`}
                      >
                        Buy Lifetime (₹499)
                        <span className="block text-[9px] font-normal text-slate-300 mt-0.5">Keep forever</span>
                      </button>
                    </div>

                    {/* Audio Language Selection */}
                    <div>
                      <label className="block text-xs font-black text-slate-300 mb-2 uppercase tracking-wide">Select Audio Track</label>
                      <div className="flex gap-2.5 flex-wrap">
                        {rentingMovie.languages?.map(lang => (
                          <button
                            key={lang}
                            onClick={() => setStreamLanguage(lang)}
                            className={`px-4 py-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                              streamLanguage === lang
                                ? 'bg-purple-600 text-white border-purple-500 shadow-md border-solid'
                                : 'bg-white/5 text-slate-300 border-white/10 hover:border-purple-500/40 border-solid'
                            }`}
                          >
                            {lang}
                          </button>
                        )) || (
                          <button className="px-4 py-2 bg-purple-600 text-white border-purple-500 border-solid rounded-xl text-xs font-extrabold">
                            {rentingMovie.language}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Streaming Quality Selector */}
                    <div>
                      <label className="block text-xs font-black text-slate-300 mb-2 uppercase tracking-wide">Streaming Quality</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: 'SD', label: 'Standard Definition (SD)', desc: 'Mobile screens' },
                          { id: 'HD', label: 'High Definition (HD)', desc: '1080p Crystal Clear' },
                          { id: '4K', label: 'Ultra 4K & HDR', desc: 'Dolby Atmos Surround' }
                        ].map(q => (
                          <button
                            key={q.id}
                            onClick={() => setStreamQuality(q.id as 'SD' | 'HD' | '4K')}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer border-solid ${
                              streamQuality === q.id
                                ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                                : 'bg-white/5 border-white/10 text-slate-400 hover:border-purple-500/30'
                            }`}
                          >
                            <span className="block font-black text-xs text-white">{q.id} Quality</span>
                            <span className="block text-[9px] text-slate-400 mt-0.5">{q.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Checkout Billing Breakdown */}
                    <div className="p-5 rounded-2xl bg-[#09090C] border border-white/5 border-solid space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-medium">Digital License Price</span>
                        <span className="font-extrabold text-white">₹{getStreamPrice()}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-medium">Convenience Digital Fee</span>
                        <span className="font-black text-green-400">FREE</span>
                      </div>
                      <div className="h-px bg-white/5 my-2" />
                      <div className="flex justify-between items-center text-sm font-black">
                        <span className="text-white">Amount Due</span>
                        <span className="text-purple-400 text-glow-purple">₹{getStreamPrice()}</span>
                      </div>
                    </div>

                    <button
                      onClick={handleProcessRental}
                      className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold py-3.5 rounded-2xl shadow-xl shadow-purple-600/20 hover:shadow-purple-600/40 transition-all cursor-pointer border-none"
                    >
                      Complete Simulated Purchase (₹{getStreamPrice()})
                    </button>
                  </>
                ) : (
                  /* Success Receipt */
                  <div className="space-y-6 text-center py-4">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 border-solid flex items-center justify-center mx-auto shadow-md animate-pulse">
                      <CheckCircle2 size={32} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white">Digital License Activated!</h4>
                      <p className="text-xs text-slate-400 mt-1">Receipt generated under enterprise booking guidelines.</p>
                    </div>

                    {/* Digital Receipt Card */}
                    <div className="text-left p-5 rounded-2xl bg-[#09090C] border border-purple-500/30 border-solid relative overflow-hidden">
                      <div className="space-y-3 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Transaction ID:</span>
                          <span className="font-mono text-purple-400 font-black">{rentalSuccessStub.transactionId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">License Activated:</span>
                          <span className="font-bold text-white uppercase">{rentalSuccessStub.tier}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Quality / Audio:</span>
                          <span className="font-bold text-white">{rentalSuccessStub.quality} UHD / {rentalSuccessStub.language}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Amount Paid:</span>
                          <span className="font-black text-green-400">₹{rentalSuccessStub.price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Rental Validity:</span>
                          <span className="font-bold text-purple-300">{rentalSuccessStub.expiry}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setWatchingStream(rentingMovie);
                          setRentingMovie(null);
                        }}
                        className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-extrabold py-3 rounded-xl shadow-lg transition-all cursor-pointer border-none flex items-center justify-center gap-2"
                      >
                        <Play size={14} className="fill-white" /> Watch Stream Now
                      </button>
                      <button
                        onClick={() => { setRentingMovie(null); setRentalSuccessStub(null); }}
                        className="glass text-slate-300 hover:text-white px-5 py-3 rounded-xl border border-white/10 cursor-pointer"
                      >
                        Close Portal
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* ── DYNAMIC LIVE EVENT BOOKING MODAL ───────────────────── */}
      <AnimatePresence>
        {bookingLiveEvent && (
          <div className="fixed inset-0 z-150 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-dark border border-amber-500/30 rounded-3xl w-full max-w-md overflow-hidden shadow-[0_8px_50px_rgba(245,158,11,0.2)] flex flex-col"
            >
              <div className="p-6 md:p-8 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-amber-500/10 border border-amber-500/20 border-solid text-amber-400 text-[10px] font-black px-2.5 py-1 rounded">
                      LIVE EVENTS BILLING
                    </span>
                    <h3 className="text-xl font-black text-white mt-3 leading-snug">{bookingLiveEvent.title}</h3>
                  </div>
                  <button
                    onClick={() => { setBookingLiveEvent(null); setEventSuccessStub(null); setEventTicketsCount(1); }}
                    className="text-slate-400 hover:text-white font-black text-xs bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg border-solid cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                {!eventSuccessStub ? (
                  <>
                    <div className="p-4 rounded-xl bg-white/2 border border-white/5 border-solid text-xs text-slate-300 space-y-2">
                      <p><strong>Venue:</strong> {bookingLiveEvent.venue}, {bookingLiveEvent.city}</p>
                      <p><strong>Showtime:</strong> {bookingLiveEvent.date}</p>
                      <p><strong>Price:</strong> {bookingLiveEvent.price}</p>
                    </div>

                    {/* Quantity Picker */}
                    <div>
                      <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-wide">Select Ticket Quantity</label>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setEventTicketsCount(c => Math.max(1, c - 1))}
                          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 border-solid flex items-center justify-center font-black text-lg text-slate-300 hover:bg-white/10 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-12 text-center text-base font-black text-white">{eventTicketsCount}</span>
                        <button
                          onClick={() => setEventTicketsCount(c => Math.min(10, c + 1))}
                          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 border-solid flex items-center justify-center font-black text-lg text-slate-300 hover:bg-white/10 cursor-pointer"
                        >
                          +
                        </button>
                        <span className="text-[10px] text-slate-500 font-bold ml-auto">(Max 10 per account)</span>
                      </div>
                    </div>

                    {/* Calculation breakdown */}
                    <div className="p-4 rounded-xl bg-[#09090C] border border-white/5 border-solid text-xs space-y-2.5">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Tickets (Qty: {eventTicketsCount})</span>
                        <span className="font-bold text-white">
                          ₹{parseInt(bookingLiveEvent.price.replace(/\D/g, '') || '500') * eventTicketsCount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Taxes & Booking Fees</span>
                        <span className="font-bold text-green-400">FREE</span>
                      </div>
                      <div className="h-px bg-white/5 border-solid" />
                      <div className="flex justify-between text-sm font-black">
                        <span className="text-white">Total Amount</span>
                        <span className="text-amber-400">
                          ₹{parseInt(bookingLiveEvent.price.replace(/\D/g, '') || '500') * eventTicketsCount}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleProcessEventBooking}
                      className="w-full bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-extrabold py-3 rounded-xl shadow-lg transition-all border-none cursor-pointer"
                    >
                      Instant Purchase (₹{parseInt(bookingLiveEvent.price.replace(/\D/g, '') || '500') * eventTicketsCount})
                    </button>
                  </>
                ) : (
                  /* Live Event Ticket Receipt */
                  <div className="space-y-6 text-center py-2">
                    <div className="w-14 h-14 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 border-solid flex items-center justify-center mx-auto shadow-md animate-pulse">
                      <CheckCircle2 size={28} />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-white">Live Event Ticket Reserved!</h4>
                      <p className="text-xs text-slate-400 mt-1">A confirmation text and virtual stub have been compiled.</p>
                    </div>

                    {/* Virtual Stub */}
                    <div className="text-left p-4 rounded-xl bg-[#09090C] border border-amber-500/20 border-solid text-xs space-y-2 relative">
                      <div className="absolute top-2 right-2 bg-amber-500/10 border border-amber-500/20 border-solid px-2 py-0.5 rounded text-[8px] text-amber-400 font-extrabold uppercase">
                        Active Entry Pass
                      </div>
                      <p className="text-slate-500">Ticket ID: <span className="font-mono text-amber-400 font-black">{eventSuccessStub.ticketId}</span></p>
                      <p className="text-slate-300 font-extrabold text-sm truncate mt-1">{eventSuccessStub.eventTitle}</p>
                      <p className="text-slate-400 font-bold">{eventSuccessStub.date}</p>
                      <p className="text-slate-500">{eventSuccessStub.venue}</p>
                      <div className="h-px bg-white/5 border-solid my-2" />
                      <div className="flex justify-between font-bold">
                        <span className="text-slate-500">Quantity / Paid:</span>
                        <span className="text-white">{eventSuccessStub.quantity} Tickets / ₹{eventSuccessStub.totalAmount}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => { setBookingLiveEvent(null); setEventSuccessStub(null); setEventTicketsCount(1); }}
                      className="w-full bg-white/5 border border-white/10 border-solid hover:bg-white/10 text-slate-300 font-bold py-2.5 rounded-lg text-xs cursor-pointer"
                    >
                      Done & Close
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── DIGITAL STREAM RENTAL MODAL ───────────────────── */}
      <AnimatePresence>
        {rentingMovie && (
          <div className="fixed inset-0 z-150 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-dark border border-purple-500/30 rounded-3xl w-full max-w-md overflow-hidden shadow-[0_8px_50px_rgba(139,92,246,0.2)] flex flex-col"
            >
              <div className="p-6 md:p-8 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-purple-500/10 border border-purple-500/20 border-solid text-purple-400 text-[10px] font-black px-2.5 py-1 rounded">
                      PVOD STREAM PORTAL
                    </span>
                    <h3 className="text-xl font-black text-white mt-3 leading-snug">{rentingMovie.title}</h3>
                  </div>
                  <button
                    onClick={() => { setRentingMovie(null); setRentalSuccessStub(null); }}
                    className="text-slate-400 hover:text-white font-black text-xs bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg border-solid cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                {!rentalSuccessStub ? (
                  <>
                    <div className="p-4 rounded-xl bg-white/2 border border-white/5 border-solid text-xs text-slate-300 space-y-2">
                      <p><strong>Available Audio:</strong> Multi-channel Dolby Atmos, Hindi, English</p>
                      <p><strong>Digital Format:</strong> 4K UHD, Dolby Vision / HDR10+</p>
                    </div>

                    {/* Tier selector */}
                    <div>
                      <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-wide">Select Streaming Tier</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setRentalTier('rent')}
                          className={`p-3 rounded-xl border border-solid text-left transition-all cursor-pointer ${
                            rentalTier === 'rent'
                              ? 'bg-purple-600/20 border-purple-500 text-white'
                              : 'bg-white/2 border-white/5 text-slate-400 hover:border-white/20'
                          }`}
                        >
                          <div className="text-xs font-black">RENT</div>
                          <div className="text-lg font-black mt-1 text-purple-400">₹149</div>
                          <div className="text-[9px] text-slate-500 mt-1 font-semibold">Active for 30 Days</div>
                        </button>
                        <button
                          onClick={() => setRentalTier('buy')}
                          className={`p-3 rounded-xl border border-solid text-left transition-all cursor-pointer ${
                            rentalTier === 'buy'
                              ? 'bg-purple-600/20 border-purple-500 text-white'
                              : 'bg-white/2 border-white/5 text-slate-400 hover:border-white/20'
                          }`}
                        >
                          <div className="text-xs font-black">BUY FOREVER</div>
                          <div className="text-lg font-black mt-1 text-purple-400">₹499</div>
                          <div className="text-[9px] text-slate-500 mt-1 font-semibold">Own it forever in HD/4K</div>
                        </button>
                      </div>
                    </div>

                    {/* Format / Quality selection */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-wide">Select Quality</label>
                        <select
                          value={streamQuality}
                          onChange={e => setStreamQuality(e.target.value as 'SD' | 'HD' | '4K')}
                          className="w-full bg-[#12121A] text-white border border-white/10 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-purple-500"
                        >
                          <option value="SD">Standard Definition (SD)</option>
                          <option value="HD">High Definition (HD)</option>
                          <option value="4K">4K UHD + HDR</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-wide">Select Language</label>
                        <select
                          value={streamLanguage}
                          onChange={e => setStreamLanguage(e.target.value)}
                          className="w-full bg-[#12121A] text-white border border-white/10 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-purple-500"
                        >
                          <option value="English">English Audio</option>
                          <option value="Hindi">Hindi Dubbed</option>
                          <option value="Tamil">Tamil Dubbed</option>
                          <option value="Telugu">Telugu Dubbed</option>
                        </select>
                      </div>
                    </div>

                    {/* Calculation breakdown */}
                    <div className="p-4 rounded-xl bg-[#09090C] border border-white/5 border-solid text-xs space-y-2.5">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Premium Stream Access ({rentalTier === 'rent' ? 'Rental' : 'Buy'})</span>
                        <span className="font-bold text-white">₹{getStreamPrice()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Stream Platform Fee</span>
                        <span className="font-bold text-green-400">FREE</span>
                      </div>
                      <div className="h-px bg-white/5 border-solid" />
                      <div className="flex justify-between text-sm font-black">
                        <span className="text-white">Total Charge</span>
                        <span className="text-purple-400">₹{getStreamPrice()}</span>
                      </div>
                    </div>

                    <button
                      onClick={handleProcessRental}
                      className="w-full bg-linear-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white font-extrabold py-3 rounded-xl shadow-lg transition-all border-none cursor-pointer"
                    >
                      Process Digital Rent (₹{getStreamPrice()})
                    </button>
                  </>
                ) : (
                  /* Rental Receipt & Stream Activation */
                  <div className="space-y-6 text-center py-2">
                    <div className="w-14 h-14 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 border-solid flex items-center justify-center mx-auto shadow-md animate-pulse">
                      <CheckCircle2 size={28} />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-white">Digital Access Activated!</h4>
                      <p className="text-xs text-slate-400 mt-1">Simulated payment received. The stream portal is now active.</p>
                    </div>

                    {/* Virtual Receipt */}
                    <div className="text-left p-4 rounded-xl bg-[#09090C] border border-purple-500/20 border-solid text-xs space-y-2 relative">
                      <div className="absolute top-2 right-2 bg-purple-500/10 border border-purple-500/20 border-solid px-2 py-0.5 rounded text-[8px] text-purple-400 font-extrabold uppercase">
                        PVOD ACTIVE PASS
                      </div>
                      <p className="text-slate-500">Transaction ID: <span className="font-mono text-purple-400 font-black">{rentalSuccessStub.transactionId}</span></p>
                      <p className="text-slate-300 font-extrabold text-sm truncate mt-1">{rentalSuccessStub.movieTitle}</p>
                      <p className="text-slate-400 font-bold">Format: {rentalSuccessStub.quality} / {rentalSuccessStub.language}</p>
                      <p className="text-slate-500">{rentalSuccessStub.expiry}</p>
                      <div className="h-px bg-white/5 border-solid my-2" />
                      <div className="flex justify-between font-bold">
                        <span className="text-slate-500">Amount Paid:</span>
                        <span className="text-white">₹{rentalSuccessStub.price}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setWatchingStream(rentingMovie);
                          setRentingMovie(null);
                          setRentalSuccessStub(null);
                        }}
                        className="flex-1 bg-linear-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white font-extrabold py-3 rounded-xl shadow-lg transition-all border-none cursor-pointer text-xs"
                      >
                        Watch Now in Theater
                      </button>
                      <button
                        onClick={() => { setRentingMovie(null); setRentalSuccessStub(null); }}
                        className="bg-white/5 border border-white/10 border-solid hover:bg-white/10 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer"
                      >
                        Done & Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── HIGH FIDELITY SIMULATED THEATER PORTAL ─────────── */}
      <AnimatePresence>
        {watchingStream && (
          <div className="fixed inset-0 z-200 bg-black/95 overflow-y-auto flex flex-col justify-between py-6 px-4 md:px-12 backdrop-blur-xl">
            {/* Top Bar / Navigation */}
            <div className="flex justify-between items-center w-full max-w-6xl mx-auto z-10">
              <div className="flex items-center gap-3">
                <span className="bg-purple-500/20 border border-purple-500/30 text-purple-400 text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-wider animate-pulse">
                  CINEMA MODE ACTIVE
                </span>
                <h2 className="text-sm md:text-base font-black text-slate-300 truncate max-w-[200px] md:max-w-md">
                  Watching: <span className="text-white font-extrabold">{watchingStream.title}</span>
                </h2>
              </div>
              <button
                onClick={() => { setWatchingStream(null); setIsPlayerPlaying(false); }}
                className="text-slate-400 hover:text-white font-black text-xs bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl transition cursor-pointer"
              >
                Exit Theater Portal
              </button>
            </div>

            {/* Main Screen Content */}
            <div className="flex-1 flex flex-col items-center justify-center my-6 relative max-w-6xl w-full mx-auto">
              
              {/* Dynamic Radial Ambient Backglow matching movie vibe */}
              {playerAmbientGlow && (
                <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
                  <div 
                    className="w-[80%] h-[60%] rounded-full bg-linear-to-r from-purple-600/10 via-pink-600/15 to-violet-600/10 opacity-70 filter blur-3xl animate-pulse"
                    style={{ transition: 'opacity 0.5s ease' }}
                  />
                </div>
              )}

              {/* Theater Wide-screen Player */}
              <div className="w-full aspect-video max-w-4xl bg-black rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col justify-between relative group/player">
                
                {/* Simulated Screen Content - Ambient visualizer */}
                <div className="absolute inset-0 bg-[#05050A] flex flex-col items-center justify-center p-6 select-none overflow-hidden">
                  
                  {/* Subtle cinema curved border */}
                  <div className="absolute inset-0 border-[3px] border-white/5 rounded-2xl pointer-events-none" />

                  {/* Visual content based on play state */}
                  {isPlayerPlaying ? (
                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                      {/* Bouncing simulated audio lines/particles */}
                      <div className="flex gap-1.5 items-end justify-center h-24 mb-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(idx => (
                          <motion.div
                            key={idx}
                            animate={{
                              height: [15, idx * 6 + 10, 20, idx * 4 + 8, 15],
                            }}
                            transition={{
                              duration: 1.2 + idx * 0.1,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            className="w-1.5 bg-linear-to-t from-purple-600 to-pink-500 rounded-full"
                          />
                        ))}
                      </div>
                      <div className="text-center">
                        <p className="text-slate-400 font-mono text-xs uppercase tracking-widest flex items-center gap-1.5 justify-center">
                          <Tv size={12} className="text-purple-400" />
                          Simulating Dolby Digital Cinema Stream
                        </p>
                        <p className="text-slate-500 text-[10px] font-bold mt-1">4K Ultra HD • Dolby Atmos Enabled</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
                        <Pause size={28} className="text-slate-400" />
                      </div>
                      <p className="text-slate-300 font-mono text-xs uppercase tracking-widest">Stream Paused</p>
                    </div>
                  )}

                  {/* Realistic Subtitle Overlay */}
                  {isPlayerPlaying && playerProgress > 5 && playerProgress < 95 && (
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center w-full px-8">
                      <span className="bg-black/75 text-yellow-300 text-xs sm:text-sm font-bold px-4 py-1.5 rounded-lg border border-white/5 shadow-md">
                        {playerProgress < 25 ? "[Atmospheric suspenseful music playing]" :
                         playerProgress < 50 ? "I'm ready for the next adventure. Let's do this together." :
                         playerProgress < 75 ? "We cannot change the past, but we can secure the future." :
                                                "Thank you for streaming with MovieStar Cinema Exclusives!"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Player HUD Overlay - Appears on Hover */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-black/75 opacity-0 group-hover/player:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 z-10">
                  
                  {/* Top Bar of player */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="bg-purple-600 text-white px-2 py-0.5 rounded font-black text-[9px] uppercase tracking-wide shadow-md">
                      4K PVOD STAGE
                    </span>
                    <span className="text-slate-300 font-mono font-semibold">Simulated Theatre Room</span>
                  </div>

                  {/* Mid Play/Pause big indicator */}
                  <div className="flex justify-center items-center">
                    <button
                      onClick={() => setIsPlayerPlaying(!isPlayerPlaying)}
                      className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg transition-all border-none cursor-pointer transform hover:scale-105"
                    >
                      {isPlayerPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
                    </button>
                  </div>

                  {/* Bottom Controls HUD */}
                  <div className="space-y-3">
                    {/* Scrub/Progress Bar */}
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-slate-400 font-mono font-bold select-none">
                        {Math.floor(playerProgress * 1.5)}:00
                      </span>
                      <div 
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const clickX = e.clientX - rect.left;
                          const percentage = (clickX / rect.width) * 100;
                          setPlayerProgress(percentage);
                        }}
                        className="flex-1 h-1.5 bg-white/10 rounded-full cursor-pointer relative group/scrub"
                      >
                        <div 
                          className="absolute top-0 left-0 h-full bg-linear-to-r from-purple-500 to-pink-500 rounded-full" 
                          style={{ width: `${playerProgress}%` }}
                        >
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-lg border border-purple-500 opacity-0 group-hover/scrub:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono font-bold select-none">150:00</span>
                    </div>

                    {/* Controls alignment */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        {/* Play control */}
                        <button
                          onClick={() => setIsPlayerPlaying(!isPlayerPlaying)}
                          className="text-slate-300 hover:text-white bg-transparent border-none cursor-pointer transition-colors"
                        >
                          {isPlayerPlaying ? <Pause size={16} /> : <Play size={16} />}
                        </button>

                        {/* Rewind */}
                        <button
                          onClick={() => setPlayerProgress(prev => Math.max(0, prev - 5))}
                          className="text-slate-300 hover:text-white bg-transparent border-none cursor-pointer transition-colors"
                          title="Rewind 5 mins"
                        >
                          <RotateCcw size={16} />
                        </button>

                        {/* Volume controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setPlayerMuted(!playerMuted)}
                            className="text-slate-300 hover:text-white bg-transparent border-none cursor-pointer transition-colors"
                          >
                            {playerMuted || playerVolume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                          </button>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={playerMuted ? 0 : playerVolume}
                            onChange={(e) => {
                              setPlayerVolume(parseFloat(e.target.value));
                              setPlayerMuted(false);
                            }}
                            className="w-16 accent-purple-500 h-1 bg-white/20 rounded-lg outline-none cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Right aligned player switches */}
                      <div className="flex items-center gap-4">
                        {/* Ambient backlighting toggle */}
                        <button
                          onClick={() => setPlayerAmbientGlow(!playerAmbientGlow)}
                          className={`px-3 py-1 rounded-full text-[10px] font-black border transition-all cursor-pointer ${
                            playerAmbientGlow
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-sm'
                              : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20'
                          }`}
                        >
                          Ambient Backglow
                        </button>

                        <button className="text-slate-300 hover:text-white bg-transparent border-none cursor-pointer transition-colors">
                          <Maximize size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stadium Seating Layout - Decorative Ambient Seating Vibe */}
            <div className="w-full max-w-3xl mx-auto mt-2 mb-4 text-center z-10 pointer-events-none">
              <div className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-3">Simulated Cinema Theater Seats</div>
              <div className="flex flex-col gap-1.5 items-center">
                {[1, 2].map(rowIdx => (
                  <div key={rowIdx} className="flex gap-1.5 justify-center">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(seatIdx => (
                      <div 
                        key={seatIdx} 
                        className={`w-3.5 h-3 rounded-t-sm border border-solid transition-colors duration-500 ${
                          playerAmbientGlow && isPlayerPlaying
                            ? 'bg-purple-900/10 border-purple-500/10'
                            : 'bg-slate-900/40 border-slate-800'
                        }`} 
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}


