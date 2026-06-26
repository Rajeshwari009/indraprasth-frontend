import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone } from 'lucide-react';
import { SITE, OUTLETS } from '../../config/site';

const OurOutlets = ({ className = '' }) => (
  <section className={`py-16 md:py-20 ${className}`}>
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-8 md:mb-10"
      >
        <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
          Visit Us
        </span>
        <h2 className="section-title mt-2">Our Other Outlets</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-2xl mx-auto text-sm md:text-base">
          50 years of trust & quality — find us across Bhopal for school, college, hospital & corporate uniforms.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 mb-8"
      >
        <img
          src={SITE.outletsBanner}
          alt="Indraprasth Uniforms outlets and contact details"
          className="w-full h-auto object-cover"
        />
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {OUTLETS.map((outlet, i) => (
          <motion.a
            key={outlet.name}
            href={`tel:${outlet.phone.replace(/\s/g, '')}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="group rounded-2xl p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <MapPin size={18} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-display font-bold text-gray-900 dark:text-white text-sm mb-1">{outlet.name}</h3>
            <p className="flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 font-semibold">
              <Phone size={13} />
              {outlet.phone}
            </p>
          </motion.a>
        ))}
      </div>
    </div>
  </section>
);

export default OurOutlets;
