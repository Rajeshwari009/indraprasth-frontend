import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight, Truck, Percent, ShieldCheck, RotateCcw,
  GraduationCap, Users, Package, Award, ChevronRight,
} from 'lucide-react';
import SchoolCard from '../components/common/SchoolCard';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import OurOutlets from '../components/common/OurOutlets';
import { schoolAPI, productAPI } from '../utils/api';

/* ── Animation helpers ── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' },
  }),
};

const SectionWrapper = ({ children, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ── Stats counter ── */
const StatItem = ({ value, label, icon: Icon }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      className="flex flex-col items-center gap-2 text-center"
    >
      <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-2">
        <Icon size={28} className="text-amber-400" />
      </div>
      <span className="font-display font-bold text-4xl text-white">{inView ? value : '0'}</span>
      <span className="text-blue-200 text-sm font-medium">{label}</span>
    </motion.div>
  );
};

/* ── Feature card ── */
const FeatureCard = ({ icon: Icon, title, desc, color, index }) => (
  <motion.div variants={fadeUp} custom={index} className="card p-6 flex flex-col items-start gap-4">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <h3 className="font-display font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
    </div>
  </motion.div>
);

const HomePage = () => {
  const [schools, setSchools] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingSchools, setLoadingSchools] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    schoolAPI.getAll()
      .then(({ data }) => setSchools(data.schools || data || []))
      .catch(console.error)
      .finally(() => setLoadingSchools(false));

    productAPI.getAll({ featured: true, limit: 8 })
      .then(({ data }) => setFeaturedProducts(data.products || data || []))
      .catch(console.error)
      .finally(() => setLoadingProducts(false));
  }, []);

  const features = [
    { icon: Truck, title: 'Free Delivery', desc: 'Complimentary delivery on all orders above ₹999 across India.', color: 'bg-blue-600' },
    { icon: Percent, title: 'Bulk Order Discounts', desc: 'Up to 30% off on institutional bulk orders for schools.', color: 'bg-amber-500' },
    { icon: ShieldCheck, title: 'Premium Quality', desc: 'ISI certified fabrics ensuring comfort and durability.', color: 'bg-green-600' },
    { icon: RotateCcw, title: 'Easy Returns', desc: '15-day hassle-free return and exchange policy.', color: 'bg-purple-600' },
  ];

  const stats = [
    { value: '500+', label: 'School Partners', icon: GraduationCap },
    { value: '50,000+', label: 'Happy Students', icon: Users },
    { value: '200+', label: 'Uniform Styles', icon: Package },
    { value: '15+', label: 'Years of Trust', icon: Award },
  ];

  return (
    <div className="min-h-screen">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-blue-950">
        {/* Background video */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster=""
          aria-hidden="true"
        >
          <source src="/videos/hero-uniform.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay for readable text */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/85 via-blue-900/75 to-indigo-900/70" />
        <div className="absolute inset-0 bg-black/25" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-amber-500/30"
            >
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              India's Most Trusted School Uniform Brand
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight drop-shadow-lg"
            >
              Premium School Uniforms{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
                for Every Student
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mt-5 text-lg text-blue-200 leading-relaxed max-w-lg"
            >
              Quality, comfort, and style — perfectly tailored uniforms for 500+ schools across India.
              Bulk orders welcome with exclusive institutional discounts.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4 mt-8"
            >
              <Link to="/shop" className="btn-secondary flex items-center gap-2">
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link to="/bulk-orders" className="btn-outline border-white text-white hover:bg-white hover:text-blue-900 flex items-center gap-2">
                Bulk Orders <ChevronRight size={18} />
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-6 mt-10"
            >
              {[['✓', '500+ Schools'], ['✓', 'ISI Certified'], ['✓', 'Free Returns']].map(([icon, text]) => (
                <div key={text} className="flex items-center gap-2 text-blue-200 text-sm">
                  <span className="text-amber-400 font-bold">{icon}</span>
                  {text}
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <span className="text-blue-300 text-xs font-medium">Scroll to explore</span>
          <div className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ── SCHOOLS ── */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionWrapper>
            <motion.div variants={fadeUp} className="text-center mb-12">
              <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Our Partners</span>
              <h2 className="section-title mt-2">Shop by School</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">
                Find official uniforms for your child's school from our extensive list of school partners.
              </p>
            </motion.div>
          </SectionWrapper>

          {loadingSchools ? (
            <LoadingSpinner />
          ) : schools.length === 0 ? (
            <p className="text-center text-gray-400">No schools available yet.</p>
          ) : (
            <SectionWrapper>
              <motion.div
                variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
              >
                {schools.slice(0, 10).map((school, i) => (
                  <motion.div key={school._id} variants={fadeUp} custom={i} className="h-full">
                    <SchoolCard school={school} index={i} />
                  </motion.div>
                ))}
              </motion.div>
              {schools.length > 10 && (
                <motion.div variants={fadeUp} className="text-center mt-8">
                  <Link to="/shop" className="btn-outline flex items-center gap-2 w-fit mx-auto">
                    View All Schools <ArrowRight size={16} />
                  </Link>
                </motion.div>
              )}
            </SectionWrapper>
          )}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionWrapper>
            <motion.div variants={fadeUp} className="flex items-end justify-between mb-12">
              <div>
                <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Handpicked</span>
                <h2 className="section-title mt-2">Featured Products</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-3">Top-rated uniforms loved by students and parents alike.</p>
              </div>
              <Link to="/shop" className="hidden sm:flex items-center gap-2 text-blue-700 dark:text-blue-400 font-semibold text-sm hover:gap-3 transition-all">
                View All <ArrowRight size={16} />
              </Link>
            </motion.div>
          </SectionWrapper>

          {loadingProducts ? (
            <LoadingSpinner />
          ) : featuredProducts.length === 0 ? (
            <p className="text-center text-gray-400">No featured products yet.</p>
          ) : (
            <SectionWrapper>
              <motion.div
                variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
              >
                {featuredProducts.map((product, i) => (
                  <motion.div key={product._id} variants={fadeUp} custom={i}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            </SectionWrapper>
          )}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionWrapper>
            <motion.div variants={fadeUp} className="text-center mb-12">
              <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Why Choose Us</span>
              <h2 className="section-title mt-2">The Indraprastha Promise</h2>
            </motion.div>
            <motion.div
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {features.map((f, i) => (
                <FeatureCard key={f.title} {...f} index={i} />
              ))}
            </motion.div>
          </SectionWrapper>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-20 bg-gradient-to-br from-blue-950 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionWrapper>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <span className="text-sm font-semibold text-amber-400 uppercase tracking-widest">Our Impact</span>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-white mt-2">
                Trusted by Schools Across India
              </h2>
            </motion.div>
            <motion.div
              variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
            >
              {stats.map((stat) => (
                <StatItem key={stat.label} {...stat} />
              ))}
            </motion.div>
          </SectionWrapper>
        </div>
      </section>

      {/* ── BULK CTA ── */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionWrapper>
            <motion.div
              variants={fadeUp}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 p-10 md:p-16 text-center shadow-2xl"
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/10 rounded-full" />
              <div className="relative z-10">
                <span className="inline-block bg-white/20 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
                  Schools & Institutions
                </span>
                <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-4">
                  Need Uniforms in Bulk?
                </h2>
                <p className="text-amber-100 text-lg max-w-xl mx-auto mb-8">
                  Special institutional pricing, custom embroidery, and dedicated account management for schools ordering 50+ units.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link to="/bulk-orders" className="bg-white text-amber-600 hover:bg-amber-50 font-bold px-8 py-3 rounded-xl transition-colors shadow-lg">
                    Request Bulk Quote
                  </Link>
                  <Link to="/contact" className="border-2 border-white text-white hover:bg-white hover:text-amber-600 font-bold px-8 py-3 rounded-xl transition-colors">
                    Contact Sales Team
                  </Link>
                </div>
              </div>
            </motion.div>
          </SectionWrapper>
        </div>
      </section>

      <OurOutlets className="bg-gray-50 dark:bg-gray-900/50" />
    </div>
  );
};

export default HomePage;
