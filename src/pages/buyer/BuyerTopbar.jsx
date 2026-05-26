import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaMoon, FaSun } from 'react-icons/fa'
import { useTheme } from '../../context/ThemeContext'
import { useBuyer } from '../../context/BuyerContext'

const pageContent = {
  '/buyer': {
    titleKey: 'buyer.dashboard_title',
    titleFallback: 'BUYER SPACE',
    subtitleKey: 'buyer.dashboard_subtitle',
    subtitleFallback: 'A focused space for your saved homes, offers, and profile updates.',
  },
  '/buyer/favorites': {
    titleKey: 'buyer.favorites_title',
    titleFallback: 'FAVORITES',
    subtitleKey: 'buyer.favorites_subtitle',
    subtitleFallback: 'Every property you marked as a favorite in one place.',
  },
  '/buyer/offers': {
    titleKey: 'buyer.offers_title',
    titleFallback: 'OFFERS',
    subtitleKey: 'buyer.offers_subtitle',
    subtitleFallback: 'Track the bids you submitted across the property catalog.',
  },
  '/buyer/profile': {
    titleKey: 'buyer.profile_title',
    titleFallback: 'PROFILE',
    subtitleKey: 'buyer.profile_subtitle',
    subtitleFallback: 'Update your buyer information and account details.',
  },
}

const BuyerTopbar = () => {
  const location = useLocation()
  const { t } = useTranslation()
  const { profile } = useBuyer()
  const { theme, toggleTheme } = useTheme()

  const currentPage = pageContent[location.pathname] ?? pageContent['/buyer']

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-xl transition-colors duration-300 dark:border-white/10 dark:bg-neutral-950/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-brand-gold">
            sun shadow
          </p>  
          <h1 className="truncate text-xl font-semibold uppercase tracking-[0.2em] text-gray-900 dark:text-white">
            {t(currentPage.titleKey, currentPage.titleFallback)}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-brand-gold hover:text-brand-gold dark:border-white/10 dark:bg-neutral-900 dark:text-gray-300"
            aria-label={
              theme === 'dark'
                ? t('admin.light_mode', 'LIGHT MODE')
                : t('admin.dark_mode', 'DARK MODE')
            }
          >
            {theme === 'dark' ? <FaSun className="h-4 w-4" /> : <FaMoon className="h-4 w-4" />}
          </button>

          <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-2 py-2 shadow-sm dark:border-white/10 dark:bg-neutral-900">

            <img
              src={profile.avatar}
              alt={profile.username}
              className="h-10 w-10 rounded-full border-2 border-brand-gold object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  )
}

export default BuyerTopbar
