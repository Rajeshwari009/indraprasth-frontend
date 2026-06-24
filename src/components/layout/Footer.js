import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import PolicyModal from '../common/PolicyModal';

const POLICY_LINKS = [
  { key: 'privacy-policy', label: 'Privacy Policy' },
  { key: 'terms-and-conditions', label: 'Terms & Conditions' },
  { key: 'refund-policy', label: 'Refund Policy' },
];

const Footer = () => {
  const [activePolicy, setActivePolicy] = useState(null);

  return (
    <>
      <footer className="bg-gray-950 text-gray-300 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">IP</span>
                </div>
                <div>
                  <p className="font-display font-bold text-white leading-none">INDRAPRASTH</p>
                  <p className="text-xs tracking-[0.2em] text-gray-400">UNIFORMS</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Your trusted partner for premium school uniforms. Quality, comfort and style for every student.
              </p>
              <div className="flex gap-3 mt-5">
                {['f', 'in', 'tw'].map((label, i) => (
                  <a key={i} href="#" className="w-9 h-9 bg-gray-800 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors text-xs font-bold text-gray-300">
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-display font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2.5">
                {[['/', 'Home'], ['/shop', 'Shop Now'], ['/bulk-orders', 'Bulk Orders'], ['/about', 'About Us'], ['/contact', 'Contact Us']].map(([to, label]) => (
                  <li key={to}>
                    <Link to={to} className="text-sm text-gray-400 hover:text-blue-400 transition-colors hover:translate-x-1 inline-block">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Schools */}
            <div>
              <h4 className="font-display font-semibold text-white mb-4">School Partners</h4>
              <ul className="space-y-2.5">
                {['DPS Schools', 'Indraprastha Schools', 'Kendriya Vidyalaya', 'Ryan International', 'DAV Schools', 'Modern School'].map(s => (
                  <li key={s} className="text-sm text-gray-400">{s}</li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-display font-semibold text-white mb-4">Contact Info</h4>
              <ul className="space-y-4">
                <li className="flex gap-3 text-sm">
                  <MapPin size={16} className="text-blue-400 mt-0.5 shrink-0" />
                  <span className="text-gray-400">123 Uniform Market, Lajpat Nagar, New Delhi - 110024</span>
                </li>
                <li className="flex gap-3 text-sm">
                  <Phone size={16} className="text-blue-400 shrink-0" />
                  <span className="text-gray-400">+91 98765 43210</span>
                </li>
                <li className="flex gap-3 text-sm">
                  <Mail size={16} className="text-blue-400 shrink-0" />
                  <span className="text-gray-400">info@indraprasthuniform.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} Indraprasth Uniforms. All rights reserved.</p>
            <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6 text-sm text-gray-500">
              {POLICY_LINKS.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActivePolicy(key)}
                  className="hover:text-gray-300 transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <PolicyModal policyKey={activePolicy} onClose={() => setActivePolicy(null)} />
    </>
  );
};

export default Footer;
