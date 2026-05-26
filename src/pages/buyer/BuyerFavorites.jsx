import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import OfferModal from '../../components/OfferModal'
import PropertyCard from '../../components/PropertyCard'
import { useBuyer } from '../../context/BuyerContext'

const BuyerFavorites = () => {
  const { t } = useTranslation()
  const { favoriteProperties, isFavorite, offers, submitOffer, toggleFavorite, isLoadingFavorites } = useBuyer()
  const [selectedProperty, setSelectedProperty] = useState(null)

  const existingOffer = useMemo(() => {
    if (!selectedProperty) {
      return null
    }

    return offers.find((offer) => offer.property.id === selectedProperty.id) ?? null
  }, [offers, selectedProperty])

  const handleOfferSubmit = ({ amount, note }) => {
    if (!selectedProperty) {
      return
    }

    submitOffer({ propertyId: selectedProperty.id, amount, note })
    setSelectedProperty(null)
  }

  return (
    <>
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-light uppercase tracking-[0.18em] text-brand-dark dark:text-white">
            {t('buyer.favorites_title', 'Favorites')}
          </h2>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            {t(
              'buyer.favorites_page_description',
              'These are the properties you marked as favorites while browsing the catalog.',
            )}
          </p>
        </div>

        <Link
          to="/properties"
          className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold transition hover:text-brand-dark dark:hover:text-white"
        >
          {t('buyer.browse_more', 'Browse More Properties')}
        </Link>
      </div>

      {isLoadingFavorites ? (
        <div className="rounded-[2rem] border border-dashed border-gray-300 bg-white px-6 py-12 text-center dark:border-white/15 dark:bg-neutral-900">
          <p className="text-sm uppercase tracking-[0.28em] text-gray-500 dark:text-gray-400">
            {t('buyer.loading_favorites', 'Loading favorites...')}
          </p>
        </div>
      ) : favoriteProperties.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-gray-300 bg-white px-6 py-12 text-center dark:border-white/15 dark:bg-neutral-900">
          <h3 className="text-2xl font-light uppercase tracking-[0.14em] text-brand-dark dark:text-white">
            {t('buyer.no_favorites_title', 'No favorites yet')}
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-500 dark:text-gray-400">
            {t(
              'buyer.no_favorites_message',
              'Start browsing the property catalog and tap the heart on any card to build your shortlist here.',
            )}
          </p>
          <Link
            to="/properties"
            className="mt-6 inline-flex rounded-full bg-brand-dark px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-brand-gold dark:bg-brand-gold dark:text-brand-dark dark:hover:bg-white"
          >
            {t('buyer.go_to_catalog', 'Go to Catalog')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {favoriteProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isFavorite={isFavorite(property.id)}
              hasOffer={offers.some((offer) => offer.property.id === property.id)}
              onToggleFavorite={toggleFavorite}
              onOpenOffer={setSelectedProperty}
            />
          ))}
        </div>
      )}

      <OfferModal
        property={selectedProperty}
        existingOffer={existingOffer}
        onClose={() => setSelectedProperty(null)}
        onSubmit={handleOfferSubmit}
      />
    </>
  )
}

export default BuyerFavorites
