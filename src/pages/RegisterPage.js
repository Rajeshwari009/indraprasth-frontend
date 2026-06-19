import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const { register } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill all required fields');
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'name', label: 'Full Name', type: 'text', icon: User, placeholder: 'Your full name', required: true },
    { name: 'email', label: 'Email Address', type: 'email', icon: Mail, placeholder: 'your@email.com', required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel', icon: Phone, placeholder: '+91 98765 43210', required: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />

      <button onClick={toggleTheme} className="absolute top-6 right-6 p-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all">
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-white font-bold text-2xl">IP</span>
            </div>
          </Link>
          <h1 className="mt-4 text-3xl font-display font-bold text-white">Create Account</h1>
          <p className="text-blue-200 mt-1 text-sm">Join Indraprasth Uniforms today</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ name, label, type, icon: Icon, placeholder, required }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-blue-100 mb-2">
                  {label}{required && <span className="text-red-400 ml-1">*</span>}
                </label>
                <div className="relative">
                  <Icon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" />
                  <input
                    type={type} name={name} value={form[name]} onChange={handleChange}
                    placeholder={placeholder} required={required}
                    className="w-full pl-11 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                  />
                </div>
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">Password <span className="text-red-400">*</span></label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" />
                <input
                  type={showPwd ? 'text' : 'password'} name="password" value={form.password}
                  onChange={handleChange} placeholder="Min 6 characters" required
                  className="w-full pl-11 pr-12 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                />
                <button type="button" onClick={() => setShowPwd(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white">
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">Confirm Password <span className="text-red-400">*</span></label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" />
                <input
                  type={showPwd ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword}
                  onChange={handleChange} placeholder="Repeat your password" required
                  className="w-full pl-11 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                />
              </div>
            </div>

            <motion.button
              type="submit" disabled={loading} whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-60"
            >
              {loading
                ? <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : <><span>Create Account</span><ArrowRight size={18} /></>
              }
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-blue-200 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-white font-semibold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>

        <p className="text-center text-blue-300 text-sm mt-6">
          <Link to="/" className="hover:text-white transition-colors">← Back to Home</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
