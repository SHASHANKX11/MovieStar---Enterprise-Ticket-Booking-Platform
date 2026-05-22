import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Database, Plus, Film, Save, ShieldCheck, Terminal, Trash2 } from 'lucide-react';
import { MOVIES, generateShowtimesForMovie, saveMoviesToStorage } from '../mockData';
import { Movie } from '../types';

interface AdminPanelProps {
  onMovieAdded: () => void;
}

export default function AdminPanel({ onMovieAdded }: AdminPanelProps) {
  const [moviesList, setMoviesList] = useState<Movie[]>([...MOVIES]);
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    language: '',
    format: '',
    duration: '',
    poster: '',
    bgImage: '',
    releaseDate: '',
    trailerYoutubeId: ''
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newMovie: Movie = {
      id: `m${Math.floor(Math.random() * 1000) + 10}`,
      title: formData.title,
      genre: formData.genre.split(',').map(g => g.trim()),
      language: formData.language,
      languages: formData.language.split(',').map(l => l.trim()) as Movie['languages'],
      format: formData.format,
      duration: formData.duration,
      poster: formData.poster || 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=400',
      bgImage: formData.bgImage || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=1200',
      rating: 8.0,
      votes: 'New',
      releaseDate: formData.releaseDate,
      trailerYoutubeId: formData.trailerYoutubeId || undefined
    };

    // Mutate the mock database for this session
    MOVIES.push(newMovie);
    generateShowtimesForMovie(newMovie);
    saveMoviesToStorage();
    setMoviesList([...MOVIES]);
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
      setFormData({
        title: '',
        genre: '',
        language: '',
        format: '',
        duration: '',
        poster: '',
        bgImage: '',
        releaseDate: '',
        trailerYoutubeId: ''
      });
      onMovieAdded();
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDelete = (id: string) => {
    const index = MOVIES.findIndex(m => m.id === id);
    if (index > -1) {
      MOVIES.splice(index, 1);
      saveMoviesToStorage();
      setMoviesList([...MOVIES]);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#09090C] text-slate-200 py-12 px-4"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Console Banner */}
        <div className="glass rounded-2xl border border-white/5 p-6 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white leading-tight text-glow-violet">Admin Dashboard</h2>
              <p className="text-sm text-slate-400 font-medium mt-0.5">Web Simulation of Swing Admin Desktop App</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full border border-emerald-500/20 text-xs font-bold">
            <Database size={14} className="animate-pulse" /> Live DB Connected
          </div>
        </div>

        {/* Add Movie Form Card */}
        <div className="glass rounded-2xl border border-white/5 overflow-hidden shadow-xl">
          <div className="p-6 border-b border-white/5 bg-white/2 flex items-center gap-2.5">
            <Plus size={18} className="text-slate-400" />
            <h3 className="font-extrabold text-white text-lg">Add New Movie Feature</h3>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {isSuccess && (
              <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3.5 rounded-xl flex items-center gap-2.5 text-sm">
                <Database size={18} className="animate-bounce" />
                <span className="font-bold">Movie successfully deployed to production database!</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Movie Title</label>
                <input 
                  required 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  type="text" 
                  placeholder="e.g. Inception"
                  className="w-full border border-white/5 bg-[#12121A] text-white placeholder-slate-500 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Genre (comma separated)</label>
                <input 
                  required 
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  type="text" 
                  placeholder="e.g. Action, Sci-Fi"
                  className="w-full border border-white/5 bg-[#12121A] text-white placeholder-slate-500 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Language</label>
                <input 
                  required 
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  type="text" 
                  placeholder="e.g. English, Hindi"
                  className="w-full border border-white/5 bg-[#12121A] text-white placeholder-slate-500 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Format</label>
                <input 
                  required 
                  name="format"
                  value={formData.format}
                  onChange={handleChange}
                  type="text" 
                  placeholder="e.g. 2D, IMAX"
                  className="w-full border border-white/5 bg-[#12121A] text-white placeholder-slate-500 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Duration</label>
                <input 
                  required 
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  type="text" 
                  placeholder="e.g. 2h 20m"
                  className="w-full border border-white/5 bg-[#12121A] text-white placeholder-slate-500 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Release Date</label>
                <input 
                  required 
                  name="releaseDate"
                  value={formData.releaseDate}
                  onChange={handleChange}
                  type="text" 
                  placeholder="e.g. 20 May, 2026"
                  className="w-full border border-white/5 bg-[#12121A] text-white placeholder-slate-500 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all" 
                />
              </div>
              
              <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Poster Image URL (Optional)</label>
                <input 
                  name="poster"
                  value={formData.poster}
                  onChange={handleChange}
                  type="text" 
                  placeholder="https://images.unsplash.com/..."
                  className="w-full border border-white/5 bg-[#12121A] text-white placeholder-slate-500 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all" 
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">YouTube Trailer ID (Optional)</label>
                <input 
                  name="trailerYoutubeId"
                  value={formData.trailerYoutubeId}
                  onChange={handleChange}
                  type="text" 
                  placeholder="e.g. dQw4w9WgXcQ"
                  className="w-full border border-white/5 bg-[#12121A] text-white placeholder-slate-500 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all" 
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-white/5">
              <button 
                type="submit"
                className="bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold py-3.5 px-8 rounded-xl shadow-lg hover:shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer hover:scale-102"
              >
                <Save size={20} />
                Publish to Live Database
              </button>
            </div>
          </form>
        </div>

        {/* Existing Shows List Card */}
        <div className="glass rounded-2xl border border-white/5 overflow-hidden shadow-xl">
          <div className="p-6 border-b border-white/5 bg-white/2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Film size={18} className="text-slate-400" />
              <h3 className="font-extrabold text-white text-lg">Manage Existing Shows</h3>
            </div>
            <span className="text-xs border border-white/5 bg-[#1C1C29] px-3 py-1 rounded-full font-extrabold text-slate-300">{moviesList.length} total shows</span>
          </div>
          <div>
            {moviesList.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-medium">No shows available in the database.</div>
            ) : (
              <ul className="divide-y divide-white/5 max-h-[400px] overflow-y-auto">
                {moviesList.map(movie => (
                  <li key={movie.id} className="p-4 hover:bg-white/1 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-16 rounded-lg overflow-hidden bg-[#12121A] border border-white/10 shrink-0">
                        <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white leading-tight mb-1.5">{movie.title}</h4>
                        <div className="flex gap-2 text-[10px] items-center">
                          <span className="bg-[#12121A] text-slate-300 border border-white/5 px-2 py-0.5 rounded font-extrabold uppercase">{movie.format}</span>
                          <span className="bg-[#12121A] text-slate-300 border border-white/5 px-2 py-0.5 rounded font-extrabold uppercase">{movie.language}</span>
                          <span className="text-slate-400 font-semibold">• {movie.genre.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(movie.id)}
                      className="p-2.5 text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-xl transition-all cursor-pointer"
                      title="Remove Show"
                    >
                      <Trash2 size={20} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Developer Console Architecture Note */}
        <div className="bg-[#0B0B14]/80 border border-white/5 rounded-2xl p-6 text-slate-400 flex items-start gap-4 shadow-2xl">
          <Terminal size={24} className="mt-1 text-emerald-400 shrink-0 shadow-[0_0_10px_rgba(52,211,153,0.35)] animate-pulse" />
          <div>
            <h4 className="font-bold text-white mb-2 tracking-tight flex items-center gap-2">
              Developer Architecture Note
            </h4>
            <p className="text-sm leading-relaxed mb-4">
              In a true production environment, this dashboard would be powered by the <span className="font-mono text-xs bg-black/40 border border-white/5 text-emerald-400 px-1.5 py-0.5 rounded">SwingAdminDashboard.java</span> desktop application running separately from the web frontend, connecting natively via JDBC to the shared MySQL/PostgreSQL cluster. Here we are simulating that INSERT behavior by pushing to our session's memory store.
            </p>
            <p className="text-sm leading-relaxed">
              Once you add a movie here, click on the application's logo to return to the Home page and you will see the new movie appended to the Discovery feed.
            </p>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
