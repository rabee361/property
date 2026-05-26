import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import OfferModal from '../components/OfferModal';
import PropertyCard from '../components/PropertyCard';
import { useBuyer } from '../context/BuyerContext';
import Navbar from './index/Navbar';
import Footer from './index/Footer';
import beachBg from '../assets/beach.webp';

const Properties = () => {
  const { t } = useTranslation();
  const {
    properties,
    isFavorite,
    offers,
    submitOffer,
    toggleFavorite,
    isLoadingProperties,
    searchProperties,
    propertyPagination,
    propertyFilters,
    propertyLoadError,
  } = useBuyer();
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchValue, setSearchValue] = useState(propertyFilters.search || '');

  const existingOffer = selectedProperty
    ? offers.find((offer) => offer.property.id === selectedProperty.id) ?? null
    : null;

  const paginationNumbers = useMemo(() => {
    if (!propertyPagination?.last_page) {
      return [];
    }

    const currentPage = propertyPagination.current_page;
    const lastPage = propertyPagination.last_page;
    const pages = new Set([1, currentPage - 1, currentPage, currentPage + 1, lastPage]);

    return [...pages].filter((page) => page >= 1 && page <= lastPage).sort((left, right) => left - right);
  }, [propertyPagination]);

  const handleOfferSubmit = ({ amount, note }) => {
    if (!selectedProperty) {
      return;
    }

    submitOffer({ propertyId: selectedProperty.id, amount, note });
    setSelectedProperty(null);
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    await searchProperties({ search: searchValue.trim(), page: 1 });
  };

  const handlePageChange = async (page) => {
    if (!propertyPagination || page < 1 || page > propertyPagination.last_page) {
      return;
    }

    await searchProperties({ page });
  };

  return (
    <>
      <Navbar />

      {/* Hero Banner */}
      <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden">
        <img
          src={beachBg}
          alt="Properties"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/60 flex flex-col items-center justify-center">
          <span className="text-brand-gold text-sm uppercase tracking-[0.3em] font-medium mb-3">
            {t('properties.subtitle')}
          </span>
          <h1 className="text-4xl md:text-5xl font-light text-white uppercase tracking-widest-extra text-center px-4">
            {t('properties.page_title')}
          </h1>
        </div>
      </div>

      <section className="py-20 bg-gray-50 transition-colors duration-300 dark:bg-neutral-950">
        <div className="container mx-auto px-3 lg:px-6">
          
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-16 px-4">
            <form onSubmit={handleSearchSubmit} className="relative group rounded-full bg-white shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-colors duration-300 dark:bg-neutral-900">
              <div className="absolute inset-y-0 left-0 pl-6 rtl:pl-0 rtl:pr-6 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 group-focus-within:text-brand-gold transition-colors w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder={t('properties.search_placeholder', 'Search for properties...')}
                className="w-full rounded-full border-2 border-transparent bg-transparent py-4 pl-14 pr-36 text-base font-medium text-gray-700 transition-all placeholder:text-gray-400 hover:border-gray-50 focus:border-brand-gold focus:outline-none focus:ring-4 focus:ring-brand-gold/10 rtl:pl-36 rtl:pr-14 md:py-5 md:text-lg dark:text-gray-100 dark:hover:border-white/10"
              />
              <button
                type="submit"
                className="absolute inset-y-2 right-2 rounded-full bg-brand-dark px-8 text-sm font-semibold uppercase tracking-widest text-white shadow-md transition-all duration-300 hover:bg-brand-gold hover:text-brand-dark cursor-pointer rtl:right-auto rtl:left-2 md:px-10"
              >
                {t('properties.search_button', 'Search')}
              </button>
            </form>
          </div>

          {propertyLoadError ? (
            <div className="mb-8 border rounded-3xl border-rose-200 bg-rose-50 px-6 py-4 text-sm text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
              {propertyLoadError}
            </div>
          ) : null}

          {isLoadingProperties ? (
            <div className="border rounded-4xl border-dashed border-gray-300 bg-white px-6 py-16 text-center text-sm uppercase tracking-[0.28em] text-gray-500 dark:border-white/15 dark:bg-neutral-900 dark:text-gray-400">
              {t('properties.loading', 'Loading approved properties...')}
            </div>
          ) : properties.length === 0 ? (
            <div className="border rounded-4xl border-dashed border-gray-300 bg-white px-6 py-16 text-center dark:border-white/15 dark:bg-neutral-900">
              <h2 className="text-2xl font-light uppercase tracking-[0.14em] text-brand-dark dark:text-white">
                {t('properties.empty_title', 'No approved properties yet')}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-500 dark:text-gray-400">
                {t('properties.empty_message', 'Approved properties will appear here as soon as the backend publishes them.')}
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 text-center text-xs uppercase tracking-[0.28em] text-gray-400 dark:text-gray-500">
                {propertyPagination?.total
                  ? t('properties.results_count', '{{count}} approved properties found', { count: propertyPagination.total })
                  : t('properties.results_count', '{{count}} approved properties found', { count: properties.length })}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {properties.map((property) => (
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
            </>
          )}

          {/* Pagination */}
          <div className="mt-16 flex justify-center items-center space-x-2 rtl:space-x-reverse">
            <button
              type="button"
              onClick={() => handlePageChange((propertyPagination?.current_page || 1) - 1)}
              disabled={!propertyPagination || propertyPagination.current_page <= 1}
              className="h-10 w-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:border-brand-gold hover:text-brand-gold transition-colors disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:text-gray-400 disabled:cursor-not-allowed"
            >
              <FaChevronLeft className="w-3 h-3 rtl:rotate-180" />
            </button>
            {paginationNumbers.map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => handlePageChange(page)}
                className={`h-10 w-10 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  propertyPagination?.current_page === page
                    ? 'bg-brand-gold text-white shadow-md'
                    : 'border border-gray-200 bg-white text-gray-600 hover:border-brand-gold hover:text-brand-gold'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handlePageChange((propertyPagination?.current_page || 1) + 1)}
              disabled={!propertyPagination || propertyPagination.current_page >= propertyPagination.last_page}
              className="h-10 w-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-brand-gold hover:text-brand-gold transition-colors cursor-pointer disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:text-gray-400 disabled:cursor-not-allowed"
            >
              <FaChevronRight className="w-3 h-3 rtl:rotate-180" />
            </button>
          </div>

        </div>
      </section>

      <OfferModal
        property={selectedProperty}
        existingOffer={existingOffer}
        onClose={() => setSelectedProperty(null)}
        onSubmit={handleOfferSubmit}
      />

      <Footer />
    </>
  );
};

export default Properties;
