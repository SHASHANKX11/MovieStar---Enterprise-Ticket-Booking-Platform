import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Tag, Check, Copy, ArrowLeft } from 'lucide-react';

interface OffersProps {
  onBack: () => void;
}

const COUPONS = [
  {
    code: 'MOVIESTARBOGO',
    title: 'Buy 1 Get 1 Free',
    description: 'Get a free second ticket when booking 2 or more seats using any debit card.',
    badge: 'Trending Offer',
    discountDesc: '50% off (upto ₹300)',
    accent: 'from-rose-500 to-orange-500'
  },
  {
    code: 'ICICI50',
    title: '50% Off up to ₹250',
    description: 'Applicable on ICICI Bank Signature & Coral credit card bookings.',
    badge: 'Bank Exclusive',
    discountDesc: '50% off (upto ₹250)',
    accent: 'from-blue-500 to-sky-500'
  },
  {
    code: 'CASHBACK100',
    title: 'Flat ₹100 Cash Back',
    description: 'Pay via Amazon Pay balance to secure a flat discount on checkout.',
    badge: 'Wallet Offer',
    discountDesc: 'Flat ₹100 Off',
    accent: 'from-emerald-500 to-teal-500'
  },
  {
    code: 'SBIEXTREME',
    title: '20% IMAX Discount',
    description: 'Special 20% discount on IMAX & 4DX format tickets with SBI Elite Cards.',
    badge: 'Premium Screen',
    discountDesc: '20% off total',
    accent: 'from-purple-500 to-pink-500'
  }
];

export default function Offers({ onBack }: OffersProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      
      // Store in session storage so it can be picked up during payment checkout!
      sessionStorage.setItem('active_promo_code', code);
      
      setTimeout(() => {
        setCopiedCode(null);
      }, 2500);
    } catch (e) {
      console.error('Failed to copy code:', e);
    }
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
          Promotions
        </span>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-white tracking-tight">
          Offers & <span className="text-rose-500 text-glow-rose">Discounts</span>
        </h1>
        <p className="text-slate-400 mt-2 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          Grab exclusive coupon codes. Copy any code below, and apply it directly on the payment checkout screen to watch your pricing melt away!
        </p>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {COUPONS.map((coupon, idx) => {
          const isCopied = copiedCode === coupon.code;
          return (
            <div 
              key={idx}
              className="glass rounded-3xl border border-white/5 bg-[#0F0F14]/40 overflow-hidden flex flex-col justify-between hover:border-white/10 transition-colors shadow-xl relative group"
            >
              {/* Highlight Gradient Accent Top Border */}
              <div className={`h-1.5 w-full bg-linear-to-r ${coupon.accent}`} />
              
              <div className="p-6 md:p-8 space-y-4">
                <div className="flex justify-between items-start">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300`}>
                    {coupon.badge}
                  </span>
                  <span className="text-xs font-black text-emerald-400">{coupon.discountDesc}</span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-extrabold text-white text-xl tracking-tight flex items-center gap-2">
                    <Tag size={18} className="text-rose-500 shrink-0" />
                    {coupon.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    {coupon.description}
                  </p>
                </div>

                {/* Perforated ticket stub border divider */}
                <div className="relative flex items-center justify-between my-2">
                  <div className="w-4 h-4 bg-[#09090C] rounded-full border border-white/5 -left-8 absolute" />
                  <div className="w-full border-t border-dashed border-white/5" />
                  <div className="w-4 h-4 bg-[#09090C] rounded-full border border-white/5 -right-8 absolute" />
                </div>

                <div className="flex items-center gap-3 bg-black/40 rounded-xl p-3.5 border border-white/5 relative justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest">Promo Code</span>
                    <span className="font-mono text-sm font-black text-white">{coupon.code}</span>
                  </div>

                  <button
                    onClick={() => handleCopyCode(coupon.code)}
                    className={`flex items-center gap-1.5 py-2 px-4 rounded-lg font-bold text-xs cursor-pointer transition-all border-none ${
                      isCopied 
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                        : 'bg-rose-600 text-white hover:bg-rose-500 shadow-md shadow-rose-600/10'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check size={13} /> Applied
                      </>
                    ) : (
                      <>
                        <Copy size={13} /> Copy Code
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <AnimatePresence>
                {isCopied && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500/90 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg border border-emerald-400/20 z-10"
                  >
                    Voucher Linked to Checkout!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      
      {/* Helpful Info banner */}
      <div className="mt-12 bg-white/2 border border-white/5 rounded-2xl p-6 flex gap-4 items-start max-w-3xl mx-auto">
        <div className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/20">
          <Gift size={16} />
        </div>
        <div>
          <h4 className="font-extrabold text-sm text-white">How do I redeem my discounts?</h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed font-medium">
            Simply click "Copy Code" on any offer card. Once copied, navigate to a movie or sports match, pick your recliners, and click checkout. You will find an interactive "Apply Promo Code" field in the order breakdown panel where you can apply your copied code!
          </p>
        </div>
      </div>
    </div>
  );
}
