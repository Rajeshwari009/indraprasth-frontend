import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {
  MapPin, CreditCard, CheckCircle, ArrowLeft, ArrowRight,
  Lock, Package, Smartphone, Wallet, Truck, ChevronRight, Shield,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../utils/api';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '');
const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_COST = 99;

/* ─── Payment method definitions ──────────────────────── */
const PAYMENT_METHODS = [
  {
    id: 'cod',
    label: 'Cash on Delivery',
    desc: 'Pay when your order arrives — simple & hassle-free',
    icon: '🏠',
    color: 'from-amber-500 to-orange-600',
    apps: [],
    tag: 'Available now',
    enabled: true,
  },
  {
    id: 'upi',
    label: 'UPI',
    desc: 'GPay, PhonePe, Paytm & more',
    icon: '⚡',
    color: 'from-purple-500 to-indigo-600',
    apps: ['GPay', 'PhonePe', 'Paytm', 'BHIM'],
    tag: 'Coming soon',
    enabled: false,
  },
  {
    id: 'razorpay',
    label: 'Cards / Net Banking',
    desc: 'Debit card, credit card, or internet banking',
    icon: '🏦',
    color: 'from-blue-500 to-blue-700',
    apps: ['Visa', 'MC', 'RuPay', 'NetBanking'],
    tag: 'Coming soon',
    enabled: false,
  },
  {
    id: 'wallets',
    label: 'Wallets',
    desc: 'Paytm, PhonePe, Amazon Pay & more',
    icon: '👛',
    color: 'from-teal-500 to-green-600',
    apps: ['Paytm', 'PhonePe', 'AmazonPay', 'Freecharge'],
    tag: 'Coming soon',
    enabled: false,
  },
  {
    id: 'stripe',
    label: 'International Card',
    desc: 'Visa / Mastercard / Amex (Stripe)',
    icon: '💳',
    color: 'from-gray-600 to-gray-800',
    apps: [],
    tag: 'Coming soon',
    enabled: false,
  },
];

/* ─── Load Razorpay script ─────────────────────────────── */
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

/* ─── Address Step ─────────────────────────────────────── */
const AddressStep = ({ form, setForm, onNext }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const required = ['name', 'email', 'phone', 'street', 'city', 'state', 'pincode'];
    if (required.some((f) => !form[f]?.trim())) return toast.error('Please fill all required fields');
    if (!/^\d{6}$/.test(form.pincode)) return toast.error('Enter a valid 6-digit pincode');
    if (!/^\d{10}$/.test(form.phone)) return toast.error('Enter a valid 10-digit phone number');
    onNext();
  };
  const fields = [
    { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Rahul Sharma', col: 2 },
    { key: 'email', label: 'Email', type: 'email', placeholder: 'rahul@example.com', col: 1 },
    { key: 'phone', label: 'Phone', type: 'tel', placeholder: '9876543210', col: 1 },
    { key: 'street', label: 'Street Address', type: 'text', placeholder: '123, MG Road', col: 2 },
    { key: 'city', label: 'City', type: 'text', placeholder: 'New Delhi', col: 1 },
    { key: 'state', label: 'State', type: 'text', placeholder: 'Delhi', col: 1 },
    { key: 'pincode', label: 'Pincode', type: 'text', placeholder: '110024', col: 1 },
  ];
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(({ key, label, type, placeholder, col }) => (
          <div key={key} className={col === 2 ? 'sm:col-span-2' : ''}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {label} <span className="text-red-500">*</span>
            </label>
            <input type={type} value={form[key] || ''} placeholder={placeholder} required
              onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
              className="input-field" />
          </div>
        ))}
      </div>
      <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
        Continue to Payment <ArrowRight size={18} />
      </button>
    </form>
  );
};

