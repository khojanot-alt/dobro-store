import React from 'react';

const CATEGORIES = [
  { value: '', label: '🔍 Barchasi' },
  { value: 'mouse', label: '🖱️ Sichqoncha' },
  { value: 'keyboard', label: '⌨️ Klaviatura' },
  { value: 'headset', label: '🎧 Quloqchin' },
  { value: 'monitor', label: '🖥️ Monitor' },
  { value: 'gamepad', label: '🎮 Gamepad' },
  { value: 'other', label: '📦 Boshqa' },
];

export default function CategoryFilter({ selected, onChange }) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.scrollContainer}>
        {CATEGORIES.map((cat) => {
          const isActive = selected === cat.value;
          return (
            <button
              key={cat.value}
              style={{
                ...styles.chip,
                ...(isActive ? styles.chipActive : styles.chipInactive),
              }}
              onClick={() => onChange(cat.value)}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    padding: '0 12px 12px',
    overflowX: 'auto',
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
  },
  scrollContainer: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'nowrap',
    width: 'max-content',
  },
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '8px 14px',
    borderRadius: '99px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    border: 'none',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
  },
  chipActive: {
    background: 'linear-gradient(135deg, #4f8ef7, #7c3aed)',
    color: '#fff',
    boxShadow: '0 4px 14px rgba(79, 142, 247, 0.35)',
  },
  chipInactive: {
    background: 'rgba(255,255,255,0.06)',
    color: '#94a3b8',
    border: '1px solid rgba(255,255,255,0.08)',
  },
};
