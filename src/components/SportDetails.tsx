import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SportEvent } from '../types';
import { MapPin, Calendar, Clock, Trophy, Share2, Ticket, CheckCircle2 } from 'lucide-react';

interface SportDetailsProps {
  sport: SportEvent;
  onBook: (sport: SportEvent) => void;
}

export default function SportDetails({ sport, onBook }: SportDetailsProps) {
  const [showCopiedToast, setShowCopiedToast] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: sport.title,
      text: `Check out ${sport.title} on MovieStar!`,
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-[#09090C] min-h-screen pb-16 text-slate-100"
    >
      {/* Hero Sport Banner */}
      <div 
        className="relative w-full h-[300px] md:h-[400px] bg-[#0A0A0F] overflow-hidden border-b border-white/5"
      >
        <div 
          className="absolute inset-0 opacity-25 mix-blend-overlay scale-105"
          style={{
            backgroundImage: `url(${sport.bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(3px)'
          }}
        ></div>
        
        <div className="absolute inset-0 bg-linear-to-t from-[#09090C] via-[#09090C]/80 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 text-center md:text-left">
            <div className="w-[120px] md:w-[160px] h-[160px] rounded-xl overflow-hidden border border-white/10 shadow-2xl shrink-0 hidden md:block">
              <img src={sport.poster} alt={sport.title} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 w-full">
              <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-3.5 py-1 rounded-full text-xs font-black shadow-lg shadow-blue-600/20 border border-blue-500/30 uppercase tracking-wide">
                <Trophy size={13} />
                {sport.tournament}
              </div>
              
              <h1 className="text-3xl md:text-5xl font-black text-white mb-3 tracking-tight text-glow-blue">{sport.title}</h1>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
                <div className="flex items-center gap-2 text-slate-300 font-bold text-sm">
                  <Calendar size={15} className="text-blue-400" />
                  {sport.date}
                </div>
                <div className="flex items-center gap-2 text-slate-300 font-bold text-sm">
                  <Clock size={15} className="text-blue-400" />
                  {sport.time}
                </div>
                <div className="flex items-center gap-2 text-slate-300 font-bold text-sm">
                  <MapPin size={15} className="text-blue-400" />
                  {sport.venue}, {sport.city}
                </div>
              </div>

            </div>

            <div className="absolute top-6 right-6 flex gap-3">
               <button 
                 onClick={handleShare}
                 className="w-10 h-10 rounded-full glass-dark border border-white/5 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
               >
                 <Share2 size={18} />
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Details */}
        <div className="flex-1 space-y-8">
          <div className="glass border border-white/5 bg-[#0F0F14]/40 rounded-2xl p-6 md:p-8 shadow-2xl">
            <h3 className="font-extrabold text-white text-xl mb-4">About the Event</h3>
            <p className="text-slate-300 leading-relaxed mb-6 font-medium text-sm">
              {sport.about || `Join us for an exciting ${sport.sportType} match as part of ${sport.tournament}. Book your tickets now and experience the thrill live at the stadium!`}
            </p>

            <h4 className="font-extrabold text-white mb-4 text-base">Key Highlights</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-blue-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300 font-medium">Digital Tickets (M-Ticket) Supported</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-blue-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300 font-medium">Exclusive F&B combos available</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-blue-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300 font-medium">Official Team Merchandise Stalls</span>
              </div>
            </div>
          </div>

          <div className="glass border border-white/5 bg-[#0F0F14]/40 rounded-2xl p-6 shadow-2xl">
            <h3 className="font-extrabold text-white text-lg mb-4">Venue Guidelines</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-slate-300 font-medium">
              <li>Please carry a valid ID proof along with your ticket.</li>
              <li>Outside food and beverages are strictly prohibited inside the stadium.</li>
              <li>Bags, laptops, power banks, and other electronic equipment may not be permitted.</li>
              <li>Gates open 2 hours before the scheduled match time.</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Checkout/Booking panel */}
        <div className="w-full lg:w-[380px] shrink-0">
          <div className="glass border border-white/5 bg-[#0F0F14]/60 p-6 rounded-2xl shadow-2xl sticky top-24">
            <h3 className="font-extrabold text-2xl text-white mb-2">Book Tickets</h3>
            <p className="text-sm font-black text-blue-400 text-glow-blue mb-6">{sport.priceRange}</p>

            <div className="space-y-4 mb-6">
               <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Match</p>
                 <p className="font-bold text-slate-200">{sport.teams.join(' vs ')}</p>
               </div>
               
               <div className="flex gap-4">
                 <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex-1">
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Date</p>
                   <p className="font-bold text-slate-200 text-sm">{sport.date}</p>
                 </div>
                 <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex-1">
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Time</p>
                   <p className="font-bold text-slate-200 text-sm">{sport.time}</p>
                 </div>
               </div>
            </div>

            <button 
              onClick={() => onBook(sport)}
              className="w-full bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-extrabold py-4 px-6 rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:scale-102 transition-all flex justify-center items-center gap-2 text-lg cursor-pointer animate-float"
            >
              <Ticket size={22} />
              Book Tickets Now
            </button>
            <p className="text-center text-[10px] text-slate-500 font-bold mt-4">By booking, you agree to our Terms & Conditions</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showCopiedToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-250 bg-[#0F0F14]/90 backdrop-blur-xl border border-blue-500/30 text-slate-100 px-5 py-3.5 rounded-2xl shadow-[0_10px_40px_rgba(59,130,246,0.25)] flex items-center gap-3"
          >
            <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30 text-blue-400">
              <CheckCircle2 size={14} className="text-glow-blue" />
            </div>
            <span className="font-extrabold text-sm tracking-wide">Sharing Link Copied to Clipboard!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
