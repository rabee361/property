import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaTimes } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

const OfferModal = ({ existingOffer, onClose, onSubmit, property }) => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({ amount: '', note: '' })

  useEffect(() => {
    if (!property) {
      return
    }

    setFormData({
      amount: existingOffer?.amount ?? '',
      note: existingOffer?.note ?? '',
    })
  }, [existingOffer, property])

  if (!property) {
    return null
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((currentData) => ({ ...currentData, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!formData.amount.trim()) {
      return
    }

    onSubmit(formData)
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.button
          type="button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          aria-label={t('buyer.close_offer_modal', 'Close offer dialog')}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 12 }}
          className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-neutral-900"
        >
          <div className="border-b border-gray-200 px-6 py-5 dark:border-white/10">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-gold">
                  {t('buyer.offer_modal_eyebrow', 'Buyer Offer')}
                </p>
                <h2 className="text-2xl font-light text-brand-dark dark:text-white">{property.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{property.price}</p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-brand-gold hover:text-brand-gold dark:border-white/10 dark:text-gray-400"
                aria-label={t('buyer.close_offer_modal', 'Close offer dialog')}
              >
                <FaTimes className="h-4 w-4" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.28em] text-gray-500 dark:text-gray-400">
                {t('buyer.offer_amount', 'Offer Amount')}
              </label>
              <input
                type="number"
                min="1"
                step="1"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder={t('buyer.offer_amount_placeholder', 'Enter your offer in SYP')}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 dark:border-white/10 dark:bg-neutral-950 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.28em] text-gray-500 dark:text-gray-400">
                {t('buyer.offer_note', 'Offer Note')}
              </label>
              <textarea
                rows="4"
                name="note"
                value={formData.note}
                onChange={handleChange}
                placeholder={t('buyer.offer_note_placeholder', 'Add a short note for the seller')}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 dark:border-white/10 dark:bg-neutral-950 dark:text-gray-100"
              />
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border border-gray-200 px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-gray-600 transition hover:border-gray-300 hover:text-brand-dark dark:border-white/10 dark:text-gray-300"
              >
                {t('profile.cancel', 'Cancel')}
              </button>
              <button
                type="submit"
                className="rounded-2xl bg-brand-gold px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-brand-gold/90"
              >
                {existingOffer ? t('buyer.save_offer', 'Save Offer') : t('buyer.submit_offer', 'Submit Offer')}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default OfferModal
