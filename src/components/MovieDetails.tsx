import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Movie, Theater, Showtime } from '../types';
import { THEATERS, SHOWTIMES, SHOWTIME_DATES } from '../mockData';
import { Star, Info, Heart, Share2, Ticket, MapPin, Play, Clock, Calendar, Award, CheckCircle2 } from 'lucide-react';
import TrailerModal from './TrailerModal';

interface MovieDetailsProps {
  movie: Movie;
  city: string;
  onSelectShowtime: (theater: Theater, showtime: Showtime) => void;
}

const LANG_COLORS: Record<string, string> = {
  Hindi: 'lang-hindi',
  English: 'lang-english',
  Tamil: 'lang-tamil',
  Telugu: 'lang-telugu',
  Kannada: 'lang-kannada',
  Malayalam: 'lang-malayalam',
};

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Build date tabs dynamically from today
const buildDateTabs = () => {
  return SHOWTIME_DATES.map((dateStr, i) => {
    const d = new Date(dateStr);
    const label = i === 0 ? 'TODAY' : i === 1 ? 'TMW' : DAY_NAMES[d.getDay()];
    return { value: dateStr, label, date: String(d.getDate()), month: MONTH_NAMES[d.getMonth()] };
  });
};

const getGoogleMapsLink = (tName: string, tCity: string) => {
  if (tCity === 'Doddaballapur') {
    return 'https://www.google.com/maps/@13.2939776,77.5258112,14z?entry=ttu&g_ep=EgoyMDI2MDUxMy4wIKXMDSoASAFQAw%3D%3D';
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tName + ' ' + tCity)}`;
};

export default function MovieDetails({ movie, city, onSelectShowtime }: MovieDetailsProps) {
  const DATES = buildDateTabs();
  const [selectedDate, setSelectedDate] = useState<string>(SHOWTIME_DATES[0]);

  const [showTrailer, setShowTrailer] = useState(false);
  const [wishlist, setWishlist] = useState(false);
  const [showCopiedToast, setShowCopiedToast] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: movie.title,
      text: `Check out ${movie.title} on MovieStar!`,
      url: window.location.href,
    };
    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShowCopiedToast(true);
        setTimeout(() => setShowCopiedToast(false), 2500);
      }
    } catch (err) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShowCopiedToast(true);
        setTimeout(() => setShowCopiedToast(false), 2500);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const cityTheaters = THEATERS.filter(t => t.city === city);


  return (
    <>
      {/* Trailer Modal */}
      <AnimatePresence>
        {showTrailer && movie.trailerYoutubeId && (
          <TrailerModal
            youtubeId={movie.trailerYoutubeId}
            title={movie.title}
            onClose={() => setShowTrailer(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="bg-[#09090C] min-h-screen text-slate-100"
      >
        {/* ── Hero Movie Banner ─────────────────────────── */}
        <div
          className="relative w-full h-[360px] md:h-[480px] bg-[#0A0A0F] text-white overflow-hidden border-b border-white/5"
        >
          <img
            src={movie.bgImage}
            alt={movie.title}
            className="absolute inset-0 w-full h-full object-cover object-center scale-105"
            style={{ filter: 'blur(4px)', opacity: 0.35 }}
          />
          <div className="absolute inset-0 hero-gradient" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col md:flex-row items-center md:items-end pb-8 gap-8 pt-12">
            {/* Poster */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-[160px] md:w-[210px] shrink-0 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/10 hidden md:block"
            >
              <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex-1 w-full text-center md:text-left"
            >
              {/* Rating Pill */}
              <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold mb-4 border border-white/10">
                <Star size={13} className="text-yellow-400 fill-yellow-400" />
                <span>{movie.rating}/10</span>
                <span className="text-slate-400 font-medium">({movie.votes} Votes)</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tight drop-shadow-lg text-glow-rose">
                {movie.title}
              </h1>

              {/* Meta Tags */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-5">
                {movie.certificate && (
                  <span className="bg-white/5 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-extrabold border border-white/10 flex items-center gap-1.5 text-slate-300">
                    <Award size={12} className="text-rose-500" />
                    {movie.certificate}
                  </span>
                )}
                <span className="bg-white/5 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-bold border border-white/10 flex items-center gap-1.5 text-slate-300">
                  <Clock size={12} className="text-rose-500" />
                  {movie.duration}
                </span>
                <span className="bg-white/5 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-extrabold border border-white/10 text-slate-300">
                  {movie.format}
                </span>
                <span className="bg-white/5 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-bold border border-white/10 flex items-center gap-1.5 text-slate-300">
                  <Calendar size={12} className="text-rose-500" />
                  {movie.releaseDate}
                </span>
              </div>

              {/* Language Badges */}
              <div className="flex flex-wrap gap-1.5 justify-center md:justify-start mb-5">
                {movie.languages?.map(lang => (
                  <span key={lang} className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${LANG_COLORS[lang] ?? 'bg-white/20 text-white border-white/30'}`}>
                    {lang}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center md:justify-start flex-wrap">
                <button
                  onClick={() => window.scrollTo({ top: 500, behavior: 'smooth' })}
                  className="bg-linear-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-extrabold py-3 px-8 rounded-xl shadow-lg shadow-rose-600/20 hover:shadow-rose-600/30 transition-all flex items-center gap-2 cursor-pointer hover:scale-102"
                >
                  <Ticket size={20} />
                  Book Tickets
                </button>
                {movie.trailerYoutubeId && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="glass text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center gap-2 hover:bg-white/10 group cursor-pointer"
                  >
                    <div className="w-7 h-7 bg-rose-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-rose-600/30">
                      <Play size={12} className="fill-white text-white ml-0.5" />
                    </div>
                    Watch Trailer
                  </button>
                )}
              </div>
            </motion.div>

            {/* Top-right action buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => setWishlist(w => !w)}
                className="w-10 h-10 rounded-full glass-dark flex items-center justify-center text-slate-300 hover:text-white border border-white/5 hover:bg-white/10 transition cursor-pointer"
              >
                <Heart size={18} className={wishlist ? 'fill-rose-500 text-rose-500' : ''} />
              </button>
              <button 
                onClick={handleShare}
                className="w-10 h-10 rounded-full glass-dark flex items-center justify-center text-slate-300 hover:text-white border border-white/5 hover:bg-white/10 transition cursor-pointer"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Date & Format Filter Bar ──────────────────── */}
        <div className="bg-[#0F0F14]/90 backdrop-blur-md border-b border-white/5 sticky top-16 z-40 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center overflow-x-auto scroll-smooth scrollbar-none">
            <div className="flex items-center gap-6">
              {/* Sticky Mini Poster */}
              <div className="hidden lg:flex items-center gap-3 border-r pr-6 border-white/10 shrink-0">
                <img src={movie.poster} alt={movie.title} className="w-10 h-14 object-cover rounded-lg shadow-md border border-white/10" />
                <div className="flex flex-col justify-center">
                  <h3 className="font-extrabold text-white text-sm truncate max-w-[200px]">{movie.title}</h3>
                  <p className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5 mt-0.5">
                    <Star size={11} className="text-rose-500 fill-rose-500" /> {movie.rating} • {movie.format.split(',')[0]}
                  </p>
                </div>
              </div>

              <div className="flex gap-2.5 min-w-max">
                {DATES.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setSelectedDate(d.value)}
                    className={`flex flex-col items-center px-4 py-2 rounded-xl transition-all cursor-pointer ${
                      selectedDate === d.value
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 border border-rose-500/50'
                        : 'bg-white/5 text-slate-300 border border-white/5 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="text-[9px] font-black tracking-wider opacity-75">{d.label}</span>
                    <span className="text-lg font-black leading-tight my-0.5">{d.date}</span>
                    <span className="text-[9px] uppercase font-black tracking-wider opacity-75">{d.month}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden md:flex gap-4 shrink-0 pl-6">
              <span className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block shadow-[0_0_8px_rgba(16,185,129,0.5)]" /> Available
              </span>
              <span className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-400 block shadow-[0_0_8px_rgba(249,115,22,0.5)]" /> Fast Filling
              </span>
            </div>
          </div>
        </div>

        {/* ── Main Content Layout ───────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row gap-8">

          {/* Left: Theaters */}
          <div className="flex-1">
            <div className="glass border border-white/5 bg-[#0F0F14]/40 rounded-2xl overflow-hidden shadow-2xl">
              {cityTheaters.length === 0 ? (
                <div className="p-16 text-center text-slate-400">
                  <MapPin size={36} className="mx-auto mb-4 text-slate-600" />
                  <p className="text-base font-bold">No theaters currently listed for {city || 'your city'}</p>
                </div>
              ) : null}

              {cityTheaters.map((theater, idx) => {
                const theaterShowtimes = SHOWTIMES.filter(
                  s => s.theaterId === theater.id && s.movieId === movie.id && s.date === selectedDate
                );
                if (theaterShowtimes.length === 0) return null;

                return (
                  <div key={theater.id} className={`p-5 md:p-7 flex flex-col md:flex-row gap-6 hover:bg-white/1.5 transition-colors ${idx !== cityTheaters.length - 1 ? 'border-b border-white/5' : ''}`}>
                    <div className="w-full md:w-1/3 shrink-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-extrabold text-white flex items-center gap-2 text-base leading-snug">
                            <Heart size={15} className="text-slate-600 hover:text-rose-500 cursor-pointer transition-colors" />
                            <a 
                              href={getGoogleMapsLink(theater.name, theater.city)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-rose-400 transition-colors"
                            >
                              {theater.name}
                            </a>
                          </h4>
                          <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1.5 font-medium">
                            <a 
                              href={getGoogleMapsLink(theater.name, theater.city)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 hover:text-rose-400 transition-colors group/map"
                            >
                              <MapPin size={13} className="text-slate-500 group-hover/map:text-rose-500 transition-colors" />
                              <span className="underline decoration-rose-500/30 underline-offset-4">{city}</span>
                            </a>
                          </p>
                        </div>
                        <button className="text-blue-400 text-xs font-bold flex items-center gap-1 hover:text-blue-300 hover:underline shrink-0 bg-transparent border-none cursor-pointer">
                          <Info size={13} /> Info
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {theater.facilities.map(f => (
                          <span key={f} className="text-[10px] text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded font-bold border border-teal-500/20 uppercase tracking-wide">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="w-full md:w-2/3 flex flex-wrap gap-3.5 items-center">
                      {theaterShowtimes.map(st => {
                        const isFilling = Math.random() > 0.6;
                        return (
                          <button
                            key={st.id}
                            onClick={() => onSelectShowtime(theater, st)}
                            className="group flex flex-col items-center justify-center p-3.5 min-w-[100px] border rounded-xl bg-white/2 hover:bg-white/8 hover:border-rose-500/50 hover:shadow-[0_0_15px_rgba(244,63,94,0.15)] transition-all pt-4 relative cursor-pointer"
                            style={{ borderColor: isFilling ? 'rgba(249,115,22,0.3)' : 'rgba(16,185,129,0.3)' }}
                          >
                            <span className="text-[9px] absolute top-[-9px] bg-[#0F0F14] px-2 py-0.5 text-slate-400 font-black tracking-wide border border-white/5 rounded-md">{st.format}</span>
                            <span className={`text-sm font-black ${isFilling ? 'text-orange-400' : 'text-emerald-400'}`}>{st.time}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: About, Cast, Reviews */}
          <div className="w-full lg:w-[340px] shrink-0 space-y-8">

            {movie.synopsis && (
              <div>
                <h3 className="font-extrabold text-white text-lg mb-3">About the movie</h3>
                <p className="text-sm text-slate-300 leading-relaxed font-medium">{movie.synopsis}</p>
              </div>
            )}

            <hr className="border-white/5" />

            {movie.cast && movie.cast.length > 0 && (
              <div>
                <h3 className="font-extrabold text-white text-lg mb-4">Cast</h3>
                <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-none">
                  {movie.cast.map(c => (
                    <div key={c.id} className="flex flex-col items-center shrink-0 w-20 group cursor-pointer">
                      <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg mb-2 border-2 border-transparent group-hover:border-rose-500/40 group-hover:shadow-[0_0_10px_rgba(244,63,94,0.3)] transition-all duration-300">
                        <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <span className="text-xs font-bold text-slate-200 text-center leading-tight line-clamp-1 group-hover:text-white">{c.name}</span>
                      <span className="text-[10px] text-slate-500 text-center line-clamp-1 mt-0.5">{c.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {movie.crew && movie.crew.length > 0 && (
              <div>
                <h3 className="font-extrabold text-white text-lg mb-4">Crew</h3>
                <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-none">
                  {movie.crew.map(c => (
                    <div key={c.id} className="flex flex-col items-center shrink-0 w-20">
                      <img src={c.image} alt={c.name} className="w-20 h-20 rounded-full object-cover shadow-lg mb-2 border border-white/5" />
                      <span className="text-xs font-bold text-slate-200 text-center leading-tight line-clamp-1">{c.name}</span>
                      <span className="text-[10px] text-slate-500 text-center line-clamp-1 mt-0.5">{c.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <hr className="border-white/5" />

            {movie.reviews && movie.reviews.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-extrabold text-white text-lg">Top Reviews</h3>
                  <span className="text-xs font-bold text-rose-400 cursor-pointer hover:text-rose-300 hover:underline">See All</span>
                </div>
                <div className="space-y-4">
                  {movie.reviews.map(r => (
                    <div key={r.id} className="glass border border-white/5 bg-[#0F0F14]/40 p-4.5 rounded-xl hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <img src={r.avatar} alt={r.user} className="w-8 h-8 rounded-full bg-slate-800" />
                        <div>
                          <p className="text-xs font-extrabold text-slate-200 leading-none">{r.user}</p>
                          <p className="text-[9px] text-slate-500 font-bold mt-1">{r.date}</p>
                        </div>
                        <div className="ml-auto flex items-center gap-0.5 font-bold text-[10px] bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                          <Star size={9} className="fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="text-yellow-400 font-black">{r.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-medium">{r.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <AnimatePresence>
          {showCopiedToast && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-250 bg-[#0F0F14]/90 backdrop-blur-xl border border-rose-500/30 text-slate-100 px-5 py-3.5 rounded-2xl shadow-[0_10px_40px_rgba(244,63,94,0.25)] flex items-center gap-3"
            >
              <div className="w-6 h-6 rounded-full bg-rose-500/20 flex items-center justify-center border border-rose-500/30 text-rose-400">
                <CheckCircle2 size={14} className="text-glow-rose" />
              </div>
              <span className="font-extrabold text-sm tracking-wide">Sharing Link Copied to Clipboard!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
