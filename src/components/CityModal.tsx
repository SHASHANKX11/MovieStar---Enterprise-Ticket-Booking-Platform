import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CITIES } from '../mockData';
import { MapPin, Search, Navigation, Loader2, X, ChevronDown } from 'lucide-react';

interface CityModalProps {
  onSelectCity: (city: string) => void;
}

const CITY_META: Record<string, { emoji: string; subtitle: string; popular?: boolean; lat: number; lng: number }> = {
  'Mumbai': { emoji: '🌊', subtitle: 'The City of Dreams', popular: true, lat: 19.076, lng: 72.8777 },
  'Delhi-NCR': { emoji: '🏛️', subtitle: 'Capital Territory', popular: true, lat: 28.6139, lng: 77.209 },
  'Bengaluru': { emoji: '🌿', subtitle: 'Silicon Valley of India', popular: true, lat: 12.9716, lng: 77.5946 },
  'Hyderabad': { emoji: '💎', subtitle: 'City of Pearls', popular: true, lat: 17.385, lng: 78.4867 },
  'Chennai': { emoji: '🌅', subtitle: 'The Cultural Capital', popular: true, lat: 13.0827, lng: 80.2707 },
  'Pune': { emoji: '📚', subtitle: 'Oxford of the East', lat: 18.5204, lng: 73.8567 },
  'Kolkata': { emoji: '🎭', subtitle: 'City of Joy', lat: 22.5726, lng: 88.3639 },
  'Kochi': { emoji: '⛵', subtitle: 'Queen of the Arabian Sea', lat: 9.9312, lng: 76.2673 },
  'Doddaballapur': { emoji: '🌾', subtitle: 'Historical Silk Town', lat: 13.2962, lng: 77.5392 },
  'Ahmedabad': { emoji: '🕌', subtitle: 'Historic Heritage City', lat: 23.0225, lng: 72.5714 },
  'Chandigarh': { emoji: '📐', subtitle: 'The Beautiful City', lat: 30.7333, lng: 76.7794 },
};

// Haversine distance (km)
function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function findNearestCity(lat: number, lng: number): { city: string; distance: number } {
  let best = { city: 'Bengaluru', distance: Infinity };
  for (const [city, meta] of Object.entries(CITY_META)) {
    const d = haversine(lat, lng, meta.lat, meta.lng);
    if (d < best.distance) best = { city, distance: d };
  }
  return best;
}

type LocationState = 'idle' | 'asking' | 'detecting' | 'detected' | 'denied' | 'error';

