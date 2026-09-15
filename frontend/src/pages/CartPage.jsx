import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useTelegramWebApp } from '../hooks/useTelegramWebApp';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems } = useCart();
  const { user, hapticSuccess, hapticError } = useTelegramWebApp();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleOrder() {
    if (items.length === 0) return;
    setLoading(true);
    setError('');

    try {
      const orderData = {
        userId: user?.id || 0,
        username: user?.username || '',
        firstName: user?.first_name || '',
        lastName: user?.last_name || '',
        products: items.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalPrice,
      };

      await axios.post('/api/orders', orderData);
      hapticSuccess();
      clearCart();
      setSuccess(true);
    } catch (err) {
      hapticError();
      setError(err.response?.data?.error || 'Xato yuz berdi. Qayta urinib ko\'ring.');
    } finally {
      setLoading(false);
    }
  }

  // Muvaffaqiyat holati
  if (success) {
    return (
      <div className="app-container">
        <div style={styles.successContainer} className="fade-in">
          <div style={styles.successIcon}>✅</div>
          <h2 style={styles.successTitle}>Buyurtma qabul qilindi!</h2>
          <p style={styles.successDesc}>
            Admin siz bilan tez orada Telegram orqali bog'lanadi va to'lov tafsilotlarini yuboradi.
          </p>
          <Link to="/products" style={styles.continueBtn}>
            Xarid qilishni davom ettirish
          </Link>
        </div>
      </div>
    );
  }

  // Bo'sh savatcha
  if (items.length === 0) {
    return (
      <div className="app-container">
        <div className="page-header">
          <h1 className="page-title">Savatcha</h1>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <p className="empty-state-title">Savatchangiz bo'sh</p>
          <p className="empty-state-desc">
            Hali hech narsa qo'shmagansiz. Mahsulotlar bo'limiga o'ting.
          </p>
          <Link to="/products" className="btn-primary" style={{ marginTop: '8px' }}>
            Mahsulotlar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="page-header">
        <h1 className="page-title">Savatcha</h1>
        <p className="page-subtitle">{totalItems} ta mahsulot</p>
      </div>

      {/* Mahsulotlar ro'yxati */}
      <div style={styles.itemsList}>
        {items.map((item) => (
          <div key={item._id} style={styles.cartItem} className="card fade-in">
            {/* Rasm */}
            <div style={styles.itemImage}>
              {item.image ? (
                <img src={item.image} alt={item.name} style={styles.itemImg} />
              ) : (
                <div style={styles.itemImgPlaceholder}>
                  {getCategoryIcon(item.category)}
                </div>
              )}
            </div>

            {/* Ma'lumot */}
            <div style={styles.itemInfo}>
              <p style={styles.itemName}>{item.name}</p>
              <p style={styles.itemPrice}>
                {(item.price * item.quantity).toLocaleString('uz-UZ')} so'm
              </p>
              <p style={styles.itemUnitPrice}>
                {item.price.toLocaleString('uz-UZ')} so'm × {item.quantity}
              </p>
            </div>

            {/* Miqdor boshqaruv */}
            <div style={styles.itemControls}>
              <button
                style={styles.qtyBtn}
                onClick={() => updateQuantity(item._id, item.quantity - 1)}
              >
                −
              </button>
              <span style={styles.qtyNum}>{item.quantity}</span>
              <button
                style={styles.qtyBtn}
                onClick={() => updateQuantity(item._id, item.quantity + 1)}
              >
                +
              </button>
              <button
                style={styles.removeBtn}
                onClick={() => removeFromCart(item._id)}
                title="O'chirish"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Xato xabari */}
      {error && <div style={styles.errorBox}>{error}</div>}

      {/* Jami va buyurtma */}
      <div style={styles.summary}>
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>Jami ({totalItems} ta):</span>
          <span style={styles.summaryTotal}>
            {totalPrice.toLocaleString('uz-UZ')} so'm
          </span>
        </div>
        <p style={styles.paymentNote}>
          💬 To'lov admin bilan shaxsiy yozishmada kelishiladi
        </p>
        <button
          style={styles.orderBtn}
          onClick={handleOrder}
          disabled={loading}
        >
          {loading ? 'Yuborilmoqda...' : '✅ Buyurtma berish'}
        </button>
      </div>
    </div>
  );
}

function getCategoryIcon(cat) {
  const icons = { mouse: '🖱️', keyboard: '⌨️', headset: '🎧', monitor: '🖥️', gamepad: '🎮', other: '📦' };
  return icons[cat] || '📦';
}

const styles = {
  itemsList: { padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '10px' },
  cartItem: {
    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px',
  },
  itemImage: {
    width: '60px', height: '60px', flexShrink: 0, borderRadius: '10px', overflow: 'hidden',
    background: 'rgba(79,142,247,0.1)',
  },
  itemImg: { width: '100%', height: '100%', objectFit: 'cover' },
  itemImgPlaceholder: {
    width: '100%', height: '100%', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '24px',
  },
  itemInfo: { flex: 1, minWidth: 0 },
  itemName: { fontSize: '13px', fontWeight: '600', color: '#e2e8f0', marginBottom: '2px',
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  itemPrice: { fontSize: '14px', fontWeight: '700', color: '#22d3ee' },
  itemUnitPrice: { fontSize: '11px', color: '#64748b', marginTop: '1px' },
  itemControls: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' },
  qtyBtn: {
    width: '28px', height: '28px', background: 'rgba(79,142,247,0.15)',
    border: '1px solid rgba(79,142,247,0.3)', borderRadius: '8px', color: '#4f8ef7',
    fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  qtyNum: { fontSize: '14px', fontWeight: '700', color: '#e2e8f0', minWidth: '20px', textAlign: 'center' },
  removeBtn: {
    background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer',
    padding: '2px', opacity: 0.6,
  },
  errorBox: {
    margin: '12px', padding: '12px 16px', background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px',
    color: '#ef4444', fontSize: '13px',
  },
  summary: {
    margin: '16px 12px', padding: '20px',
    background: 'rgba(18,18,26,0.92)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
  },
  summaryRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  summaryLabel: { fontSize: '15px', color: '#94a3b8', fontWeight: '500' },
  summaryTotal: { fontSize: '20px', fontWeight: '800', color: '#22d3ee' },
  paymentNote: {
    fontSize: '12px', color: '#64748b', marginBottom: '16px',
    padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px',
  },
  orderBtn: {
    width: '100%', padding: '14px', background: 'linear-gradient(135deg, #4f8ef7, #7c3aed)',
    color: '#fff', border: 'none', borderRadius: '14px', fontSize: '16px', fontWeight: '700',
    cursor: 'pointer', transition: 'opacity 0.2s',
  },
  successContainer: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '60px 24px', textAlign: 'center', gap: '16px',
    minHeight: '60vh',
  },
  successIcon: { fontSize: '72px' },
  successTitle: { fontSize: '24px', fontWeight: '800', color: '#e2e8f0' },
  successDesc: { fontSize: '14px', color: '#94a3b8', maxWidth: '300px', lineHeight: '1.6' },
  continueBtn: {
    display: 'inline-block', padding: '12px 24px',
    background: 'linear-gradient(135deg, #4f8ef7, #7c3aed)', color: '#fff',
    borderRadius: '14px', textDecoration: 'none', fontSize: '15px', fontWeight: '600',
    marginTop: '8px',
  },
};
