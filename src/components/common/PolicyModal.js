import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText } from 'lucide-react';
import { POLICIES } from '../../data/policies';

const PolicyModal = ({ policyKey, onClose }) => {
  const policy = policyKey ? POLICIES[policyKey] : null;

  useEffect(() => {
    if (!policy) return undefined;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [policy, onClose]);

  return (
    <AnimatePresence>
      {policy && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="policy-modal-title"
        >
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[90vh] flex flex-col z-10"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          >
            <div className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-gray-100 dark:border-gray-800 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center shrink-0">
                  <FileText size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0">
                  <h2 id="policy-modal-title" className="font-display font-bold text-lg sm:text-xl text-gray-900 dark:text-white truncate">
                    {policy.title}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Last updated: {policy.updated}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors shrink-0"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base">
                {policy.intro}
              </p>

              {policy.sections.map((section) => (
                <section key={section.heading}>
                  <h3 className="font-display font-semibold text-base text-gray-900 dark:text-white mb-2">
                    {section.heading}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    {section.body}
                  </p>
                </section>
              ))}
            </div>

            <div className="p-4 sm:p-5 border-t border-gray-100 dark:border-gray-800 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PolicyModal;
