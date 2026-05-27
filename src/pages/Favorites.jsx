import { useTranslation } from 'react-i18next'
import BuyerFavorites from './buyer/BuyerFavorites'
import Navbar from './index/Navbar'
import Footer from './index/Footer'

const Favorites = () => {
  const { t } = useTranslation()

  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-gray-50 px-4 pb-16 pt-32 dark:bg-neutral-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-4xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-neutral-900 md:p-10">
          <div className="mb-8 border-b border-gray-200 pb-6 dark:border-white/10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
              {t('nav.favorites', 'Favorites')}
            </p>
          </div>

          <BuyerFavorites />
        </div>
      </section>

      <Footer />
    </>
  )
}

export default Favorites
