import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Movie, Theater, Showtime, Seat } from '../types';
import { generateSeats } from '../mockData';
import { ChevronRight } from 'lucide-react';

interface SeatSelectionProps {
  movie: Movie;
  theater: Theater;
  showtime: Showtime;
  onCheckout: (selectedSeats: Seat[], totalAmount: number) => void;
}

const TIER_LABELS = { VIP: 'VIP Premium', GOLD: 'Executive', SILVER: 'Standard' };
const TIER_PRICES = { VIP: 600, GOLD: 350, SILVER: 200 };

export default function SeatSelection({ movie, theater, showtime, onCheckout }: SeatSelectionProps) {
  const [seats] = useState<Seat[]>(() => generateSeats());
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);

  const rows = useMemo(() => {
    const map = new Map<string, Seat[]>();
    seats.forEach(s => {
      if (!map.has(s.row)) map.set(s.row, []);
      map.get(s.row)!.push(s);
    });
    return Array.from(map.entries()).map(([rowName, rowSeats]) => ({
      rowName,
      seats: rowSeats.sort((a, b) => a.number - b.number)
    }));
  }, [seats]);

  const toggleSeat = (seat: Seat) => {
    if (seat.status === 'booked') return;
    if (selectedSeatIds.includes(seat.id)) {
      setSelectedSeatIds(prev => prev.filter(id => id !== seat.id));
    } else {
      if (selectedSeatIds.length >= 10) {
        alert('You can select up to 10 seats.');
        return;
      }
      setSelectedSeatIds(prev => [...prev, seat.id]);
    }
  };

  const selectedSeats = seats.filter(s => selectedSeatIds.includes(s.id));
  const totalAmount = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  const getSeatClass = (seat: Seat) => {
    const isSelected = selectedSeatIds.includes(seat.id);
    const isBooked = seat.status === 'booked';

    if (isBooked) return 'bg-[#181824]/40 border-white/5 text-slate-600 cursor-not-allowed opacity-40';

    const tierBase = {
      VIP: isSelected ? 'seat-vip selected' : 'seat-vip',
      GOLD: isSelected ? 'seat-gold selected' : 'seat-gold',
      SILVER: isSelected ? 'seat-silver selected' : 'seat-silver',
    };

    return tierBase[seat.tier] ?? '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#09090C] min-h-screen text-slate-100 pb-32"
    >
      {/* Header Info */}
      <div className="bg-[#0F0F14]/90 border-b border-white/5 p-4 sticky top-16 z-30 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-md">
        <div className="max-w-5xl mx-auto flex justify-between items-start gap-4">
          <div>
            <h2 className="font-black text-white text-lg tracking-tight text-glow-rose">{movie.title}</h2>
            <p className="text-sm text-slate-400 font-medium mt-0.5">{theater.name}</p>
            <p className="text-xs text-rose-500 font-bold mt-0.5">{showtime.date} • {showtime.time} • {showtime.format}</p>
          </div>

          {/* Tier Legend */}
          <div className="hidden md:flex gap-4 text-xs font-semibold shrink-0 text-slate-300">
            <span className="flex items-center gap-1.5">
              <div className="w-4 h-4 bg-amber-400/10 rounded border border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.2)]" /> VIP (₹{TIER_PRICES.VIP})
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-4 h-4 bg-purple-500/10 rounded border border-purple-500/40 shadow-[0_0_8px_rgba(139,92,246,0.2)]" /> Exec (₹{TIER_PRICES.GOLD})
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-4 h-4 bg-emerald-500/10 rounded border border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]" /> Std (₹{TIER_PRICES.SILVER})
            </span>
            <span className="flex items-center gap-1.5 opacity-60">
              <div className="w-4 h-4 bg-[#181824]/40 rounded border border-white/5" /> Sold
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 overflow-x-auto mt-8 scrollbar-none">

        {/* IMAX Screen Graphic */}
        <div className="flex flex-col items-center mb-16 select-none">
          <div className="w-full max-w-2xl relative px-4">
            <div className="h-6 bg-linear-to-b from-rose-500/15 to-transparent rounded-t-[100px] blur-md" />
            <div className="h-1.5 bg-linear-to-r from-rose-600 via-purple-500 to-rose-600 rounded-full shadow-[0_0_20px_rgba(244,63,94,0.75)]" />
          </div>
          <span className="text-[10px] font-black text-slate-400 tracking-[0.4em] uppercase mt-4 text-glow-rose">
            All eyes this way · IMAX CINEMA SCREEN
          </span>
        </div>

        {/* Seat Layout */}
        <div className="flex flex-col gap-3.5 min-w-max mx-auto pb-8" style={{ width: 'fit-content' }}>
          {rows.map(({ rowName, seats: rowSeats }) => {
            const tier = rowSeats[0]?.tier;
            return (
              <div key={rowName} className="flex items-center gap-4 group">
                <div className="w-6 text-center">
                  <span className="text-slate-500 font-bold text-xs">{rowName}</span>
                </div>

                <div className="flex gap-2 justify-center">
                  {rowSeats.map((seat, idx) => {
                    const isAisle = idx === Math.floor(rowSeats.length / 4) || idx === Math.floor(rowSeats.length * 0.75);
                    const isSelected = selectedSeatIds.includes(seat.id);

                    return (
                      <div key={seat.id} className={`flex items-center ${isAisle ? 'mr-6' : ''}`}>
                        <motion.button
                          whileTap={seat.status !== 'booked' ? { scale: 0.85 } : {}}
                          animate={isSelected ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                          onClick={() => toggleSeat(seat)}
                          disabled={seat.status === 'booked'}
                          className={`
                            relative w-7.5 h-7.5 sm:w-8.5 sm:h-8.5 rounded-[6px_6px_3px_3px] flex items-center justify-center text-[9px] sm:text-[10px] font-extrabold transition-all border
                            ${getSeatClass(seat)}
                          `}
                        >
                          <span className={seat.status === 'booked' ? 'hidden' : ''}>{seat.number}</span>
                        </motion.button>
                      </div>
                    );
                  })}
                </div>

                <div className="w-24 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-slate-400 font-semibold">{TIER_LABELS[tier]} · ₹{rowSeats[0]?.price}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tier Info */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 max-w-2xl mx-auto">
          {(['VIP', 'GOLD', 'SILVER'] as const).map(tier => (
            <div key={tier} className="flex-1 glass rounded-2xl p-5 text-center shadow-lg border border-white/5">
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1.5">{TIER_LABELS[tier]}</p>
              <p className="font-black text-white text-xl">₹{TIER_PRICES[tier]}</p>
              <div className={`w-3.5 h-3.5 rounded mx-auto mt-2.5 ${tier === 'VIP' ? 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.4)]' : tier === 'GOLD' ? 'bg-purple-500 shadow-[0_0_8px_rgba(139,92,246,0.4)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Checkout Bar */}
      <AnimatePresence>
        {selectedSeatIds.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 glass-dark border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] z-50 p-4 sm:p-5 backdrop-blur-xl"
          >
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-center sm:text-left">
                <p className="text-xs font-extrabold text-slate-400 mb-2 uppercase tracking-wider">
                  {selectedSeatIds.length} Ticket{selectedSeatIds.length > 1 ? 's' : ''} Selected
                </p>
                <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                  {selectedSeats.map(s => (
                    <span key={s.id} className={`text-xs font-black px-2.5 py-0.5 rounded-md border ${
                      s.tier === 'VIP' ? 'bg-amber-400/10 text-amber-400 border-amber-500/30' :
                      s.tier === 'GOLD' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
                      'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    }`}>
                      {s.id}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-slate-400">Total Amount</p>
                  <p className="text-2xl font-black text-white tracking-tight">₹{totalAmount}</p>
                </div>
                <button
                  onClick={() => onCheckout(selectedSeats, totalAmount)}
                  className="bg-linear-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-extrabold py-3.5 px-8 rounded-xl shadow-lg shadow-rose-600/20 hover:shadow-rose-600/30 transition-all flex items-center gap-2 min-w-[180px] justify-center text-base cursor-pointer hover:scale-102"
                >
                  Pay ₹{totalAmount}
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
