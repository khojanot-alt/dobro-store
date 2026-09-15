import React from 'react';
import { useCart } from '../context/CartContext';
import { useTelegramWebApp } from '../hooks/useTelegramWebApp';

const CATEGORY_LABELS = {
  mouse: 'Sichqoncha',
  keyboard: 'Klaviatura',
  headset: 'Quloqchin',
  monitor: 'Monitor',
  gamepad: 'Gamepad',
  other: 'Boshqa',
};

const PLACEHOLDER_GRADIENTS = [
  'linear-gradient(135deg, #4f8ef7 0%, #7c3aed 100%)',
  'linear-gradient(135deg, #22d3ee 0%, #4f8ef7 100%)',
  'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
  'linear-gradient(135deg, #10b981 0%, #4f8ef7 100%)',
];

export default function ProductCard({ product }) {
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const { hapticImpact, hapticSuccess } = useTelegramWebApp();

  const quantity = getItemQuantity(product._id);
  const isOutOfStock = product.stock === 0;

  const gradientIndex =
    (product.name?.charCodeAt(0) || 0) % PLACEHOLDER_GRADIENTS.length;

  function handleAdd() {
    hapticImpact();
    addToCart(product);
  }

  function handleIncrease() {
    hapticImpact();
    updateQuantity(product._id, quantity + 1);
  }

  function handleDecrease() {
    hapticImpact();
    updateQuantity(product._id, quantity - 1);
  }

  return (
    <div style={styles.card} className="fade-in">
      {/* Rasm */}
      <div style={styles.imageWrap}>
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            style={styles.image}
            loading="lazy"
          />
        ) : (
          <div
            style={{
              ...styles.imagePlaceholder,
              background: PLACEHOLDER_GRADIENTS[gradientIndex],
            }}
          >
            <span style={styles.placeholderIcon}>
              {getCategoryIcon(product.category)}
            </span>
          </div>
        )}

        {product.popular && (
          <span style={styles.popularBadge}>⭐ Mashhur</span>
        )}

        {isOutOfStock && (
          <div style={styles.outOfStockOverlay}>
            <span>Tugagan</span>
          </div>
        )}
      </div>

      {/* Ma'lumot */}
      <div style={styles.body}>
        <span style={styles.categoryBadge}>
          {CATEGORY_LABELS[product.category] || product.category}
        </span>

        <p style={styles.name} title={product.name}>
          {product.name}
        </p>

        <p style={styles.price}>
          {product.price.toLocaleString('uz-UZ')} so'm
        </p>

        {/* Tugmalar */}
        {quantity === 0 ? (
          <button
            style={{
              ...styles.addBtn,
              ...(isOutOfStock ? styles.addBtnDisabled : {}),
            }}
            onClick={handleAdd}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? 'Tugagan' : '+ Savatchaga'}
          </button>
        ) : (
          <div style={styles.quantityRow}>
            <button style={styles.qtyBtn} onClick={handleDecrease}>
              −
            </button>
            <span style={styles.qtyCount}>{quantity}</span>
            <button style={styles.qtyBtn} onClick={handleIncrease}>
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function getCategoryIcon(category) {
  const icons = {
    mouse: '🖱️',
    keyboard: '⌨️',
    headset: '🎧',
    monitor: '🖥️',
    gamepad: '🎮',
    other: '📦',
  };
  return icons[category] || '📦';
}

const styles = {
  card: {
    background: 'rgba(18, 18, 26, 0.92)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    overflow: 'hidden',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'default',
  },
  imageWrap: {
    position: 'relative',
    width: '100%',
    paddingTop: '80%',
    overflow: 'hidden',
  },
  image: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  imagePlaceholder: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    fontSize: '40px',
    filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))',
  },
  popularBadge: {
    position: 'absolute',
    top: '8px',
    left: '8px',
    padding: '3px 8px',
    background: 'rgba(245, 158, 11, 0.9)',
    color: '#fff',
    borderRadius: '99px',
    fontSize: '10px',
    fontWeight: '600',
  },
  outOfStockOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.55)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#e2e8f0',
    fontSize: '13px',
    fontWeight: '600',
  },
  body: {
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  categoryBadge: {
    display: 'inline-block',
    fontSize: '10px',
    fontWeight: '600',
    color: '#4f8ef7',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
  },
  name: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#e2e8f0',
    lineHeight: '1.3',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  price: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#22d3ee',
  },
  addBtn: {
    width: '100%',
    padding: '8px',
    background: 'linear-gradient(135deg, #4f8ef7, #7c3aed)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  addBtnDisabled: {
    background: 'rgba(255,255,255,0.1)',
    color: '#64748b',
    cursor: 'not-allowed',
  },
  quantityRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '4px',
  },
  qtyBtn: {
    width: '32px',
    height: '32px',
    background: 'rgba(79, 142, 247, 0.15)',
    border: '1px solid rgba(79, 142, 247, 0.3)',
    borderRadius: '8px',
    color: '#4f8ef7',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
  },
  qtyCount: {
    flex: 1,
    textAlign: 'center',
    fontSize: '15px',
    fontWeight: '700',
    color: '#e2e8f0',
  },
};
