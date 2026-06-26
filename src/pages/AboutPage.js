import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Heart, Target, Sparkles, ShieldCheck, Users, GraduationCap,
  Award, Leaf, ArrowRight, CheckCircle,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.55 } }),
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

const TIMELINE = [
  { year: '2009', title: 'Founded', desc: 'Indraprastha Uniforms founded in Lajpat Nagar, New Delhi, with a vision to provide quality uniforms for local schools.', color: 'bg-blue-600' },
  { year: '2012', title: 'First 50 Schools', desc: 'Reached milestone of 50 school partnerships across Delhi NCR, expanding to Noida and Gurgaon.', color: 'bg-amber-500' },
  { year: '2015', title: 'Manufacturing Unit', desc: 'Opened our own state-of-the-art manufacturing unit in Delhi, ensuring quality control at every step.', color: 'bg-green-600' },
  { year: '2018', title: 'Pan-India Expansion', desc: 'Extended operations to 15 cities across India, partnering with 200+ schools nationwide.', color: 'bg-purple-600' },
  { year: '2021', title: 'Online Platform', desc: 'Launched our e-commerce platform, making ordering uniforms convenient for parents across India.', color: 'bg-rose-600' },
  { year: '2024', title: '500+ Schools', desc: 'Celebrated the milestone of 500+ school partners and 50,000+ happy students across the country.', color: 'bg-teal-600' },
];

