import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, School, ShoppingBag, Users,
  FileText, LogOut, Menu, X, Plus, Edit2, Trash2,
  Search, Upload, Eye, EyeOff, ChevronDown, Sun, Moon,
  TrendingUp, DollarSign, CheckCircle, Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { productAPI, schoolAPI, orderAPI, bulkOrderAPI } from '../utils/api';
import toast from 'react-hot-toast';

const BASE_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

/* ─── Sidebar ─────────────────────────────────────────── */
const Sidebar = ({ open, setOpen }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const links = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/products', icon: Package, label: 'Products' },
    { to: '/admin/schools', icon: School, label: 'Schools' },
    { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { to: '/admin/bulk-orders', icon: FileText, label: 'Bulk Orders' },
  ];
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-gray-950 border-r border-gray-800 z-40 transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">IP</span>
              </div>
              <div>
                <p className="font-display font-bold text-white text-sm">INDRAPRASTH</p>
                <p className="text-xs text-gray-400 tracking-widest">ADMIN</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {links.map(({ to, icon: Icon, label, end }) => (
              <NavLink key={to} to={to} end={end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <Icon size={18} />{label}
              </NavLink>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-3 mb-3 px-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user?.name?.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-medium truncate">{user?.name}</p>
                <p className="text-gray-400 text-xs truncate">{user?.email}</p>
              </div>
            </div>
            <Link to="/" className="flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white text-sm rounded-xl hover:bg-gray-800 transition-all mb-1">
              <Eye size={16} /> View Store
            </Link>
            <button onClick={() => { logout(); navigate('/'); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-900/20 text-sm rounded-xl transition-all">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

/* ─── Top Bar ─────────────────────────────────────────── */
const TopBar = ({ onMenuClick, title }) => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-6 gap-4 sticky top-0 z-20">
      <button onClick={onMenuClick} className="lg:hidden text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
        <Menu size={22} />
      </button>
      <h1 className="font-display font-bold text-gray-900 dark:text-white text-lg flex-1">{title}</h1>
      <button onClick={toggleTheme} className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </header>
  );
};

/* ─── Stat Card ───────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, color }) => (
  <motion.div whileHover={{ y: -2 }} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
      <Icon size={22} className="text-white" />
    </div>
    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
  </motion.div>
);

/* ─── Dashboard ───────────────────────────────────────── */
const Dashboard = () => {
  const [stats, setStats] = useState({ products: 0, schools: 0, orders: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [p, s, o] = await Promise.all([
          productAPI.getAllAdmin(),
          schoolAPI.getAllAdmin(),
          orderAPI.getAllAdmin(),
        ]);
        const revenue = o.data.filter(x => x.isPaid).reduce((a, x) => a + x.totalPrice, 0);
        setStats({ products: p.data.length, schools: s.data.length, orders: o.data.length, revenue });
        setRecentOrders(o.data.slice(0, 5));
      } catch {}
    };
    load();
  }, []);

  const statusColor = { pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700', delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Package} label="Total Products" value={stats.products} color="bg-blue-600" />
        <StatCard icon={School} label="Schools" value={stats.schools} color="bg-purple-600" />
        <StatCard icon={ShoppingBag} label="Total Orders" value={stats.orders} color="bg-green-600" />
        <StatCard icon={DollarSign} label="Revenue" value={`₹${stats.revenue.toLocaleString()}`} color="bg-amber-500" />
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">Recent Orders</h3>
          <Link to="/admin/orders" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View all</Link>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {recentOrders.length === 0 ? (
            <p className="text-center text-gray-400 py-8 text-sm">No orders yet</p>
          ) : recentOrders.map(order => (
            <div key={order._id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {order.user?.name || order.guestInfo?.name || 'Guest'}
                </p>
                <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-900 dark:text-white text-sm">₹{order.totalPrice.toLocaleString()}</span>
                <span className={`badge px-2.5 py-1 text-xs rounded-lg ${statusColor[order.status] || 'bg-gray-100 text-gray-700'}`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Product Modal ───────────────────────────────────── */
const ProductModal = ({ product, schools, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    discountPrice: product?.discountPrice || '',
    school: product?.school?._id || product?.school || '',
    category: product?.category || 'shirt',
    gender: product?.gender || 'unisex',
    tags: product?.tags?.join(', ') || '',
    isActive: product?.isActive ?? true,
    isFeatured: product?.isFeatured ?? false,
    sizes: product?.sizes?.length ? product.sizes : [{ size: '', stock: 0 }],
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    setPreviewUrls(selected.map(f => URL.createObjectURL(f)));
  };

  const addSize = () => setForm(p => ({ ...p, sizes: [...p.sizes, { size: '', stock: 0 }] }));
  const removeSize = (i) => setForm(p => ({ ...p, sizes: p.sizes.filter((_, idx) => idx !== i) }));
  const updateSize = (i, field, val) => setForm(p => ({
    ...p,
    sizes: p.sizes.map((s, idx) => idx === i ? { ...s, [field]: field === 'stock' ? Number(val) : val } : s)
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      const { sizes, tags, ...rest } = form;
      Object.entries(rest).forEach(([k, v]) => fd.append(k, v));
      fd.append('sizes', JSON.stringify(sizes.filter(s => s.size)));
      fd.append('tags', tags);
      files.forEach(f => fd.append('images', f));
      if (product) {
        const existingImages = product.images || [];
        fd.append('existingImages', JSON.stringify(existingImages));
        await productAPI.update(product._id, fd);
        toast.success('Product updated');
      } else {
        await productAPI.create(fd);
        toast.success('Product created');
      }
      onSave();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving product');
    } finally {
      setLoading(false);
    }
  };

  const CATEGORIES = ['shirt', 'trouser', 'skirt', 'dress', 'blazer', 'tie', 'socks', 'shoes', 'bag', 'accessories', 'set', 'other'];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white dark:bg-gray-900 flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800 z-10">
          <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-500">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Product Name *</label>
              <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="input-field" placeholder="e.g. DPS School Shirt" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">School *</label>
              <select required value={form.school} onChange={e => setForm(p => ({ ...p, school: e.target.value }))}
                className="input-field">
                <option value="">Select school</option>
                {schools.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category *</label>
              <select required value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className="input-field">
                {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Price (₹) *</label>
              <input required type="number" min="0" value={form.price}
                onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                className="input-field" placeholder="299" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Discount Price (₹)</label>
              <input type="number" min="0" value={form.discountPrice}
                onChange={e => setForm(p => ({ ...p, discountPrice: e.target.value }))}
                className="input-field" placeholder="249" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Gender</label>
              <select value={form.gender} onChange={e => setForm(p => ({ ...p, gender: e.target.value }))}
                className="input-field">
                {['boys', 'girls', 'unisex'].map(g => <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tags (comma separated)</label>
              <input value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))}
                className="input-field" placeholder="summer, formal, sports" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                rows={3} className="input-field resize-none" placeholder="Product description..." />
            </div>
          </div>

          {/* Sizes */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sizes & Stock</label>
              <button type="button" onClick={addSize}
                className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline">
                <Plus size={14} /> Add Size
              </button>
            </div>
            <div className="space-y-2">
              {form.sizes.map((s, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input value={s.size} onChange={e => updateSize(i, 'size', e.target.value)}
                    className="input-field flex-1 text-sm py-2" placeholder="Size (e.g. S, M, 32, etc.)" />
                  <input type="number" min="0" value={s.stock} onChange={e => updateSize(i, 'stock', e.target.value)}
                    className="input-field w-24 text-sm py-2" placeholder="Stock" />
                  {form.sizes.length > 1 && (
                    <button type="button" onClick={() => removeSize(i)} className="text-red-400 hover:text-red-600 p-2">
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product Images</label>
            {product?.images?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {product.images.map((img, i) => (
                  <img key={i} src={img.startsWith('http') ? img : `${BASE_URL}${img}`}
                    alt="" className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
                ))}
              </div>
            )}
            {previewUrls.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {previewUrls.map((url, i) => (
                  <img key={i} src={url} alt="" className="w-16 h-16 object-cover rounded-lg border-2 border-blue-400" />
                ))}
              </div>
            )}
            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-blue-400 transition-colors bg-gray-50 dark:bg-gray-800">
              <Upload size={24} className="text-gray-400 mb-2" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Click to upload images (max 5)</span>
              <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-6">
            {[['isActive', 'Active (visible in store)'], ['isFeatured', 'Featured product']].map(([key, label]) => (
              <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
                <div onClick={() => setForm(p => ({ ...p, [key]: !p[key] }))}
                  className={`w-11 h-6 rounded-full transition-colors relative ${form[key] ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form[key] ? 'translate-x-6' : 'translate-x-1'}`} />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Plus size={16} />}
              {product ? 'Update' : 'Create'} Product
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

/* ─── Products Panel ──────────────────────────────────── */
const ProductsPanel = () => {
  const [products, setProducts] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [p, s] = await Promise.all([productAPI.getAllAdmin(), schoolAPI.getAll()]);
      setProducts(p.data);
      setSchools(s.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productAPI.delete(id);
      toast.success('Product deleted');
      load();
    } catch { toast.error('Delete failed'); }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.school?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="input-field pl-9 py-2.5 text-sm" placeholder="Search products..." />
        </div>
        <button onClick={() => setModal({})} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase">
                <tr>
                  {['Product', 'School', 'Category', 'Price', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-10 text-gray-400">No products found</td></tr>
                ) : filtered.map(product => (
                  <motion.tr key={product._id} layout
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {product.images?.[0] ? (
                          <img src={product.images[0].startsWith('http') ? product.images[0] : `${BASE_URL}${product.images[0]}`}
                            alt="" className="w-10 h-10 rounded-xl object-cover bg-gray-100 dark:bg-gray-700" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 text-xs font-bold">
                            {product.name?.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                          <p className="text-xs text-gray-400">{product.gender}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{product.school?.shortName || '—'}</td>
                    <td className="px-5 py-4">
                      <span className="badge bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2.5 py-1 rounded-lg capitalize">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-900 dark:text-white">
                      ₹{(product.discountPrice || product.price).toLocaleString()}
                      {product.discountPrice && <span className="text-xs text-gray-400 line-through ml-1.5">₹{product.price}</span>}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`badge px-2.5 py-1 rounded-lg text-xs ${product.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => setModal(product)}
                          className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg text-blue-600 transition-colors">
                          <Edit2 size={15} />
                        </button>
                        <button onClick={() => handleDelete(product._id)}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {modal !== null && (
          <ProductModal
            product={modal._id ? modal : null}
            schools={schools}
            onClose={() => setModal(null)}
            onSave={load}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── School Modal ────────────────────────────────────── */
const SchoolModal = ({ school, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: school?.name || '', shortName: school?.shortName || '',
    description: school?.description || '', city: school?.city || '',
    isActive: school?.isActive ?? true, order: school?.order || 0,
    logo: school?.logo || '',
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('logo', file);
      if (school) {
        await schoolAPI.update(school._id, fd);
        toast.success('School updated');
      } else {
        await schoolAPI.create(fd);
        toast.success('School created');
      }
      onSave();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving school');
    } finally {
      setLoading(false);
    }
  };

  const logoSrc = preview || (form.logo && (form.logo.startsWith('http') ? form.logo : `${BASE_URL}${form.logo}`));

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white">{school ? 'Edit School' : 'Add School'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-500"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 overflow-hidden bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
              {logoSrc ? <img src={logoSrc} alt="" className="w-full h-full object-contain p-2" /> : <Upload size={24} className="text-gray-400" />}
            </div>
            <label className="cursor-pointer text-sm text-blue-600 dark:text-blue-400 hover:underline">
              Upload Logo
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </label>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Or paste logo URL</label>
              <input value={form.logo} onChange={e => setForm(p => ({ ...p, logo: e.target.value }))}
                className="input-field text-sm py-2" placeholder="https://..." />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">School Name *</label>
              <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="input-field" placeholder="Delhi Public School" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Short Name *</label>
              <input required value={form.shortName} onChange={e => setForm(p => ({ ...p, shortName: e.target.value.toUpperCase() }))}
                className="input-field" placeholder="DPS" maxLength={10} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">City</label>
              <input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                className="input-field" placeholder="New Delhi" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                rows={2} className="input-field resize-none text-sm" placeholder="About the school..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Display Order</label>
              <input type="number" value={form.order} onChange={e => setForm(p => ({ ...p, order: Number(e.target.value) }))}
                className="input-field" placeholder="0" />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <div onClick={() => setForm(p => ({ ...p, isActive: !p.isActive }))}
                  className={`w-11 h-6 rounded-full transition-colors relative ${form.isActive ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Plus size={16} />}
              {school ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

/* ─── Schools Panel ───────────────────────────────────── */
const SchoolsPanel = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { const { data } = await schoolAPI.getAllAdmin(); setSchools(data); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this school?')) return;
    try { await schoolAPI.delete(id); toast.success('School deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setModal({})} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Add School
        </button>
      </div>
      {loading ? <div className="text-center py-12 text-gray-400">Loading...</div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {schools.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-400">No schools yet</div>
          ) : schools.map(school => {
            const logoSrc = school.logo
              ? (school.logo.startsWith('http') ? school.logo : `${BASE_URL}${school.logo}`)
              : null;
            return (
              <motion.div key={school._id} layout
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center overflow-hidden shrink-0">
                  {logoSrc ? <img src={logoSrc} alt={school.shortName} className="w-full h-full object-contain p-1.5" />
                    : <span className="font-bold text-blue-600 text-sm">{school.shortName}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{school.name}</p>
                      <p className="text-xs text-gray-400">{school.city || 'India'}</p>
                    </div>
                    <span className={`badge text-xs px-2 py-0.5 rounded-lg shrink-0 ${school.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-gray-100 text-gray-500'}`}>
                      {school.isActive ? 'Active' : 'Off'}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => setModal(school)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg hover:bg-blue-100 transition-colors">
                      <Edit2 size={13} /> Edit
                    </button>
                    <button onClick={() => handleDelete(school._id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 transition-colors">
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
      <AnimatePresence>
        {modal !== null && (
          <SchoolModal school={modal._id ? modal : null} onClose={() => setModal(null)} onSave={load} />
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Orders Panel ────────────────────────────────────── */
const OrdersPanel = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const load = async () => {
      try { const { data } = await orderAPI.getAllAdmin(); setOrders(data); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await orderAPI.updateStatus(id, status);
      setOrders(p => p.map(o => o._id === id ? { ...o, status } : o));
      toast.success('Status updated');
    } catch { toast.error('Update failed'); }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
    confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
    processing: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
    shipped: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400',
    delivered: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
  };

  const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <div className="p-6 space-y-3">
      {loading ? <div className="text-center py-12 text-gray-400">Loading...</div>
        : orders.length === 0 ? <div className="text-center py-12 text-gray-400">No orders yet</div>
        : orders.map(order => (
          <div key={order._id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <button onClick={() => setExpanded(p => p === order._id ? null : order._id)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex items-center gap-4 min-w-0">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {order.user?.name || order.guestInfo?.name || 'Guest Order'}
                  </p>
                  <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-semibold text-gray-900 dark:text-white text-sm">₹{order.totalPrice.toLocaleString()}</span>
                <span className={`badge px-2.5 py-1 text-xs rounded-lg ${statusColors[order.status] || ''}`}>{order.status}</span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${expanded === order._id ? 'rotate-180' : ''}`} />
              </div>
            </button>

            <AnimatePresence>
              {expanded === order._id && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                  className="overflow-hidden border-t border-gray-100 dark:border-gray-800">
                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Customer</p>
                        <p className="font-medium text-gray-900 dark:text-white">{order.user?.name || order.guestInfo?.name}</p>
                        <p className="text-gray-500 dark:text-gray-400">{order.user?.email || order.guestInfo?.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Shipping Address</p>
                        <p className="text-gray-700 dark:text-gray-300">
                          {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Order Items</p>
                      <div className="space-y-2">
                        {order.items?.map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-2.5">
                            <span className="text-gray-700 dark:text-gray-300">{item.name} <span className="text-gray-400">× {item.quantity}</span> {item.size && <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-1.5 py-0.5 rounded ml-1">{item.size}</span>}</span>
                            <span className="font-semibold text-gray-900 dark:text-white">₹{(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Update Status:</label>
                      <select value={order.status} onChange={e => updateStatus(order._id, e.target.value)}
                        className="input-field py-2 text-sm flex-1 max-w-xs">
                        {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
    </div>
  );
};

/* ─── Bulk Orders Panel ───────────────────────────────── */
const BulkOrdersPanel = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { const { data } = await bulkOrderAPI.getAllAdmin(); setOrders(data); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await bulkOrderAPI.updateStatus(id, { status });
      setOrders(p => p.map(o => o._id === id ? { ...o, status } : o));
      toast.success('Status updated');
    } catch { toast.error('Update failed'); }
  };

  const statusColor = { new: 'bg-blue-100 text-blue-700', contacted: 'bg-yellow-100 text-yellow-700', quoted: 'bg-purple-100 text-purple-700', confirmed: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700' };

  return (
    <div className="p-6 space-y-3">
      {loading ? <div className="text-center py-12 text-gray-400">Loading...</div>
        : orders.length === 0 ? <div className="text-center py-12 text-gray-400">No bulk orders yet</div>
        : orders.map(order => (
          <div key={order._id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-gray-900 dark:text-white">{order.contactName}</p>
                  <span className={`badge text-xs px-2.5 py-1 rounded-lg ${statusColor[order.status] || 'bg-gray-100 text-gray-700'}`}>{order.status}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{order.organization}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{order.email} · {order.phone}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{order.requirements}</p>
                {order.estimatedQuantity && <p className="text-xs text-gray-400">Qty: ~{order.estimatedQuantity} units</p>}
                <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <div className="shrink-0">
                <select value={order.status} onChange={e => updateStatus(order._id, e.target.value)}
                  className="input-field py-2 text-sm text-xs">
                  {['new', 'contacted', 'quoted', 'confirmed', 'rejected'].map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

/* ─── Admin Page Shell ────────────────────────────────── */
const TITLES = {
  '/admin': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/schools': 'Schools',
  '/admin/orders': 'Orders',
  '/admin/bulk-orders': 'Bulk Orders',
};

const AdminPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [title, setTitle] = useState('Dashboard');

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <TopBar onMenuClick={() => setSidebarOpen(true)} title={title} />
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<><PageTitle set={setTitle} t="Dashboard" /><Dashboard /></>} />
            <Route path="/products" element={<><PageTitle set={setTitle} t="Products" /><ProductsPanel /></>} />
            <Route path="/schools" element={<><PageTitle set={setTitle} t="Schools" /><SchoolsPanel /></>} />
            <Route path="/orders" element={<><PageTitle set={setTitle} t="Orders" /><OrdersPanel /></>} />
            <Route path="/bulk-orders" element={<><PageTitle set={setTitle} t="Bulk Orders" /><BulkOrdersPanel /></>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const PageTitle = ({ set, t }) => {
  useEffect(() => { set(t); }, [set, t]);
  return null;
};

export default AdminPage;
