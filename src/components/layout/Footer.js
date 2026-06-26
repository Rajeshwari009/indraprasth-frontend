import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import PolicyModal from '../common/PolicyModal';
import { SITE } from '../../config/site';

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
              <img
                src={SITE.footerLogo}
                alt={`${SITE.name} - ${SITE.tagline}`}
                className="h-16 w-auto mb-4 object-contain"
              />
              <p className="text-sm text-gray-400 leading-relaxed">
                The Uniform Icons — trusted for school, college, hospital & corporate uniforms since 1975.
              </p>
              <div className="flex gap-3 mt-5">
                <a
                  href={SITE.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 bg-gray-800 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors text-gray-300"
                >
                  <FaFacebookF size={16} />
                </a>
                <a
                  href={SITE.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 bg-gray-800 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-colors text-gray-300"
                >
                  <FaInstagram size={16} />
                </a>
                <a
                  href={`https://wa.me/${SITE.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="w-9 h-9 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors text-gray-300"
                >
                  <FaWhatsapp size={16} />
                </a>
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
              <h4 className="font-display font-semibold text-white mb-4">We Serve</h4>
              <ul className="space-y-2.5 text-sm text-gray-400">
                {['School Uniforms', 'College Uniforms', 'Hospital Uniforms', 'Corporate Uniforms', 'Industrial Wear'].map(s => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-display font-semibold text-white mb-4">Contact Info</h4>
              <ul className="space-y-4">
                <li className="flex gap-3 text-sm">
                  <MapPin size={16} className="text-blue-400 mt-0.5 shrink-0" />
                  <span className="text-gray-400">{SITE.city}</span>
                </li>
                <li className="flex gap-3 text-sm">
                  <Phone size={16} className="text-blue-400 shrink-0" />
                  <a href={`tel:+91${SITE.phone}`} className="text-gray-400 hover:text-blue-400 transition-colors">
                    +91 {SITE.phoneDisplay}
                  </a>
                </li>
                <li className="flex gap-3 text-sm">
                  <Mail size={16} className="text-blue-400 shrink-0" />
                  <a href={`mailto:${SITE.email}`} className="text-gray-400 hover:text-blue-400 transition-colors break-all">
                    {SITE.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
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
