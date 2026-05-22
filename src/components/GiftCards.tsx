import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check, ArrowLeft, ArrowRight, CircleCheck, Ticket } from 'lucide-react';

interface GiftCardsProps {
  onBack: () => void;
}

const THEMES = [
  { id: 'BIRTHDAY', label: 'Birthday Bash', desc: 'Happy Birthday!', color: 'from-amber-400 via-rose-500 to-red-500', emoji: '🎂' },
  { id: 'ANNIVERSARY', label: 'Anniversary Special', desc: 'Happy Anniversary!', color: 'from-pink-500 via-purple-600 to-indigo-600', emoji: '💖' },
  { id: 'FESTIVE', label: 'Festive Joy', desc: 'Season\'s Greetings!', color: 'from-emerald-500 via-teal-600 to-cyan-500', emoji: '🌟' },
  { id: 'CONGRATS', label: 'Congratulations', desc: 'Huge Congrats to You!', color: 'from-yellow-400 via-orange-500 to-amber-600', emoji: '🎉' },
  { id: 'MOVIE', label: 'Movie Night', desc: 'Let\'s watch a movie together!', color: 'from-rose-600 via-purple-600 to-indigo-700', emoji: '🎬' }
];

export default function GiftCards({ onBack }: GiftCardsProps) {
  const [selectedTheme, setSelectedTheme] = useState(THEMES[4]); // default: Movie
  const [amount, setAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState('');
  
  // Recipient details
  const [recName, setRecName] = useState('');
  const [recEmail, setRecEmail] = useState('');
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  
  const [processing, setProcessing] = useState(false);
  const [purchased, setPurchased] = useState(false);
  
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherPin, setVoucherPin] = useState('');
  const [copied, setCopied] = useState(false);

  const activeAmount = customAmount ? parseInt(customAmount) || 0 : amount;

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recName || !recEmail || !senderName) return;
    if (activeAmount <= 0) return;
    
    setProcessing(true);
    setTimeout(() => {
      // Generate random voucher and pin
      const p1 = Math.floor(1000 + Math.random() * 9000);
      const p2 = Math.floor(1000 + Math.random() * 9000);
      setVoucherCode(`MSTG-FT${p1}-${p2}`);
      setVoucherPin(String(Math.floor(1000 + Math.random() * 9000)));
      setProcessing(false);
      setPurchased(true);
    }, 2000);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(`${voucherCode} PIN: ${voucherPin}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error(e);
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
          Gift Vouchers
        </span>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-white tracking-tight">
          MovieStar <span className="text-rose-500 text-glow-rose">e-Gift</span> Cards
        </h1>
        <p className="text-slate-400 mt-2 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          Gift the cinematic experience. Personalize a beautiful voucher card, choose an amount, and send it directly to their email instantly.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!purchased ? (
          <motion.div 
            key="builder"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
          >
            {/* Left: Designer preview */}
            <div className="space-y-6 lg:sticky lg:top-24">
              <h2 className="text-lg font-black text-white uppercase tracking-wider">Live Card Preview</h2>
              
              {/* Animated Gift Card Mockup */}
              <div className="w-full relative overflow-hidden rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]" style={{ aspectRatio: '16/10' }}>
                {/* Dynamic gradient background matching theme */}
                <div className={`absolute inset-0 bg-linear-to-br ${selectedTheme.color} opacity-90 transition-all duration-500`} />
                {/* Dynamic patterns/shapes */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
                <div className="absolute top-0 right-0 p-8 text-5xl select-none">{selectedTheme.emoji}</div>
                
                {/* Logo */}
                <div className="absolute top-8 left-8 flex items-center gap-2">
                  <div className="w-7 h-7 bg-white/20 rounded flex items-center justify-center backdrop-blur-md">
                    <Ticket className="text-white fill-white" size={14} />
                  </div>
                  <span className="font-extrabold text-sm tracking-tight text-white">MovieStar Gift Card</span>
                </div>

                {/* Message Overlay */}
                <div className="absolute inset-x-8 top-[32%] text-white text-glow-rose select-none">
                  <p className="text-[10px] uppercase font-black tracking-widest text-white/70">Personal message</p>
                  <p className="font-black text-2xl truncate mt-1">{message || selectedTheme.desc}</p>
                  <p className="text-xs text-white/80 font-medium italic truncate mt-1">
                    {senderName ? `From: ${senderName}` : ''} {recName ? `To: ${recName}` : ''}
                  </p>
                </div>

                {/* Bottom Details */}
                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end text-white">
                  <div>
                    <p className="text-[9px] uppercase font-black tracking-widest text-white/60">Voucher Value</p>
                    <p className="text-3xl font-black">₹{activeAmount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] uppercase font-black tracking-widest text-white/60">Validity</p>
                    <p className="text-xs font-bold font-mono">12 MONTHS FROM PURCHASE</p>
                  </div>
                </div>
              </div>

              {/* Theme Selector */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-3">Choose Occasion Theme</label>
                <div className="flex flex-wrap gap-2.5">
                  {THEMES.map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme)}
                      className={`px-4 py-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                        selectedTheme.id === theme.id
                          ? 'bg-rose-600 border-rose-500 text-white shadow-md shadow-rose-600/30'
                          : 'bg-white/5 border-white/5 text-slate-300 hover:border-white/10'
                      }`}
                    >
                      <span className="mr-1.5">{theme.emoji}</span>
                      {theme.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Personalization form */}
            <div className="glass p-6 md:p-8 rounded-3xl border border-white/5 bg-[#0F0F14]/40 shadow-2xl space-y-6">
              <div>
                <h3 className="text-xl font-black text-white">Personalize & Purchase</h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">Generate a digital barcode card delivered direct to their inbox.</p>
              </div>

              <form onSubmit={handlePurchase} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-black uppercase text-slate-400 mb-1 tracking-wider">Recipient Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={recName}
                      onChange={(e) => setRecName(e.target.value)}
                      className="w-full bg-[#12121A] border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 text-white outline-none text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase text-slate-400 mb-1 tracking-wider">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full bg-[#12121A] border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 text-white outline-none text-sm transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-400 mb-1 tracking-wider">Recipient Email</label>
                  <input
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={recEmail}
                    onChange={(e) => setRecEmail(e.target.value)}
                    className="w-full bg-[#12121A] border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 text-white outline-none text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-400 mb-1 tracking-wider">Custom Message</label>
                  <textarea
                    placeholder="Wishing you a cinematic experience filled with lots of fun!"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={2}
                    className="w-full bg-[#12121A] border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 text-white outline-none text-sm transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-400 mb-3 tracking-wider">Select Gift Card Value</label>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {[250, 500, 1000, 2000].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => { setAmount(val); setCustomAmount(''); }}
                        className={`py-2 rounded-lg border font-bold text-xs cursor-pointer transition-all ${
                          amount === val && !customAmount
                            ? 'bg-rose-500/25 border-rose-500 text-rose-400'
                            : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/10'
                        }`}
                      >
                        ₹{val}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    placeholder="Or enter custom amount (e.g. ₹1500)"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full bg-[#12121A] border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 text-glow-rose text-white outline-none text-sm transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={processing || activeAmount <= 0}
                  className="w-full bg-linear-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-lg transition-all mt-4 cursor-pointer text-sm flex items-center justify-center gap-2"
                >
                  {processing ? 'Processing Payment...' : <>Proceed to Pay ₹{activeAmount} <ArrowRight size={16} /></>}
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-8 md:p-12 rounded-3xl border border-white/10 bg-[#0F0F14]/60 max-w-xl mx-auto shadow-2xl text-center"
          >
            <div className="w-16 h-16 bg-rose-600/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.25)]">
              <CircleCheck size={32} className="animate-pulse" />
            </div>

            <h2 className="text-2xl font-black text-white tracking-tight">Gift Card Purchased!</h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              We have processed your transaction. The digital voucher card code has been sent directly to <span className="text-white font-bold">{recEmail}</span>.
            </p>

            {/* Generated Voucher Stub */}
            <div className="bg-[#12121A]/70 border border-white/5 rounded-2xl p-6 my-8 space-y-4 text-left relative overflow-hidden">
              <div className={`absolute top-0 inset-x-0 h-1.5 bg-linear-to-r ${selectedTheme.color}`} />
              <div className="flex justify-between items-start text-xs border-b border-white/5 pb-3">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-extrabold">Recipient Name</p>
                  <p className="font-extrabold text-white text-sm mt-0.5">{recName}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 uppercase font-extrabold">Sender</p>
                  <p className="font-extrabold text-white text-sm mt-0.5">{senderName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b border-white/5 pb-3">
                <div>
                  <p className="text-[9px] text-slate-500 uppercase font-extrabold">Voucher Code</p>
                  <p className="font-mono font-black text-white text-sm tracking-wide mt-0.5">{voucherCode}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 uppercase font-extrabold">Security PIN</p>
                  <p className="font-mono font-black text-rose-400 text-sm tracking-widest mt-0.5">{voucherPin}</p>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs pt-1">
                <div>
                  <p className="text-[9px] text-slate-500 uppercase font-extrabold">Redemption Value</p>
                  <p className="text-lg font-black text-green-400 mt-0.5">₹{activeAmount}</p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className={`flex items-center gap-1 py-1.5 px-3 rounded-lg font-bold text-[10px] border-none cursor-pointer transition ${
                    copied 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {copied ? <Check size={11} /> : <Copy size={11} />}
                  {copied ? 'Copied' : 'Copy Code & PIN'}
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setPurchased(false);
                setRecName('');
                setRecEmail('');
                setSenderName('');
                setCustomAmount('');
                setMessage('');
              }}
              className="w-full bg-linear-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-extrabold py-4 px-6 rounded-xl shadow-lg transition-all cursor-pointer text-sm"
            >
              Buy Another Gift Card
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
