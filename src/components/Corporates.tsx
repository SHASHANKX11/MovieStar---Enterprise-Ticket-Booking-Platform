import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Gift, Building2, Calculator, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';

interface CorporatesProps {
  onBack: () => void;
}

export default function Corporates({ onBack }: CorporatesProps) {
  const [vouchersCount, setVouchersCount] = useState(50);
  const [faceValue, setFaceValue] = useState(250);
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Math variables
  const rawTotal = vouchersCount * faceValue;
  const discountPercent = vouchersCount >= 200 ? 15 : vouchersCount >= 100 ? 10 : vouchersCount >= 50 ? 5 : 0;
  const discountAmount = Math.floor(rawTotal * (discountPercent / 100));
  const finalPrice = rawTotal - discountAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !email) return;
    
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 text-slate-100 min-h-[80vh]">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <span className="text-xs font-black text-rose-500 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
          B2B Solutions
        </span>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-white tracking-tight">
          MovieStar <span className="text-rose-500 text-glow-rose">Corporate</span> Vouchers
        </h1>
        <p className="text-slate-400 mt-2 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          Reward your employees, delight your business clients, and coordinate seamless bulk bookings with custom discount solutions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Columns: Product features & calculator */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Bulk Tickets', desc: 'Pre-book complete auditoriums for private premieres and team outings.', icon: Users },
              { title: 'Brand Rewards', desc: 'Digital vouchers for customer loyalty campaigns and rewards.', icon: Gift },
              { title: 'Custom API', desc: 'Plug voucher generation directly into your corporate HR portal.', icon: Building2 }
            ].map((f, idx) => (
              <div key={idx} className="glass p-5 rounded-2xl border border-white/5 bg-[#0F0F14]/30">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
                  <f.icon size={20} />
                </div>
                <h3 className="font-extrabold text-white text-base mb-1.5">{f.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Interactive Calculator */}
          <div className="glass p-6 md:p-8 rounded-3xl border border-white/5 bg-[#0F0F14]/40">
            <h2 className="text-xl font-black text-white flex items-center gap-2 mb-6">
              <Calculator className="text-rose-500" size={20} /> Corporate Bulk Pricing Estimator
            </h2>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-slate-300">Number of Vouchers</label>
                  <span className="font-mono font-black text-rose-400 bg-rose-500/10 px-3 py-1 rounded-md text-xs border border-rose-500/20">{vouchersCount} Qty</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="500" 
                  step="10"
                  value={vouchersCount}
                  onChange={(e) => setVouchersCount(Number(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-bold mt-1.5">
                  <span>10 vouchers</span>
                  <span>100 (10% off)</span>
                  <span>200+ (15% off)</span>
                  <span>500 vouchers</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">Face Value per Voucher</label>
                <div className="grid grid-cols-4 gap-3">
                  {[100, 250, 500, 1000].map(val => (
                    <button
                      key={val}
                      onClick={() => setFaceValue(val)}
                      className={`py-3 rounded-xl border font-bold text-sm cursor-pointer transition-all ${
                        faceValue === val 
                          ? 'bg-rose-500/20 border-rose-500 text-rose-400' 
                          : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/10'
                      }`}
                    >
                      ₹{val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pricing breakdown summary */}
              <div className="bg-black/30 border border-white/5 rounded-2xl p-6 space-y-3.5">
                <div className="flex justify-between text-xs font-bold text-slate-400">
                  <span>Subtotal Cost</span>
                  <span>₹{rawTotal}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-xs font-bold text-green-400">
                    <span>Corporate Discount ({discountPercent}%)</span>
                    <span>- ₹{discountAmount}</span>
                  </div>
                )}
                <hr className="border-white/5" />
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-white text-sm">Estimated Total Price</span>
                  <span className="font-black text-white text-2xl text-glow-rose">₹{finalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: callback request form */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass p-6 md:p-8 rounded-3xl border border-white/5 bg-[#0F0F14]/50 shadow-2xl"
              >
                <h3 className="text-lg font-black text-white mb-1.5">Request callback</h3>
                <p className="text-xs text-slate-400 mb-6 font-medium">Get a custom quotation invoice generated for your corporate account.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-black uppercase text-slate-400 mb-1 tracking-wider">Company Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Acme Corp Ltd"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full bg-[#12121A] border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 text-white outline-none text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase text-slate-400 mb-1 tracking-wider">Corporate Email</label>
                    <input
                      type="email"
                      required
                      placeholder="hr@acme.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#12121A] border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 text-white outline-none text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase text-slate-400 mb-1 tracking-wider">Estimated Quantity</label>
                    <input
                      type="number"
                      disabled
                      value={vouchersCount}
                      className="w-full bg-[#12121A]/50 border border-white/5 rounded-xl p-3 text-slate-400 outline-none text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-linear-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-lg transition-all mt-4 cursor-pointer text-sm flex items-center justify-center gap-2"
                  >
                    {submitting ? 'Sending Request...' : <>Request Quote <ArrowRight size={16} /></>}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-8 rounded-3xl border border-white/10 bg-[#0F0F14]/75 text-center shadow-2xl"
              >
                <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                  <CheckCircle2 size={24} className="animate-pulse" />
                </div>
                <h3 className="font-extrabold text-white text-base">Request Submitted!</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed font-medium">
                  We have received your estimate query for <span className="text-white font-bold">{vouchersCount} vouchers</span> at ₹{faceValue} each. A manager will email <span className="text-slate-300 font-bold">{email}</span> shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="w-full mt-6 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold py-2.5 px-4 rounded-xl text-xs cursor-pointer transition"
                >
                  Create Another Quote
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
