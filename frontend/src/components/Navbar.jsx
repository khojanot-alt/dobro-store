import React from 'react';
import { NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTelegramWebApp } from '../hooks/useTelegramWebApp';

const ADMIN_ID = import.meta.env.VITE_ADMIN_ID || '0';

const navItems = [
  { to: '/', icon: '🏠', label: 'Asosiy', exact: true },
  { to: '/products', icon: '🛍️', label: 'Mahsulotlar' },
  { to: '/cart', icon: '🛒', label: 'Savatcha' },
];

export default function Navbar() {
  const { totalItems } = useCart();
  const { user } = useTelegramWebApp();

  const isAdmin = user && String(user.id) === String(ADMIN_ID);

  return (
    <nav style={styles.nav}>
      <div style={styles.navInner}>
        {navItems.map(({ to, icon, label, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            style={({ isActive }) => ({
              ...styles.navItem,
              ...(isActive ? styles.navItemActive : {}),
            })}
          >
            <div style={styles.iconWrap}>
              <span style={styles.icon}>{icon}</span>
              {to === '/cart' && totalItems > 0 && (
                <span style={styles.cartBadge}>{totalItems > 99 ? '99+' : totalItems}</span>
              )}
            </div>
            <span style={styles.label}>{label}</span>
          </NavLink>
        ))}

        {isAdmin && (
          <NavLink
            to="/admin"
            style={({ isActive }) => ({
              ...styles.navItem,
              ...(isActive ? styles.navItemActive : {}),
            })}
          >
            <div style={styles.iconWrap}>
              <span style={styles.icon}>⚙️</span>
            </div>
            <span style={styles.label}>Admin</span>
          </NavLink>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    background: 'rgba(10, 10, 15, 0.95)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    paddingBottom: 'env(safe-area-inset-bottom)',
  },
  navInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: '64px',
    maxWidth: '480px',
    margin: '0 auto',
    padding: '0 8px',
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '3px',
    flex: 1,
    textDecoration: 'none',
    color: '#64748b',
    transition: 'color 0.2s ease',
    padding: '6px 4px',
    borderRadius: '12px',
    cursor: 'pointer',
  },
  navItemActive: {
    color: '#4f8ef7',
  },
  iconWrap: {
    position: 'relative',
  },
  icon: {
    fontSize: '22px',
    lineHeight: 1,
  },
  label: {
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '0.3px',
  },
  cartBadge: {
    position: 'absolute',
    top: '-6px',
    right: '-8px',
    minWidth: '18px',
    height: '18px',
    padding: '0 4px',
    background: 'linear-gradient(135deg, #4f8ef7, #7c3aed)',
    color: '#fff',
    borderRadius: '99px',
    fontSize: '10px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
  },
};
