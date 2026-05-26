import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaExclamationTriangle } from 'react-icons/fa';

const DeleteModal = ({ property, onConfirm, onCancel }) => {
  const { t } = useTranslation();

  if (!property) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        ></motion.div>

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl dark:shadow-none border border-gray-200 dark:border-white/10 p-8 max-w-md w-full mx-auto z-10 transition-colors duration-300"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <FaExclamationTriangle className="w-8 h-8 text-red-500" />
            </div>

            <h2 className="text-xl font-light text-gray-900 dark:text-white uppercase tracking-widest mb-2">
              {t('profile.delete_title', 'Delete Property?')}
            </h2>
            
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
              {t('profile.delete_message', 'Are you sure you want to remove this property? This action cannot be undone.')}
            </p>

            <div className="flex w-full gap-4">
              <button
                onClick={onCancel}
                className="flex-1 py-3 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 text-xs uppercase tracking-widest font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                {t('profile.delete_cancel', 'Cancel')}
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 py-3 bg-red-500 text-white text-xs uppercase tracking-widest font-semibold rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
              >
                {t('profile.delete_confirm', 'Delete')}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DeleteModal;
