import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';
import ProductImage from './ProductImage';

const CATEGORY_COLORS = {
  shirt: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  trouser: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  skirt: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  dress: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  blazer: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  tie: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  socks: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  shoes: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  bag: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  set: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  other: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');

  const {
    _id,
    name,
    price,
    discountPrice,
    images = [],
    school,
    category,
    sizes = [],
    rating,
    numReviews,
  } = product;

  const displayRating = rating > 0 ? rating : null;

  const discount = discountPrice && discountPrice < price
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;

  const availableSizes = sizes.filter((s) => s.stock > 0);

  const handleAddToCart = () => {
    if (!availableSizes.length) {
      toast.error('This product is out of stock');
      return;
    }
    setShowSizeModal(true);
  };

  const confirmAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    addToCart(product, selectedSize);
    toast.success(`${name} (${selectedSize}) added to cart!`);
    setShowSizeModal(false);
    setSelectedSize('');
  };

  return (
    <>
      <motion.div
        className="card group flex flex-col h-full border border-gray-100/80 dark:border-gray-800/80 hover:border-blue-200 dark:hover:border-blue-800"
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Image */}
        <Link to={`/product/${_id}`} className="relative block overflow-hidden aspect-[3/4] bg-gray-100 dark:bg-gray-800">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-[1] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {discount > 0 && (
            <div className="absolute top-3 left-3 z-10 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-md">
              -{discount}%
            </div>
          )}
          {school?.shortName && (
            <div className="absolute top-3 right-3 z-10 bg-blue-700/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-md">
              {school.shortName}
            </div>
          )}
          <ProductImage
            src={images[0]}
            alt={name}
            category={category}
            name={name}
            className="w-full h-full"
            imgClassName="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </Link>

        {/* Info */}
        <div className="flex flex-col flex-1 p-4 gap-2.5">
          {/* School & Category */}
          <div className="flex items-center gap-2 flex-wrap">
            {category && (
              <span className={`badge ${CATEGORY_COLORS[category] || CATEGORY_COLORS.other}`}>
                <Tag size={10} className="mr-1" />
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </span>
            )}
          </div>

          {/* Name */}
          <Link to={`/product/${_id}`}>
            <h3 className="font-display font-semibold text-gray-900 dark:text-white text-sm leading-snug line-clamp-2 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
              {name}
            </h3>
          </Link>

          {/* School name */}
          {school?.name && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{school.name}</p>
          )}

          {displayRating && (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-amber-500 font-bold">★ {displayRating.toFixed(1)}</span>
              {numReviews > 0 && (
                <span className="text-gray-400">({numReviews})</span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 mt-auto pt-2">
            <span className="text-lg font-bold text-blue-700 dark:text-blue-400">
              ₹{(discountPrice || price).toLocaleString('en-IN')}
            </span>
            {discountPrice && discountPrice < price && (
              <span className="text-sm text-gray-400 line-through">
                ₹{price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Add to Cart */}
          <motion.button
            onClick={handleAddToCart}
            whileTap={{ scale: 0.97 }}
            disabled={!availableSizes.length}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 mt-2
              ${availableSizes.length
                ? 'bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white shadow-md hover:shadow-blue-700/30'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              }`}
          >
            <ShoppingCart size={16} />
            {availableSizes.length ? 'Add to Cart' : 'Out of Stock'}
          </motion.button>
        </div>
      </motion.div>

      {/* Size Selector Modal */}
      <AnimatePresence>
        {showSizeModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowSizeModal(false)}
            />
            <motion.div
              className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-sm z-10"
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-display font-bold text-gray-900 dark:text-white">Select Size</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{name}</p>
                </div>
                <button
                  onClick={() => setShowSizeModal(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-5">
                {availableSizes.map((s) => (
                  <button
                    key={s.size}
                    onClick={() => setSelectedSize(s.size)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-200
                      ${selectedSize === s.size
                        ? 'border-blue-700 bg-blue-700 text-white'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-500'
                      }`}
                  >
                    {s.size}
                    {s.stock < 5 && (
                      <span className="ml-1 text-xs text-amber-500">(Low)</span>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowSizeModal(false)}
                  className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAddToCart}
                  className="flex-1 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm transition-colors shadow-md"
                >
                  Add to Cart
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductCard;
