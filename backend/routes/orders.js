import express from 'express';
import Order from '../models/Order.js';
import { sendOrderToAdmin } from '../bot.js';

const router = express.Router();

// POST /api/orders — yangi buyurtma berish
router.post('/', async (req, res) => {
  try {
    const { userId, username, firstName, lastName, products, totalPrice } = req.body;

    if (!userId || !products || products.length === 0) {
      return res.status(400).json({ error: 'userId va products majburiy' });
    }

    const order = new Order({
      userId,
      username: username || '',
      firstName: firstName || '',
      lastName: lastName || '',
      products,
      totalPrice,
    });

    await order.save();

    // Adminga xabar yuborish
    const userInfo = { userId, username, firstName, lastName };
    await sendOrderToAdmin(order, userInfo);

    res.status(201).json({
      message: 'Buyurtmangiz qabul qilindi! Admin siz bilan tez orada bog\'lanadi.',
      orderId: order._id,
    });
  } catch (err) {
    res.status(500).json({ error: 'Buyurtma berishda xato: ' + err.message });
  }
});

// GET /api/orders — admin uchun barcha buyurtmalar
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Buyurtmalarni olishda xato: ' + err.message });
  }
});

export default router;
