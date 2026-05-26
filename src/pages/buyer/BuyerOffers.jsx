import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useBuyer } from '../../context/BuyerContext'

const BuyerOffers = () => {
  const { t } = useTranslation()
  const { offers } = useBuyer()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-light uppercase tracking-[0.18em] text-brand-dark dark:text-white">
            {t('buyer.offers_title', 'Offers')}
          </h2>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            {t(
              'buyer.offers_page_description',
              'Every bid you submit from the property cards will appear here with its latest status.',
            )}
          </p>
        </div>

        <Link
          to="/properties"
          className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold transition hover:text-brand-dark dark:hover:text-white"
        >
          {t('buyer.make_new_offer', 'Make a New Offer')}
        </Link>
      </div>

      {offers.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-gray-300 bg-white px-6 py-12 text-center dark:border-white/15 dark:bg-neutral-900">
          <h3 className="text-2xl font-light uppercase tracking-[0.14em] text-brand-dark dark:text-white">
            {t('buyer.no_offers_title', 'No offers submitted yet')}
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-500 dark:text-gray-400">
            {t(
              'buyer.no_offers_message',
              'Open any property card, choose Make Offer, and the result will be tracked here automatically.',
            )}
          </p>
          <Link
            to="/properties"
            className="mt-6 inline-flex rounded-full bg-brand-dark px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-brand-gold dark:bg-brand-gold dark:text-brand-dark dark:hover:bg-white"
          >
            {t('buyer.go_to_properties', 'Browse Properties')}
          </Link>
        </div>
      ) : (
        <div className="grid gap-5">
          {offers.map((offer) => (
            <article
              key={`${offer.property.id}-${offer.submittedAt}`}
              className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-neutral-900 dark:shadow-none"
            >
              <div className="grid gap-6 p-6 lg:grid-cols-[240px_1fr] lg:p-7">
                <div className="overflow-hidden rounded-[1.5rem]">
                  <img
                    src={offer.property.image}
                    alt={offer.property.title}
                    className="h-full min-h-52 w-full object-cover"
                  />
                </div>

                <div className="space-y-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-gold">
                        {offer.property.location}
                      </p>
                      <h3 className="mt-2 text-2xl font-light uppercase tracking-[0.12em] text-brand-dark dark:text-white">
                        {offer.property.title}
                      </h3>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{offer.property.specs}</p>
                    </div>

                    <span className="inline-flex w-fit rounded-full bg-amber-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                      {offer.status}
                    </span>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl bg-gray-50 p-4 dark:bg-neutral-950">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500 dark:text-gray-400">
                        {t('buyer.offer_amount', 'Offer Amount')}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">{offer.amount} SYP</p>
                    </div>
                    <div className="rounded-2xl bg-gray-50 p-4 dark:bg-neutral-950">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500 dark:text-gray-400">
                        {t('buyer.listing_price', 'Listing Price')}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">{offer.property.price}</p>
                    </div>
                    <div className="rounded-2xl bg-gray-50 p-4 dark:bg-neutral-950">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500 dark:text-gray-400">
                        {t('buyer.submitted_on', 'Submitted On')}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
                        {new Date(offer.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-200 p-4 dark:border-white/10">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500 dark:text-gray-400">
                      {t('buyer.offer_note', 'Offer Note')}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-300">
                      {offer.note || t('buyer.no_offer_note', 'No note provided for this offer.')}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      to="/properties"
                      className="rounded-full bg-brand-dark px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-brand-gold dark:bg-brand-gold dark:text-brand-dark dark:hover:bg-white"
                    >
                      {t('buyer.update_from_catalog', 'Update from Catalog')}
                    </Link>
                    <Link
                      to="/buyer/favorites"
                      className="rounded-full border border-gray-200 px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-gray-700 transition hover:border-brand-gold hover:text-brand-gold dark:border-white/10 dark:text-gray-200"
                    >
                      {t('buyer.review_favorites', 'Review Favorites')}
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default BuyerOffers
