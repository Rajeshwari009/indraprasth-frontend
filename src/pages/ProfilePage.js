import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, Lock, Save, Package, Camera,
  ChevronDown, Truck, Calendar, MapPinned, ShoppingBag, Settings,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI, orderAPI } from '../utils/api';
import { getAssetUrl } from '../utils/images';
import ProductImage from '../components/common/ProductImage';
import MapView from '../components/common/MapView';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  ORDER_STATUS_STEPS,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  getStatusStepIndex,
  formatOrderDate,
  formatOrderId,
} from '../utils/orderStatus';
import toast from 'react-hot-toast';

const TABS = [
  { id: 'orders', label: 'My Orders', icon: Package },
  { id: 'settings', label: 'Account Settings', icon: Settings },
];

const OrderTimeline = ({ status }) => {
  const current = getStatusStepIndex(status);
  if (status === 'cancelled') {
    return (
      <p className="text-sm text-red-600 dark:text-red-400 font-medium py-2">
        This order was cancelled.
      </p>
    );
  }

  return (
    <div className="relative pl-1">
      {ORDER_STATUS_STEPS.map((step, i) => {
        const done = i <= current;
        const active = i === current;
        return (
          <div key={step.key} className="flex gap-4 pb-6 last:pb-0 relative">
            {i < ORDER_STATUS_STEPS.length - 1 && (
              <div className={`absolute left-[11px] top-6 w-0.5 h-full ${done && i < current ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
            )}
            <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 ${
              done ? 'bg-blue-600 border-blue-600' : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600'
            }`}>
              {done && <div className={`w-2 h-2 rounded-full ${active ? 'bg-white animate-pulse' : 'bg-white/80'}`} />}
            </div>
            <div className="pt-0.5">
              <p className={`text-sm font-semibold ${active ? 'text-blue-700 dark:text-blue-400' : done ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400'}`}>
                {step.label}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{step.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const OrderCard = ({ order }) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      layout
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
            <ShoppingBag size={22} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 dark:text-white text-sm">
              {formatOrderId(order._id)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Placed on {formatOrderDate(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <p className="font-bold text-gray-900 dark:text-white">₹{order.totalPrice?.toLocaleString('en-IN')}</p>
            {order.estimatedDelivery && (
              <p className="text-xs text-gray-400 flex items-center gap-1 justify-end mt-0.5">
                <Calendar size={11} /> Est. {formatOrderDate(order.estimatedDelivery)}
              </p>
            )}
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${ORDER_STATUS_COLORS[order.status] || ''}`}>
            {ORDER_STATUS_LABELS[order.status] || order.status}
          </span>
          <ChevronDown size={18} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-gray-100 dark:border-gray-800"
          >
            <div className="p-5 space-y-6">
              <div className="sm:hidden flex justify-between text-sm">
                <span className="text-gray-500">Total</span>
                <span className="font-bold">₹{order.totalPrice?.toLocaleString('en-IN')}</span>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Items Ordered</h4>
                <div className="space-y-3">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex gap-3 items-center bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0">
                        <ProductImage
                          src={item.image}
                          alt={item.name}
                          name={item.name}
                          className="w-full h-full"
                          imgClassName="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 dark:text-white line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Size: {item.size || '—'} · Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-sm text-gray-900 dark:text-white shrink-0">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="rounded-xl bg-gray-50 dark:bg-gray-800/60 p-4">
                  <p className="text-xs text-gray-400 mb-1">Payment</p>
                  <p className="font-medium capitalize">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</p>
                  <p className="text-xs text-gray-500 mt-2">Shipping: ₹{order.shippingPrice?.toLocaleString('en-IN') || 0}</p>
                </div>
                <div className="rounded-xl bg-gray-50 dark:bg-gray-800/60 p-4">
                  <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Truck size={12} /> Delivery Address</p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {order.shippingAddress?.label || `${order.shippingAddress?.street}, ${order.shippingAddress?.city}, ${order.shippingAddress?.state} – ${order.shippingAddress?.pincode}`}
                  </p>
                </div>
              </div>

              {order.shippingAddress?.lat && order.shippingAddress?.lng && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Delivery Location</p>
                  <MapView lat={order.shippingAddress.lat} lng={order.shippingAddress.lng} height="200px" />
                </div>
              )}

              {(order.trackingLocation || (order.trackingLat && order.trackingLng)) && (
                <div className="space-y-3">
                  <div className="rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/30 p-4 flex gap-3">
                    <MapPinned size={20} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide">Live Tracking</p>
                      <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">{order.trackingLocation || 'Order location updated'}</p>
                    </div>
                  </div>
                  {order.trackingLat && order.trackingLng && (
                    <MapView lat={order.trackingLat} lng={order.trackingLng} height="200px" zoom={14} />
                  )}
                </div>
              )}

              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Track Your Order</h4>
                <OrderTimeline status={order.status} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || '',
      phone: user.phone || '',
      street: user.address?.street || '',
      city: user.address?.city || '',
      state: user.address?.state || '',
      pincode: user.address?.pincode || '',
      password: '',
      confirmPassword: '',
    });
  }, [user]);

  useEffect(() => {
    orderAPI.getMyOrders()
      .then(({ data }) => setOrders(data))
      .catch(() => toast.error('Could not load orders'))
      .finally(() => setOrdersLoading(false));
  }, []);

  const avatarUrl = user?.avatar ? getAssetUrl(user.avatar) : null;
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : null;

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error('Image must be under 5MB');
    setAvatarLoading(true);
    try {
      const { data } = await authAPI.uploadAvatar(file);
      updateUser(data);
      toast.success('Profile photo updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setSaveLoading(true);
    try {
      const { data } = await authAPI.updateProfile({
        name: form.name,
        phone: form.phone,
        address: { street: form.street, city: form.city, state: form.state, pincode: form.pincode },
        ...(form.password ? { password: form.password } : {}),
      });
      updateUser(data);
      setForm((p) => ({ ...p, password: '', confirmPassword: '' }));
      toast.success('Profile saved successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gradient-to-b from-slate-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-6 md:p-8 mb-8 shadow-xl"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-6">
            <div className="relative group">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl bg-white/10 flex items-center justify-center">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={user?.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-white">{user?.name?.charAt(0)?.toUpperCase()}</span>
                )}
                {avatarLoading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-9 h-9 bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-lg flex items-center justify-center transition-colors"
                aria-label="Change photo"
              >
                <Camera size={16} />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="font-display font-bold text-2xl md:text-3xl text-white">
                Hello, {user?.name?.split(' ')[0]}!
              </h1>
              <p className="text-blue-200 text-sm mt-1">{user?.email}</p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-3">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/15 text-white border border-white/20">
                  {user?.role === 'admin' ? 'Administrator' : 'Valued Customer'}
                </span>
                {memberSince && (
                  <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30">
                    Member since {memberSince}
                  </span>
                )}
              </div>
            </div>
            <div className="hidden md:flex gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-white">{orders.length}</p>
                <p className="text-xs text-blue-200">Orders</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-gray-100 dark:bg-gray-800/80 rounded-2xl w-full sm:w-auto sm:inline-flex">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === id
                  ? 'bg-white dark:bg-gray-900 text-blue-700 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === 'orders' ? (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-4"
            >
              {ordersLoading ? (
                <div className="py-16"><LoadingSpinner /></div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
                  <Package size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">No orders yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 max-w-sm mx-auto">
                    When you place an order, it will appear here with live tracking and delivery updates.
                  </p>
                </div>
              ) : (
                orders.map((order) => <OrderCard key={order._id} order={order} />)
              )}
            </motion.div>
          ) : (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
                <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white">Account Settings</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Update your personal details and delivery address</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-8">
                <section>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <User size={16} className="text-blue-600" /> Personal Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Full Name</label>
                      <input type="text" name="name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                        className="input-field" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Email</label>
                      <div className="relative">
                        <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="email" value={user?.email || ''} disabled
                          className="input-field pl-9 opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-800" />
                      </div>
                    </div>
                    <div className="sm:col-span-2 sm:max-w-xs">
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Phone Number</label>
                      <div className="relative">
                        <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="tel" name="phone" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                          className="input-field pl-9" placeholder="9425605685" />
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <MapPin size={16} className="text-blue-600" /> Default Delivery Address
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Street Address</label>
                      <input type="text" name="street" value={form.street} onChange={(e) => setForm((p) => ({ ...p, street: e.target.value }))}
                        className="input-field" placeholder="House no., street, area" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">City</label>
                      <input type="text" name="city" value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                        className="input-field" placeholder="Bhopal" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">State</label>
                      <input type="text" name="state" value={form.state} onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))}
                        className="input-field" placeholder="Madhya Pradesh" />
                    </div>
                    <div className="sm:max-w-xs">
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">PIN Code</label>
                      <input type="text" name="pincode" value={form.pincode} onChange={(e) => setForm((p) => ({ ...p, pincode: e.target.value }))}
                        className="input-field" placeholder="462001" />
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Lock size={16} className="text-blue-600" /> Change Password
                    <span className="text-xs font-normal text-gray-400">(optional)</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">New Password</label>
                      <input type="password" name="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                        className="input-field" placeholder="Min. 6 characters" autoComplete="new-password" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Confirm Password</label>
                      <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                        className="input-field" placeholder="Repeat password" autoComplete="new-password" />
                    </div>
                  </div>
                </section>

                <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                  <button type="submit" disabled={saveLoading} className="btn-primary flex items-center gap-2 px-8">
                    {saveLoading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfilePage;
