import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Ticket, ArrowLeft, ArrowRight, Tv, Sparkles, Trophy } from 'lucide-react';
import { MOVIES, LIVE_EVENTS, SPORT_EVENTS, saveMoviesToStorage } from '../mockData';
import { Movie, LiveEvent, SportEvent } from '../types';

interface ListYourShowProps {
  onBack: () => void;
  city: string;
}

const PRESET_POSTERS = [
  'https://images.unsplash.com/photo-1540039155732-684735035727?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1518659616233-ff10fef4cc41?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&q=80&w=400',
];

export default function ListYourShow({ onBack, city }: ListYourShowProps) {
  const [step, setStep] = useState(1);
  const [eventType, setEventType] = useState<'MOVIE' | 'EVENT' | 'PLAY' | 'SPORT'>('EVENT');
  
  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('07:30 PM');
  const [venue, setVenue] = useState('');
  const [eventCity, setEventCity] = useState(city || 'Bengaluru');
  const [price, setPrice] = useState('');
  const [poster, setPoster] = useState(PRESET_POSTERS[0]);
  const [description, setDescription] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [generatedId, setGeneratedId] = useState('');

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !venue || !price) return;
    
    setSubmitting(true);
    setTimeout(() => {
      const id = 'LYS-' + Math.floor(100000 + Math.random() * 900000);
      setGeneratedId(id);
      
      if (eventType === 'MOVIE') {
        const newMovie: Movie = {
          id,
          title,
          genre: category ? category.split(',').map(s => s.trim()) : ['Drama'],
          language: 'Hindi / English',
          languages: ['Hindi', 'English'],
          format: '2D / 3D',
          duration: '2h 15m',
          certificate: 'UA',
          poster,
          bgImage: poster,
          rating: 0.0,
          votes: '0',
          releaseDate: date || 'Live Now',
          synopsis: description || 'No description provided.',
        };
        MOVIES.unshift(newMovie);
        saveMoviesToStorage();
      } else if (eventType === 'SPORT') {
        const newSport: SportEvent = {
          id,
          title,
          tournament: category || 'Local Tournament',
          sportType: category || 'Cricket',
          teams: [title, 'Opponent Team'],
          date: date || 'Coming Soon',
          time,
          venue,
          city: eventCity,
          priceRange: `Rs. ${price} onwards`,
          poster,
          bgImage: poster,
          about: description || 'Exciting live match.'
        };
        SPORT_EVENTS.unshift(newSport);
      } else {
        // EVENT or PLAY
        const newEvent: LiveEvent = {
          id,
          title,
          category: eventType === 'PLAY' ? 'Theatre' : (category || 'Music Shows'),
          date: date || 'Coming Soon',
          venue,
          city: eventCity,
          price: `Rs. ${price} onwards`,
          poster
        };
        LIVE_EVENTS.unshift(newEvent);
      }
      
      setSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-slate-100 min-h-[80vh] flex flex-col justify-center">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <span className="text-xs font-black text-rose-500 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
          Organizer Portal
        </span>
      </div>

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div 
            key="form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="glass rounded-3xl border border-white/5 overflow-hidden shadow-2xl bg-[#0F0F14]/40"
          >
            <div className="bg-linear-to-r from-rose-600/10 to-purple-600/10 p-8 border-b border-white/5 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
                  List Your <span className="text-rose-500 text-glow-rose">Show</span> <Sparkles className="text-yellow-400" size={24} />
                </h1>
                <p className="text-sm text-slate-400 mt-1">Submit your movie, play, concert, or sports event to our local databases</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-500 block uppercase">Progress</span>
                <span className="text-2xl font-black text-white">{step}/3</span>
              </div>
            </div>

            <div className="p-8">
              {/* Stepper Header */}
              <div className="flex items-center justify-between mb-8 max-w-md mx-auto">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${step >= 1 ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30' : 'bg-white/5 text-slate-400'}`}>1</div>
                <div className={`flex-1 h-0.5 mx-2 ${step >= 2 ? 'bg-rose-600' : 'bg-white/5'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${step >= 2 ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30' : 'bg-white/5 text-slate-400'}`}>2</div>
                <div className={`flex-1 h-0.5 mx-2 ${step >= 3 ? 'bg-rose-600' : 'bg-white/5'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${step >= 3 ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30' : 'bg-white/5 text-slate-400'}`}>3</div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {step === 1 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Select Show Type</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { type: 'EVENT', label: 'Concert/Show', icon: Sparkles },
                          { type: 'MOVIE', label: 'Movie Premiere', icon: Tv },
                          { type: 'PLAY', label: 'Theatre Play', icon: Ticket },
                          { type: 'SPORT', label: 'Sports Event', icon: Trophy }
                        ].map(item => (
                          <button
                            key={item.type}
                            type="button"
                            onClick={() => {
                              setEventType(item.type as 'EVENT' | 'MOVIE' | 'PLAY' | 'SPORT');
                              if (item.type === 'PLAY') setCategory('Theatre');
                              else if (item.type === 'SPORT') setCategory('Cricket');
                            }}
                            className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-3 ${
                              eventType === item.type 
                                ? 'bg-rose-600/20 border-rose-500 text-rose-300' 
                                : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                            }`}
                          >
                            <item.icon size={24} />
                            <span className="text-xs font-bold">{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Show Title / Name</label>
                        <input
                          type="text"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder={eventType === 'SPORT' ? 'RCB vs CSK' : 'Live Unplugged Music Night'}
                          className="w-full bg-[#12121A] border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 text-white outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                          {eventType === 'MOVIE' ? 'Genres (comma-separated)' : 'Category / Genre'}
                        </label>
                        <input
                          type="text"
                          required
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          placeholder={eventType === 'MOVIE' ? 'Action, Thriller' : eventType === 'PLAY' ? 'Theatre' : 'Music Shows'}
                          disabled={eventType === 'PLAY'}
                          className="w-full bg-[#12121A] border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 text-white outline-none transition-all disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Select Target City</label>
                      <select 
                        value={eventCity}
                        onChange={(e) => setEventCity(e.target.value)}
                        className="w-full bg-[#12121A] border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 text-white outline-none transition-all"
                      >
                        <option value="Bengaluru">Bengaluru</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Delhi-NCR">Delhi-NCR</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Doddaballapur">Doddaballapur</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Venue Address</label>
                      <input
                        type="text"
                        required
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                        placeholder="Chowdiah Memorial Hall, Malleshwaram"
                        className="w-full bg-[#12121A] border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 text-white outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Date (e.g. Sat, 28 Oct)</label>
                      <input
                        type="text"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        placeholder="Sat, 28 Oct"
                        className="w-full bg-[#12121A] border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 text-white outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Time (e.g. 07:30 PM)</label>
                      <input
                        type="text"
                        required
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        placeholder="07:30 PM"
                        className="w-full bg-[#12121A] border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 text-white outline-none transition-all"
                      />
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Base Ticket Price (in Rs.)</label>
                        <input
                          type="number"
                          required
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="499"
                          className="w-full bg-[#12121A] border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 text-white outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Poster Artwork (Unsplash preset or URL)</label>
                        <input
                          type="text"
                          required
                          value={poster}
                          onChange={(e) => setPoster(e.target.value)}
                          className="w-full bg-[#12121A] border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 text-white outline-none transition-all text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Preset Suggestions</label>
                      <div className="flex gap-4">
                        {PRESET_POSTERS.map((p, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setPoster(p)}
                            className={`w-16 h-20 rounded-lg overflow-hidden border-2 cursor-pointer transition ${poster === p ? 'border-rose-500' : 'border-transparent opacity-60 hover:opacity-100'}`}
                          >
                            <img src={p} className="w-full h-full object-cover" alt="" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">About / Description</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Add some details about the show, guidelines, or features..."
                        rows={3}
                        className="w-full bg-[#12121A] border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 text-white outline-none transition-all resize-none text-sm"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Footer Controls */}
                <div className="flex justify-between items-center pt-6 border-t border-white/5 mt-6">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="bg-white/5 hover:bg-white/10 text-white font-extrabold px-6 py-3 rounded-xl transition flex items-center gap-2 cursor-pointer text-sm"
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                  ) : (
                    <div />
                  )}

                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold px-6 py-3 rounded-xl transition flex items-center gap-2 cursor-pointer text-sm shadow-lg shadow-rose-600/20"
                    >
                      Next Step <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={submitting}
                      className="bg-linear-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-extrabold px-8 py-3 rounded-xl transition flex items-center gap-2 cursor-pointer text-sm shadow-lg shadow-rose-600/30"
                    >
                      {submitting ? 'Submitting Details...' : 'Submit & List Live'}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-3xl border border-white/10 p-12 text-center max-w-xl mx-auto shadow-2xl bg-[#0F0F14]/60"
          >
            <div className="w-20 h-20 bg-rose-600/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-500/20 shadow-[0_0_30px_rgba(244,63,94,0.3)]">
              <CheckCircle2 size={40} className="animate-pulse" />
            </div>
            
            <h2 className="text-3xl font-black text-white tracking-tight">Show Successfully Listed!</h2>
            <p className="text-sm text-slate-400 mt-2">
              Your show has been processed and injected directly into our session database storage with ID: 
              <span className="font-mono text-rose-400 font-extrabold ml-1.5">{generatedId}</span>
            </p>

            <div className="bg-white/2 border border-white/5 rounded-2xl p-6 my-8 text-left space-y-3">
              <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                <span className="text-slate-500">Show Name</span>
                <span className="text-white font-bold">{title}</span>
              </div>
              <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                <span className="text-slate-500">Venue</span>
                <span className="text-white font-bold">{venue}, {eventCity}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Pricing</span>
                <span className="text-green-400 font-extrabold">Rs. {price} onwards</span>
              </div>
            </div>

            <button
              onClick={onBack}
              className="w-full bg-linear-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-extrabold py-4 px-6 rounded-xl shadow-lg transition-all cursor-pointer"
            >
              Go to Homepage & Browse Show
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
