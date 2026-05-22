import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import QRCode from 'react-qr-code';
import { Movie, Theater, Showtime, BookingState } from '../types';
import { CheckCircle2, MapPin, Calendar, Clock, ChevronRight, CreditCard, Smartphone, Wallet } from 'lucide-react';

interface CheckoutProps {
  bookingState: BookingState;
  movie: Movie;
  theater: Theater;
  showtime: Showtime;
  onConfirm: () => void;
}

const getGoogleMapsLink = (tName: string, tCity: string) => {
  if (tCity === 'Doddaballapur') {
    return 'https://www.google.com/maps/@13.2939776,77.5258112,14z?entry=ttu&g_ep=EgoyMDI2MDUxMy4wIKXMDSoASAFQAw%3D%3D';
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tName + ' ' + tCity)}`;
};

export function Checkout({ bookingState, movie, theater, showtime, onConfirm }: CheckoutProps) {
  const { selectedSeats, totalAmount, convenienceFee } = bookingState;
  
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'PAYPAL' | null>('UPI');
  const [upiSelected, setUpiSelected] = useState<'PHONEPE' | 'GPAY' | 'PAYTM'>('PHONEPE');

  // Promo code states
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  useEffect(() => {
    const autoCode = sessionStorage.getItem('active_promo_code');
    if (autoCode) {
      setPromoCode(autoCode);
    }
  }, []);

  const handleApplyPromo = () => {
    setPromoError(null);
    const code = promoCode.toUpperCase().trim();
    if (!code) return;
    
    if (code === 'MOVIESTARBOGO') {
      if (selectedSeats.length < 2) {
        setPromoError('BOGO requires at least 2 tickets!');
        setDiscount(0);
        setAppliedPromo(null);
        return;
      }
      const freeSeatPrice = selectedSeats[0].price;
      setDiscount(freeSeatPrice);
      setAppliedPromo(code);
    } else if (code === 'ICICI50') {
      const half = Math.floor(totalAmount * 0.5);
      const capped = Math.min(half, 250);
      setDiscount(capped);
      setAppliedPromo(code);
    } else if (code === 'CASHBACK100') {
      setDiscount(Math.min(totalAmount, 100));
      setAppliedPromo(code);
    } else if (code === 'SBIEXTREME') {
      setDiscount(Math.floor(totalAmount * 0.2));
      setAppliedPromo(code);
    } else {
      setPromoError('Invalid coupon code!');
      setDiscount(0);
      setAppliedPromo(null);
    }
  };

  const finalAmount = Math.max(0, totalAmount + convenienceFee - discount);

  const handlePay = () => {
    setProcessing(true);
    // Clear promo code on successful checkout
    sessionStorage.removeItem('active_promo_code');
    setTimeout(() => {
      onConfirm();
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#09090C] min-h-screen py-10 px-4 text-slate-200"
    >
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Left Column: Form & Contact */}
        <div className="w-full md:w-2/3 space-y-6">
          <div className="glass rounded-2xl border border-white/5 overflow-hidden shadow-xl">
             <div className="bg-white/2 px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-extrabold text-white tracking-tight">Share Contact Details</h3>
                <span className="text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-md">Required</span>
             </div>
             <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    defaultValue="gamerzo142009@gmail.com"
                    className="w-full bg-[#12121A] border border-white/5 rounded-xl p-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5">Phone Number</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-white/5 bg-[#1C1C29] text-slate-300 font-semibold text-sm">+91</span>
                    <input
                      type="text"
                      placeholder="9876543210"
                      className="flex-1 block w-full bg-[#12121A] rounded-none rounded-r-xl border border-white/5 p-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 outline-none transition-all"
                    />
                  </div>
                </div>
             </div>
          </div>

          <div className="glass rounded-2xl border border-white/5 overflow-hidden shadow-xl">
            <div className="bg-white/2 px-6 py-4 border-b border-white/5">
              <h3 className="font-extrabold text-white tracking-tight">Payment Methods</h3>
            </div>
            <div className="flex flex-col md:flex-row border-b border-white/5">
              {/* Payment Methods Sidebar */}
              <div className="w-full md:w-1/3 bg-white/1 border-r border-white/5">
                <button 
                  onClick={() => setPaymentMethod('UPI')}
                  className={`w-full text-left px-5 py-4 border-l-4 transition-all font-bold flex items-center gap-3 cursor-pointer ${paymentMethod === 'UPI' ? 'border-rose-500 bg-white/3 text-white' : 'border-transparent text-slate-400 hover:bg-white/1 hover:text-white'}`}
                >
                  <Smartphone size={18} /> UPI
                </button>
                <button 
                  onClick={() => setPaymentMethod('CARD')}
                  className={`w-full text-left px-5 py-4 border-l-4 transition-all font-bold flex items-center gap-3 cursor-pointer ${paymentMethod === 'CARD' ? 'border-rose-500 bg-white/3 text-white' : 'border-transparent text-slate-400 hover:bg-white/1 hover:text-white'}`}
                >
                  <CreditCard size={18} /> Debit/Credit Card
                </button>
                <button 
                  onClick={() => setPaymentMethod('PAYPAL')}
                  className={`w-full text-left px-5 py-4 border-l-4 transition-all font-bold flex items-center gap-3 cursor-pointer ${paymentMethod === 'PAYPAL' ? 'border-rose-500 bg-white/3 text-white' : 'border-transparent text-slate-400 hover:bg-white/1 hover:text-white'}`}
                >
                  <Wallet size={18} /> PayPal
                </button>
              </div>

              {/* Payment Method Details */}
              <div className="w-full md:w-2/3 p-6 bg-transparent min-h-[250px]">
                {paymentMethod === 'UPI' && (
                  <div className="animate-fade-scale">
                    <h4 className="font-extrabold text-white mb-4">Pay by UPI App</h4>
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <button 
                        onClick={() => setUpiSelected('PHONEPE')}
                        className={`border rounded-xl p-3.5 text-center transition-all cursor-pointer ${upiSelected === 'PHONEPE' ? 'border-rose-500 bg-rose-500/10 ring-1 ring-rose-500 text-white' : 'border-white/5 bg-white/2 hover:bg-white/4 text-slate-300'}`}
                      >
                        <div className="w-10 h-10 mx-auto bg-purple-600 rounded-full flex items-center justify-center text-white font-bold mb-2">Pe</div>
                        <span className="text-xs font-semibold">PhonePe</span>
                      </button>
                      <button 
                        onClick={() => setUpiSelected('GPAY')}
                        className={`border rounded-xl p-3.5 text-center transition-all cursor-pointer ${upiSelected === 'GPAY' ? 'border-rose-500 bg-rose-500/10 ring-1 ring-rose-500 text-white' : 'border-white/5 bg-white/2 hover:bg-white/4 text-slate-300'}`}
                      >
                        <div className="w-10 h-10 mx-auto bg-white rounded-full flex items-center justify-center font-bold mb-2 shadow-[0_0_12px_rgba(255,255,255,0.15)]"><span className="text-blue-500">G</span><span className="text-red-500">P</span><span className="text-yellow-500">a</span><span className="text-green-500">y</span></div>
                        <span className="text-xs font-semibold">Google Pay</span>
                      </button>
                      <button 
                        onClick={() => setUpiSelected('PAYTM')}
                        className={`border rounded-xl p-3.5 text-center transition-all cursor-pointer ${upiSelected === 'PAYTM' ? 'border-rose-500 bg-rose-500/10 ring-1 ring-rose-500 text-white' : 'border-white/5 bg-white/2 hover:bg-white/4 text-slate-300'}`}
                      >
                        <div className="w-10 h-10 mx-auto bg-[#002970] border border-sky-900 rounded-full flex items-center justify-center text-white text-xs font-bold mb-2">Paytm</div>
                        <span className="text-xs font-semibold">Paytm</span>
                      </button>
                    </div>
                    
                    <div className="relative flex items-center py-2">
                       <div className="grow border-t border-white/5"></div>
                       <span className="shrink-0 mx-4 text-slate-500 text-xs font-bold uppercase tracking-wider">Or Enter UPI ID</span>
                       <div className="grow border-t border-white/5"></div>
                    </div>
                    
                    <div className="mt-4">
                      <input
                        type="text"
                        placeholder="example@upi"
                        className="w-full bg-[#12121A] border border-white/5 rounded-xl p-3 text-white focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                )}
                
                {paymentMethod === 'CARD' && (
                  <div className="animate-fade-scale space-y-4">
                    <h4 className="font-extrabold text-white mb-2">Enter Card Details</h4>
                    <div>
                      <input
                        type="text"
                        placeholder="Card Number"
                        className="w-full bg-[#12121A] border border-white/5 rounded-xl p-3 text-white focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 outline-none transition-all"
                      />
                    </div>
                    <div className="flex gap-4">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-1/2 bg-[#12121A] border border-white/5 rounded-xl p-3 text-white focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 outline-none transition-all"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        className="w-1/2 bg-[#12121A] border border-white/5 rounded-xl p-3 text-white focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Name on Card"
                        className="w-full bg-[#12121A] border border-white/5 rounded-xl p-3 text-white focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'PAYPAL' && (
                  <div className="animate-fade-scale flex flex-col items-center justify-center h-full text-center py-6">
                    <div className="w-16 h-16 bg-[#003087] rounded-2xl flex items-center justify-center text-white font-serif italic font-black text-4xl mb-4 shadow-lg shadow-[#003087]/20 border border-blue-500/30">
                      P
                    </div>
                    <h4 className="font-extrabold text-white mb-2">Checkout with PayPal</h4>
                    <p className="text-sm text-slate-400 mb-6 max-w-sm">You will be redirected to PayPal to complete your purchase securely.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl border border-white/5 p-6 flex items-start gap-4 shadow-xl">
            <div className="mt-1 bg-emerald-500/10 text-emerald-400 p-2.5 rounded-full border border-emerald-500/20 hidden sm:block"><CheckCircle2 size={22} /></div>
            <div>
              <h4 className="font-extrabold text-white mb-1">Cancellation Policy</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Tickets can be cancelled up to 4 hours before the showtime for a 75% refund. 
                Convenience fees are non-refundable. Booking is bound by Terms and Conditions.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="w-full md:w-1/3">
          <div className="glass rounded-2xl border border-white/10 overflow-hidden shadow-2xl sticky top-24">
            <div className="p-6 border-b border-white/10 bg-linear-to-br from-rose-950/40 via-[#0F0F16] to-[#0A0A10]">
              <h3 className="font-black text-xl mb-1 tracking-tight text-glow-rose">{movie.title}</h3>
              <p className="text-xs text-rose-400 font-bold mb-4 tracking-wider uppercase">{movie.language} • {movie.format}</p>
              
              <div className="space-y-2.5 text-sm text-slate-300">
                <p className="flex items-start gap-2.5">
                  <MapPin size={15} className="text-rose-500 shrink-0 mt-0.5" /> 
                  <span className="font-medium">
                    <a 
                      href={getGoogleMapsLink(theater.name, theater.city)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-rose-400 transition-colors underline decoration-rose-500/30 underline-offset-4"
                    >
                      {theater.name}
                    </a>
                  </span>
                </p>
                <p className="flex items-center gap-2.5"><Calendar size={15} className="text-rose-500 shrink-0" /> <span className="font-medium">{showtime.date}</span></p>
                <p className="flex items-center gap-2.5"><Clock size={15} className="text-rose-500 shrink-0" /> <span className="font-medium">{showtime.time}</span></p>
              </div>
            </div>

            <div className="p-6 bg-[#0B0B12]/80 space-y-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-extrabold text-white text-lg tracking-tight">{selectedSeats.map(s => s.id).join(', ')}</p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">M-Ticket • {selectedSeats.length} Tickets</p>
                </div>
                <span className="font-extrabold text-white text-lg">Rs. {totalAmount}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">+ Convenience fees</span>
                <span className="font-bold text-white">Rs. {convenienceFee}</span>
              </div>

              {/* Promo Code Redemption UI */}
              <div className="border-t border-white/5 pt-4 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Promo Code / Offer</span>
                  {appliedPromo && <span className="text-emerald-400 font-extrabold">Applied!</span>}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="bg-[#12121A] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-rose-500 w-full font-mono uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-rose-500 text-[10px] font-bold mt-1">{promoError}</p>}
                {appliedPromo && (
                  <p className="text-emerald-400 text-[10px] font-medium mt-1">
                    Discount of Rs. {discount} applied from code {appliedPromo}
                  </p>
                )}
              </div>

              <hr className="border-dashed border-white/10 my-4" />

              {discount > 0 && (
                <div className="flex justify-between text-sm text-emerald-400 font-bold mb-2">
                  <span>Promo Discount</span>
                  <span>- Rs. {discount}</span>
                </div>
              )}

              <div className="flex justify-between items-center pb-2">
                <span className="text-slate-300 font-bold text-base">Sub Total</span>
                <span className="font-black text-rose-500 text-2xl text-glow-rose">Rs. {finalAmount}</span>
              </div>

              <button 
                onClick={handlePay}
                disabled={processing || !paymentMethod}
                className={`w-full font-extrabold py-4 px-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 cursor-pointer ${
                  processing || !paymentMethod
                    ? 'bg-slate-800 text-slate-500 cursor-wait'
                    : 'bg-linear-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white hover:shadow-rose-600/30 hover:scale-102'
                }`}
              >
                {processing ? (
                  <>Processing Payment...</>
                ) : (
                  <>Pay Rs. {finalAmount} <ChevronRight size={18} /></>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}


export function TicketConfirmation({ bookingState, movie, theater, showtime }: Omit<CheckoutProps, 'onConfirm'>) {
  const mockBookingId = Math.random().toString(36).substring(2, 10).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen bg-[#09090C] py-16 px-4 flex justify-center items-start text-slate-200"
    >
      <div className="max-w-md w-full relative drop-shadow-[0_20px_50px_rgba(0,0,0,0.85)] filter">
        
        {/* Ticket Body */}
        <div className="glass-dark border border-white/10 rounded-3xl overflow-hidden relative">
          
          {/* Success Banner */}
          <div className="bg-linear-to-r from-emerald-600 to-teal-600 p-6 text-center text-white relative border-b border-white/5">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.3)]">
               <CheckCircle2 size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-black tracking-tight">Booking Confirmed!</h2>
            <p className="text-emerald-100 text-xs font-bold mt-1.5 tracking-widest uppercase bg-black/15 py-1 px-3 rounded-full inline-block">BKG-ID: {mockBookingId}</p>
          </div>

          {/* Upper Section */}
          <div className="p-8 pb-6 text-center">
            <img src={movie.poster} alt={movie.title} className="w-20 h-28 object-cover rounded-xl mx-auto shadow-xl border border-white/10 mb-4 hover:scale-105 transition-transform duration-300" />
            <h3 className="font-black text-2xl text-white mb-1.5 tracking-tight text-glow-rose">{movie.title}</h3>
            <p className="text-xs font-extrabold text-slate-400 tracking-wider uppercase">{movie.language} • {movie.format}</p>
          </div>

          {/* Perforation Bite-marks and Dashed Line */}
          <div className="absolute top-[358px] -left-4 w-8 h-8 bg-[#09090C] rounded-full border border-white/10 z-10" />
          <div className="absolute top-[358px] -right-4 w-8 h-8 bg-[#09090C] rounded-full border border-white/10 z-10" />
          <div className="absolute top-[372px] left-6 right-6 border-t-2 border-dashed border-white/10 z-10" />

          {/* Lower Section (Stub details) */}
          <div className="p-8 pt-10 text-center">
            
            <div className="grid grid-cols-2 gap-y-5 gap-x-4 text-left border-b border-white/5 pb-6 mb-6">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-extrabold tracking-widest mb-0.5">Date</p>
                <p className="font-black text-white text-sm">{showtime.date}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-extrabold tracking-widest mb-0.5">Time</p>
                <p className="font-black text-white text-sm">{showtime.time}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] text-slate-500 uppercase font-extrabold tracking-widest mb-0.5">Theater</p>
                <p className="font-black text-white text-sm">
                  <a 
                    href={getGoogleMapsLink(theater.name, theater.city)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-rose-400 transition-colors underline decoration-rose-500/30 underline-offset-4"
                  >
                    {theater.name}
                  </a>
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] text-slate-500 uppercase font-extrabold tracking-widest mb-0.5">Seats ({bookingState.selectedSeats.length})</p>
                <p className="font-black text-rose-500 text-lg text-glow-rose">{bookingState.selectedSeats.map(s => s.id).join(', ')}</p>
              </div>
            </div>

            {/* Barcode/QR Stub */}
            <div className="flex justify-center mb-6">
               <div className="p-3.5 bg-white rounded-2xl shadow-xl border-4 border-slate-900 inline-block animate-pulse-glow">
                  <QRCode 
                    value={JSON.stringify({
                      bookingId: mockBookingId,
                      movie: movie.title,
                      date: showtime.date,
                      time: showtime.time,
                      theater: theater.name,
                      seats: bookingState.selectedSeats.map(s => s.id).join(', ')
                    })}
                    size={120} 
                  />
               </div>
            </div>

            <button 
              onClick={() => window.location.reload()} 
              className="bg-white/4 text-rose-400 border border-rose-500/20 hover:bg-rose-500/10 font-extrabold text-sm w-full py-3.5 rounded-xl transition-all cursor-pointer text-center block"
            >
              Return to Home
            </button>
          </div>
          
        </div>
      </div>
    </motion.div>
  );
}
