import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Phone, Mail, Clock, Send, CheckCircle, MessageSquare,
  MessageCircle,
} from 'lucide-react';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { SITE } from '../config/site';

const BUSINESS_HOURS = [
  { day: 'Monday – Friday', hours: '9:00 AM – 7:00 PM', open: true },
  { day: 'Saturday', hours: '9:00 AM – 6:00 PM', open: true },
  { day: 'Sunday', hours: 'Closed', open: false },
];

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
    toast.success('Message sent! We\'ll reply within 24 hours.');
  };

  const contactCards = [
    {
      icon: MapPin,
      title: 'Visit Us',
      lines: [SITE.city, 'Multiple outlets across Bhopal'],
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
    },
    {
      icon: Phone,
      title: 'Customer Care',
      lines: [`+91 ${SITE.phoneDisplay}`, 'WhatsApp Business available'],
      href: `tel:+91${SITE.phone}`,
      color: 'text-green-600 bg-green-50 dark:bg-green-900/20',
    },
    {
      icon: Mail,
      title: 'Email Us',
      lines: [SITE.email, 'Usually replies within 24 hrs'],
      href: `mailto:${SITE.email}`,
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20',
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      lines: [`+91 ${SITE.phoneDisplay}`, 'Order now via chat'],
      href: `https://wa.me/${SITE.whatsapp}`,
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-amber-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-amber-500/30">
            <MessageSquare size={16} /> Get in Touch
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display font-bold text-4xl sm:text-5xl text-white mb-4">
            Contact Us
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-blue-200 text-lg max-w-xl mx-auto">
            Have a question, need a bulk quote, or just want to say hello? We're here for you.
          </motion.p>
        </div>
      </section>

      {/* ── Contact Cards ── */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 -mt-8">
            {contactCards.map((card, i) => {
              const CardWrapper = card.href ? 'a' : 'div';
              const wrapperProps = card.href
                ? { href: card.href, target: card.href.startsWith('http') ? '_blank' : undefined, rel: 'noopener noreferrer' }
                : {};
              return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <CardWrapper {...wrapperProps} className={`card p-6 block h-full ${card.href ? 'hover:shadow-lg transition-shadow' : ''}`}>
                  <div className={`w-12 h-12 ${card.color} rounded-2xl flex items-center justify-center mb-4`}>
                    <card.icon size={22} />
                  </div>
                  <h3 className="font-display font-bold text-gray-900 dark:text-white mb-2">{card.title}</h3>
                  {card.lines.map((line, j) => (
                    <p key={j} className={`text-sm ${j === card.lines.length - 1 ? 'text-gray-400 dark:text-gray-500 mt-1 text-xs' : 'text-gray-600 dark:text-gray-400'}`}>
                      {line}
                    </p>
                  ))}
                </CardWrapper>
              </motion.div>
            );})}
          </div>
        </div>
      </section>

      {/* ── Map + Form ── */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Map Placeholder */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col gap-6"
            >
              <div className="relative overflow-hidden rounded-3xl h-72 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-xl">
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                <div className="relative flex flex-col items-center gap-3 text-center">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl"
                  >
                    <MapPin size={28} className="text-blue-700" />
                  </motion.div>
                  <div>
                    <p className="text-white font-bold font-display">Indraprasth-Uniforms</p>
                    <p className="text-blue-200 text-sm">{SITE.city}</p>
                    <p className="text-blue-300 text-xs mt-1">+91 {SITE.phoneDisplay}</p>
                  </div>
                </div>
                {/* Pulsing rings */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  {[1, 2, 3].map((n) => (
                    <motion.div
                      key={n}
                      className="absolute rounded-full border border-white/20"
                      initial={{ width: 80, height: 80, x: -40, y: -40, opacity: 0.8 }}
                      animate={{ width: 80 + n * 60, height: 80 + n * 60, x: -(40 + n * 30), y: -(40 + n * 30), opacity: 0 }}
                      transition={{ duration: 3, repeat: Infinity, delay: n * 0.8 }}
                    />
                  ))}
                </div>
              </div>

              {/* Business Hours Table */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                <h3 className="font-display font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Clock size={18} className="text-blue-700 dark:text-blue-400" /> Business Hours
                </h3>
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {BUSINESS_HOURS.map((row) => (
                    <div key={row.day} className="flex justify-between items-center py-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{row.day}</span>
                      <span className={`text-sm font-semibold ${row.open ? 'text-blue-700 dark:text-blue-400' : 'text-gray-400'}`}>
                        {row.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <a href={SITE.facebook} target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors">
                  <FaFacebookF size={16} /> Facebook
                </a>
                <a href={SITE.instagram} target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-semibold transition-colors">
                  <FaInstagram size={16} /> Instagram
                </a>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-7 shadow-lg border border-gray-100 dark:border-gray-800"
            >
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-5 py-10">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
                    className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle size={40} className="text-green-500" />
                  </motion.div>
                  <h3 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Message Sent!</h3>
                  <p className="text-gray-500 dark:text-gray-400">Thank you for reaching out, {form.name}. We'll get back to you at {form.email} within 24 hours.</p>
                  <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }} className="btn-outline">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="font-display font-bold text-2xl text-gray-900 dark:text-white mb-6">Send Us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Your Name <span className="text-red-500">*</span></label>
                        <input name="name" value={form.name} onChange={handleChange} placeholder="Rahul Sharma" className="input-field" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="rahul@example.com" className="input-field" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Subject</label>
                      <input name="subject" value={form.subject} onChange={handleChange} placeholder="How can we help you?" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message <span className="text-red-500">*</span></label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Tell us about your inquiry, bulk order requirements, or any questions you may have..."
                        className="input-field resize-none"
                        required
                      />
                    </div>
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileTap={{ scale: 0.98 }}
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                          Sending...
                        </>
                      ) : (
                        <><Send size={16} /> Send Message</>
                      )}
                    </motion.button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
