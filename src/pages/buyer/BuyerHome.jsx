import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaHeart, FaFileSignature, FaUserEdit } from 'react-icons/fa'
import { useBuyer } from '../../context/BuyerContext'

const BuyerHome = () => {
  const { t } = useTranslation()
  const { favoriteProperties, offers, profile } = useBuyer()

  const cards = [
    {
      title: t('buyer.favorites_title', 'Favorites'),
      description: t(
        'buyer.favorites_card_description',
        'Review the properties you liked and continue submitting offers from a curated list.',
      ),
      path: '/buyer/favorites',
      icon: FaHeart,
    },
    {
      title: t('buyer.offers_title', 'Offers'),
      description: t(
        'buyer.offers_card_description',
        'See every bid you submitted and keep track of its latest status and timing.',
      ),
      path: '/buyer/offers',
      icon: FaFileSignature,
    },
    {
      title: t('buyer.profile_title', 'Profile'),
      description: t(
        'buyer.profile_card_description',
        'Update your avatar, username, and email details before your next conversation.',
      ),
      path: '/buyer/profile',
      icon: FaUserEdit,
    },
  ]

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-neutral-900 dark:shadow-none">
        <div className="grid gap-8 px-6 py-8 lg:grid-cols-[1.4fr_0.9fr] lg:px-8 lg:py-10">
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="max-w-2xl text-3xl font-light uppercase tracking-[0.18em] text-brand-dark dark:text-white md:text-4xl">
                {t('buyer.dashboard_heading', 'MOVE FASTER ON THE HOMES YOU CARE ABOUT')}
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-gray-500 dark:text-gray-400 md:text-base">
                {t(
                  'buyer.dashboard_description',
                  'Use this focused buyer space to review favorite properties, revisit submitted offers, and keep your profile ready for the next step.',
                )}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/properties"
                className="rounded-full bg-brand-dark px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-brand-gold dark:bg-brand-gold dark:text-brand-dark dark:hover:bg-white"
              >
                {t('buyer.browse_properties', 'Browse Properties')}
              </Link>
            </div>
          </div>

        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.path}
            to={card.path}
            className="group rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold hover:shadow-xl dark:border-white/10 dark:bg-neutral-900 dark:shadow-none"
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gold/10 text-brand-gold transition group-hover:bg-brand-gold group-hover:text-white">
              <card.icon className="h-6 w-6" />
            </div>
            <h3 className="mb-3 text-2xl font-light uppercase tracking-[0.14em] text-brand-dark dark:text-white">
              {card.title}
            </h3>
            <p className="mb-6 text-sm leading-7 text-gray-500 dark:text-gray-400">{card.description}</p>
          </Link>
        ))}
      </section>
    </div>
  )
}

export default BuyerHome
