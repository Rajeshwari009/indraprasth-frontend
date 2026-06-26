export const ORDER_STATUS_STEPS = [
  { key: 'pending', label: 'Order Received', desc: 'We have received your order' },
  { key: 'confirmed', label: 'Order Confirmed', desc: 'Your order is confirmed' },
  { key: 'processing', label: 'Getting Packed', desc: 'Your uniforms are being packed' },
  { key: 'shipped', label: 'On the Way', desc: 'Your order is out for delivery' },
  { key: 'delivered', label: 'Delivered', desc: 'Enjoy your new uniforms!' },
];

export const ORDER_STATUS_LABELS = {
  pending: 'Order Received',
  confirmed: 'Order Confirmed',
  processing: 'Getting Packed',
  shipped: 'On the Way',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const ORDER_STATUS_COLORS = {
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  processing: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  shipped: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

export const getStatusStepIndex = (status) => {
  if (status === 'cancelled') return -1;
  const idx = ORDER_STATUS_STEPS.findIndex((s) => s.key === status);
  return idx >= 0 ? idx : 0;
};

export const formatOrderDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatOrderId = (id) => (id ? `#${id.slice(-8).toUpperCase()}` : '');
