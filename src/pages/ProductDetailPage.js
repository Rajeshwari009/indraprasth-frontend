import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingCart, Minus, Plus, Tag, School,
  User, CheckCircle, AlertCircle, ChevronRight,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { productAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { getProductImageUrls } from '../utils/images';
import ProductImage from '../components/common/ProductImage';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(0);

  useEffect(() => {
    setLoading(true);
    setSelectedSize('');
    setQuantity(1);
    setMainImage(0);
    productAPI.getOne(id)
      .then(({ data }) => {
        setProduct(data.product || data);
        const prod = data.product || data;
        if (prod.school || prod.category) {
          productAPI.getAll({
            school: prod.school?._id,
            category: prod.category,
            limit: 4,
          }).then(({ data: rd }) => {
            const related = (rd.products || rd || []).filter((p) => p._id !== prod._id);
            setRelatedProducts(related.slice(0, 4));
          }).catch(() => {});
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="pt-24"><LoadingSpinner /></div>;
  if (!product) return (
    <div className="pt-24 text-center py-20">
      <p className="text-gray-500 dark:text-gray-400">Product not found.</p>
      <Link to="/shop" className="btn-primary mt-4 inline-flex">Back to Shop</Link>
    </div>
  );

  const {
    name, price, discountPrice, images = [], school, category, gender,
    description, sizes = [], featured,
  } = product;

  const imageUrls = getProductImageUrls(images, category);
  const availableSizes = sizes.filter((s) => s.stock > 0);
  const displayPrice = discountPrice || price;
  const discount = discountPrice && discountPrice < price
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;

  const selectedSizeObj = sizes.find((s) => s.size === selectedSize);
  const maxQty = selectedSizeObj?.stock || 0;

  const handleAddToCart = () => {
    if (!selectedSize) { toast.error('Please select a size first'); return; }
    if (quantity > maxQty) { toast.error(`Only ${maxQty} units available`); return; }
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize, quantity);
    }
    toast.success(`${name} added to cart!`);
  };

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gradient-to-b from-slate-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 py-6 text-sm text-gray-500 dark:text-gray-400">
          <Link to="/" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link to="/shop" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">Shop</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 dark:text-white font-medium truncate max-w-48">{name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* ── Image Gallery ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col-reverse sm:flex-row gap-4 lg:sticky lg:top-24"
          >
            {/* Thumbnails */}
            {imageUrls.length > 1 && (
              <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto sm:max-h-[560px]">
                {imageUrls.map((url, i) => (
                  <button
                    key={`${url}-${i}`}
                    onClick={() => setMainImage(i)}
                    className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      mainImage === i
                        ? 'border-blue-700 shadow-lg ring-2 ring-blue-200 dark:ring-blue-800'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt={`${name} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main image */}
            <div className="flex-1 aspect-square rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-800">
              <ProductImage
                key={mainImage}
                src={images[mainImage] || images[0]}
                alt={name}
                category={category}
                name={name}
                fallbackIndex={mainImage}
                className="w-full h-full"
                imgClassName="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* ── Product Info ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-5 bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 shadow-lg border border-gray-100 dark:border-gray-800"
          >
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {school?.shortName && (
                <span className="badge bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1 text-xs font-bold">
                  {school.shortName}
                </span>
              )}
              {category && (
                <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 px-3 py-1 text-xs">
                  <Tag size={10} className="mr-1" />
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </span>
              )}
              {featured && (
                <span className="badge bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-3 py-1 text-xs">
                  Featured
                </span>
              )}
            </div>

            {/* Name */}
            <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-gray-900 dark:text-white leading-tight">{name}</h1>

            {product.rating > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-amber-500 font-bold text-lg">★ {product.rating.toFixed(1)}</span>
                {product.numReviews > 0 && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">({product.numReviews} reviews)</span>
                )}
              </div>
            )}

            {/* School info */}
            {school?.name && (
              <p className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <School size={16} />
                {school.name}
              </p>
            )}

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="font-display font-bold text-3xl text-blue-700 dark:text-blue-400">
                ₹{displayPrice.toLocaleString('en-IN')}
              </span>
              {discount > 0 && (
                <>
                  <span className="text-xl text-gray-400 line-through">₹{price.toLocaleString('en-IN')}</span>
                  <span className="badge bg-amber-500 text-white px-2 py-0.5 text-sm font-bold">-{discount}%</span>
                </>
              )}
            </div>

            {/* Description */}
            {description && (
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{description}</p>
            )}

            {/* Size Selector */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Select Size</span>
                {selectedSize && selectedSizeObj && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedSizeObj.stock} units available
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => {
                  const inStock = s.stock > 0;
                  return (
                    <button
                      key={s.size}
                      onClick={() => inStock && setSelectedSize(s.size)}
                      disabled={!inStock}
                      className={`relative px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all
                        ${selectedSize === s.size
                          ? 'border-blue-700 bg-blue-700 text-white shadow-md'
                          : inStock
                            ? 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-500'
                            : 'border-gray-100 dark:border-gray-800 text-gray-300 dark:text-gray-700 cursor-not-allowed'
                        }`}
                    >
                      {s.size}
                      {!inStock && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-px bg-gray-300 dark:bg-gray-700 rotate-45" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-3">Quantity</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-bold text-gray-900 dark:text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(maxQty || 99, q + 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                {selectedSize && selectedSizeObj && (
                  <span className="text-xs text-gray-400">
                    Max: {selectedSizeObj.stock}
                  </span>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-3 mt-2">
              <motion.button
                onClick={handleAddToCart}
                whileTap={{ scale: 0.97 }}
                disabled={!availableSizes.length}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                <ShoppingCart size={18} />
                {availableSizes.length ? 'Add to Cart' : 'Out of Stock'}
              </motion.button>
            </div>

            {/* Stock indicator */}
            {selectedSize && selectedSizeObj && (
              <div className={`flex items-center gap-2 text-sm ${selectedSizeObj.stock < 5 ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400'}`}>
                {selectedSizeObj.stock < 5 ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
                {selectedSizeObj.stock < 5 ? `Only ${selectedSizeObj.stock} left in stock!` : 'In Stock'}
              </div>
            )}

            {/* Details */}
            <div className="border-t border-gray-100 dark:border-gray-800 pt-5 space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Product Details</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {category && (
                  <div>
                    <span className="text-gray-400 dark:text-gray-500 flex items-center gap-1.5"><Tag size={13} /> Category</span>
                    <p className="font-medium text-gray-700 dark:text-gray-300 mt-0.5 capitalize">{category}</p>
                  </div>
                )}
                {gender && (
                  <div>
                    <span className="text-gray-400 dark:text-gray-500 flex items-center gap-1.5"><User size={13} /> Gender</span>
                    <p className="font-medium text-gray-700 dark:text-gray-300 mt-0.5 capitalize">{gender}</p>
                  </div>
                )}
                {school?.name && (
                  <div className="col-span-2">
                    <span className="text-gray-400 dark:text-gray-500 flex items-center gap-1.5"><School size={13} /> School</span>
                    <p className="font-medium text-gray-700 dark:text-gray-300 mt-0.5">{school.name}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 border-t border-gray-100 dark:border-gray-800 pt-5">
              {['Free delivery over ₹999', 'Easy 15-day returns', 'ISI certified quality'].map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <CheckCircle size={13} className="text-green-500" /> {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="section-title text-2xl">Related Products</h2>
              <Link to="/shop" className="text-sm font-semibold text-blue-700 dark:text-blue-400 flex items-center gap-1 hover:gap-2 transition-all">
                View All <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
