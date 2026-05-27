import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { FaCalendarAlt, FaCity, FaIdCard, FaUser } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'

const CreateProfile = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { profile, isLoadingProfile, createProfile } = useAuth()
  const [formData, setFormData] = useState({
    fullName: '',
    nationalIdNumber: '',
    birthday: '',
    city: '',
    idCardImage: null,
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const returnTo = useMemo(() => location.state?.returnTo || '/owner/info', [location.state])

  useEffect(() => {
    if (!isLoadingProfile && profile) {
      navigate(returnTo, { replace: true })
    }
  }, [isLoadingProfile, navigate, profile, returnTo])

  const handleChange = (event) => {
    setErrorMessage('')
    setFormData((currentData) => ({
      ...currentData,
      [event.target.name]: event.target.value,
    }))
  }

  const handleIdCardChange = (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setErrorMessage('')
    setFormData((currentData) => ({
      ...currentData,
      idCardImage: file,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!(formData.idCardImage instanceof File)) {
      setErrorMessage(t('auth.id_card_required', 'Please upload your ID card image.'))
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      await createProfile({
        fullName: formData.fullName,
        nationalNumber: formData.nationalIdNumber,
        idCardImage: formData.idCardImage,
        birthday: formData.birthday,
        city: formData.city,
      })

      toast.success(t('profile.created_success', 'Profile created successfully!'))
      navigate(returnTo, { replace: true })
    } catch (error) {
      const msg = error.message || t('profile.create_profile_failed', 'Failed to create the profile.')
      setErrorMessage(msg)
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoadingProfile) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <h2 className="text-2xl font-light text-gray-900 dark:text-white mb-4">
          {t('profile.loading_profile', 'Loading your profile...')}
        </h2>
      </div>
    )
  }

  return (
    <>
      <div className="mb-10">
        <h1 className="text-3xl font-light text-gray-900 dark:text-white uppercase tracking-widest mb-4">
          {t('profile.create_profile_title', 'CREATE PROFILE')}
        </h1>
        <div className="w-24 h-1 bg-brand-gold mb-4"></div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {t('profile.create_profile_subtitle', 'Complete your profile before publishing your first property.')}
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm dark:shadow-none p-8 md:p-10 max-w-3xl border border-gray-200 dark:border-white/10 transition-colors duration-300">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMessage ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
              {errorMessage}
            </div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-medium mb-2 block">
                {t('auth.full_name', 'Full Name')}
              </label>
              <div className="relative">
                <FaUser className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-white/10 rounded-lg text-gray-700 dark:text-gray-100 text-sm focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/10 transition-colors bg-gray-50/50 dark:bg-white/5"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-medium mb-2 block">
                {t('auth.national_id_number', 'National ID Number')}
              </label>
              <div className="relative">
                <FaIdCard className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  name="nationalIdNumber"
                  value={formData.nationalIdNumber}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-white/10 rounded-lg text-gray-700 dark:text-gray-100 text-sm focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/10 transition-colors bg-gray-50/50 dark:bg-white/5"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-medium mb-2 block">
                {t('auth.city', 'City')}
              </label>
              <div className="relative">
                <FaCity className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-white/10 rounded-lg text-gray-700 dark:text-gray-100 text-sm focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/10 transition-colors bg-gray-50/50 dark:bg-white/5"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-medium mb-2 block">
                {t('auth.birthday', 'Birthday')}
              </label>
              <div className="relative">
                <FaCalendarAlt className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-white/10 rounded-lg text-gray-700 dark:text-gray-100 text-sm focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/10 transition-colors bg-gray-50/50 dark:bg-white/5"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-medium mb-2 block">
                {t('auth.id_card_image', 'ID Card Image')}
              </label>
              <label className="block cursor-pointer rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-gray-700 transition-colors hover:border-brand-gold hover:bg-gray-100/80 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold">
                    <FaIdCard className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {formData.idCardImage ? formData.idCardImage.name : t('auth.upload_id_card', 'Upload ID card')}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {t('auth.id_card_help', 'Upload a clear image of the front side of your ID card')}
                    </p>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleIdCardChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto px-10 py-3 bg-brand-gold text-white text-xs uppercase tracking-widest-extra font-semibold rounded-lg hover:bg-brand-gold/90 transition-all duration-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? t('profile.creating_profile', 'Creating Profile...')
              : t('profile.create_profile_cta', 'Create Profile')}
          </button>
        </form>
      </div>
    </>
  )
}

export default CreateProfile