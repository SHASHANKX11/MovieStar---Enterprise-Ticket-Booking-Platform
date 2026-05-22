import { useEffect } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

interface TrailerModalProps {
  youtubeId: string;
  title: string;
  onClose: () => void;
}

export default function TrailerModal({ youtubeId, title, onClose }: TrailerModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent scroll on body
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-300 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-5xl relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-white font-bold text-lg truncate">{title} — Official Trailer</span>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 transition-all px-3 py-1.5 rounded-full text-sm font-medium"
          >
            <X size={16} />
            Close
          </button>
        </div>

        {/* YouTube Embed */}
        <div className="relative w-full rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(225,29,72,0.3)]" style={{ paddingTop: '56.25%' }}>
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
            title={`${title} Trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>

        <p className="text-center text-xs text-gray-500 mt-3">
          Click outside or press <kbd className="bg-white/10 text-gray-300 px-1.5 py-0.5 rounded text-xs">Esc</kbd> to close
        </p>
      </motion.div>
    </motion.div>
  );
}
