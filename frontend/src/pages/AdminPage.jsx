import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useTelegramWebApp } from '../hooks/useTelegramWebApp';

const ADMIN_ID = import.meta.env.VITE_ADMIN_ID || '0';

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  category: 'mouse',
  stock: '',
  image: '',
  popular: false,
};

const CATEGORIES = [
  { value: 'mouse', label: 'Sichqoncha' },
  { value: 'keyboard', label: 'Klaviatura' },
  { value: 'headset', label: 'Quloqchin' },
  { value: 'monitor', label: 'Monitor' },
  { value: 'gamepad', label: 'Gamepad' },
  { value: 'other', label: 'Boshqa' },
];

export default function AdminPage() {
  const { user } = useTelegramWebApp();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const userIsAdmin = user && String(user.id) === String(ADMIN_ID);

  const adminHeaders = { 'x-admin-id': user?.id };

  const fetchProducts = useCallback(() => {
    axios
      .get('/api/products')
      .then((res) => setProducts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  function openAdd() {
    setEditProduct(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  }

  function openEdit(product) {
    setEditProduct(product);
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category,
      stock: product.stock,
      image: product.image || '',
      popular: product.popular || false,
    });
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.name || !form.price) {
      showToast('❌ Nom va narx majburiy!');
      return;
    }
    setSaving(true);
    try {
      const data = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock) || 0,
      };

      if (editProduct) {
        await axios.put(`/api/products/${editProduct._id}`, data, {
          headers: adminHeaders,
        });
        showToast('✅ Mahsulot yangilandi!');
      } else {
        await axios.post('/api/products', data, { headers: adminHeaders });
        showToast('✅ Mahsulot qo\'shildi!');
      }

      setShowModal(false);
      fetchProducts();
    } catch (err) {
      showToast('❌ ' + (err.response?.data?.error || 'Xato yuz berdi'));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(product) {
    if (!window.confirm(`"${product.name}" ni o'chirishni tasdiqlaysizmi?`)) return;
    try {
      await axios.delete(`/api/products/${product._id}`, { headers: adminHeaders });
      showToast('🗑️ Mahsulot o\'chirildi');
      fetchProducts();
    } catch (err) {
      showToast('❌ ' + (err.response?.data?.error || 'O\'chirishda xato'));
    }
  }

  function handleFormChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  // Ruxsat yo'q
  if (!userIsAdmin) {
    return (
      <div className="app-container">
        <div className="empty-state" style={{ minHeight: '80vh' }}>
          <div className="empty-state-icon">🔒</div>
          <p className="empty-state-title">Ruxsat yo'q</p>
          <p className="empty-state-desc">
            Bu bo'lim faqat admin uchun. Sizning ID raqamingiz tekshirildi — kirish rad etildi.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}

      {/* Sarlavha */}
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="page-title">Admin Panel</h1>
          <p className="page-subtitle">{products.length} ta mahsulot</p>
        </div>
        <button className="btn-primary" onClick={openAdd} style={{ padding: '10px 18px', fontSize: '14px' }}>
          + Qo'shish
        </button>
      </div>

      {/* Mahsulotlar jadvali */}
      {loading ? (
        <div className="spinner-container">
          <div className="spinner" />
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <p className="empty-state-title">Mahsulotlar yo'q</p>
          <p className="empty-state-desc">Birinchi mahsulotni qo'shing!</p>
        </div>
      ) : (
        <div style={styles.tableWrap}>
          {products.map((p) => (
            <div key={p._id} style={styles.tableRow} className="card fade-in">
              {/* Rasm */}
              <div style={styles.rowImage}>
                {p.image ? (
                  <img src={p.image} alt={p.name} style={styles.rowImg} />
                ) : (
                  <div style={styles.rowImgPlaceholder}>
                    {getCategoryIcon(p.category)}
                  </div>
                )}
              </div>

              {/* Ma'lumot */}
              <div style={styles.rowInfo}>
                <div style={styles.rowName}>{p.name}</div>
                <div style={styles.rowMeta}>
                  <span style={styles.rowPrice}>{p.price.toLocaleString('uz-UZ')} so'm</span>
                  <span style={styles.rowStock}>📦 {p.stock} ta</span>
                  {p.popular && <span style={styles.popularTag}>⭐</span>}
                </div>
                <div style={styles.rowCategory}>{getCategoryName(p.category)}</div>
              </div>

              {/* Tugmalar */}
              <div style={styles.rowActions}>
                <button style={styles.editBtn} onClick={() => openEdit(p)}>✏️</button>
                <button style={styles.deleteBtn} onClick={() => handleDelete(p)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal forma */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle" />
            <h2 className="modal-title">
              {editProduct ? '✏️ Mahsulot tahrirlash' : '➕ Yangi mahsulot'}
            </h2>

            <div style={styles.formGrid}>
              <div className="form-group">
                <label className="form-label">Nomi *</label>
                <input
                  className="form-input"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  placeholder="Logitech G502 X"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Narxi (so'm) *</label>
                <input
                  className="form-input"
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleFormChange}
                  placeholder="250000"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Kategoriya</label>
                <select
                  className="form-select"
                  name="category"
                  value={form.category}
                  onChange={handleFormChange}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Soni (omborda)</label>
                <input
                  className="form-input"
                  name="stock"
                  type="number"
                  value={form.stock}
                  onChange={handleFormChange}
                  placeholder="10"
                  min="0"
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Rasm URL</label>
                <input
                  className="form-input"
                  name="image"
                  value={form.image}
                  onChange={handleFormChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Tavsif</label>
                <textarea
                  className="form-textarea"
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  placeholder="Mahsulot haqida qisqacha ma'lumot..."
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-checkbox-row">
                  <input
                    type="checkbox"
                    name="popular"
                    checked={form.popular}
                    onChange={handleFormChange}
                  />
                  <span>⭐ Mashhur mahsulot sifatida belgilash</span>
                </label>
              </div>
            </div>

            <div style={styles.modalActions}>
              <button className="btn-secondary" onClick={() => setShowModal(false)} style={{ flex: 1 }}>
                Bekor qilish
              </button>
              <button
                className="btn-primary"
                onClick={handleSave}
                disabled={saving}
                style={{ flex: 2 }}
              >
                {saving ? 'Saqlanmoqda...' : editProduct ? '💾 Yangilash' : '✅ Saqlash'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getCategoryIcon(cat) {
  const icons = { mouse: '🖱️', keyboard: '⌨️', headset: '🎧', monitor: '🖥️', gamepad: '🎮', other: '📦' };
  return icons[cat] || '📦';
}

function getCategoryName(cat) {
  const names = { mouse: 'Sichqoncha', keyboard: 'Klaviatura', headset: 'Quloqchin', monitor: 'Monitor', gamepad: 'Gamepad', other: 'Boshqa' };
  return names[cat] || cat;
}

const styles = {
  tableWrap: { padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '10px' },
  tableRow: {
    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px',
  },
  rowImage: {
    width: '52px', height: '52px', flexShrink: 0, borderRadius: '10px',
    overflow: 'hidden', background: 'rgba(79,142,247,0.1)',
  },
  rowImg: { width: '100%', height: '100%', objectFit: 'cover' },
  rowImgPlaceholder: {
    width: '100%', height: '100%', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '22px',
  },
  rowInfo: { flex: 1, minWidth: 0 },
  rowName: { fontSize: '13px', fontWeight: '600', color: '#e2e8f0', marginBottom: '4px',
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  rowMeta: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' },
  rowPrice: { fontSize: '12px', fontWeight: '700', color: '#22d3ee' },
  rowStock: { fontSize: '11px', color: '#64748b' },
  popularTag: { fontSize: '12px' },
  rowCategory: { fontSize: '11px', color: '#4f8ef7', textTransform: 'uppercase', letterSpacing: '0.3px' },
  rowActions: { display: 'flex', flexDirection: 'column', gap: '6px' },
  editBtn: {
    width: '32px', height: '32px', background: 'rgba(79,142,247,0.15)',
    border: '1px solid rgba(79,142,247,0.25)', borderRadius: '8px', cursor: 'pointer', fontSize: '14px',
  },
  deleteBtn: {
    width: '32px', height: '32px', background: 'rgba(239,68,68,0.12)',
    border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', cursor: 'pointer', fontSize: '14px',
  },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' },
  modalActions: { display: 'flex', gap: '10px' },
};