const VALUES = [
  { icon: ShieldCheck, title: 'Quality First', desc: 'ISI certified fabrics, rigorous quality checks, and premium stitching in every uniform we produce.', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
  { icon: Heart, title: 'Student Comfort', desc: 'Designed for all-day wear with breathable fabrics that keep students comfortable through long school days.', color: 'text-rose-600 bg-rose-50 dark:bg-rose-900/20' },
  { icon: Leaf, title: 'Sustainability', desc: 'Eco-friendly dyeing processes and responsible sourcing of cotton and polyester blends.', color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
  { icon: Users, title: 'Community', desc: 'Supporting local weavers and artisans, providing livelihoods to 200+ families across our supply chain.', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
];

const SCHOOLS_TRUSTED = ['Delhi Public School', 'Kendriya Vidyalaya', 'Ryan International', 'DAV Schools', 'Modern School', 'Springdales School', 'Amity Schools', 'St. Columbus School'];

const AboutPage = () => (
  <div className="min-h-screen">
    {/* ── Hero ── */}
    <section className="relative pt-32 pb-20 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-20 w-80 h-80 bg-amber-400 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-60 h-60 bg-white rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-amber-500/30">
          <Sparkles size={16} /> Our Story Since 2009
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display font-bold text-4xl sm:text-5xl text-white mb-5">
          Dressing the Future, <span className="text-amber-400">One Student at a Time</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg text-blue-200 max-w-2xl mx-auto leading-relaxed">
          For over 15 years, Indraprastha Uniforms has been the trusted uniform partner for schools across India — blending quality craftsmanship with comfort and affordability.
        </motion.p>
      </div>
    </section>

    {/* ── Brand Story ── */}
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <Section>
            <motion.div variants={fadeUp}>
              <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Our Story</span>
              <h2 className="section-title mt-2 mb-5">Built on a Simple Belief</h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>In 2009, our founder Rajesh Kumar walked into a school near Lajpat Nagar and noticed something troubling — students from less affluent families were wearing uniforms that didn't quite fit, made from inferior fabric that wore out within months.</p>
                <p>He knew he could do better. With two sewing machines and a small workspace, Indraprastha Uniforms was born — with the mission to make premium-quality school uniforms accessible to every family, regardless of their background.</p>
                <p>Today, we're proud to serve 500+ schools, clothe 50,000+ students, and employ 200+ skilled artisans — all while maintaining the same commitment to quality that started it all.</p>
              </div>
            </motion.div>
          </Section>
          <Section>
            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
              {[
                { value: '500+', label: 'School Partners', icon: GraduationCap, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' },
                { value: '50K+', label: 'Happy Students', icon: Users, color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' },
                { value: '50+', label: 'Years of Trust', icon: Award, color: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' },
                { value: '200+', label: 'Artisans Employed', icon: Heart, color: 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400' },
              ].map(({ value, label, icon: Icon, color }) => (
                <div key={label} className={`${color} rounded-2xl p-5 flex flex-col gap-3`}>
                  <Icon size={24} />
                  <div>
                    <p className="font-display font-bold text-2xl">{value}</p>
                    <p className="text-sm font-medium opacity-80">{label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </Section>
        </div>
      </div>
    </section>

    {/* ── Mission & Vision ── */}
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Section>
          <motion.div variants={fadeUp} className="text-center mb-12">
            <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Purpose</span>
            <h2 className="section-title mt-2">Mission & Vision</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div variants={fadeUp} custom={0} className="relative overflow-hidden bg-blue-700 dark:bg-blue-800 rounded-3xl p-8 text-white">
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
              <Target size={32} className="mb-4 text-amber-400" />
              <h3 className="font-display font-bold text-2xl mb-3">Our Mission</h3>
              <p className="text-blue-100 leading-relaxed">
                To provide every school student in India with high-quality, comfortable, and affordable uniforms — helping them step into school with confidence and pride, regardless of their family's economic background.
              </p>
            </motion.div>
            <motion.div variants={fadeUp} custom={1} className="relative overflow-hidden bg-amber-500 dark:bg-amber-600 rounded-3xl p-8 text-white">
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
              <Sparkles size={32} className="mb-4" />
              <h3 className="font-display font-bold text-2xl mb-3">Our Vision</h3>
              <p className="text-amber-50 leading-relaxed">
                To be India's most trusted school uniform brand by 2030 — serving 5,000+ schools, partnering with every major school chain, and setting the gold standard for quality and service in the education wear industry.
              </p>
            </motion.div>
          </div>
        </Section>
      </div>
    </section>

    {/* ── Values ── */}
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Section>
          <motion.div variants={fadeUp} className="text-center mb-12">
            <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest">What We Stand For</span>
            <h2 className="section-title mt-2">Our Core Values</h2>
          </motion.div>
          <motion.div variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <motion.div key={v.title} variants={fadeUp} custom={i} className="card p-6">
                <div className={`w-12 h-12 ${v.color} rounded-2xl flex items-center justify-center mb-4`}>
                  <v.icon size={22} />
                </div>
                <h3 className="font-display font-bold text-gray-900 dark:text-white mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </Section>
      </div>
    </section>

    {/* ── Timeline ── */}
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Section>
          <motion.div variants={fadeUp} className="text-center mb-14">
            <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Journey</span>
            <h2 className="section-title mt-2">Our Milestones</h2>
          </motion.div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-blue-400 to-blue-200 dark:from-blue-900 dark:via-blue-700 dark:to-blue-900" />
            <div className="space-y-8">
              {TIMELINE.map((item, i) => (
                <motion.div key={item.year} variants={fadeUp} custom={i} className="flex gap-6 pl-4">
                  <div className="relative shrink-0">
                    <div className={`w-8 h-8 ${item.color} rounded-full flex items-center justify-center shadow-lg ring-4 ring-white dark:ring-gray-900`}>
                      <CheckCircle size={16} className="text-white" />
                    </div>
                  </div>
                  <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 -mt-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`badge ${item.color} text-white px-3 py-1 font-bold text-sm`}>{item.year}</span>
                      <h3 className="font-display font-bold text-gray-900 dark:text-white">{item.title}</h3>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>
      </div>
    </section>

    {/* ── Quality Promise ── */}
    <section className="py-20 bg-gradient-to-br from-blue-950 to-blue-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Section>
          <motion.div variants={fadeUp}>
            <ShieldCheck size={48} className="text-amber-400 mx-auto mb-5" />
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-5">The Quality Promise</h2>
            <p className="text-blue-200 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              Every uniform that leaves our facility undergoes 12-point quality inspection. We use only ISI-certified fabrics, colorfast dyes, and reinforced stitching to ensure your child's uniform lasts the entire academic year.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {['ISI Certified Fabrics', 'Colorfast Guarantee', 'Full Year Warranty', 'Replacement for Defects', 'Comfort Tested', 'Eco-friendly Dyes'].map((q) => (
                <div key={q} className="flex items-center gap-2 text-sm text-blue-200 bg-white/5 rounded-xl px-4 py-3">
                  <CheckCircle size={14} className="text-amber-400 shrink-0" /> {q}
                </div>
              ))}
            </div>
          </motion.div>
        </Section>
      </div>
    </section>

    {/* ── Trusted By ── */}
    <section className="py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Section>
          <motion.div variants={fadeUp}>
            <p className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-8">Trusted by schools including</p>
            <div className="flex flex-wrap justify-center gap-3">
              {SCHOOLS_TRUSTED.map((school) => (
                <span key={school} className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300">
                  {school}
                </span>
              ))}
            </div>
          </motion.div>
          <motion.div variants={fadeUp} custom={1} className="mt-12">
            <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
              Shop Our Uniforms <ArrowRight size={16} />
            </Link>
          </motion.div>
        </Section>
      </div>
    </section>
  </div>
);

export default AboutPage;
