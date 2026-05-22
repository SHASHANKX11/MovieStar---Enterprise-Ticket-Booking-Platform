import { Movie, Theater, Showtime, Seat, SeatTier, SportEvent, LiveEvent } from './types';

export const CITIES = ['Mumbai', 'Delhi-NCR', 'Bengaluru', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Kochi', 'Doddaballapur', 'Ahmedabad', 'Chandigarh'];

export const SPORT_EVENTS: SportEvent[] = [
  {
    id: 'sp1',
    title: 'TATA IPL 2026: RCB vs CSK',
    tournament: 'TATA IPL 2026',
    sportType: 'Cricket',
    teams: ['Royal Challengers Bengaluru', 'Chennai Super Kings'],
    date: '2026-05-24',
    time: '07:30 PM',
    venue: 'M. Chinnaswamy Stadium',
    city: 'Bengaluru',
    priceRange: 'Rs. 1500 - Rs. 12000',
    poster: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=400',
    bgImage: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=1200',
    trailerYoutubeId: 'IOiynB3WX_c',
    about: 'Experience the greatest rivalry in franchise cricket as the Royal Challengers Bengaluru take on the Chennai Super Kings in a high-octane TATA IPL 2026 clash.'
  },
  {
    id: 'sp2',
    title: 'TATA IPL 2026: MI vs KKR',
    tournament: 'TATA IPL 2026',
    sportType: 'Cricket',
    teams: ['Mumbai Indians', 'Kolkata Knight Riders'],
    date: '2026-05-25',
    time: '07:30 PM',
    venue: 'Wankhede Stadium',
    city: 'Mumbai',
    priceRange: 'Rs. 1200 - Rs. 10000',
    poster: 'https://images.unsplash.com/photo-1593766827228-8737b4534aa6?auto=format&fit=crop&q=80&w=400',
    bgImage: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&q=80&w=1200',
    about: 'The battle of the champions! Mumbai Indians face off against Kolkata Knight Riders under the lights.'
  },
  {
    id: 'sp3',
    title: 'Pro Kabaddi: Bulls vs Pirates',
    tournament: 'Pro Kabaddi League',
    sportType: 'Kabaddi',
    teams: ['Bengaluru Bulls', 'Patna Pirates'],
    date: '2026-05-28',
    time: '08:00 PM',
    venue: 'Kanteerava Indoor Stadium',
    city: 'Bengaluru',
    priceRange: 'Rs. 500 - Rs. 3000',
    poster: 'https://images.unsplash.com/photo-1628891435222-065926d73a94?auto=format&fit=crop&q=80&w=400',
    bgImage: 'https://images.unsplash.com/photo-1518659616233-ff10fef4cc41?auto=format&fit=crop&q=80&w=1200',
    about: 'Witness the intense mat battle between two powerhouse kabaddi franchises.'
  }
];

export const INITIAL_MOVIES: Movie[] = [
  // ── HINDI ──────────────────────────────────────
  {
    id: 'm1',
    title: 'Pushpa 2: The Rule',
    genre: ['Action', 'Crime', 'Drama'],
    language: 'Telugu (Hindi Dubbed)',
    languages: ['Telugu', 'Hindi', 'Tamil'],
    format: '2D, IMAX, 4DX',
    duration: '3h 21m',
    certificate: 'UA',
    poster: 'https://media.themoviedb.org/t/p/w500/bhxZj3y59cK7JtGdV285dhDRaMe.jpg',
    bgImage: 'https://media.themoviedb.org/t/p/original/keC82cQ8q0ZHthrbvzWq04kGnbv.jpg',
    rating: 8.5,
    votes: '420K',
    releaseDate: '5 Dec, 2024',
    trailerYoutubeId: 'g3JUbgOHgdw',
    synopsis: 'Pushpa Raj continues his dominance over the red sandalwood smuggling empire, but faces a formidable nemesis in the form of Bhanwar Singh Shekhawat, who vows to bring him down.',
    cast: [
      { id: 'c1', name: 'Allu Arjun', role: 'Pushpa Raj', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop' },
      { id: 'c2', name: 'Rashmika Mandanna', role: 'Srivalli', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop' },
      { id: 'c3', name: 'Fahadh Faasil', role: 'Bhanwar Singh', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop' }
    ],
    crew: [
      { id: 'cr1', name: 'Sukumar', role: 'Director', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop' }
    ],
    reviews: [
      { id: 'r1', user: 'AlluFan007', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pushpa', rating: 5, date: '6 Dec, 2024', content: 'Allu Arjun absolutely rules! The mass scenes are next level. ICON STAR!' }
    ]
  },
  {
    id: 'm2',
    title: 'Kalki 2898 AD',
    genre: ['Sci-Fi', 'Mythology', 'Action'],
    language: 'Telugu, Hindi, Tamil, Kannada',
    languages: ['Telugu', 'Hindi', 'Tamil', 'Kannada'],
    format: '2D, IMAX 3D, 4DX',
    duration: '3h 1m',
    certificate: 'UA',
    poster: 'https://media.themoviedb.org/t/p/w500/rstcAnBeCkxNQjNp3YXrF6IP1tW.jpg',
    bgImage: 'https://media.themoviedb.org/t/p/original/o8XSR1SONnjcsv84NRu6Mwsl5io.jpg',
    rating: 8.3,
    votes: '310K',
    releaseDate: '27 Jun, 2024',
    isPremiere: true,
    trailerYoutubeId: 'rn7tdg6cpW4',
    synopsis: 'Set in a dystopian future where humanity has nearly exhausted the Earth\'s resources, the story follows Kalki, the 10th avatar of Vishnu, as he battles Supreme Yaskin.',
    cast: [
      { id: 'c4', name: 'Prabhas', role: 'Bhairava / Kalki', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop' },
      { id: 'c5', name: 'Deepika Padukone', role: 'Sumathi', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop' },
      { id: 'c6', name: 'Amitabh Bachchan', role: 'Ashwatthama', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop' }
    ],
    crew: [
      { id: 'cr2', name: 'Nag Ashwin', role: 'Director', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop' }
    ],
    reviews: [
      { id: 'r2', user: 'SciFiLover', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kalki', rating: 4.5, date: '28 Jun, 2024', content: 'A visual spectacle! The mythological sci-fi blend is unique and brilliant.' }
    ]
  },
  {
    id: 'm3',
    title: 'Stree 2',
    genre: ['Horror', 'Comedy', 'Thriller'],
    language: 'Hindi',
    languages: ['Hindi'],
    format: '2D',
    duration: '2h 16m',
    certificate: 'UA',
    poster: 'https://media.themoviedb.org/t/p/w500/2NC7sj8rheKxWqLYAbHnCa4mYBH.jpg',
    bgImage: 'https://media.themoviedb.org/t/p/original/fVV0A67kDjTTQ4CvUn8LoletRmI.jpg',
    rating: 8.8,
    votes: '280K',
    releaseDate: '15 Aug, 2024',
    trailerYoutubeId: 'VlvOgk5BHS4',
    synopsis: 'The men of Chanderi must unite again to face a new supernatural terror — one even more powerful than Stree herself.',
    cast: [
      { id: 'c7', name: 'Rajkummar Rao', role: 'Vicky', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop' },
      { id: 'c8', name: 'Shraddha Kapoor', role: 'Stree', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop' },
      { id: 'c9', name: 'Tamannaah Bhatia', role: 'Guest', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop' }
    ],
    crew: [
      { id: 'cr3', name: 'Amar Kaushik', role: 'Director', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop' }
    ],
    reviews: [
      { id: 'r3', user: 'HorrorFan', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Stree', rating: 5, date: '16 Aug, 2024', content: 'Even scarier and funnier! The cameos are worth every penny.' }
    ]
  },
  // ── KANNADA ─────────────────────────────────────
  {
    id: 'm4',
    title: 'Kantara: Chapter 1',
    genre: ['Mythology', 'Action', 'Thriller'],
    language: 'Kannada',
    languages: ['Kannada', 'Hindi', 'Tamil', 'Telugu'],
    format: '2D',
    duration: '2h 20m',
    certificate: 'UA',
    poster: 'https://media.themoviedb.org/t/p/w500/3CP7crYcSBV0k8JP6fl0XaMPpDY.jpg',
    bgImage: 'https://media.themoviedb.org/t/p/original/w57nxiBIODAYHLRs1xmrCY9zEFe.jpg',
    rating: 9.1,
    votes: '185K',
    releaseDate: '2026 (Coming Soon)',
    isPremiere: true,
    isComingSoon: true,
    trailerYoutubeId: 'TMQUFhWm8C0',
    synopsis: 'The prequel to the blockbuster Kantara explores the ancient covenant between the tribal deity Panjurli and the village of Kaadubettu.',
    cast: [
      { id: 'c10', name: 'Rishab Shetty', role: 'Shiva\'s Ancestor', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop' }
    ],
    crew: [
      { id: 'cr4', name: 'Rishab Shetty', role: 'Director', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop' }
    ],
    reviews: []
  },
  {
    id: 'm5',
    title: 'KGF: Chapter 3',
    genre: ['Action', 'Drama', 'Crime'],
    language: 'Kannada',
    languages: ['Kannada', 'Hindi', 'Tamil', 'Telugu', 'Malayalam'],
    format: '2D, IMAX, 4DX',
    duration: '3h 5m',
    certificate: 'A',
    poster: 'https://media.themoviedb.org/t/p/w500/khNVygolU0TxLIDWff5tQlAhZ23.jpg',
    bgImage: 'https://media.themoviedb.org/t/p/original/nsV5Mfi9FAV4w8eDsdr7uqVswOk.jpg',
    rating: 9.4,
    votes: '510K',
    releaseDate: '2026 (Coming Soon)',
    isPremiere: true,
    isComingSoon: true,
    trailerYoutubeId: 'Qah9sSIXJqk',
    synopsis: 'Rocky\'s legacy continues as the KGF empire faces its most dangerous challenge yet. The saga of blood, power, and survival reaches its epic conclusion.',
    cast: [
      { id: 'c11', name: 'Yash', role: 'Rocky Bhai', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop' },
      { id: 'c12', name: 'Sanjay Dutt', role: 'Adheera', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop' }
    ],
    crew: [
      { id: 'cr5', name: 'Prashanth Neel', role: 'Director', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop' }
    ],
    reviews: [
      { id: 'r5', user: 'KGFFan', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=KGF', rating: 5, date: '1 Jan, 2026', content: 'Rocky never dies. The most awaited film of the decade!' }
    ]
  },
  // ── TAMIL ────────────────────────────────────────
  {
    id: 'm6',
    title: 'Vettaiyan',
    genre: ['Action', 'Thriller'],
    language: 'Tamil',
    languages: ['Tamil', 'Hindi', 'Telugu'],
    format: '2D',
    duration: '2h 40m',
    certificate: 'UA',
    poster: 'https://media.themoviedb.org/t/p/w500/yEEyhQaW7cEb0IDJstoMBmEtPND.jpg',
    bgImage: 'https://media.themoviedb.org/t/p/original/b3AeMIsXPm6wvGp9E7mGmRZ6528.jpg',
    rating: 8.0,
    votes: '95K',
    releaseDate: '10 Oct, 2024',
    trailerYoutubeId: 'NQXE3iJCWNI',
    synopsis: 'A fearless cop takes on a ruthless drug lord in a gritty battle that pushes him to the edge of law and morality.',
    cast: [
      { id: 'c13', name: 'Rajinikanth', role: 'Rajadurai', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop' },
      { id: 'c14', name: 'Fahadh Faasil', role: 'Villain', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop' }
    ],
    crew: [
      { id: 'cr6', name: 'T. J. Gnanavel', role: 'Director', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop' }
    ],
    reviews: [
      { id: 'r6', user: 'ThalaivaFan', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajini', rating: 4.5, date: '11 Oct, 2024', content: 'Superstar delivers! His presence alone is worth the ticket.' }
    ]
  },
  {
    id: 'm7',
    title: 'Amaran',
    genre: ['War', 'Biography', 'Drama'],
    language: 'Tamil',
    languages: ['Tamil', 'Hindi', 'Telugu'],
    format: '2D',
    duration: '2h 46m',
    certificate: 'UA',
    poster: 'https://media.themoviedb.org/t/p/w500/eCB06m1KUGilEOlIzb40nkQhVY0.jpg',
    bgImage: 'https://media.themoviedb.org/t/p/original/7cNE2qydew1c8fqnlhWjkE3DHc2.jpg',
    rating: 8.9,
    votes: '210K',
    releaseDate: '31 Oct, 2024',
    trailerYoutubeId: 'hylIXfZeB4c',
    synopsis: 'Based on the life of Major Mukund Varadarajan, an Army officer who was posthumously awarded the Ashoka Chakra for his bravery.',
    cast: [
      { id: 'c15', name: 'Sivakarthikeyan', role: 'Major Mukund', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop' },
      { id: 'c16', name: 'Sai Pallavi', role: 'Indhu Rebecca Varghese', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop' }
    ],
    crew: [
      { id: 'cr7', name: 'Rajkumar Periasamy', role: 'Director', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop' }
    ],
    reviews: [
      { id: 'r7', user: 'PatriotIndia', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amaran', rating: 5, date: '1 Nov, 2024', content: 'One of the most moving films ever. Sai Pallavi is phenomenal.' }
    ]
  },
  // ── TELUGU ───────────────────────────────────────
  {
    id: 'm8',
    title: 'Devara: Part 1',
    genre: ['Action', 'Thriller', 'Drama'],
    language: 'Telugu',
    languages: ['Telugu', 'Hindi', 'Tamil'],
    format: '2D, IMAX',
    duration: '2h 55m',
    certificate: 'UA',
    poster: 'https://media.themoviedb.org/t/p/w500/lqoMzCcZYEFK729d6qzt349fB4o.jpg',
    bgImage: 'https://media.themoviedb.org/t/p/original/8ODNt5olCeIqBYTP3GgXEQYTfeX.jpg',
    rating: 7.8,
    votes: '145K',
    releaseDate: '27 Sep, 2024',
    trailerYoutubeId: 'lR5nlovVgvQ',
    synopsis: 'A fearless sea lord who rules the coasts with an iron fist must confront both a deadly rival and his own son who questions his ways.',
    cast: [
      { id: 'c17', name: 'Jr NTR', role: 'Devara / Vara', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop' },
      { id: 'c18', name: 'Janhvi Kapoor', role: 'Thangam', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop' }
    ],
    crew: [
      { id: 'cr8', name: 'Koratala Siva', role: 'Director', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop' }
    ],
    reviews: [
      { id: 'r8', user: 'NTRFan', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Devara', rating: 4, date: '28 Sep, 2024', content: 'NTR in a double role is a treat. Mass entertainer at its finest.' }
    ]
  },
  {
    id: 'm9',
    title: 'Salaar: Part 1',
    genre: ['Action', 'Crime', 'Drama'],
    language: 'Telugu, Kannada',
    languages: ['Telugu', 'Kannada', 'Hindi', 'Tamil'],
    format: '2D, IMAX 3D',
    duration: '3h 4m',
    certificate: 'A',
    poster: 'https://media.themoviedb.org/t/p/w500/nlu9WbcetNFRGXXPWITr30ob7W6.jpg',
    bgImage: 'https://media.themoviedb.org/t/p/original/xtOCTmGemASooRkAxRorYODig1p.jpg',
    rating: 7.5,
    votes: '130K',
    releaseDate: '22 Dec, 2023',
    trailerYoutubeId: '9Im1q4gvk1M',
    synopsis: 'Deva, a brutal warrior, must confront his past as he arrives at Khansaar, a land ruled by violence and blood.',
    cast: [
      { id: 'c19', name: 'Prabhas', role: 'Deva', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop' },
      { id: 'c20', name: 'Prithviraj Sukumaran', role: 'Vardha', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop' }
    ],
    crew: [
      { id: 'cr9', name: 'Prashanth Neel', role: 'Director', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop' }
    ],
    reviews: [
      { id: 'r9', user: 'PrabhasFan', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Salaar', rating: 4, date: '23 Dec, 2023', content: 'Prabhas is back with a bang. Prashanth Neel\'s signature style.' }
    ]
  },
  // ── ENGLISH ──────────────────────────────────────
  {
    id: 'm10',
    title: 'Deadpool & Wolverine',
    genre: ['Action', 'Comedy', 'Superhero'],
    language: 'English',
    languages: ['English', 'Hindi', 'Tamil', 'Telugu'],
    format: '2D, 3D, IMAX 3D',
    duration: '2h 7m',
    certificate: 'A',
    poster: 'https://media.themoviedb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    bgImage: 'https://media.themoviedb.org/t/p/original/ufpeVEM64uZHPpzzeiDNIAdaeOD.jpg',
    rating: 9.4,
    votes: '580K',
    releaseDate: '26 Jul, 2024',
    isPremiere: true,
    trailerYoutubeId: 'Idh8n5XuYIA',
    synopsis: 'Deadpool teams up with Wolverine in a multiverse-hopping adventure that will change the MCU forever. Expect fourth-wall breaks, mayhem, and a lot of laughs.',
    cast: [
      { id: 'c21', name: 'Ryan Reynolds', role: 'Deadpool', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop' },
      { id: 'c22', name: 'Hugh Jackman', role: 'Wolverine', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop' }
    ],
    crew: [
      { id: 'cr10', name: 'Shawn Levy', role: 'Director', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop' }
    ],
    reviews: [
      { id: 'r10', user: 'MarvelManiac', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DP', rating: 5, date: '27 Jul, 2024', content: 'The duo we always wanted! Absolute chaos in the best way possible.' }
    ]
  },
  {
    id: 'm11',
    title: 'Inside Out 2',
    genre: ['Animation', 'Comedy', 'Family'],
    language: 'English',
    languages: ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada'],
    format: '2D, 3D',
    duration: '1h 40m',
    certificate: 'U',
    poster: 'https://media.themoviedb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
    bgImage: 'https://media.themoviedb.org/t/p/original/p5ozvmdgsmbWe0H8Xk7Rc8SCwAB.jpg',
    rating: 8.6,
    votes: '195K',
    releaseDate: '14 Jun, 2024',
    isPremiere: true,
    trailerYoutubeId: 'u69y5Ie519M',
    synopsis: "Riley's mind gets new Emotions — Anxiety, Envy, Ennui, and Embarrassment — as she enters her teenage years. Joy must adapt to the changes or risk losing who Riley truly is.",
    cast: [
      { id: 'c23', name: 'Amy Poehler', role: 'Joy (voice)', image: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop' },
      { id: 'c24', name: 'Maya Hawke', role: 'Anxiety (voice)', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop' }
    ],
    crew: [
      { id: 'cr11', name: 'Kelsey Mann', role: 'Director', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop' }
    ],
    reviews: [
      { id: 'r11', user: 'PixarFan', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=InsideOut', rating: 5, date: '15 Jun, 2024', content: 'Emotional rollercoaster from start to finish. Perfect for all ages.' }
    ]
  },
  {
    id: 'm12',
    title: 'Dune: Part Two',
    genre: ['Sci-Fi', 'Adventure', 'Epic'],
    language: 'English',
    languages: ['English', 'Hindi'],
    format: '2D, IMAX, 4DX',
    duration: '2h 46m',
    certificate: 'UA',
    poster: 'https://media.themoviedb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    bgImage: 'https://media.themoviedb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg',
    rating: 9.1,
    votes: '385K',
    releaseDate: '1 Mar, 2024',
    trailerYoutubeId: 'U2Qp5pL3ovA',
    synopsis: 'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe.',
    cast: [
      { id: 'c25', name: 'Timothée Chalamet', role: 'Paul Atreides', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop' },
      { id: 'c26', name: 'Zendaya', role: 'Chani', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop' },
      { id: 'c27', name: 'Austin Butler', role: 'Feyd-Rautha', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop' }
    ],
    crew: [
      { id: 'cr12', name: 'Denis Villeneuve', role: 'Director', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop' }
    ],
    reviews: [
      { id: 'r12', user: 'SciFiNerd', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dune', rating: 4.5, date: '2 Mar, 2024', content: 'Visually breathtaking. Hans Zimmer\'s score is other-worldly.' }
    ]
  },
  // ── MALAYALAM ────────────────────────────────────
  {
    id: 'm13',
    title: 'Manjummel Boys',
    genre: ['Adventure', 'Drama', 'Survival'],
    language: 'Malayalam',
    languages: ['Malayalam', 'Tamil', 'Hindi', 'Telugu'],
    format: '2D',
    duration: '2h 17m',
    certificate: 'UA',
    poster: 'https://media.themoviedb.org/t/p/w500/bswrtewwthpsh6nABiqKevU4UBI.jpg',
    bgImage: 'https://media.themoviedb.org/t/p/original/zGsHpuMN412VyzJZZnQeq4lMdjF.jpg',
    rating: 8.5,
    votes: '88K',
    releaseDate: '22 Feb, 2024',
    trailerYoutubeId: '9uzfrur9SDU',
    synopsis: 'A group of friends on a trip to Kodaikanal face a life-or-death situation when one of them falls into the notorious Guna cave — a place from which no one has returned alive.',
    cast: [
      { id: 'c28', name: 'Soubin Shahir', role: 'Kuttan', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop' },
      { id: 'c29', name: 'Shyam Mohan', role: 'Subbai', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop' }
    ],
    crew: [
      { id: 'cr13', name: 'Chidambaram S. Poduval', role: 'Director', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop' }
    ],
    reviews: [
      { id: 'r13', user: 'MolywoodFan', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Manjummel', rating: 5, date: '23 Feb, 2024', content: 'Edge of your seat thriller! Emotional and powerful.' }
    ]
  },
  {
    id: 'm14',
    title: 'RRR',
    genre: ['Action', 'Epic', 'Historical'],
    language: 'Telugu',
    languages: ['Telugu', 'Hindi', 'Tamil', 'Kannada', 'Malayalam'],
    format: '2D, IMAX',
    duration: '3h 2m',
    certificate: 'UA',
    poster: 'https://media.themoviedb.org/t/p/w500/u0XUBNQWlOvrh0Gd97ARGpIkL0.jpg',
    bgImage: 'https://media.themoviedb.org/t/p/original/i0Y0wP8H6SRgjr6QmuwbtQbS24D.jpg',
    rating: 9.5,
    votes: '890K',
    releaseDate: '25 Mar, 2022',
    trailerYoutubeId: 'i4pjiLGUTtk',
    synopsis: 'A fictional tale about two legendary revolutionaries and their journey away from home before they started fighting for their country in the 1920s.',
    cast: [
      { id: 'c30', name: 'Jr NTR', role: 'Komaram Bheem', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop' },
      { id: 'c31', name: 'Ram Charan', role: 'A. Rama Raju', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop' },
      { id: 'c32', name: 'Alia Bhatt', role: 'Sita', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop' }
    ],
    crew: [
      { id: 'cr14', name: 'S. S. Rajamouli', role: 'Director', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop' }
    ],
    reviews: [
      { id: 'r14', user: 'Rajamouli_Fan', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RRR', rating: 5, date: '26 Mar, 2022', content: 'Naatu Naatu! This film is a cultural phenomenon. Absolutely spectacular.' }
    ]
  }
];

const getPersistedMovies = (): Movie[] => {
  const persisted = localStorage.getItem('moviestar_movies');
  if (persisted) {
    try {
      const storedMovies: Movie[] = JSON.parse(persisted);
      // Synchronize latest static assets, ratings, and trailers from INITIAL_MOVIES into the persisted array,
      // but do not restore deleted ones and keep newly added ones intact.
      return storedMovies.map(stored => {
        const initial = INITIAL_MOVIES.find(m => m.id === stored.id);
        if (initial) {
          return {
            ...stored,
            title: initial.title,
            genre: initial.genre,
            language: initial.language,
            languages: initial.languages,
            format: initial.format,
            duration: initial.duration,
            certificate: initial.certificate,
            poster: initial.poster,
            bgImage: initial.bgImage,
            rating: initial.rating,
            votes: initial.votes,
            releaseDate: initial.releaseDate,
            isPremiere: initial.isPremiere,
            isComingSoon: initial.isComingSoon,
            trailerYoutubeId: initial.trailerYoutubeId,
            synopsis: initial.synopsis,
            cast: initial.cast,
            crew: initial.crew
          };
        }
        return stored;
      });
    } catch (e) {
      console.error('Failed to parse persisted movies:', e);
    }
  }
  return INITIAL_MOVIES;
};

export const MOVIES: Movie[] = getPersistedMovies();

export const saveMoviesToStorage = () => {
  localStorage.setItem('moviestar_movies', JSON.stringify(MOVIES));
};

export const LIVE_EVENTS: LiveEvent[] = [
  // ── MUSIC & COMEDY & FESTIVALS (EVENTS) ──────────────────
  {
    id: 'le1',
    title: 'Sunburn Arena ft. Alan Walker',
    category: 'Music Shows',
    date: 'Fri, 25 Oct onwards',
    venue: 'Bhartiya Mall of Bengaluru',
    city: 'Bengaluru',
    price: 'Rs. 999 onwards',
    poster: 'https://images.unsplash.com/photo-1540039155732-684735035727?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'le2',
    title: 'Zakir Khan Live - Tathastu',
    category: 'Comedy Shows',
    date: 'Sun, 20 Oct',
    venue: 'Manpho Convention Centre',
    city: 'Bengaluru',
    price: 'Rs. 799 onwards',
    poster: 'https://images.unsplash.com/photo-1527224857830-43a7ebb8545e?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'le_m1',
    title: 'Arijit Singh Live Symphony Tour',
    category: 'Music Shows',
    date: 'Sat, 14 Dec',
    venue: 'Jio World Garden, BKC',
    city: 'Mumbai',
    price: 'Rs. 1999 onwards',
    poster: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'le_c1',
    title: 'Vir Das: Mind Fool World Tour',
    category: 'Comedy Shows',
    date: 'Thu, 12 Nov',
    venue: 'Chowdiah Memorial Hall',
    city: 'Bengaluru',
    price: 'Rs. 1200 onwards',
    poster: 'https://images.unsplash.com/photo-1585699324551-f6c309eed262?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'le_f1',
    title: 'Doddaballapur Spice & Food Festival',
    category: 'Food Festivals',
    date: 'Sat, 18 Oct',
    venue: 'Doddaballapur Town Grounds',
    city: 'Doddaballapur',
    price: 'Rs. 150 onwards',
    poster: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400'
  },

  // ── THEATRE / PLAYS ──────────────────────────────────────
  {
    id: 'le4',
    title: 'Romeo & Juliet — A Ballet',
    category: 'Theatre',
    date: 'Fri, 15 Nov',
    venue: 'Chowdiah Memorial Hall',
    city: 'Bengaluru',
    price: 'Rs. 500 onwards',
    poster: 'https://images.unsplash.com/photo-1507676184212-d0330a15183c?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'le_t1',
    title: 'Mughal-e-Azam: The Musical',
    category: 'Theatre',
    date: 'Sat, 09 Nov onwards',
    venue: 'Jamshed Bhabha Theatre: NCPA',
    city: 'Mumbai',
    price: 'Rs. 1500 onwards',
    poster: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'le_t2',
    title: 'Macbeth: A Tribal Gothic Adaptation',
    category: 'Theatre',
    date: 'Wed, 23 Oct',
    venue: 'Ranga Shankara, J.P. Nagar',
    city: 'Bengaluru',
    price: 'Rs. 400',
    poster: 'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&q=80&w=400'
  },

  // ── WORKSHOPS & ADVENTURES & EXHIBITIONS (ACTIVITIES) ────
  {
    id: 'le3',
    title: 'Handmade Pottery Workshop',
    category: 'Workshops',
    date: 'Sat, 12 Oct',
    venue: 'Lahe Lahe, Indiranagar',
    city: 'Bengaluru',
    price: 'Rs. 1500',
    poster: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'le_a1',
    title: 'Doddaballapur Vineyard & Wine Tour',
    category: 'Adventure',
    date: 'Every Sunday',
    venue: 'Grover Zampa Vineyards',
    city: 'Doddaballapur',
    price: 'Rs. 2200',
    poster: 'https://images.unsplash.com/photo-1528254847117-67bbde7c234a?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'le_a2',
    title: 'Soap Making & Natural Cosmetics Class',
    category: 'Workshops',
    date: 'Sat, 26 Oct',
    venue: 'Doddaballapur Community Hall',
    city: 'Doddaballapur',
    price: 'Rs. 850',
    poster: 'https://images.unsplash.com/photo-1607006342411-924fdbb1480f?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'le_a3',
    title: 'Nandi Hills Rock Climbing Camp',
    category: 'Adventure',
    date: 'Sun, 27 Oct',
    venue: 'Nandi Hills Base Camp',
    city: 'Doddaballapur',
    price: 'Rs. 1800',
    poster: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'le_new1',
    title: 'Jazz Night – Live',
    category: 'Music Shows',
    date: 'Fri, 30 Oct',
    venue: 'Blue Note, Bengaluru',
    city: 'Bengaluru',
    price: 'Rs. 1200 onwards',
    poster: 'https://images.unsplash.com/photo-1529101091764-c3526daf38fe?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'le_new2',
    title: 'Shakespearean Play – Hamlet',
    category: 'Theatre',
    date: 'Sat, 4 Nov',
    venue: 'Ranga Shankara',
    city: 'Bengaluru',
    price: 'Rs. 800 onwards',
    poster: 'https://images.unsplash.com/photo-1589571895475-66cac4f824a9?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'le_new3',
    title: 'Interstate Football Championship',
    category: 'Sports',
    date: 'Sun, 12 Nov',
    venue: 'Sree Kanteerava Stadium',
    city: 'Bengaluru',
    price: 'Rs. 1500 onwards',
    poster: 'https://images.unsplash.com/photo-1521412803525-924711453753?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'le_new4',
    title: 'Adventure Hiking Trip',
    category: 'Adventure',
    date: 'Mon, 20 Nov',
    venue: 'Nandi Hills',
    city: 'Doddaballapur',
    price: 'Rs. 2000 onwards',
    poster: 'https://images.unsplash.com/photo-1508261305953-fb9c0710e443?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'le_new5',
    title: 'Buzz: Tech Startup Pitch Night',
    category: 'Buzz',
    date: 'Tue, 22 Nov',
    venue: 'CoWork Hub, Bengaluru',
    city: 'Bengaluru',
    price: 'Free',
    poster: 'https://images.unsplash.com/photo-1485425001249-149ca5c4a2e1?auto=format&fit=crop&q=80&w=400'
  }
];


export const THEATERS: Theater[] = [
  { id: 't1', city: 'Mumbai', name: 'PVR: ICON Palladium, Lower Parel', facilities: ['M-Ticket', 'Food & Beverage', 'Parking'] },
  { id: 't2', city: 'Mumbai', name: 'Cinepolis: Andheri (W)', facilities: ['M-Ticket', 'Recliner', 'Dolby Atmos'] },
  { id: 't3', city: 'Delhi-NCR', name: 'PVR: Select City Walk, Saket', facilities: ['M-Ticket', 'Food & Beverage', 'Recliner'] },
  { id: 't4', city: 'Delhi-NCR', name: 'INOX: GIP Mall, Noida', facilities: ['M-Ticket', 'IMAX', 'Food & Beverage'] },
  { id: 't5', city: 'Bengaluru', name: 'INOX: Forum Mall, Koramangala', facilities: ['M-Ticket', 'Food & Beverage'] },
  { id: 't6', city: 'Bengaluru', name: 'Cinemax: Central Mall, Bellandur', facilities: ['M-Ticket', 'Food & Beverage', 'Recliner'] },
  { id: 't7', city: 'Bengaluru', name: 'PVR: Orion Mall, Rajajinagar', facilities: ['M-Ticket', 'Food & Beverage', 'IMAX'] },
  { id: 't8', city: 'Bengaluru', name: 'Cinepolis: Nexus Shantiniketan', facilities: ['M-Ticket', 'Dolby Atmos'] },
  { id: 't9', city: 'Hyderabad', name: 'PVR: Inorbit Mall, Madhapur', facilities: ['M-Ticket', 'IMAX', 'Recliner'] },
  { id: 't10', city: 'Hyderabad', name: 'Cinepolis: Forum Sujana Mall', facilities: ['M-Ticket', 'Food & Beverage'] },
  { id: 't11', city: 'Chennai', name: 'SPI: Palazzo, Nungambakkam', facilities: ['M-Ticket', 'Recliner', 'Dolby Atmos'] },
  { id: 't12', city: 'Chennai', name: 'PVR: VR Mall, Anna Nagar', facilities: ['M-Ticket', 'Food & Beverage'] },
  { id: 't13', city: 'Doddaballapur', name: 'Giri Cinema: Doddaballapur', facilities: ['M-Ticket', 'Food & Beverage'] },
  { id: 't14', city: 'Doddaballapur', name: 'Sangam Theatre: Doddaballapur', facilities: ['M-Ticket', 'Dolby Atmos', 'Recliner'] },
  { id: 't15', city: 'Ahmedabad', name: 'PVR: Acropolis Mall, Thaltej', facilities: ['M-Ticket', 'Food & Beverage', 'Parking'] },
  { id: 't16', city: 'Ahmedabad', name: 'Cinepolis: Alpha One, Vastrapur', facilities: ['M-Ticket', 'IMAX', 'Recliner'] },
  { id: 't17', city: 'Chandigarh', name: 'PVR: Elante Mall', facilities: ['M-Ticket', 'IMAX', 'Dolby Atmos'] },
  { id: 't18', city: 'Chandigarh', name: 'Cinepolis: TDI Mall', facilities: ['M-Ticket', 'Food & Beverage', 'Recliner'] },
];

// ── Dynamic date helpers ─────────────────────────
const toDateStr = (d: Date): string => d.toISOString().split('T')[0];
const today = new Date();
const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
const dayAfter = new Date(today); dayAfter.setDate(today.getDate() + 2);

export const SHOWTIME_DATES = [toDateStr(today), toDateStr(tomorrow), toDateStr(dayAfter)];

export const SHOWTIMES: Showtime[] = [];
export const generateShowtimesForMovie = (movie: Movie) => {
  const timesArray = ['09:30 AM', '12:15 PM', '03:45 PM', '07:00 PM', '10:30 PM'];
  THEATERS.forEach(theater => {
    SHOWTIME_DATES.forEach(date => {
      timesArray.forEach((time, index) => {
        if ((movie.id.charCodeAt(1) + theater.id.charCodeAt(1) + index) % 3 === 0) return;
        SHOWTIMES.push({
          id: `s-${movie.id}-${theater.id}-${date}-${index}`,
          movieId: movie.id,
          theaterId: theater.id,
          date,
          time,
          format: index % 3 === 0 ? 'IMAX 3D' : index % 2 === 0 ? '3D' : '2D'
        });
      });
    });
  });
};


MOVIES.forEach(movie => generateShowtimesForMovie(movie));

export const generateSeats = (): Seat[] => {
  const seats: Seat[] = [];
  const rows = [
    { row: 'J', count: 18, tier: 'VIP', price: 600 },
    { row: 'I', count: 18, tier: 'VIP', price: 600 },
    { row: 'H', count: 18, tier: 'VIP', price: 600 },
    { row: 'G', count: 16, tier: 'GOLD', price: 350 },
    { row: 'F', count: 16, tier: 'GOLD', price: 350 },
    { row: 'E', count: 16, tier: 'GOLD', price: 350 },
    { row: 'D', count: 14, tier: 'SILVER', price: 200 },
    { row: 'C', count: 14, tier: 'SILVER', price: 200 },
    { row: 'B', count: 12, tier: 'SILVER', price: 200 },
    { row: 'A', count: 12, tier: 'SILVER', price: 200 },
  ];
  rows.forEach(r => {
    for (let c = 1; c <= r.count; c++) {
      const isBooked = Math.random() < 0.3;
      seats.push({
        id: `${r.row}${c}`,
        row: r.row,
        number: c,
        tier: r.tier as SeatTier,
        price: r.price,
        status: isBooked ? 'booked' : 'available'
      });
    }
  });
  return seats.reverse();
};
