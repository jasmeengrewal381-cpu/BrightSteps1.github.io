
import dns from 'node:dns';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import parentRoutes from './routes/parentRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dns.setServers(['8.8.8.8', '8.8.4.4']);

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.join(currentDirectory, 'config.env')
});

const app = express();
const PORT = process.env.PORT || 5000;

if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET is missing from backend/config.env');
}
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin not allowed by CORS: ${origin}`));
    }
  },
  credentials: true
}));


app.use(session({
  name: 'brightsteps.sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 2
  }
}));

app.use(express.json({ limit: '20kb' }));

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'BrightSteps Haven backend is running.'
  });
});

app.get('/api/videos', async (_req, res) => {
  try {
    const collection = mongoose.connection.db.collection('serviceVideos');
    const videos = await collection.find({}).sort({ createdAt: -1 }).toArray();
    res.json({ success: true, videos });
  } catch (error) {
    console.error('Public videos error:', error.message);
    res.status(500).json({ success: false, message: 'Could not load videos.' });
  }
});

app.use('/api/enquiries', enquiryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/parents', parentRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found.'
  });
});

async function startServer() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is missing from backend/config.env.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected.');

    app.listen(PORT, () => {
      console.log(`Backend running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Backend startup failed:', error.message);
    process.exit(1);
  }
}

startServer();
