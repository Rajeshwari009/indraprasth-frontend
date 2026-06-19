import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Percent, Users, Palette, Shield, Phone, Mail, Building2,
  ChevronDown, ChevronUp, CheckCircle, Package, FileText, Handshake,
  ArrowRight,
} from 'lucide-react';
import { bulkOrderAPI, schoolAPI } from '../utils/api';
import toast from 'react-hot-toast';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const Section = ({ children, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} className={className}>
      {children}
    </motion.div>
  );
};

const FAQ_ITEMS = [
  { q: 'What is the minimum order quantity for bulk orders?', a: 'Our minimum order quantity is 25 pieces per item. For orders of 100+ pieces, we offer additional discounts and dedicated account management.' },
  { q: 'How long does delivery take for bulk orders?', a: 'Bulk orders typically take 10–21 working days depending on the size and customization requirements. Rush orders can be accommodated for a premium.' },
  { q: 'Can we get our school logo embroidered on uniforms?', a: 'Absolutely! We offer custom embroidery and screen printing services for school logos, badges, and monograms on all uniform items.' },
  { q: 'Do you offer custom sizing for bulk orders?', a: 'Yes, we provide measurement-based custom sizing for institutional orders. Our team can visit your school to take measurements at no extra charge for orders of 200+ units.' },
  { q: 'What payment terms are available for schools?', a: 'We offer 30–50% advance payment with the balance on delivery. For government schools and established institutions, credit terms up to 60 days are available.' },
  { q: 'Can you match our existing uniform design exactly?', a: 'Yes! Bring us a sample or detailed specifications, and our design team will replicate it precisely, including fabric type, color, and finishing.' },
];

