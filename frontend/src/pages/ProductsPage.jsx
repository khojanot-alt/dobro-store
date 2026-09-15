import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category') || '';

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category) params.category = category;

    axios
      .get('/api/products', { params })
      .then((res) => setProducts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category]);

  function handleCategoryChange(val) {
    if (val) {
      setSearchParams({ category: val });
    } else {
      setSearchParams({});
    }
    setSearch('');
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-container">
      {/* Sarlavha */}
      <div className="page-header">
        <h1 className="page-title">Mahsulotlar</h1>
        <p className="page-subtitle">
          {category
            ? `Kategoriya: ${getCategoryName(category)}`
            : 'Barcha mahsulotlar'}
        </p>
      </div>

      {/* Qidiruv */}
      <div className="search-wrapper">
        <span className="search-icon">🔍</span>
        <input
          className="search-input"
          type="text"
          placeholder="Mahsulot qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Kategoriya filtri */}
      <CategoryFilter selected={category} onChange={handleCategoryChange} />

      {/* Mahsulotlar */}
      {loading ? (
        <div className="spinner-container">
          <div className="spinner" />
          <p style={{ color: '#64748b', fontSize: '14px' }}>Yuklanmoqda...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <p className="empty-state-title">Mahsulot topilmadi</p>
          <p className="empty-state-desc">
            {search
              ? `"${search}" bo'yicha natija yo'q`
              : 'Bu kategoriyada mahsulotlar mavjud emas'}
          </p>
        </div>
      ) : (
        <div className="products-grid">
          {filtered.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

function getCategoryName(cat) {
  const names = {
    mouse: 'Sichqoncha',
    keyboard: 'Klaviatura',
    headset: 'Quloqchin',
    monitor: 'Monitor',
    gamepad: 'Gamepad',
    other: 'Boshqa',
  };
  return names[cat] || cat;
}
