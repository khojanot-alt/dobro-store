import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useTelegramWebApp } from '../hooks/useTelegramWebApp';

const CATEGORY_CARDS = [
  { value: 'mouse', label: 'Sichqoncha', icon: '🖱️', color: '#4f8ef7' },
  { value: 'keyboard', label: 'Klaviatura', icon: '⌨️', color: '#7c3aed' },
  { value: 'headset', label: 'Quloqchin', icon: '🎧', color: '#22d3ee' },
  { value: 'monitor', label: 'Monitor', icon: '🖥️', color: '#10b981' },
  { value: 'gamepad', label: 'Gamepad', icon: '🎮', color: '#f59e0b' },
  { value: 'other', label: 'Boshqa', icon: '📦', color: '#ef4444' },
];

export default function HomePage() {
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useTelegramWebApp();

  useEffect(() => {
    axios
      .get('/api/products?popular=true')
      .then((res) => setPopularProducts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const greeting = user?.first_name ? `Salom, ${user.first_name}! 👋` : 'Xush kelibsiz! 👋';

  return (
    <div className="app-container">
      {/* Banner */}
      <div style={styles.banner}>
        <p style={styles.greeting}>{greeting}</p>
        <h1 style={styles.storeName}>Dobro Store</h1>
        <p style={styles.storeDesc}>Eng yaxshi kompyuter aksessuarlari</p>
        <Link to="/products" style={styles.shopBtn}>
          Barcha mahsulotlar →
        </Link>
      </div>

      {/* Kategoriyalar */}
      <div>
        <div className="section-header">
          <span className="section-title">Kategoriyalar</span>
        </div>
        <div style={styles.categoriesGrid}>
          {CATEGORY_CARDS.map((cat) => (
            <Link
              key={cat.value}
              to={`/products?category=${cat.value}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  ...styles.categoryCard,
                  background: `linear-gradient(135deg, ${cat.color}22, ${cat.color}11)`,
                  borderColor: `${cat.color}33`,
                }}
              >
                <span style={styles.categoryIcon}>{cat.icon}</span>
                <span style={{ ...styles.categoryLabel, color: cat.color }}>
                  {cat.label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Mashhur mahsulotlar */}
      <div>
        <div className="section-header">
          <span className="section-title">⭐ Mashhur</span>
          <Link to="/products" className="section-link">
            Barchasi
          </Link>
        </div>

        {loading ? (
          <div className="spinner-container">
            <div className="spinner" />
          </div>
        ) : popularProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <p className="empty-state-desc">Mashhur mahsulotlar yo'q</p>
          </div>
        ) : (
          <div style={styles.popularScroll}>
            {popularProducts.map((product) => (
              <div key={product._id} style={styles.popularItem}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  banner: {
    margin: '16px 12px',
    padding: '28px 24px',
    borderRadius: '24px',
    background: 'linear-gradient(135deg, rgba(79,142,247,0.15) 0%, rgba(124,58,237,0.15) 100%)',
    border: '1px solid rgba(79,142,247,0.2)',
    position: 'relative',
    overflow: 'hidden',
  },
  greeting: {
    fontSize: '14px',
    color: '#94a3b8',
    marginBottom: '6px',
  },
  storeName: {
    fontSize: '32px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #4f8ef7, #7c3aed)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '6px',
  },
  storeDesc: {
    fontSize: '14px',
    color: '#94a3b8',
    marginBottom: '20px',
  },
  shopBtn: {
    display: 'inline-block',
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #4f8ef7, #7c3aed)',
    color: '#fff',
    borderRadius: '12px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600',
  },
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
    padding: '0 12px',
  },
  categoryCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '16px 8px',
    borderRadius: '16px',
    border: '1px solid',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  categoryIcon: {
    fontSize: '28px',
  },
  categoryLabel: {
    fontSize: '11px',
    fontWeight: '600',
    textAlign: 'center',
  },
  popularScroll: {
    display: 'flex',
    overflowX: 'auto',
    gap: '12px',
    padding: '0 12px 12px',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  },
  popularItem: {
    minWidth: '160px',
    maxWidth: '160px',
    flexShrink: 0,
  },
};
