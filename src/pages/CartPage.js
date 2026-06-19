import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getAssetUrl } from '../utils/images';
const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_COST = 99;

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, total, itemCount, clearCart } = useCart();
  const navigate = useNavigate();

  const shipping = total >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const grandTotal = total + shipping;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-4"
        >
          <div className="w-32 h-32 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={52} className="text-blue-200 dark:text-blue-800" />
          </div>
          <h2 className="font-display font-bold text-2xl text-gray-900 dark:text-white mb-3">Your cart is empty</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Add some uniforms to your cart and they will appear here.</p>
          <Link to="/shop" className="btn-primary flex items-center gap-2 w-fit mx-auto">
            Browse Uniforms <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <h1 className="section-title">Shopping Cart</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{itemCount} item{itemCount !== 1 ? 's' : ''} in your cart</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="space-y-4">
              <AnimatePresence>
                {cart.map((item) => {
                  const imageUrl = getAssetUrl(item.image);

                  return (
                    <motion.div
                      key={`${item._id}-${item.selectedSize}`}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -30, height: 0, marginBottom: 0 }}
                      transition={{ type: 'spring', damping: 25 }}
                      className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-5 flex gap-4 shadow-sm border border-gray-100 dark:border-gray-800"
                    >
                      {/* Image */}
                      <Link to={`/product/${item._id}`} className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                        {imageUrl ? (
                          <img src={imageUrl} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center">
                            <span className="text-xl font-bold text-blue-400">{item.name?.charAt(0)}</span>
                          </div>
                        )}
                      </Link>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <Link to={`/product/${item._id}`}>
                              <h3 className="font-display font-semibold text-gray-900 dark:text-white text-sm sm:text-base leading-snug hover:text-blue-700 dark:hover:text-blue-400 transition-colors line-clamp-2">
                                {item.name}
                              </h3>
                            </Link>
                            {item.school?.name && (
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">{item.school.name}</p>
                            )}
                            <span className="inline-flex items-center gap-1 mt-1.5 text-xs font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-lg">
                              <Tag size={10} /> Size: {item.selectedSize}
                            </span>
                          </div>
                          <button
                            onClick={() => removeFromCart(item._id, item.selectedSize)}
                            className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity */}
                          <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item._id, item.selectedSize, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-10 text-center text-sm font-bold text-gray-900 dark:text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item._id, item.selectedSize, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="font-bold text-lg text-blue-700 dark:text-blue-400">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </p>
                            <p className="text-xs text-gray-400">
                              ₹{item.price.toLocaleString('en-IN')} each
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Continue Shopping */}
            <div className="flex items-center justify-between mt-6">
              <Link to="/shop" className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                <ArrowLeft size={16} /> Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                className="text-sm text-red-500 hover:text-red-600 dark:text-red-400 font-medium hover:underline transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-80 xl:w-96 shrink-0"
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 sticky top-24">
              <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white mb-5">Order Summary</h2>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 dark:text-green-400 font-semibold' : ''}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10 rounded-lg px-3 py-2">
                    Add ₹{(FREE_SHIPPING_THRESHOLD - total).toLocaleString('en-IN')} more for free shipping
                  </p>
                )}
                <div className="flex justify-between font-display font-bold text-xl text-gray-900 dark:text-white border-t border-gray-100 dark:border-gray-800 pt-3">
                  <span>Total</span>
                  <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/checkout')}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight size={18} />
              </motion.button>

              {/* Trust signals */}
              <div className="mt-5 space-y-2">
                {['Secure checkout with SSL', '15-day easy returns', 'ISI certified products'].map((t) => (
                  <p key={t} className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                    <span className="text-green-500">✓</span> {t}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
