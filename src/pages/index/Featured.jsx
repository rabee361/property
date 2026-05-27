import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import PropertyCard from '../../components/PropertyCard';
import { useBuyer } from '../../context/BuyerContext';

const Featured = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    featuredProperties,
    isLoadingFeatured,
    featuredLoadError,
    isFavorite,
    toggleFavorite,
  } = useBuyer();

  return (
    <section id="properties" className="bg-gray-50 py-20 transition-colors duration-300 dark:bg-neutral-950">
      <div className="container mx-auto px-6 lg:px-12">
        <div 
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-light uppercase tracking-widest text-brand-dark dark:text-white md:text-4xl">
            {t('featured.section_title')}
          </h2>
          <div className="w-24 h-1 bg-brand-gold mx-auto"></div>
        </div>

        {featuredLoadError ? (
          <div className="mb-8 rounded-3xl border border-rose-200 bg-rose-50 px-6 py-4 text-sm text-rose-600">
            {featuredLoadError}
          </div>
        ) : null}

        {isLoadingFeatured ? (
          <div className="rounded-4xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center text-sm uppercase tracking-[0.28em] text-gray-500 dark:border-white/15 dark:bg-neutral-900 dark:text-gray-400">
            {t('featured.loading', 'Loading featured properties...')}
          </div>
        ) : featuredProperties.length === 0 ? (
          <div className="rounded-4xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center text-sm uppercase tracking-widest-extra text-gray-500 dark:border-white/15 dark:bg-neutral-900 dark:text-gray-400">
            {t('featured.empty', 'No featured properties available right now.')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isFavorite={isFavorite(property.id)}
                hasOffer={false}
                onToggleFavorite={toggleFavorite}
                showOfferButton={false}
              />
            ))}
          </div>
        )}

        {/* Show More Button */}
        <div className="flex justify-center mt-14">
          <button
            onClick={() => navigate('/properties')}
            className="cursor-pointer border border-brand-dark bg-transparent px-10 py-3 text-xs uppercase tracking-widest-extra text-brand-dark transition-all duration-300 hover:bg-brand-dark hover:text-white dark:border-brand-gold dark:text-brand-gold dark:hover:bg-brand-gold dark:hover:text-brand-dark"
          >
            {t('featured.show_more')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Featured;
