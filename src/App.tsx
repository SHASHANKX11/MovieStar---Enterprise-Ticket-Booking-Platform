import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, User, Ticket, X, Code, ShieldCheck } from 'lucide-react';
import CityModal from './components/CityModal';
import Home from './components/Home';
import MovieDetails from './components/MovieDetails';
import SeatSelection from './components/SeatSelection';
import { Checkout, TicketConfirmation } from './components/BookingFlow';
import JavaDocsModal from './components/JavaDocsModal';
import AdminPanel from './components/AdminPanel';
import SportDetails from './components/SportDetails';
import { Movie, Theater, Showtime, Seat, BookingState, SportEvent, LiveEvent } from './types';
import { MOVIES, SPORT_EVENTS, LIVE_EVENTS } from './mockData';
import ListYourShow from './components/ListYourShow';
import Corporates from './components/Corporates';
import Offers from './components/Offers';
import GiftCards from './components/GiftCards';

type ViewState = 'HOME' | 'MOVIE_DETAILS' | 'SPORT_DETAILS' | 'SEAT_SELECTION' | 'CHECKOUT' | 'TICKET' | 'ADMIN' | 'LIST_YOUR_SHOW' | 'CORPORATES' | 'OFFERS' | 'GIFT_CARDS';

export default function App() {
  const [city, setCity] = useState<string>('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
  const [view, setView] = useState<ViewState>('HOME');
  const [showSignIn, setShowSignIn] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showJavaDocs, setShowJavaDocs] = useState(false);
  
  // Selection State
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedSport, setSelectedSport] = useState<SportEvent | null>(null);
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [bookingState, setBookingState] = useState<BookingState>({ selectedSeats: [], totalAmount: 0, convenienceFee: 0 });

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ movies: Movie[]; sports: SportEvent[]; events: LiveEvent[] }>({ movies: [], sports: [], events: [] });
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Real-time Search Filter Effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ movies: [], sports: [], events: [] });
      return;
    }
    const q = searchQuery.toLowerCase();
    
    const filteredMovies = MOVIES.filter(m => 
      m.title.toLowerCase().includes(q) || 
      m.genre.some(g => g.toLowerCase().includes(q)) ||
      m.language.toLowerCase().includes(q)
    );

    const filteredSports = SPORT_EVENTS.filter(s => 
      s.title.toLowerCase().includes(q) || 
      s.teams.some(t => t.toLowerCase().includes(q)) ||
      s.sportType.toLowerCase().includes(q) ||
      s.tournament.toLowerCase().includes(q)
    );

    const filteredEvents = LIVE_EVENTS.filter(e => 
      e.title.toLowerCase().includes(q) || 
      e.category.toLowerCase().includes(q) ||
      e.venue.toLowerCase().includes(q)
    );

    setSearchResults({
      movies: filteredMovies.slice(0, 4),
      sports: filteredSports.slice(0, 4),
      events: filteredEvents.slice(0, 4)
    });
  }, [searchQuery]);

  // Navigation Handlers
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const goToCategory = (category: string) => {
    setActiveCategory(category);
    resetHome();
  };

  const handleSelectCity = (selectedCity: string) => {
    setCity(selectedCity);
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setView('MOVIE_DETAILS');
    window.scrollTo(0, 0);
  };

  const handleSelectSport = (sport: SportEvent) => {
    setSelectedSport(sport);
    setView('SPORT_DETAILS');
    window.scrollTo(0, 0);
  };

  const handleBookSport = (sport: SportEvent) => {
    // Map SportEvent to standard entities for the SeatSelection module
    setSelectedMovie({
        id: sport.id,
        title: sport.title,
        genre: [sport.sportType],
        language: 'English',
        format: 'Live',
        duration: '4h',
        poster: sport.poster,
        bgImage: sport.bgImage,
        rating: 4.8,
        votes: '2k',
        releaseDate: sport.date
    } as Movie);
    
    setSelectedTheater({
        id: sport.id + '-venue',
        city: sport.city,
        name: sport.venue,
        facilities: ['Food', 'Merch', 'Restrooms']
    });
    
    setSelectedShowtime({
        id: sport.id + '-time',
        movieId: sport.id,
        theaterId: sport.id + '-venue',
        date: sport.date,
        time: sport.time,
        format: sport.tournament
    });
    
    setView('SEAT_SELECTION');
    window.scrollTo(0, 0);
  };

  const handleBookLiveEvent = (event: LiveEvent) => {
    setSelectedMovie({
      id: event.id,
      title: event.title,
      genre: [event.category],
      language: 'English',
      format: 'Live Show',
      duration: '3h',
      poster: event.poster,
      bgImage: event.poster,
      rating: 4.9,
      votes: '1.2k',
      releaseDate: event.date
    } as Movie);
    
    setSelectedTheater({
      id: event.id + '-venue',
      city: event.city,
      name: event.venue,
      facilities: ['M-Ticket', 'Food & Drink']
    });
    
    setSelectedShowtime({
      id: event.id + '-time',
      movieId: event.id,
      theaterId: event.id + '-venue',
      date: event.date,
      time: '07:00 PM',
      format: event.category
    });
    
    setView('SEAT_SELECTION');
    window.scrollTo(0, 0);
  };

  const handleSelectShowtime = (theater: Theater, showtime: Showtime) => {
    setSelectedTheater(theater);
    setSelectedShowtime(showtime);
    setView('SEAT_SELECTION');
    window.scrollTo(0, 0);
  };

  const handleProceedToCheckout = (seats: Seat[], amount: number) => {
    setBookingState({
      movieId: selectedMovie?.id,
      theaterId: selectedTheater?.id,
      showtimeId: selectedShowtime?.id,
      selectedSeats: seats,
      totalAmount: amount,
      convenienceFee: Math.floor(amount * 0.1), // 10% mock fee
    });
    setView('CHECKOUT');
    window.scrollTo(0, 0);
  };

  const handleConfirmBooking = () => {
    setView('TICKET');
    window.scrollTo(0, 0);
  };

  const resetHome = () => {
    setSelectedMovie(null);
    setSelectedSport(null);
    setSelectedTheater(null);
    setSelectedShowtime(null);
    setBookingState({ selectedSeats: [], totalAmount: 0, convenienceFee: 0 });
    setView('HOME');
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSignedIn(true);
    setShowSignIn(false);
  };

  return (
    <motion.div
      className="min-h-screen bg-[#09090C] font-sans text-slate-100 selection:bg-rose-500/30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      
      {!city && <CityModal onSelectCity={handleSelectCity} />}
      {showJavaDocs && <JavaDocsModal onClose={() => setShowJavaDocs(false)} />}

      {/* Sign In / Sign Up Modal */}
      {showSignIn && (
        <div className="fixed inset-0 z-100 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-dark rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative border border-white/10 animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowSignIn(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"
            >
              <X size={20} />
            </button>
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.15)]">
                  <User size={24} />
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  {authMode === 'signin' ? 'Welcome Back' : 'Create an Account'}
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  {authMode === 'signin' ? 'Sign in to continue to MovieStar' : 'Join MovieStar to book tickets easily'}
                </p>
              </div>

              {/* Tabs */}
              <div className="flex p-1 bg-white/5 border border-white/10 rounded-xl mb-6">
                <button
                  onClick={() => setAuthMode('signin')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                    authMode === 'signin' ? 'bg-[#ff2a5f] text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setAuthMode('signup')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                    authMode === 'signup' ? 'bg-[#ff2a5f] text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleSignIn} className="space-y-4">
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1">Full Name</label>
                    <input type="text" required placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-white placeholder-slate-500 outline-none transition-all" />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Email Address</label>
                  <input type="email" required placeholder="name@example.com" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-white placeholder-slate-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Password</label>
                  <input type="password" required placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-white placeholder-slate-500 outline-none transition-all" />
                </div>
                <button type="submit" className="w-full bg-linear-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-extrabold py-3 px-4 rounded-xl shadow-lg shadow-rose-600/20 hover:shadow-rose-600/30 transition-all mt-4 cursor-pointer">
                  {authMode === 'signin' ? 'Sign In' : 'Create Account'}
                </button>
              </form>
              <div className="mt-6 text-center text-sm text-slate-400">
                {authMode === 'signin' ? (
                  <>Don't have an account? <button onClick={() => setAuthMode('signup')} className="text-rose-400 font-bold hover:underline bg-transparent border-none cursor-pointer">Sign up</button></>
                ) : (
                  <>Already have an account? <button onClick={() => setAuthMode('signin')} className="text-rose-400 font-bold hover:underline bg-transparent border-none cursor-pointer">Sign in</button></>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Navigation Bar */}
      <nav className={`bg-[#09090C]/85 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50 transition-shadow duration-300 ${isScrolled ? 'shadow-[0_8px_30px_rgba(0,0,0,0.6)]' : 'shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={resetHome} className="flex items-center gap-2 group cursor-pointer bg-transparent border-none">
              <div className="w-8 h-8 bg-rose-600 rounded flex items-center justify-center transform group-hover:scale-105 transition shadow-[0_0_12px_rgba(244,63,94,0.4)]">
                <Ticket className="text-white fill-white" size={16} />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white hidden sm:block">Movie<span className="text-rose-500 text-glow-rose">Star</span></span>
            </button>

            {/* Real Search Bar */}
            <div className="relative hidden md:block">
              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-2 w-64 lg:w-96 focus-within:ring-2 focus-within:ring-rose-500/30 transition-all">
                <Search size={16} className="text-slate-400 mr-2" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(true);
                  }}
                  onFocus={() => setShowSearchResults(true)}
                  placeholder="Search for Movies, Events, Plays..." 
                  className="bg-transparent border-none outline-none text-sm w-full text-slate-200 placeholder-slate-500"
                />
                {searchQuery && (
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setShowSearchResults(false);
                    }}
                    className="text-slate-400 hover:text-white transition bg-transparent border-none cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Search Results Dropdown Overlay */}
              {showSearchResults && searchQuery.trim() && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowSearchResults(false)} 
                  />
                  <div className="absolute top-12 left-0 right-0 z-50 glass-dark border border-white/10 rounded-2xl shadow-2xl p-4 max-h-[450px] overflow-y-auto space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* No results */}
                    {searchResults.movies.length === 0 && searchResults.sports.length === 0 && searchResults.events.length === 0 && (
                      <div className="text-center py-6 text-slate-500 text-sm">
                        No matches found for "{searchQuery}"
                      </div>
                    )}

                    {/* Movies category */}
                    {searchResults.movies.length > 0 && (
                      <div>
                        <h4 className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2 border-b border-white/5 pb-1">Movies</h4>
                        <div className="space-y-1.5">
                          {searchResults.movies.map(movie => (
                            <button
                              key={movie.id}
                              onClick={() => {
                                handleSelectMovie(movie);
                                setSearchQuery('');
                                setShowSearchResults(false);
                              }}
                              className="w-full text-left p-2 rounded-xl hover:bg-white/5 transition flex items-center gap-3 cursor-pointer group bg-transparent border-none"
                            >
                              <img src={movie.poster} alt={movie.title} className="w-8 h-10 object-cover rounded-lg" />
                              <div className="truncate">
                                <p className="font-extrabold text-sm text-white group-hover:text-rose-400 transition truncate">{movie.title}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5 truncate">{movie.genre.join(', ')} • {movie.language}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sports category */}
                    {searchResults.sports.length > 0 && (
                      <div>
                        <h4 className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2 border-b border-white/5 pb-1">Sports</h4>
                        <div className="space-y-1.5">
                          {searchResults.sports.map(sport => (
                            <button
                              key={sport.id}
                              onClick={() => {
                                handleSelectSport(sport);
                                setSearchQuery('');
                                setShowSearchResults(false);
                              }}
                              className="w-full text-left p-2 rounded-xl hover:bg-white/5 transition flex items-center gap-3 cursor-pointer group bg-transparent border-none"
                            >
                              <img src={sport.poster} alt={sport.title} className="w-8 h-10 object-cover rounded-lg" />
                              <div className="truncate">
                                <p className="font-extrabold text-sm text-white group-hover:text-rose-400 transition truncate">{sport.title}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5 truncate">{sport.tournament} • {sport.venue}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Live Events category */}
                    {searchResults.events.length > 0 && (
                      <div>
                        <h4 className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2 border-b border-white/5 pb-1">Events & Theatre Plays</h4>
                        <div className="space-y-1.5">
                          {searchResults.events.map(event => (
                            <button
                              key={event.id}
                              onClick={() => {
                                handleBookLiveEvent(event);
                                setSearchQuery('');
                                setShowSearchResults(false);
                              }}
                              className="w-full text-left p-2 rounded-xl hover:bg-white/5 transition flex items-center gap-3 cursor-pointer group bg-transparent border-none"
                            >
                              <img src={event.poster} alt={event.title} className="w-8 h-10 object-cover rounded-lg" />
                              <div className="truncate">
                                <p className="font-extrabold text-sm text-white group-hover:text-rose-400 transition truncate">{event.title}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5 truncate">{event.category} • {event.venue}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={() => { setView('ADMIN'); window.scrollTo(0,0); }}
              className="flex items-center gap-1.5 text-sm font-bold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-full transition-all cursor-pointer"
            >
              <ShieldCheck size={16} className="text-indigo-400" />
              <span className="hidden lg:inline">Admin DB</span>
            </button>
            <button 
              onClick={() => setShowJavaDocs(true)}
              className="flex items-center gap-1.5 text-sm font-bold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-full transition-all cursor-pointer"
            >
              <Code size={16} />
              <span className="hidden lg:inline">Java Arch</span>
            </button>
            <button 
              onClick={() => setCity('')}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-rose-400 transition-colors bg-transparent border-none cursor-pointer"
            >
              <span className="hidden sm:block">{city || 'Select City'}</span>
              <MapPin size={16} />
            </button>
            {isSignedIn ? (
              <button 
                onClick={() => setIsSignedIn(false)}
                title="Sign Out"
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 transition-colors px-3 py-1.5 rounded-full border border-white/10 cursor-pointer"
              >
                <div className="w-6 h-6 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center">
                  <User size={14} />
                </div>
                <span className="text-sm font-semibold text-slate-300">Sign Out</span>
              </button>
            ) : (
              <button onClick={() => setShowSignIn(true)} className="bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold px-4 py-1.5 rounded-lg shadow-md shadow-rose-600/25 hover:shadow-rose-600/35 transition cursor-pointer">
                Sign in
              </button>
            )}
          </div>
        </div>
        
        {/* Secondary Navigation */}
        <div className="hidden md:block bg-[#0F0F14] border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[40px] flex items-center justify-between text-[14px] text-slate-300">
            <div className="flex items-center gap-5">
              <button onClick={() => goToCategory('MOVIES')} className={`bg-transparent border-none cursor-pointer transition-colors whitespace-nowrap ${activeCategory === 'MOVIES' ? 'text-rose-500 font-bold text-glow-rose' : 'hover:text-rose-400'}`}>Movies</button>
              <button onClick={() => goToCategory('STREAMS')} className={`bg-transparent border-none cursor-pointer transition-colors relative flex items-center whitespace-nowrap ${activeCategory === 'STREAMS' ? 'text-rose-500 font-bold text-glow-rose' : 'hover:text-rose-400'}`}>
                Streams 
                <span className="text-[10px] text-white bg-rose-600 rounded px-1 ml-1.5 font-bold mb-0.5 shadow-[0_0_8px_rgba(244,63,94,0.5)]">NEW</span>
              </button>
              <button onClick={() => goToCategory('EVENTS')} className={`bg-transparent border-none cursor-pointer transition-colors whitespace-nowrap ${activeCategory === 'EVENTS' ? 'text-rose-500 font-bold text-glow-rose' : 'hover:text-rose-400'}`}>Events</button>
              <button onClick={() => goToCategory('PLAYS')} className={`bg-transparent border-none cursor-pointer transition-colors whitespace-nowrap ${activeCategory === 'PLAYS' ? 'text-rose-500 font-bold text-glow-rose' : 'hover:text-rose-400'}`}>Plays</button>
              <button onClick={() => goToCategory('SPORTS')} className={`bg-transparent border-none cursor-pointer transition-colors whitespace-nowrap ${activeCategory === 'SPORTS' ? 'text-rose-500 font-bold text-glow-rose' : 'hover:text-rose-400'}`}>Sports</button>
              <button onClick={() => goToCategory('ACTIVITIES')} className={`bg-transparent border-none cursor-pointer transition-colors whitespace-nowrap ${activeCategory === 'ACTIVITIES' ? 'text-rose-500 font-bold text-glow-rose' : 'hover:text-rose-400'}`}>Activities</button>
              <button onClick={() => goToCategory('BUZZ')} className={`bg-transparent border-none cursor-pointer transition-colors whitespace-nowrap ${activeCategory === 'BUZZ' ? 'text-rose-500 font-bold text-glow-rose' : 'hover:text-rose-400'}`}>Buzz</button>
            </div>
            <div className="flex items-center gap-5 text-[12px]">
              <button onClick={() => { setView('LIST_YOUR_SHOW'); setActiveCategory('ALL'); window.scrollTo(0, 0); }} className="hover:text-rose-400 bg-transparent border-none cursor-pointer transition-colors whitespace-nowrap">ListYourShow</button>
              <button onClick={() => { setView('CORPORATES'); setActiveCategory('ALL'); window.scrollTo(0, 0); }} className="hover:text-rose-400 bg-transparent border-none cursor-pointer transition-colors whitespace-nowrap">Corporates</button>
              <button onClick={() => { setView('OFFERS'); setActiveCategory('ALL'); window.scrollTo(0, 0); }} className="hover:text-rose-400 bg-transparent border-none cursor-pointer transition-colors whitespace-nowrap">Offers</button>
              <button onClick={() => { setView('GIFT_CARDS'); setActiveCategory('ALL'); window.scrollTo(0, 0); }} className="hover:text-rose-400 bg-transparent border-none cursor-pointer transition-colors whitespace-nowrap">Gift Cards</button>
            </div>
          </div>
        </div>
      </nav>

      {/* App Content Routing */}
      <main>
        <>
          {view === 'HOME' && city && (
            <div key="home">
              <Home 
                onSelectMovie={handleSelectMovie} 
                onSelectSport={handleSelectSport} 
                city={city} 
                category={activeCategory} 
                onSelectCategory={goToCategory}
              />
            </div>
          )}

          {view === 'MOVIE_DETAILS' && selectedMovie && (
            <div key="movie-details">
              <MovieDetails
                movie={selectedMovie}
                city={city}
                onSelectShowtime={handleSelectShowtime}
              />
            </div>
          )}

          {view === 'SPORT_DETAILS' && selectedSport && (
            <div key="sport-details">
              <SportDetails
                sport={selectedSport}
                onBook={handleBookSport}
              />
            </div>
          )}

          {view === 'SEAT_SELECTION' && selectedMovie && selectedTheater && selectedShowtime && (
            <div key="seat-selection">
              <SeatSelection
                movie={selectedMovie}
                theater={selectedTheater}
                showtime={selectedShowtime}
                onCheckout={handleProceedToCheckout}
              />
            </div>
          )}

          {view === 'CHECKOUT' && selectedMovie && selectedTheater && selectedShowtime && (
            <div key="checkout">
              <Checkout
                bookingState={bookingState}
                movie={selectedMovie}
                theater={selectedTheater}
                showtime={selectedShowtime}
                onConfirm={handleConfirmBooking}
              />
            </div>
          )}

          {view === 'TICKET' && selectedMovie && selectedTheater && selectedShowtime && (
            <div key="ticket">
              <TicketConfirmation
                bookingState={bookingState}
                movie={selectedMovie}
                theater={selectedTheater}
                showtime={selectedShowtime}
              />
            </div>
          )}

          {view === 'ADMIN' && (
            <div key="admin">
              <AdminPanel onMovieAdded={() => { setView('HOME'); window.scrollTo(0, 0); }} />
            </div>
          )}

          {view === 'LIST_YOUR_SHOW' && (
            <div key="list-your-show">
              <ListYourShow onBack={resetHome} city={city} />
            </div>
          )}

          {view === 'CORPORATES' && (
            <div key="corporates">
              <Corporates onBack={resetHome} />
            </div>
          )}

          {view === 'OFFERS' && (
            <div key="offers">
              <Offers onBack={resetHome} />
            </div>
          )}

          {view === 'GIFT_CARDS' && (
            <div key="gift-cards">
              <GiftCards onBack={resetHome} />
            </div>
          )}
        </>
      </main>

      {/* Global Footer */}
      <footer className="bg-[#0B0B0F] text-slate-400 py-16 mt-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 border-b border-white/5 pb-8">
            <div>
              <h4 className="font-bold text-white mb-4 text-glow-rose">Movies Now Showing</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><button onClick={resetHome} className="hover:text-white transition bg-transparent border-none cursor-pointer">Kalki 2898 AD</button></li>
                <li><button onClick={resetHome} className="hover:text-white transition bg-transparent border-none cursor-pointer">Inside Out 2</button></li>
                <li><button onClick={resetHome} className="hover:text-white transition bg-transparent border-none cursor-pointer">Munjya</button></li>
                <li><button onClick={resetHome} className="hover:text-white transition bg-transparent border-none cursor-pointer">Chandu Champion</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 text-glow-rose">Top Sports Events</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><button onClick={resetHome} className="hover:text-white transition bg-transparent border-none cursor-pointer">TATA IPL 2026</button></li>
                <li><button onClick={resetHome} className="hover:text-white transition bg-transparent border-none cursor-pointer">Pro Kabaddi League</button></li>
                <li><button onClick={resetHome} className="hover:text-white transition bg-transparent border-none cursor-pointer">Indian Super League</button></li>
                <li><button onClick={resetHome} className="hover:text-white transition bg-transparent border-none cursor-pointer">Premier Badminton</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 text-glow-rose">Events in Top Cities</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><button onClick={resetHome} className="hover:text-white transition bg-transparent border-none cursor-pointer">Events in Mumbai</button></li>
                <li><button onClick={resetHome} className="hover:text-white transition bg-transparent border-none cursor-pointer">Events in Delhi-NCR</button></li>
                <li><button onClick={resetHome} className="hover:text-white transition bg-transparent border-none cursor-pointer">Events in Bengaluru</button></li>
                <li><button onClick={resetHome} className="hover:text-white transition bg-transparent border-none cursor-pointer">Events in Chennai</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 text-glow-rose">Help</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><button onClick={resetHome} className="hover:text-white transition bg-transparent border-none cursor-pointer">About Us</button></li>
                <li><button onClick={resetHome} className="hover:text-white transition bg-transparent border-none cursor-pointer">Contact Us</button></li>
                <li><button onClick={resetHome} className="hover:text-white transition bg-transparent border-none cursor-pointer">Current Openings</button></li>
                <li><button onClick={resetHome} className="hover:text-white transition bg-transparent border-none cursor-pointer">FAQs</button></li>
              </ul>
            </div>
          </div>
          
          <div className="text-center text-sm font-medium text-slate-500">
            <div className="flex justify-center items-center gap-2 mb-4">
               <button onClick={resetHome} className="flex items-center justify-center bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition cursor-pointer p-2 px-4">
                 <Ticket size={14} className="text-rose-500 mr-2 shadow-[0_0_8px_rgba(244,63,94,0.3)]" />
                 <span className="font-extrabold text-lg tracking-tight text-white">Movie<span className="text-rose-500 text-glow-rose">Star</span></span>
               </button>
            </div>
            <p>Copyright 2026 © MovieStar Entertainment Pvt. Ltd. All Rights Reserved.</p>
            <div className="flex justify-center gap-4 mt-4">
               <button onClick={resetHome} className="hover:text-slate-300 transition bg-transparent border-none cursor-pointer">Privacy Policy</button>
               <button onClick={resetHome} className="hover:text-slate-300 transition bg-transparent border-none cursor-pointer">Terms of Service</button>
               <button onClick={resetHome} className="hover:text-slate-300 transition bg-transparent border-none cursor-pointer">Do Not Sell My Information</button>
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
