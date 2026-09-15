import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'https://web.telegram.org',
    ],
    credentials: true,
  })
);
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Route topilmadi' });
});

// ─── MongoDB Ulanish ─────────────────────────────────────────────────────────
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB ga ulandi');

    app.listen(PORT, () => {
      console.log(`🚀 Server ishga tushdi: http://localhost:${PORT}`);
      console.log(`📌 Admin ID: ${process.env.ADMIN_TELEGRAM_ID}`);
    });
  } catch (err) {
    console.error('❌ MongoDB ga ulanishda xato:', err.message);
    process.exit(1);
  }
}

startServer();