const BulkOrdersPage = () => {
  const [schools, setSchools] = useState([]);
  const [faqOpen, setFaqOpen] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    contactName: '',
    email: '',
    phone: '',
    organization: '',
    school: '',
    requirements: '',
    estimatedQuantity: '',
  });

  useEffect(() => {
    schoolAPI.getAll()
      .then(({ data }) => setSchools(data.schools || data || []))
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const required = ['contactName', 'email', 'phone', 'organization', 'estimatedQuantity'];
    const missing = required.filter((f) => !form[f]?.trim());
    if (missing.length) { toast.error('Please fill all required fields'); return; }
    if (!/^\d{10}$/.test(form.phone)) { toast.error('Enter a valid 10-digit phone'); return; }
    if (parseInt(form.estimatedQuantity) < 25) { toast.error('Minimum order quantity is 25'); return; }

    setSubmitting(true);
    try {
      await bulkOrderAPI.create({
        ...form,
        estimatedQuantity: parseInt(form.estimatedQuantity),
      });
      setSubmitted(true);
      toast.success('Bulk order inquiry submitted! We will contact you within 24 hours.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const benefits = [
    { icon: Percent, title: 'Up to 30% Discount', desc: 'Tiered pricing based on volume — the more you order, the more you save.', color: 'bg-blue-600' },
    { icon: Palette, title: 'Custom Branding', desc: 'School logos, embroidery, screen printing on all uniform items.', color: 'bg-amber-500' },
    { icon: Users, title: 'Dedicated Manager', desc: 'A dedicated account manager for seamless bulk order processing.', color: 'bg-green-600' },
    { icon: Shield, title: 'Quality Guarantee', desc: 'ISI certified fabrics with full replacement guarantee for defective items.', color: 'bg-purple-600' },
  ];

  const steps = [
    { icon: FileText, step: '01', title: 'Submit Inquiry', desc: 'Fill out the form below with your requirements. Our team reviews it within 2 hours.' },
    { icon: Phone, step: '02', title: 'Consultation Call', desc: 'Our bulk order specialist calls you to understand your exact needs and provide a detailed quote.' },
    { icon: Handshake, step: '03', title: 'Order & Deliver', desc: 'Confirm your order, pay 50% advance, and receive your uniforms within the committed timeline.' },
  ];

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-amber-500/30">
            <Package size={16} /> Schools & Institutions
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display font-bold text-4xl sm:text-5xl text-white mb-5">
            Bulk Orders for <span className="text-amber-400">Schools</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg text-blue-200 max-w-2xl mx-auto mb-8">
            Premium quality school uniforms at institutional prices. Custom sizing, school branding, and dedicated support for orders of 25+ pieces.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-wrap justify-center gap-6">
            {['Min. 25 units', 'Up to 30% off', 'Custom branding', 'Fast delivery'].map((tag) => (
              <span key={tag} className="flex items-center gap-2 text-sm text-blue-200">
                <CheckCircle size={14} className="text-amber-400" /> {tag}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section>
            <motion.div variants={fadeUp} className="text-center mb-12">
              <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Why Bulk Order</span>
              <h2 className="section-title mt-2">Benefits for Your Institution</h2>
            </motion.div>
            <motion.div variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((b, i) => (
                <motion.div key={b.title} variants={fadeUp} custom={i} className="card p-6 flex flex-col gap-4">
                  <div className={`w-12 h-12 rounded-2xl ${b.color} flex items-center justify-center`}>
                    <b.icon size={22} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-gray-900 dark:text-white mb-1">{b.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{b.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </Section>
        </div>
      </section>

      {/* ── How it Works ── */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Process</span>
              <h2 className="section-title mt-2">How Bulk Ordering Works</h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((s, i) => (
                <motion.div key={s.step} variants={fadeUp} custom={i} className="relative text-center">
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[calc(50%+40px)] right-[-calc(50%-40px)] h-0.5 bg-gradient-to-r from-blue-200 to-blue-100 dark:from-blue-900 dark:to-blue-950" />
                  )}
                  <div className="relative inline-flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-blue-700 dark:bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-700/30">
                      <s.icon size={28} className="text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
                      {s.step}
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-gray-900 dark:text-white mt-5 mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ── Inquiry Form ── */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section>
            <motion.div variants={fadeUp} className="text-center mb-10">
              <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Get Started</span>
              <h2 className="section-title mt-2">Submit Bulk Order Inquiry</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-3">Fill in your details and we'll get back to you within 24 hours with a custom quote.</p>
            </motion.div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-900 rounded-3xl p-10 text-center shadow-lg border border-gray-100 dark:border-gray-800"
              >
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
                  <CheckCircle size={40} className="text-green-500" />
                </div>
                <h3 className="font-display font-bold text-2xl text-gray-900 dark:text-white mb-3">Inquiry Submitted!</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Our bulk order specialist will call you at <strong>{form.phone}</strong> within 24 hours.
                </p>
                <button onClick={() => { setSubmitted(false); setForm({ contactName: '', email: '', phone: '', organization: '', school: '', requirements: '', estimatedQuantity: '' }); }} className="btn-outline">
                  Submit Another Inquiry
                </button>
              </motion.div>
            ) : (
              <motion.div variants={fadeUp} className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-100 dark:border-gray-800">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Contact Name <span className="text-red-500">*</span></label>
                      <input name="contactName" value={form.contactName} onChange={handleChange} placeholder="Principal / Coordinator name" className="input-field" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="school@example.com" className="input-field" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                      <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="9876543210" className="input-field" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Estimated Quantity <span className="text-red-500">*</span></label>
                      <input name="estimatedQuantity" type="number" min="25" value={form.estimatedQuantity} onChange={handleChange} placeholder="Min. 25 pieces" className="input-field" required />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Organization / School Name <span className="text-red-500">*</span></label>
                      <input name="organization" value={form.organization} onChange={handleChange} placeholder="Delhi Public School, Sector 45" className="input-field" required />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">School (if already our partner)</label>
                      <select name="school" value={form.school} onChange={handleChange} className="input-field">
                        <option value="">Select a school (optional)</option>
                        {schools.map((s) => (
                          <option key={s._id} value={s._id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Requirements & Special Instructions</label>
                      <textarea
                        name="requirements"
                        value={form.requirements}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Describe the uniform types needed, specific colors, sizes distribution, embroidery requirements, delivery timeline, etc."
                        className="input-field resize-none"
                      />
                    </div>
                  </div>
                  <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2">
                    {submitting ? (
                      <>
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                        Submitting...
                      </>
                    ) : (
                      <><ArrowRight size={18} /> Submit Bulk Order Inquiry</>
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </Section>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section>
            <motion.div variants={fadeUp} className="text-center mb-10">
              <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest">FAQs</span>
              <h2 className="section-title mt-2">Frequently Asked Questions</h2>
            </motion.div>
            <div className="space-y-3">
              {FAQ_ITEMS.map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  custom={i}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
                >
                  <button
                    onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                    className="w-full flex items-start justify-between gap-4 p-5 text-left"
                  >
                    <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{item.q}</span>
                    <span className="shrink-0 mt-0.5">
                      {faqOpen === i ? <ChevronUp size={18} className="text-blue-700 dark:text-blue-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {faqOpen === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ── Contact CTA ── */}
      <section className="py-12 bg-blue-700 dark:bg-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="font-display font-bold text-2xl text-white mb-3">Have more questions?</h3>
          <p className="text-blue-200 mb-6">Our team is available Mon–Sat, 9 AM to 6 PM</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:+919876543210" className="flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-bold px-6 py-3 rounded-xl transition-colors">
              <Phone size={18} /> Call Us
            </a>
            <a href="mailto:bulk@indraprasthuniform.com" className="flex items-center gap-2 border-2 border-white text-white hover:bg-white hover:text-blue-700 font-bold px-6 py-3 rounded-xl transition-colors">
              <Mail size={18} /> Email Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BulkOrdersPage;
