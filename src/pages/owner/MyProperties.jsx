import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaBed, FaTag, FaVectorSquare } from 'react-icons/fa';
import DeleteModal from './DeleteModal';
import { useOwnerProperties } from '../../context/OwnerPropertiesContext';

const STATUS_STYLES = {
  pending: 'bg-amber-500/90 text-white',
  approved: 'bg-emerald-500/90 text-white',
  rejected: 'bg-red-500/90 text-white',
  sold: 'bg-slate-700 text-white',
  rented: 'bg-sky-600 text-white',
};

const MyProperties = () => {
  const { t } = useTranslation();
  const { properties, isLoading, deleteProperty, errorMessage } = useOwnerProperties();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const resolveStatusLabel = (status) =>
    t(`profile.status_${status}`, status ? status.toUpperCase() : t('profile.status_unknown', 'UNKNOWN'));

  const handleDeleteConfirm = async () => {
    if (deleteTarget) {
      setIsDeleting(true);
      setDeleteError('');

      try {
        await deleteProperty(deleteTarget.id);
        setDeleteTarget(null);
      } catch (error) {
        setDeleteError(error.message || t('profile.delete_failed', 'Failed to delete the property.'));
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <>
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-light text-gray-900 dark:text-white uppercase tracking-widest mb-4">
            {t('profile.my_properties', 'MY PROPERTIES')}
          </h1>
          <div className="w-24 h-1 bg-brand-gold mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {t('profile.my_properties_subtitle', 'Manage your listed properties')}
          </p>
        </div>

        <Link
          to="/owner/properties/new"
          className="inline-flex items-center justify-center rounded-lg bg-brand-gold px-6 py-3 text-xs font-semibold uppercase tracking-widest-extra text-white transition hover:bg-brand-gold/90"
        >
          {t('profile.add_property', 'Add Property')}
        </Link>
      </div>

      {errorMessage || deleteError ? (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
          {deleteError || errorMessage}
        </div>
      ) : null}

      {isLoading ? (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm dark:shadow-none border border-gray-200 dark:border-white/10 p-12 text-center transition-colors duration-300">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {t('profile.loading_properties', 'Loading your properties...')}
          </p>
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm dark:shadow-none border border-gray-200 dark:border-white/10 p-12 text-center transition-colors duration-300">
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-6">
            {t('profile.no_properties', "You haven't listed any properties yet.")}
          </p>
          <Link
            to="/owner/properties/new"
            className="inline-flex px-8 py-3 bg-brand-gold text-white text-xs uppercase tracking-widest font-semibold rounded-lg hover:bg-brand-gold/90 transition-colors cursor-pointer"
          >
            {t('profile.list_first', 'List Your First Property')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((prop) => (
            <div
              key={prop.id}
              className="bg-white dark:bg-neutral-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md dark:shadow-none transition-all duration-300 group border border-gray-200 dark:border-white/10 flex flex-col h-full"
            >
              <div className="relative overflow-hidden aspect-4/3">
                <img
                  src={prop.image}
                  alt={prop.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                <span className="absolute top-4 right-4 rtl:left-4 rtl:right-auto bg-brand-gold text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                   {t(`profile.${prop.purpose}`, prop.purpose || prop.type)}
                </span>

                <span className={`absolute top-4 left-4 rtl:right-4 rtl:left-auto rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-widest shadow-md ${STATUS_STYLES[prop.status] || 'bg-white/90 text-gray-700'}`}>
                  {resolveStatusLabel(prop.status)}
                </span>

                <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-3 px-5 text-white flex justify-between items-center rounded flex-wrap gap-2">
                  <span className="text-sm font-light uppercase tracking-wider">{t('profile.price', 'Price')}</span>
                  <span className="font-semibold tracking-wide">{prop.price}</span>
                </div>
              </div>

              <div className="p-6 flex flex-col grow">
                <h3 className="text-xl font-light text-gray-900 dark:text-white mb-1 truncate">{prop.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm italic mb-2 truncate">{prop.specs}</p>
                <p className="text-gray-400 dark:text-gray-500 text-xs mb-4 truncate">{prop.location}</p>

                <div className="mt-auto pt-4 border-t border-gray-200 dark:border-white/10 grid grid-cols-3 gap-2">
                  <div className="flex flex-col items-center justify-center text-gray-600 dark:text-gray-300">
                    <FaVectorSquare className="w-4 h-4 mb-1 text-brand-gold" />
                    <span className="text-[11px] font-semibold">{prop.area} {t('profile.area_unit', 'm²')}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-gray-600 dark:text-gray-300 border-x border-gray-200 dark:border-white/10 px-2 text-center">
                    <FaBed className="w-4 h-4 mb-1 text-brand-gold" />
                    <span className="text-[11px] font-semibold">{prop.beds} {t('profile.rooms', 'Rooms')}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-gray-600 dark:text-gray-300">
                    <FaTag className="w-4 h-4 mb-1 text-brand-gold" />
                    <span className="text-[11px] font-semibold truncate">{t(`profile.type_${prop.propertyType}`, prop.propertyType)}</span>
                  </div>
                </div>

                <div className="flex gap-3 mt-5 pt-5 border-t border-gray-200 dark:border-white/10">
                  <Link
                    to={`/owner/properties/${prop.id}/edit`}
                    className="flex-1 py-2 text-center bg-brand-dark text-white text-xs uppercase tracking-widest rounded-lg hover:bg-brand-gold transition-colors block"
                  >
                    {t('profile.edit', 'Edit')}
                  </Link>
                  <button
                    onClick={() => setDeleteTarget(prop)}
                    className="flex-1 py-2 text-center bg-white dark:bg-transparent border border-red-300 dark:border-red-500/40 text-red-500 text-xs uppercase tracking-widest rounded-lg hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                  >
                    {t('profile.delete', 'Delete')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteModal
          property={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            if (!isDeleting) {
              setDeleteTarget(null)
            }
          }}
        />
      )}
    </>
  );
};

export default MyProperties;
