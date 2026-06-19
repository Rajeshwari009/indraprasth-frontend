import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import { getAssetUrl } from '../../utils/images';

const getInitials = (name = '') =>
  name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

const GRADIENT_PALETTE = [
  'from-blue-500 to-blue-700',
  'from-indigo-500 to-indigo-700',
  'from-teal-500 to-teal-700',
  'from-purple-500 to-purple-700',
  'from-rose-500 to-rose-700',
  'from-amber-500 to-amber-700',
  'from-green-500 to-green-700',
  'from-cyan-500 to-cyan-700',
];

const SchoolCard = ({ school, index = 0 }) => {
  const navigate = useNavigate();
  const { _id, name, shortName, logo, city, description } = school;

  const logoUrl = getAssetUrl(logo);
  const gradient = GRADIENT_PALETTE[index % GRADIENT_PALETTE.length];

  const handleClick = () => {
    navigate(`/shop?school=${_id}`);
  };

  return (
    <motion.div
      onClick={handleClick}
      className="card cursor-pointer group p-5 flex flex-col items-center text-center gap-4 select-none h-full"
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Logo */}
      <div className="relative">
        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg overflow-hidden`}>
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className={`${logoUrl ? 'hidden' : 'flex'} w-full h-full items-center justify-center`}
          >
            <span className="text-white font-display font-bold text-2xl">
              {getInitials(shortName || name)}
            </span>
          </div>
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shadow-md">
          <ArrowRight size={12} className="text-white" />
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 flex-1 w-full">
        <h3 className="font-display font-bold text-gray-900 dark:text-white text-sm leading-snug line-clamp-2 min-h-[2.75rem] group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
          {name}
        </h3>
        {city ? (
          <p className="flex items-center justify-center gap-1 text-xs text-gray-500 dark:text-gray-400 min-h-[1.25rem]">
            <MapPin size={11} className="shrink-0" />
            <span className="truncate">{city}</span>
          </p>
        ) : (
          <div className="min-h-[1.25rem]" />
        )}
        <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-2 min-h-[2.5rem] mt-1">
          {description || '\u00A0'}
        </p>
      </div>

      {/* CTA */}
      <span className="mt-auto text-xs font-semibold text-blue-700 dark:text-blue-400 group-hover:text-blue-800 dark:group-hover:text-blue-300 flex items-center gap-1 transition-colors">
        Shop Uniforms <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
      </span>
    </motion.div>
  );
};

export default SchoolCard;
