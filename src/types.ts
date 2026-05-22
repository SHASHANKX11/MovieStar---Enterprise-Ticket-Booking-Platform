export type City = string;

export type SeatTier = 'VIP' | 'GOLD' | 'SILVER';

export type MovieLanguage = 'Hindi' | 'English' | 'Tamil' | 'Telugu' | 'Kannada' | 'Malayalam';

export interface Movie {
  id: string;
  title: string;
  genre: string[];
  language: string;
  languages: MovieLanguage[];
  format: string;
  duration: string;
  poster: string;
  bgImage: string;
  rating: number;
  votes: string;
  releaseDate: string;
  isPremiere?: boolean;
  isComingSoon?: boolean;
  certificate?: string; // U, UA, A
  trailerYoutubeId?: string;
  synopsis?: string;
  cast?: { id: string; name: string; role: string; image: string }[];
  crew?: { id: string; name: string; role: string; image: string }[];
  reviews?: { id: string; user: string; avatar: string; rating: number; date: string; content: string }[];
}

export interface LiveEvent {
  id: string;
  title: string;
  category: string;
  date: string;
  venue: string;
  city: string;
  price: string;
  poster: string;
}

export interface SportEvent {
  id: string;
  title: string;
  tournament: string;
  sportType: string;
  teams: string[];
  date: string;
  time: string;
  venue: string;
  city: string;
  priceRange: string;
  poster: string;
  bgImage: string;
  trailerYoutubeId?: string;
  about?: string;
}

export interface Theater {
  id: string;
  city: string;
  name: string;
  facilities: string[];
}

export interface Showtime {
  id: string;
  movieId: string;
  theaterId: string;
  date: string; // e.g., '2026-05-20'
  time: string; // e.g., '10:30 AM'
  format: string; // e.g., '2D', 'IMAX 3D'
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  tier: SeatTier;
  price: number;
  status: 'available' | 'booked';
}

export interface BookingState {
  movieId?: string;
  theaterId?: string;
  showtimeId?: string;
  selectedSeats: Seat[];
  totalAmount: number;
  convenienceFee: number;
}
