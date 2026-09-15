import express from 'express';
import Product from '../models/Product.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

// GET /api/products — barcha mahsulotlar (filter bilan)
router.get('/', async (req, res) => {
  try {
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.popular === 'true') {
      filter.popular = true;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Mahsulotlarni olishda xato: ' + err.message });
  }
});

// GET /api/products/:id — bitta mahsulot
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Mahsulot topilmadi' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Mahsulotni olishda xato: ' + err.message });
  }
});

// POST /api/products — yangi mahsulot qo'shish (faqat admin)
router.post('/', adminAuth, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: 'Mahsulot qo\'shishda xato: ' + err.message });
  }
});

// PUT /api/products/:id — mahsulot tahrirlash (faqat admin)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Mahsulot topilmadi' });
    }
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: 'Mahsulot yangilashda xato: ' + err.message });
  }
});

// DELETE /api/products/:id — mahsulot o'chirish (faqat admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Mahsulot topilmadi' });
    }
    res.json({ message: 'Mahsulot muvaffaqiyatli o\'chirildi', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: 'Mahsulot o\'chirishda xato: ' + err.message });
  }
});

export default router;
