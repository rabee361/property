import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import {
  FaBath,
  FaBed,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaMapMarkerAlt,
  FaRegHeart,
  FaTag,
  FaVectorSquare,
} from 'react-icons/fa'
import Navbar from './index/Navbar'
import Footer from './index/Footer'
import { apiRequest } from '../lib/api'
import { normalizeProperty } from '../lib/property'
import { useBuyer } from '../context/BuyerContext'

const PropertyDetails = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  const { isFavorite, toggleFavorite } = useBuyer()
  const [property, setProperty] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadProperty = async () => {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const response = await apiRequest(`/api/app/properties/${id}`)

        if (isMounted) {
          setProperty(normalizeProperty(response?.property))
          setSelectedImageIndex(0)
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message || t('properties.details_failed', 'Failed to load the property details.'))
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    if (id) {
      loadProperty()
    }

    return () => {
      isMounted = false
    }
  }, [id, t])

  const galleryImages = property?.galleryImages || []
  const activeImage = galleryImages[selectedImageIndex] || property?.image

  const featureItems = useMemo(() => {
    if (!property?.features) {
      return []
    }

    if (Array.isArray(property.features)) {
      return property.features.filter(Boolean)
    }

    return String(property.features)
      .split(/[,\n]/)
      .map((item) => item.trim())
      .filter(Boolean)
  }, [property])

  const handlePreviousImage = () => {
    if (galleryImages.length <= 1) {
      return
    }

    setSelectedImageIndex((currentIndex) =>
      currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1,
    )
  }

  const handleNextImage = () => {
    if (galleryImages.length <= 1) {
      return
    }

    setSelectedImageIndex((currentIndex) =>
      currentIndex === galleryImages.length - 1 ? 0 : currentIndex + 1,
    )
  }

  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-gray-50 px-4 pb-16 pt-32 dark:bg-neutral-950 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-gray-700 transition hover:border-brand-gold hover:text-brand-gold dark:border-white/10 dark:bg-neutral-900 dark:text-gray-300"
            >
              <FaChevronLeft className="h-3 w-3 rtl:rotate-180" />
              {t('properties.back_to_list', 'Back to Properties')}
            </Link>
          </div>

          {isLoading ? (
            <div className="rounded-4xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center text-sm uppercase tracking-[0.28em] text-gray-500 dark:border-white/15 dark:bg-neutral-900 dark:text-gray-400">
              {t('properties.details_loading', 'Loading property details...')}
            </div>
          ) : errorMessage ? (
            <div className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-4 text-sm text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
              {errorMessage}
            </div>
          ) : !property ? (
            <div className="rounded-4xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center text-sm uppercase tracking-[0.28em] text-gray-500 dark:border-white/15 dark:bg-neutral-900 dark:text-gray-400">
              {t('properties.details_not_found', 'Property not found.')}
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
              <div className="rounded-4xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-neutral-900 dark:shadow-none sm:p-6">
                <div className="relative overflow-hidden rounded-[1.75rem] bg-black/5">
                  <img
                    src={activeImage}
                    alt={property.title}
                    className="h-70 w-full object-cover sm:h-105"
                  />

                  {galleryImages.length > 1 ? (
                    <>
                      <button
                        type="button"
                        onClick={handlePreviousImage}
                        className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/75"
                      >
                        <FaChevronLeft className="h-4 w-4 rtl:rotate-180" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextImage}
                        className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/75"
                      >
                        <FaChevronRight className="h-4 w-4 rtl:rotate-180" />
                      </button>
                    </>
                  ) : null}
                </div>

                <div className="mt-5 grid grid-cols-4 gap-3 sm:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5">
                  {galleryImages.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setSelectedImageIndex(index)}
                      className={`overflow-hidden rounded-2xl border transition ${
                        selectedImageIndex === index
                          ? 'border-brand-gold shadow-lg shadow-brand-gold/10'
                          : 'border-gray-200 hover:border-brand-gold/40 dark:border-white/10'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${property.title} ${index + 1}`}
                        className="h-20 w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-4xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-neutral-900 dark:shadow-none sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-6 dark:border-white/10">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-gold">
                      <span>{property.propertyType}</span>
                      <span className="text-gray-300 dark:text-white/20">/</span>
                      <span>{property.purpose}</span>
                    </div>
                    <h1 className="mt-4 text-3xl font-light uppercase tracking-[0.14em] text-brand-dark dark:text-white">
                      {property.title}
                    </h1>
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <FaMapMarkerAlt className="h-4 w-4 text-brand-gold" />
                      <span>{property.location || t('properties.location_unknown', 'Location not available')}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleFavorite(property.id, property)}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 text-rose-500 transition hover:border-rose-200 hover:bg-rose-50 dark:border-white/10 dark:hover:bg-white/5"
                    aria-pressed={isFavorite(property.id)}
                    aria-label={
                      isFavorite(property.id)
                        ? t('buyer.remove_favorite', 'Remove from favorites')
                        : t('buyer.add_favorite', 'Add to favorites')
                    }
                  >
                    {isFavorite(property.id) ? <FaHeart className="h-4 w-4" /> : <FaRegHeart className="h-4 w-4" />}
                  </button>
                </div>

                <div className="mt-6 rounded-3xl bg-brand-dark px-6 py-5 text-white dark:bg-brand-gold dark:text-brand-dark">
                  <div className="text-[11px] uppercase tracking-[0.3em] text-white/60 dark:text-brand-dark/60">
                    {t('featured.price', 'Price')}
                  </div>
                  <div className="mt-2 text-3xl font-semibold tracking-wide">{property.price}</div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div className="rounded-3xl border border-gray-100 px-4 py-5 text-center dark:border-white/10">
                    <FaVectorSquare className="mx-auto h-5 w-5 text-brand-gold" />
                    <div className="mt-3 text-xs uppercase tracking-[0.24em] text-gray-400">
                      {t('featured.area', 'Area')}
                    </div>
                    <div className="mt-2 text-lg font-semibold text-brand-dark dark:text-white">
                      {property.area} {t('featured.sqm', 'sqm')}
                    </div>
                  </div>
                  <div className="rounded-3xl border border-gray-100 px-4 py-5 text-center dark:border-white/10">
                    <FaBed className="mx-auto h-5 w-5 text-brand-gold" />
                    <div className="mt-3 text-xs uppercase tracking-[0.24em] text-gray-400">
                      {t('featured.beds', 'Beds')}
                    </div>
                    <div className="mt-2 text-lg font-semibold text-brand-dark dark:text-white">{property.beds}</div>
                  </div>
                  <div className="col-span-2 rounded-3xl border border-gray-100 px-4 py-5 text-center dark:border-white/10 sm:col-span-1">
                    <FaBath className="mx-auto h-5 w-5 text-brand-gold" />
                    <div className="mt-3 text-xs uppercase tracking-[0.24em] text-gray-400">
                      {t('featured.baths', 'Baths')}
                    </div>
                    <div className="mt-2 text-lg font-semibold text-brand-dark dark:text-white">{property.baths}</div>
                  </div>
                </div>

                <div className="mt-8 space-y-6">
                  <div>
                    <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-gray-400">
                      {t('properties.details_description', 'Description')}
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-gray-600 dark:text-gray-300">
                      {property.description || t('properties.details_no_description', 'No description provided for this property yet.')}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-gray-400">
                      {t('properties.details_features', 'Features')}
                    </h2>
                    {featureItems.length > 0 ? (
                      <div className="mt-4 flex flex-wrap gap-3">
                        {featureItems.map((feature) => (
                          <span
                            key={feature}
                            className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-600 dark:bg-white/10 dark:text-gray-300"
                          >
                            <FaTag className="h-3 w-3 text-brand-gold" />
                            {feature}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                        {t('properties.details_no_features', 'No property features were provided.')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}

export default PropertyDetails