export default function CityModal({ onSelectCity }: CityModalProps) {
  const [search, setSearch] = useState('');
  const [locState, setLocState] = useState<LocationState>('idle');
  const [detectedCity, setDetectedCity] = useState('');
  const [detectedCoords, setDetectedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [distanceKm, setDistanceKm] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const [selectedMapCity, setSelectedMapCity] = useState<string | null>(null);

  const filtered = CITIES.filter(c =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  const popular = filtered.filter(c => CITY_META[c]?.popular);
  const others = filtered.filter(c => !CITY_META[c]?.popular);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocState('error');
      return;
    }
    setLocState('detecting');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setDetectedCoords({ lat: latitude, lng: longitude });
        const nearest = findNearestCity(latitude, longitude);
        setDetectedCity(nearest.city);
        setDistanceKm(Math.round(nearest.distance));
        setLocState('detected');
      },
      (err) => {
        console.error('Geolocation error:', err);
        if (err.code === err.PERMISSION_DENIED) {
          setLocState('denied');
        } else {
          setLocState('error');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // Auto open permission prompt
  useEffect(() => {
    // Small delay so the modal renders before the browser prompt
    const t = setTimeout(() => setLocState('asking'), 800);
    return () => clearTimeout(t);
  }, []);

  const mapLat = selectedMapCity
    ? CITY_META[selectedMapCity]?.lat ?? 20.5937
    : detectedCoords
    ? detectedCoords.lat
    : 20.5937;
  const mapLng = selectedMapCity
    ? CITY_META[selectedMapCity]?.lng ?? 78.9629
    : detectedCoords
    ? detectedCoords.lng
    : 78.9629;


  return (
    <div className="fixed inset-0 z-100 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 280 }}
        className="glass-dark border border-white/10 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 bg-linear-to-r from-rose-950/20 to-orange-950/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-full bg-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-600/30">
              <MapPin size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white text-glow-rose">Choose Your City</h2>
              <p className="text-sm text-slate-400 mt-0.5">Get personalised movies and event listings</p>
            </div>
          </div>

          {/* Detect Location Button / Status */}
          <AnimatePresence mode="wait">
            {locState === 'asking' && (
              <motion.div
                key="asking"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 glass bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Navigation size={18} className="text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">Want to detect your location?</p>
                    <p className="text-xs text-slate-400 mt-1">We'll find the nearest city with shows & events for you.</p>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={detectLocation}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-extrabold rounded-xl transition shadow-lg shadow-emerald-500/25 cursor-pointer"
                      >
                        Yes, Detect My Location
                      </button>
                      <button
                        onClick={() => setLocState('idle')}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold rounded-xl border border-white/10 transition cursor-pointer"
                      >
                        No, I'll Pick Manually
                      </button>
                    </div>
                  </div>
                  <button onClick={() => setLocState('idle')} className="text-slate-500 hover:text-white transition cursor-pointer bg-transparent border-none shrink-0">
                    <X size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {locState === 'detecting' && (
              <motion.div
                key="detecting"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 glass bg-blue-500/5 border border-blue-500/20 rounded-2xl p-4"
              >
                <div className="flex items-center gap-3">
                  <Loader2 size={20} className="text-blue-400 animate-spin" />
                  <div>
                    <p className="text-sm font-bold text-white">Detecting your location…</p>
                    <p className="text-xs text-slate-400 mt-0.5">Please allow location access in your browser.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {locState === 'detected' && (
              <motion.div
                key="detected"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 glass bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <MapPin size={18} className="text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">
                        📍 Nearest city: <span className="text-emerald-400">{detectedCity}</span>
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">~{distanceKm} km away • {CITY_META[detectedCity]?.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowMap(!showMap)}
                      className="px-3 py-1.5 text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-slate-300 transition cursor-pointer flex items-center gap-1"
                    >
                      🗺️ Map
                      <ChevronDown size={12} className={`transition-transform ${showMap ? 'rotate-180' : ''}`} />
                    </button>
                    <button
                      onClick={() => onSelectCity(detectedCity)}
                      className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-extrabold rounded-xl transition shadow-lg shadow-emerald-500/25 cursor-pointer"
                    >
                      Use {detectedCity}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {locState === 'denied' && (
              <motion.div
                key="denied"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 glass bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">Location access denied</p>
                    <p className="text-xs text-slate-400 mt-0.5">No worries! Please select a city manually below.</p>
                  </div>
                  <button onClick={() => setLocState('idle')} className="text-slate-500 hover:text-white transition cursor-pointer bg-transparent border-none">
                    <X size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {locState === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 glass bg-red-500/5 border border-red-500/20 rounded-2xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-red-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">Could not detect location</p>
                    <p className="text-xs text-slate-400 mt-0.5">Your browser may not support geolocation. Select manually.</p>
                  </div>
                  <button onClick={() => setLocState('idle')} className="text-slate-500 hover:text-white transition cursor-pointer bg-transparent border-none">
                    <X size={16} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interactive Map (OpenStreetMap embed — free, no API key) */}
          <AnimatePresence>
            {showMap && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 280, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-4 rounded-2xl overflow-hidden border border-white/10 relative"
              >
                <iframe
                  title="Location Map"
                  width="100%"
                  height="280"
                  style={{ border: 0, borderRadius: '16px' }}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapLng - 0.15}%2C${mapLat - 0.1}%2C${mapLng + 0.15}%2C${mapLat + 0.1}&layer=mapnik&marker=${mapLat}%2C${mapLng}`}
                  loading="lazy"
                />
                {/* City quick-switch chips on map */}
                <div className="absolute bottom-3 left-3 right-3 flex gap-1.5 flex-wrap">
                  {CITIES.slice(0, 6).map(c => (
                    <button
                      key={c}
                      onClick={() => setSelectedMapCity(c === selectedMapCity ? null : c)}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-full backdrop-blur-md transition cursor-pointer border ${
                        selectedMapCity === c
                          ? 'bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-500/30'
                          : 'bg-black/60 border-white/20 text-white hover:bg-black/80'
                      }`}
                    >
                      {CITY_META[c]?.emoji} {c}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Detect button when idle (compact) */}
          {locState === 'idle' && (
            <button
              onClick={() => setLocState('asking')}
              className="w-full mb-4 flex items-center justify-center gap-2 px-4 py-2.5 bg-white/3 hover:bg-white/6 border border-white/8 rounded-xl transition cursor-pointer group"
            >
              <Navigation size={14} className="text-emerald-400 group-hover:text-emerald-300" />
              <span className="text-xs font-bold text-slate-300 group-hover:text-white transition">Detect My Location</span>
            </button>
          )}

          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search for your city..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
              className="w-full bg-[#12121A] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-rose-500/50 text-white transition placeholder-slate-500"
            />
          </div>
        </div>

        {/* Cities Grid */}
        <div className="p-6 max-h-[60vh] overflow-y-auto scrollbar-none">
          {popular.length > 0 && (
            <>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3.5">Popular Cities</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {popular.map((city, idx) => {
                  const meta = CITY_META[city] ?? { emoji: '🏙️', subtitle: 'Explore events', lat: 0, lng: 0 };
                  return (
                    <motion.button
                      key={city}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => onSelectCity(city)}
                      className={`glass bg-white/2 border rounded-xl p-4 text-left transition-all group shadow-md hover:bg-white/4 cursor-pointer ${
                        detectedCity === city
                          ? 'border-emerald-500/40 ring-1 ring-emerald-500/20'
                          : 'border-white/5 hover:border-rose-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl mb-2">{meta.emoji}</span>
                        {detectedCity === city && (
                          <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                            📍 NEAREST
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-white group-hover:text-rose-400 transition-colors">{city}</p>
                      <p className="text-xs text-slate-400 mt-1 truncate">{meta.subtitle}</p>
                    </motion.button>
                  );
                })}
              </div>
            </>
          )}

          {others.length > 0 && (
            <>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3.5">More Cities</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {others.map((city, idx) => {
                  const meta = CITY_META[city] ?? { emoji: '🏙️', subtitle: 'Explore events', lat: 0, lng: 0 };
                  return (
                    <motion.button
                      key={city}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => onSelectCity(city)}
                      className={`glass bg-white/2 border rounded-xl p-4 text-left transition-all group shadow-md hover:bg-white/4 cursor-pointer ${
                        detectedCity === city
                          ? 'border-emerald-500/40 ring-1 ring-emerald-500/20'
                          : 'border-white/5 hover:border-rose-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl mb-2">{meta.emoji}</span>
                        {detectedCity === city && (
                          <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                            📍 NEAREST
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-white group-hover:text-rose-400 transition-colors">{city}</p>
                      <p className="text-xs text-slate-400 mt-1 truncate">{meta.subtitle}</p>
                    </motion.button>
                  );
                })}
              </div>
            </>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <p className="text-lg font-semibold">No city found for "{search}"</p>
              <button onClick={() => setSearch('')} className="text-sm text-rose-400 mt-2 hover:underline cursor-pointer">Clear search</button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
