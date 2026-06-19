import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, SlidersHorizontal, X, Grid2X2,
} from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ShopFilters from '../components/shop/ShopFilters';
import { productAPI, schoolAPI } from '../utils/api';

const SORT_OPTIONS = [
  { value: '', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
];
const PAGE_SIZE = 12;

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const school = searchParams.get('school') || '';
  const category = searchParams.get('category') || '';
  const gender = searchParams.get('gender') || '';
  const sort = searchParams.get('sort') || '';
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const [searchInput, setSearchInput] = useState(search);
  const [priceMin, setPriceMin] = useState(minPrice);
  const [priceMax, setPriceMax] = useState(maxPrice);

  const setParam = (key, value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value);
      else next.delete(key);
      if (key !== 'page') next.set('page', '1');
      return next;
    });
  };

  const setPage = (pageNum) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(pageNum));
      return next;
    });
  };

  const clearAllFilters = () => {
    setSearchParams({});
    setSearchInput('');
    setPriceMin('');
    setPriceMax('');
  };

  const activeFiltersCount = [school, category, gender, sort, search, minPrice, maxPrice].filter(Boolean).length;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: PAGE_SIZE };
      if (school) params.school = school;
      if (category) params.category = category;
      if (gender) params.gender = gender;
      if (sort) params.sort = sort;
      if (search) params.search = search;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const { data } = await productAPI.getAll(params);
      setProducts(data.products || data || []);
      setTotalPages(data.pages || data.totalPages || 1);
      setTotalCount(data.total || (data.products || data || []).length);
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [school, category, gender, sort, search, page, minPrice, maxPrice]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  useEffect(() => {
    schoolAPI.getAll()
      .then(({ data }) => setSchools(data.schools || data || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    setPriceMin(minPrice);
    setPriceMax(maxPrice);
  }, [minPrice, maxPrice]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setParam('search', searchInput);
  };

  const handlePriceApply = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (priceMin) next.set('minPrice', priceMin);
      else next.delete('minPrice');
      if (priceMax) next.set('maxPrice', priceMax);
      else next.delete('maxPrice');
      next.set('page', '1');
      return next;
    });
  };

  const filterProps = {
    schools,
    school,
    category,
    gender,
    priceMin,
    priceMax,
    onPriceMinChange: setPriceMin,
    onPriceMaxChange: setPriceMax,
    onPriceApply: handlePriceApply,
    onSetParam: setParam,
    onClearAll: clearAllFilters,
    activeFiltersCount,
  };

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gradient-to-b from-slate-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Hero banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '48px 48px' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-blue-200 text-sm font-semibold uppercase tracking-widest mb-2">Official School Uniforms</p>
            <h1 className="font-display font-bold text-3xl md:text-5xl text-white mb-3">Shop Uniforms</h1>
            <p className="text-blue-100/90 text-base md:text-lg max-w-xl">
              {totalCount > 0
                ? `Discover ${totalCount} premium uniforms from top schools across India`
                : 'Browse our curated collection of school uniforms'}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search bar section */}
        <div className="py-6 -mt-6">
          <div className="flex flex-wrap gap-3 mb-6 bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-800">
          <form onSubmit={handleSearchSubmit} className="flex-1 min-w-60 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search uniforms, schools..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="input-field pl-11 pr-4"
            />
          </form>

          <select
            value={sort}
            onChange={(e) => setParam('sort', e.target.value)}
            className="input-field w-auto min-w-44"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden btn-outline flex items-center gap-2"
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFiltersCount > 0 && (
              <span className="bg-blue-700 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
          </div>
        </div>

        {/* Results count */}
        {!loading && products.length > 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Showing page {page} of {totalPages} · {totalCount} products total
          </p>
        )}

        {/* Active filter chips */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {school && (
              <span className="flex items-center gap-1.5 badge bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1">
                School: {schools.find((s) => String(s._id) === school)?.shortName || 'Selected'}
                <button onClick={() => setParam('school', '')}><X size={12} /></button>
              </span>
            )}
            {category && (
              <span className="flex items-center gap-1.5 badge bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-3 py-1">
                {category.charAt(0).toUpperCase() + category.slice(1)}
                <button onClick={() => setParam('category', '')}><X size={12} /></button>
              </span>
            )}
            {gender && (
              <span className="flex items-center gap-1.5 badge bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300 px-3 py-1">
                {gender.charAt(0).toUpperCase() + gender.slice(1)}
                <button onClick={() => setParam('gender', '')}><X size={12} /></button>
              </span>
            )}
            {search && (
              <span className="flex items-center gap-1.5 badge bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 px-3 py-1">
                "{search}"
                <button onClick={() => { setParam('search', ''); setSearchInput(''); }}><X size={12} /></button>
              </span>
            )}
            {(minPrice || maxPrice) && (
              <span className="flex items-center gap-1.5 badge bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-3 py-1">
                ₹{minPrice || '0'} — ₹{maxPrice || '∞'}
                <button onClick={() => { setSearchParams((p) => { const n = new URLSearchParams(p); n.delete('minPrice'); n.delete('maxPrice'); return n; }); setPriceMin(''); setPriceMax(''); }}><X size={12} /></button>
              </span>
            )}
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop filters panel */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-800">
              <h3 className="font-display font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-blue-600" /> Filters
              </h3>
              <p className="text-xs text-gray-400 mb-4">Refine your search</p>
              <ShopFilters {...filterProps} />
            </div>
          </aside>

          {/* Products grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <LoadingSpinner />
            ) : products.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 gap-4 text-center"
              >
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <Grid2X2 size={36} className="text-gray-300 dark:text-gray-600" />
                </div>
                <p className="font-display font-bold text-xl text-gray-900 dark:text-white">No products found</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Try adjusting your filters or search term.</p>
                <button onClick={clearAllFilters} className="btn-primary">Clear Filters</button>
              </motion.div>
            ) : (
              <>
                <motion.div
                  layout
                  className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-5"
                >
                  <AnimatePresence>
                    {products.map((product, i) => (
                      <motion.div
                        key={product._id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col items-center gap-4 mt-12">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Page {page} of {totalPages}
                    </p>
                    <div className="flex justify-center items-center gap-2 flex-wrap">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold disabled:opacity-40 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 transition-colors"
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 7) {
                        pageNum = i + 1;
                      } else if (page <= 4) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 3) {
                        pageNum = totalPages - 6 + i;
                      } else {
                        pageNum = page - 3 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-11 h-11 rounded-xl text-sm font-bold transition-all ${
                            page === pageNum
                              ? 'bg-blue-700 text-white shadow-lg shadow-blue-700/30 scale-105'
                              : 'border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page === totalPages}
                      className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold disabled:opacity-40 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 transition-colors"
                    >
                      Next
                    </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              className="fixed left-0 top-0 h-full z-50 w-80 bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto lg:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-display font-bold text-gray-900 dark:text-white">Filters</h3>
                <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <X size={20} />
                </button>
              </div>
              <div className="p-5">
                <ShopFilters {...filterProps} />
              </div>
              <div className="p-5 border-t border-gray-100 dark:border-gray-800">
                <button onClick={() => setSidebarOpen(false)} className="btn-primary w-full">
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShopPage;
