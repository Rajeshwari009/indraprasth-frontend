import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Package } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { getAssetUrl } from '../../utils/images';
const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_COST = 99;

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, total, itemCount } = useCart();

  const shipping = total >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const grandTotal = total + shipping;
  const progressToFree = Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 h-full z-50 w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <ShoppingBag size={18} className="text-blue-700 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-gray-900 dark:text-white">Your Cart</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8 text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center"
                >
                  <Package size={40} className="text-blue-300 dark:text-blue-700" />
                </motion.div>
                <div>
                  <p className="font-display font-bold text-xl text-gray-900 dark:text-white">Cart is empty</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add uniforms to get started</p>
                </div>
                <Link
                  to="/shop"
                  onClick={onClose}
                  className="btn-primary flex items-center gap-2"
                >
                  Browse Shop <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <>
                {/* Free Shipping Progress */}
                {total < FREE_SHIPPING_THRESHOLD && (
                  <div className="px-5 py-3 bg-amber-50 dark:bg-amber-900/10 border-b border-amber-100 dark:border-amber-900/20">
                    <p className="text-xs text-amber-700 dark:text-amber-400 mb-1.5">
                      Add <strong>₹{(FREE_SHIPPING_THRESHOLD - total).toLocaleString('en-IN')}</strong> more for free shipping!
                    </p>
                    <div className="w-full h-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-amber-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressToFree}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                )}
                {total >= FREE_SHIPPING_THRESHOLD && (
                  <div className="px-5 py-2.5 bg-green-50 dark:bg-green-900/10 border-b border-green-100 dark:border-green-900/20">
                    <p className="text-xs text-green-700 dark:text-green-400 font-medium">
                      You qualify for free shipping!
                    </p>
                  </div>
                )}

                {/* Items */}
                <div className="flex-1 overflow-y-auto py-3 px-5 space-y-3">
                  <AnimatePresence initial={false}>
                    {cart.map((item) => {
                      const imageUrl = getAssetUrl(item.image);

                      return (
                        <motion.div
                          key={`${item._id}-${item.selectedSize}`}
                          layout
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 30, height: 0, marginBottom: 0 }}
                          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                          className="flex gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800"
                        >
                          {/* Image */}
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0">
                            {imageUrl ? (
                              <img src={imageUrl} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center">
                                <span className="text-lg font-bold text-blue-400">{item.name?.charAt(0)}</span>
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-1">{item.name}</p>
                            {item.school?.name && (
                              <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{item.school.name}</p>
                            )}
                            <p className="text-xs text-blue-700 dark:text-blue-400 font-medium mt-0.5">Size: {item.selectedSize}</p>

                            <div className="flex items-center justify-between mt-2">
                              {/* Quantity */}
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => updateQuantity(item._id, item.selectedSize, item.quantity - 1)}
                                  className="w-6 h-6 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="w-6 text-center text-sm font-bold text-gray-900 dark:text-white">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item._id, item.selectedSize, item.quantity + 1)}
                                  className="w-6 h-6 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>

                              {/* Price & Remove */}
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-blue-700 dark:text-blue-400">
                                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                </span>
                                <button
                                  onClick={() => removeFromCart(item._id, item.selectedSize)}
                                  className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {/* Footer Summary */}
                <div className="border-t border-gray-100 dark:border-gray-800 p-5 space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>Subtotal</span>
                      <span>₹{total.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>Shipping</span>
                      <span className={shipping === 0 ? 'text-green-600 dark:text-green-400 font-medium' : ''}>
                        {shipping === 0 ? 'FREE' : `₹${shipping}`}
                      </span>
                    </div>
                    <div className="flex justify-between font-display font-bold text-lg text-gray-900 dark:text-white border-t border-gray-100 dark:border-gray-800 pt-2">
                      <span>Total</span>
                      <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <Link
                    to="/checkout"
                    onClick={onClose}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/cart"
                    onClick={onClose}
                    className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                  >
                    View Full Cart
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
