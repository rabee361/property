import { FaBath, FaBed, FaHeart, FaRegHeart, FaVectorSquare } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const PropertyCard = ({
  property,
  isFavorite,
  hasOffer,
  onToggleFavorite,
  onOpenOffer,
  showOfferButton = true,
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const actionGridClass = showOfferButton ? 'grid grid-cols-1 gap-3' : 'grid grid-cols-1 gap-3'

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-white/10 dark:bg-neutral-900 dark:shadow-none">
      <div className="relative overflow-hidden aspect-4/5 sm:aspect-4/3 lg:aspect-4/5">
        <img
          src={property.image}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-white backdrop-blur-sm">
          {property.type}
        </div>

        <button
          type="button"
          onClick={() => onToggleFavorite(property.id, property)}
          aria-pressed={isFavorite}
          aria-label={
            isFavorite
              ? t('buyer.remove_favorite', 'Remove from favorites')
              : t('buyer.add_favorite', 'Add to favorites')
          }
          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-rose-500 shadow-lg backdrop-blur-sm transition hover:scale-105 hover:bg-white dark:bg-neutral-900/90"
        >
          {isFavorite ? <FaHeart className="h-4 w-4" /> : <FaRegHeart className="h-4 w-4" />}
        </button>

        <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-black/60 px-4 py-3 text-white backdrop-blur-md">
          <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.25em] text-white/70">
            <span>{t('featured.price', 'Price')}</span>
            <span className="text-right text-sm font-semibold tracking-wide text-white">{property.price}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-5 space-y-2">
          <h3 className="text-2xl font-light text-brand-dark dark:text-white">{property.title}</h3>
          <p className="text-sm italic text-gray-500 dark:text-gray-400">{property.specs}</p>
          <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">{property.location}</p>
        </div>

        <div className="mt-auto space-y-5">
          <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-5 dark:border-white/10">
            <div className="flex flex-col items-center justify-center text-gray-600 dark:text-gray-300">
              <FaVectorSquare className="mb-1 h-5 w-5 text-brand-gold" />
              <span className="text-xs font-semibold">
                {property.area} {t('featured.sqm', 'sqm')}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center border-x border-gray-100 px-2 text-center text-gray-600 dark:border-white/10 dark:text-gray-300">
              <FaBed className="mb-1 h-5 w-5 text-brand-gold" />
              <span className="text-xs font-semibold">
                {property.beds} {t('featured.beds', 'Beds')}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center text-gray-600 dark:text-gray-300">
              <FaBath className="mb-1 h-5 w-5 text-brand-gold" />
              <span className="text-xs font-semibold">
                {property.baths} {t('featured.baths', 'Baths')}
              </span>
            </div>
          </div>

          <div className={actionGridClass}>
            <button
              type="button"
              onClick={() => navigate(`/properties/${property.id}`)}
              className="w-full rounded-xl border border-brand-dark px-4 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-brand-dark transition hover:bg-brand-dark hover:text-white dark:border-brand-gold dark:text-brand-gold dark:hover:bg-brand-gold dark:hover:text-brand-dark"
            >
              {t('properties.view_details', 'View Details')}
            </button>

          </div>
        </div>
      </div>
    </article>
  )
}

export default PropertyCard
