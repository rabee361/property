import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useBuyer } from '../../context/BuyerContext'

const BuyerProfile = () => {
  const { t } = useTranslation()
  const { profile, updateProfile } = useBuyer()
  const [formData, setFormData] = useState(profile)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    setFormData(profile)
  }, [profile])

  const handleChange = (event) => {
    const { name, value } = event.target
    setIsSaved(false)
    setFormData((currentData) => ({ ...currentData, [name]: value }))
  }

  const handleAvatarChange = (event) => {
    const nextAvatar = event.target.files?.[0]

    if (!nextAvatar) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setIsSaved(false)
      setFormData((currentData) => ({ ...currentData, avatar: reader.result }))
    }
    reader.readAsDataURL(nextAvatar)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    updateProfile(formData)
    setIsSaved(true)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <section className="rounded-4xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-neutral-900 dark:shadow-none">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-gold">
          {t('buyer.profile_label', 'Buyer Identity')}
        </p>
        <h2 className="mt-3 text-3xl font-light uppercase tracking-[0.18em] text-brand-dark dark:text-white">
          {t('buyer.profile_title', 'Profile')}
        </h2>
        <p className="mt-3 text-sm leading-7 text-gray-500 dark:text-gray-400">
          {t(
            'buyer.profile_description',
            'Keep your buyer profile current so offers and future interactions feel complete and consistent.',
          )}
        </p>

        <div className="mt-8 flex flex-col items-center rounded-3xl bg-gray-50 px-5 py-8 text-center dark:bg-neutral-950">
          <img
            src={formData.avatar}
            alt={formData.username}
            className="h-28 w-28 rounded-full border-4 border-brand-gold object-cover"
          />
          <p className="mt-5 text-xl font-semibold text-gray-900 dark:text-white">{formData.username}</p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{formData.email}</p>
          <label className="mt-6 inline-flex cursor-pointer rounded-full border border-gray-200 px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-gray-700 transition hover:border-brand-gold hover:text-brand-gold dark:border-white/10 dark:text-gray-200">
            {t('profile.change_avatar', 'Change Avatar')}
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </label>
        </div>
      </section>

      <section className="rounded-4xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-neutral-900 dark:shadow-none md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.28em] text-gray-500 dark:text-gray-400">
              {t('buyer.username', 'Username')}
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 dark:border-white/10 dark:bg-neutral-950 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.28em] text-gray-500 dark:text-gray-400">
              {t('profile.email', 'Email Address')}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 dark:border-white/10 dark:bg-neutral-950 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <Link
              to="/change-password"
              className="inline-flex justify-center rounded-full border border-gray-200 px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-gray-700 transition hover:border-brand-gold hover:text-brand-gold dark:border-white/10 dark:text-gray-200"
            >
              {t('buyer.change_password', 'Change Password')}
            </Link>
            <button
              type="submit"
              className="inline-flex justify-center rounded-full bg-brand-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-brand-gold/90"
            >
              {t('profile.save_changes', 'Save Changes')}
            </button>
          </div>

          {isSaved ? (
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              {t('buyer.profile_saved', 'Your buyer profile has been updated locally.')}
            </p>
          ) : null}
        </form>
      </section>
    </div>
  )
}

export default BuyerProfile