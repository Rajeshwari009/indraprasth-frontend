import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const CATEGORIES = ['shirt', 'trouser', 'skirt', 'dress', 'blazer', 'tie', 'socks', 'shoes', 'bag', 'set', 'other'];
const GENDERS = [
  { value: '', label: 'All' },
  { value: 'boys', label: 'Boys' },
  { value: 'girls', label: 'Girls' },
  { value: 'unisex', label: 'Unisex' },
];

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center justify-between w-full mb-3 text-sm font-semibold text-gray-900 dark:text-white"
      >
        {title}
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && children}
    </div>
  );
};

const ShopFilters = ({
  schools,
  school,
  category,
  gender,
  priceMin,
  priceMax,
  onPriceMinChange,
  onPriceMaxChange,
  onPriceApply,
  onSetParam,
  onClearAll,
  activeFiltersCount,
}) => (
  <div className="space-y-0">
    <FilterSection title="School">
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 dark:text-gray-400">
          <input type="radio" name="school" checked={!school} onChange={() => onSetParam('school', '')} className="accent-blue-700" />
          All Schools
        </label>
        {schools.map((s) => (
          <label key={s._id} className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 dark:text-gray-400">
            <input
              type="radio"
              name="school"
              checked={school === String(s._id)}
              onChange={() => onSetParam('school', String(s._id))}
              className="accent-blue-700"
            />
            <span className="truncate">{s.name}</span>
          </label>
        ))}
      </div>
    </FilterSection>

    <FilterSection title="Category">
      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 dark:text-gray-400">
          <input type="radio" name="category" checked={!category} onChange={() => onSetParam('category', '')} className="accent-blue-700" />
          All Categories
        </label>
        {CATEGORIES.map((c) => (
          <label key={c} className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 dark:text-gray-400">
            <input type="radio" name="category" checked={category === c} onChange={() => onSetParam('category', c)} className="accent-blue-700" />
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </label>
        ))}
      </div>
    </FilterSection>

    <FilterSection title="Gender">
      <div className="flex flex-wrap gap-2">
        {GENDERS.map((g) => (
          <button
            key={g.value}
            type="button"
            onClick={() => onSetParam('gender', g.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition-colors ${
              gender === g.value
                ? 'border-blue-700 bg-blue-700 text-white'
                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-400'
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>
    </FilterSection>

    <FilterSection title="Price Range (₹)">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="price-min" className="text-xs text-gray-400 mb-1 block">Min Price</label>
            <input
              id="price-min"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="0"
              value={priceMin}
              onChange={(e) => onPriceMinChange(e.target.value.replace(/[^\d]/g, ''))}
              className="w-full px-3 py-2 text-sm rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="price-max" className="text-xs text-gray-400 mb-1 block">Max Price</label>
            <input
              id="price-max"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="9999"
              value={priceMax}
              onChange={(e) => onPriceMaxChange(e.target.value.replace(/[^\d]/g, ''))}
              className="w-full px-3 py-2 text-sm rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={onPriceApply}
          className="w-full py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Apply Price Filter
        </button>
      </div>
    </FilterSection>

    {activeFiltersCount > 0 && (
      <button
        type="button"
        onClick={onClearAll}
        className="w-full py-2 text-sm text-red-600 dark:text-red-400 font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
      >
        Clear All Filters ({activeFiltersCount})
      </button>
    )}
  </div>
);

export default ShopFilters;
