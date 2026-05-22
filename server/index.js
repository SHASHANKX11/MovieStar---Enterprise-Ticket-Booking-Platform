/* global process, console */
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';
import dotenv from 'dotenv';
import pg from 'pg';
dotenv.config();

const app = express();
app.use(express.json());

const { Pool } = pg;
// ---------- Database Connection ----------
// Configure your PostgreSQL connection here (ideally via .env)
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'booking_db',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// ---------- Rate Limiting ----------
// Apply to all public routes. Limits 100 requests per 15 minutes per IP.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests, please try again later.',
    status: 429,
  },
});
app.use(limiter);

// ---------- Input Validation & Sanitization ----------
// Example endpoint: Create a booking. Schema enforces type, length, and rejects extra fields.
const bookingSchema = z.object({
  userId: z.string().uuid(),
  movieId: z.string().uuid(),
  seats: z.array(z.string().min(1).max(5)), // seat codes like "A1"
}).strict(); // reject unknown keys

app.post('/api/booking', async (req, res) => {
  const parseResult = bookingSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid request payload', details: parseResult.error.errors });
  }
  
  const { userId, movieId, seats } = parseResult.data;

  try {
    // Insert booking into PostgreSQL DB
    // We use parameterized queries ($1, $2, etc.) which automatically prevent SQL Injection
    const query = 'INSERT INTO bookings (user_id, movie_id, seats) VALUES ($1, $2, $3) RETURNING *';
    const values = [userId, movieId, JSON.stringify(seats)];
    const dbRes = await pool.query(query, values);
    
    res.status(201).json({ message: 'Booking created', data: dbRes.rows[0] });
  } catch (error) {
    console.error('Database insertion error:', error);
    res.status(500).json({ error: 'Failed to create booking in database.' });
  }
});

// ---------- Secure API Key Handling ----------
// Example: external service API key loaded from env, never hard‑coded.
const EXTERNAL_API_KEY = process.env.EXTERNAL_API_KEY;
if (!EXTERNAL_API_KEY) {
  console.warn('EXTERNAL_API_KEY is not set. External service calls will fail.');
}

// Example route that uses the secret (never exposed to client).
app.get('/api/secure-data', (req, res) => {
  // Simulate a call to a third‑party service using the secret.
  res.json({ data: 'secure information', usedKey: !!EXTERNAL_API_KEY });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Secure server listening on http://localhost:${PORT}`);
});
