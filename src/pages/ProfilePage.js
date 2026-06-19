import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Lock, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setLoading(true);
    try {
      await authAPI.updateProfile({
        name: form.name,
        phone: form.phone,
        address: { street: form.street, city: form.city, state: form.state, pincode: form.pincode },
        ...(form.password ? { password: form.password } : {}),
      });
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{user?.name}</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{user?.email}</p>
              <span className={`badge text-xs mt-1 ${user?.role === 'admin' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                {user?.role === 'admin' ? 'Administrator' : 'Customer'}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" name="name" value={form.name} onChange={handleChange}
                    className="input-field pl-10" placeholder="Your name" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" value={user?.email} disabled
                    className="input-field pl-10 opacity-60 cursor-not-allowed" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                    className="input-field pl-10" placeholder="+91 98765 43210" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <MapPin size={16} /> Delivery Address
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <input type="text" name="street" value={form.street} onChange={handleChange}
                    className="input-field" placeholder="Street address" />
                </div>
                <input type="text" name="city" value={form.city} onChange={handleChange}
                  className="input-field" placeholder="City" />
                <input type="text" name="state" value={form.state} onChange={handleChange}
                  className="input-field" placeholder="State" />
                <input type="text" name="pincode" value={form.pincode} onChange={handleChange}
                  className="input-field" placeholder="PIN Code" />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Lock size={16} /> Change Password (optional)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="password" name="password" value={form.password} onChange={handleChange}
                  className="input-field" placeholder="New password" />
                <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange}
                  className="input-field" placeholder="Confirm new password" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 w-full justify-center">
              {loading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
              Save Changes
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