/* ─── Stripe Card Sub-form ─────────────────────────────── */
const StripeCardForm = ({ onPay, processing, grandTotal, onBack }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    onPay({ stripe, cardElement: elements.getElement(CardElement) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border-2 border-blue-200 dark:border-blue-800">
        <CardElement options={{
          style: {
            base: { fontSize: '16px', color: '#374151', '::placeholder': { color: '#9ca3af' } },
            invalid: { color: '#ef4444' },
          },
        }} />
      </div>
      <p className="flex items-center gap-1.5 text-xs text-gray-400">
        <Lock size={11} /> Secured by Stripe. Card details are encrypted.
      </p>
      <div className="flex gap-3">
        <button type="button" onClick={onBack} className="btn-outline flex items-center gap-2 px-4">
          <ArrowLeft size={16} />
        </button>
        <button type="submit" disabled={!stripe || processing}
          className="flex-1 btn-primary flex items-center justify-center gap-2">
          {processing
            ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
            : <><Lock size={15} /> Pay ₹{grandTotal.toLocaleString('en-IN')}</>}
        </button>
      </div>
    </form>
  );
};

/* ─── UPI Sub-form ─────────────────────────────────────── */
const UPIForm = ({ onPay, processing, grandTotal, onBack }) => {
  const [upiId, setUpiId] = useState('');
  const UPI_APPS = [
    { name: 'GPay', color: '#00B9F1', emoji: '🔵' },
    { name: 'PhonePe', color: '#5F259F', emoji: '🟣' },
    { name: 'Paytm', color: '#00BAF2', emoji: '🔷' },
    { name: 'BHIM', color: '#002970', emoji: '🇮🇳' },
  ];
  return (
    <div className="space-y-4 mt-4">
      <div className="grid grid-cols-4 gap-2">
        {UPI_APPS.map((app) => (
          <button key={app.name} type="button"
            onClick={() => onPay({ method: 'upi', upiApp: app.name })}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group">
            <span className="text-2xl">{app.emoji}</span>
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 group-hover:text-blue-700 dark:group-hover:text-blue-400">{app.name}</span>
          </button>
        ))}
      </div>
      <div className="relative flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        <span className="text-xs text-gray-400 font-medium">or enter UPI ID</span>
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="flex gap-2">
        <input value={upiId} onChange={(e) => setUpiId(e.target.value)}
          placeholder="yourname@upi"
          className="input-field flex-1" />
        <button type="button" disabled={!upiId.includes('@') || processing}
          onClick={() => onPay({ method: 'upi', upiId })}
          className="btn-primary px-4 disabled:opacity-50">
          {processing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Pay'}
        </button>
      </div>
      <div className="flex gap-3">
        <button onClick={onBack} className="btn-outline flex items-center gap-2 w-full justify-center">
          <ArrowLeft size={16} /> Back
        </button>
      </div>
    </div>
  );
};

/* ─── Payment Step ─────────────────────────────────────── */
const PaymentStep = ({ form, cart, total, shipping, grandTotal, onBack, onSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState('cod');
  const [processing, setProcessing] = useState(false);
  const { clearCart } = useCart();

  const codTotal = selectedMethod === 'cod' ? grandTotal + 30 : grandTotal;

  const buildOrderItems = () => cart.map((item) => ({
    product: item._id,
    name: item.name,
    image: item.image,
    price: item.price,
    size: item.selectedSize,
    quantity: item.quantity,
  }));

  const createBaseOrder = async (paymentMethod) => {
    const { data } = await orderAPI.create({
      items: buildOrderItems(),
      shippingAddress: { street: form.street, city: form.city, state: form.state, pincode: form.pincode },
      guestInfo: { name: form.name, email: form.email, phone: form.phone },
      paymentMethod,
    });
    return data._id;
  };

  /* Razorpay popup (UPI / Wallets / Cards / Net Banking) */
  const handleRazorpay = async (prefill = {}) => {
    setProcessing(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) { toast.error('Razorpay failed to load. Check your connection.'); setProcessing(false); return; }

      const orderId = await createBaseOrder(selectedMethod);
      const { data } = await orderAPI.createRazorpayOrder(orderId);

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Indraprasth Uniforms',
        description: 'School Uniform Order',
        order_id: data.razorpayOrderId,
        prefill: { name: form.name, email: form.email, contact: form.phone, ...prefill },
        theme: { color: '#1d4ed8' },
        handler: async (response) => {
          try {
            await orderAPI.verifyRazorpayPayment({
              orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            clearCart();
            toast.success('Payment successful! Order placed.');
            onSuccess(orderId);
          } catch { toast.error('Payment verification failed. Contact support.'); }
        },
        modal: { ondismiss: () => setProcessing(false) },
      };

      /* Pre-select method in Razorpay */
      if (selectedMethod === 'upi') {
        options.config = { display: { blocks: { upi: { name: 'UPI', instruments: [{ method: 'upi' }] } }, sequence: ['block.upi'], preferences: { show_default_blocks: false } } };
      } else if (selectedMethod === 'wallets') {
        options.config = { display: { blocks: { wallets: { name: 'Wallets', instruments: [{ method: 'wallet' }] } }, sequence: ['block.wallets'], preferences: { show_default_blocks: false } } };
      }

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (resp) => { toast.error(resp.error.description); setProcessing(false); });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
      setProcessing(false);
    }
  };

  /* Stripe card payment */
  const handleStripe = async ({ stripe, cardElement }) => {
    setProcessing(true);
    try {
      const orderId = await createBaseOrder('stripe');
      const { data: piData } = await orderAPI.createPaymentIntent(orderId);
      const { error, paymentIntent } = await stripe.confirmCardPayment(piData.clientSecret, {
        payment_method: { card: cardElement, billing_details: { name: form.name, email: form.email } },
      });
      if (error) { toast.error(error.message); setProcessing(false); return; }
      if (paymentIntent.status === 'succeeded') {
        await orderAPI.confirmPayment({ orderId, paymentIntentId: paymentIntent.id });
        clearCart();
        toast.success('Payment successful! Order placed.');
        onSuccess(orderId);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
      setProcessing(false);
    }
  };

  /* COD */
  const handleCOD = async () => {
    setProcessing(true);
    try {
      const orderId = await createBaseOrder('cod');
      await orderAPI.confirmCOD(orderId);
      clearCart();
      toast.success('Order placed! Pay on delivery.');
      onSuccess(orderId, 'cod');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-dashed border-amber-200 dark:border-amber-800/50 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 px-4 py-3.5 text-center">
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
          ✨ Online payments are on the way!
        </p>
        <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-1 leading-relaxed">
          We&apos;re putting the finishing touches on UPI, cards & wallets — stay tuned!
          For now, place your order easily with <span className="font-semibold">Cash on Delivery (COD)</span>.
        </p>
      </div>

      {/* Method selector */}
      <div className="space-y-3">
        {PAYMENT_METHODS.map((method) => {
          const isSelected = selectedMethod === method.id;
          const isDisabled = !method.enabled;

          return (
            <motion.button
              key={method.id}
              type="button"
              whileTap={isDisabled ? undefined : { scale: 0.99 }}
              disabled={isDisabled}
              onClick={() => method.enabled && setSelectedMethod(method.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                isDisabled
                  ? 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 opacity-60 cursor-not-allowed'
                  : isSelected
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-md shadow-blue-200 dark:shadow-blue-900/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-900'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                isSelected && method.enabled ? 'border-blue-600' : 'border-gray-300 dark:border-gray-600'
              }`}>
                {isSelected && method.enabled && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
              </div>

              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center text-xl shrink-0 shadow-sm ${isDisabled ? 'grayscale' : ''}`}>
                {method.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">{method.label}</span>
                  {method.id === 'cod' && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                      COD
                    </span>
                  )}
                  {method.tag && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      method.enabled
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
                    }`}>{method.tag}</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{method.desc}</p>
                {isDisabled && (
                  <p className="text-xs text-violet-600 dark:text-violet-400 mt-1 font-medium">
                    🚧 Under progress — launching soon!
                  </p>
                )}
                {method.apps.length > 0 && (
                  <div className="flex gap-1.5 mt-1.5 flex-wrap">
                    {method.apps.map((app) => (
                      <span key={app} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-lg font-medium">
                        {app}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {!isDisabled && (
                <ChevronRight size={16} className={`shrink-0 transition-transform ${isSelected ? 'text-blue-600 rotate-90' : 'text-gray-300 dark:text-gray-600'}`} />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* COD checkout */}
      {selectedMethod === 'cod' && (
        <div className="flex gap-3 pt-2">
          <button onClick={onBack} className="btn-outline flex items-center gap-2 px-5">
            <ArrowLeft size={16} /> Back
          </button>
          <button
            onClick={handleCOD}
            disabled={processing}
            className="flex-1 btn-primary flex items-center justify-center gap-2"
          >
            {processing
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
              : <><Truck size={16} /> Place Order (COD) — ₹{codTotal.toLocaleString('en-IN')}</>
            }
          </button>
        </div>
      )}

      <div className="flex items-center justify-center gap-4 pt-2">
        <Shield size={14} className="text-green-500" />
        <p className="text-xs text-gray-400">Secure checkout · Cash on Delivery available nationwide</p>
      </div>
    </div>
  );
};

/* ─── Confirmation Step ────────────────────────────────── */
const ConfirmationStep = ({ orderId, paymentMethod }) => {
  const navigate = useNavigate();
  const isCOD = paymentMethod === 'cod';
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={48} className="text-green-500" />
      </motion.div>
      <h2 className="font-display font-bold text-2xl text-gray-900 dark:text-white mb-2">Order Placed!</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-1">
        {isCOD ? 'Your order is confirmed. Please keep cash ready on delivery.' : 'Payment received! Your uniforms are being processed.'}
      </p>
      {orderId && (
        <p className="text-sm font-mono bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-2 inline-block my-5 text-gray-600 dark:text-gray-300">
          Order ID: {orderId}
        </p>
      )}
      <div className="flex gap-3 justify-center">
        <button onClick={() => navigate('/')} className="btn-outline">Back to Home</button>
        <button onClick={() => navigate('/shop')} className="btn-primary flex items-center gap-2">
          Shop More <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  );
};

/* ─── Main Checkout ────────────────────────────────────── */
const CheckoutPage = () => {
  const { cart, total } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({});
  const [orderId, setOrderId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');

  const shipping = total >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const grandTotal = total + shipping;

  useEffect(() => { if (cart.length === 0 && step < 2) navigate('/cart'); }, [cart, step, navigate]);

  const steps = [
    { label: 'Address', icon: MapPin },
    { label: 'Payment', icon: CreditCard },
    { label: 'Confirmed', icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <h1 className="section-title">Checkout</h1>
        </div>

        {/* Progress stepper */}
        <div className="flex items-center justify-center mb-10">
          {steps.map((s, i) => (
            <React.Fragment key={s.label}>
              <div className={`flex flex-col items-center gap-1.5 ${i <= step ? 'text-blue-700 dark:text-blue-400' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  i < step ? 'bg-blue-700 dark:bg-blue-600 text-white' :
                  i === step ? 'bg-blue-700 dark:bg-blue-600 text-white ring-4 ring-blue-200 dark:ring-blue-900' :
                  'bg-gray-100 dark:bg-gray-800 text-gray-400'
                }`}>
                  {i < step ? <CheckCircle size={20} /> : <s.icon size={18} />}
                </div>
                <span className="text-xs font-semibold hidden sm:block">{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 transition-all ${i < step ? 'bg-blue-700' : 'bg-gray-200 dark:bg-gray-700'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main card */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div key="address" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                      <MapPin size={20} className="text-blue-600" /> Shipping Address
                    </h2>
                    <AddressStep form={form} setForm={setForm} onNext={() => setStep(1)} />
                  </motion.div>
                )}
                {step === 1 && (
                  <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                      <Wallet size={20} className="text-blue-600" /> Choose Payment Method
                    </h2>
                    <PaymentStep
                      form={form} cart={cart} total={total}
                      shipping={shipping} grandTotal={grandTotal}
                      onBack={() => setStep(0)}
                      onSuccess={(id, method) => { setOrderId(id); setPaymentMethod(method); setStep(2); }}
                    />
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <ConfirmationStep orderId={orderId} paymentMethod={paymentMethod} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Order Summary */}
          {step < 2 && (
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 sticky top-24">
                <h3 className="font-display font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Package size={18} className="text-blue-600" /> Order Summary
                </h3>
                <div className="space-y-3 mb-4 max-h-56 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={`${item._id}-${item.selectedSize}`} className="flex justify-between text-sm gap-2">
                      <span className="text-gray-600 dark:text-gray-400 line-clamp-1 flex-1">
                        {item.name} <span className="text-blue-600 dark:text-blue-400">×{item.quantity}</span>
                        <span className="text-xs ml-1 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-500">{item.selectedSize}</span>
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white shrink-0">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 dark:border-gray-800 pt-3 space-y-2">
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Subtotal</span><span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white border-t border-gray-100 dark:border-gray-800 pt-2">
                    <span>Total</span><span>₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                {form.name && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-xs font-semibold text-gray-400 mb-1">Delivering to:</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{form.name}</p>
                    <p className="text-xs text-gray-500">{form.city}, {form.state} {form.pincode}</p>
                  </div>
                )}
                {/* Trust badges */}
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
                  {['Secure checkout with SSL', '15-day easy returns', 'ISI certified products'].map((t) => (
                    <p key={t} className="flex items-center gap-2 text-xs text-gray-400">
                      <CheckCircle size={12} className="text-green-500 shrink-0" /> {t}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
