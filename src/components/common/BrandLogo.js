import React from 'react';
import { SITE } from '../../config/site';

const BrandLogo = ({ className = 'h-10 w-auto', showText = true, textClassName = '' }) => (
  <div className={`flex items-center gap-3 ${textClassName}`}>
    <img
      src={SITE.logo}
      alt={`${SITE.name} - ${SITE.tagline}`}
      className={`${className} object-contain`}
    />
    {showText && (
      <div className="hidden sm:block leading-tight">
        <p className="font-display font-bold text-sm md:text-base">Indraprasth-Uniforms</p>
        <p className="text-[10px] md:text-xs tracking-wide opacity-80">{SITE.tagline}</p>
      </div>
    )}
  </div>
);

export default BrandLogo;
