import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../lib/api';
import { formatPropertyPrice } from '../../lib/property';

const Properties = () => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [activePropertyId, setActivePropertyId] = useState(null);
  const [approvalModalProperty, setApprovalModalProperty] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadProperties = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await apiRequest('/api/admin/property/admin/index', {
          token,
        });

        if (isMounted) {
          setProperties(response?.properties || []);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message || t('admin.properties_load_failed', 'Failed to load properties.'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (token) {
      loadProperties();
    }

    return () => {
      isMounted = false;
    };
  }, [t, token]);

  const handleStatusChange = async (propertyId, status) => {
    setActivePropertyId(propertyId);
    setErrorMessage('');

    try {
      const response = await apiRequest(`/api/admin/property/admin/changeStatus/${propertyId}`, {
        method: 'POST',
        token,
        data: { status },
      });

      setProperties((currentProperties) =>
        currentProperties.map((property) =>
          property.id === propertyId
            ? {
                ...property,
                ...(response?.property || {}),
              }
            : property,
        ),
      );
      toast.success(t('admin.property_status_updated', 'Property status updated successfully!'));
    } catch (error) {
      const msg = error.message || t('admin.property_action_failed', 'Failed to update property status.');
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setActivePropertyId(null);
    }
  };

  const getStatusBadgeClass = (status) => {
    if (status === 'approved') return 'bg-emerald-500/90';
    if (status === 'pending') return 'bg-amber-500/90';
    if (status === 'rejected') return 'bg-red-500/90';
    return 'bg-slate-600';
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-widest uppercase text-gray-900 dark:text-white">
          {t('admin.properties_title', 'PROPERTY MANAGEMENT')}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('admin.properties_subtitle', 'View and manage all property listings.')}
        </p>
      </div>

      {errorMessage ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
          {errorMessage}
        </div>
      ) : null}

      <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white dark:bg-neutral-900 shadow-sm dark:border-white/10 dark:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full min-w-280 text-left text-sm">
            <thead className="border-b border-gray-200 dark:border-white/10 bg-gray-50/50 text-xs uppercase tracking-wider text-gray-500 dark:bg-transparent dark:text-brand-gold">
              <tr>
                <th className="px-6 py-4 font-semibold">{t('admin.id', 'ID')}</th>
                <th className="px-6 py-4 font-semibold">{t('admin.title', 'TITLE')}</th>
                <th className="px-6 py-4 font-semibold">{t('admin.owner', 'OWNER')}</th>
                <th className="px-6 py-4 font-semibold">{t('admin.type', 'TYPE')}</th>
                <th className="px-6 py-4 font-semibold">{t('admin.purpose', 'PURPOSE')}</th>
                <th className="px-6 py-4 font-semibold">{t('admin.price', 'PRICE')}</th>
                <th className="px-6 py-4 font-semibold">{t('admin.status', 'STATUS')}</th>
                <th className="px-6 py-4 font-semibold">{t('admin.acceptance', 'ACCEPTANCE')}</th>
                <th className="px-6 py-4 font-semibold text-right">{t('admin.actions', 'ACTIONS')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/5 text-gray-700 dark:text-gray-300">
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    {t('admin.loading_properties', 'Loading properties...')}
                  </td>
                </tr>
              ) : properties.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    {t('admin.no_properties', 'No properties found.')}
                  </td>
                </tr>
              ) : properties.map((property) => (
                <tr 
                  key={property.id} 
                  className="transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  <td className="whitespace-nowrap px-6 py-4">#{property.id}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900 dark:text-white">{property.title}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 italic">{property.address}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900 dark:text-white">{property.user?.name || t('admin.admin_uploaded', 'Admin Upload')}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{property.user?.email || property.admin?.email || t('admin.not_available', 'N/A')}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 uppercase">{property.property_type}</td>
                  <td className="whitespace-nowrap px-6 py-4 uppercase">{property.purpose}</td>
                  <td className="whitespace-nowrap px-6 py-4 font-semibold font-sans">
                    {formatPropertyPrice(property.price)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span 
                      className={`rounded px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white ${getStatusBadgeClass(property.status)}`}
                    >
                      {t(`admin.status_${property.status}`, property.status)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest ${property.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300' : 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300'}`}>
                      {property.status === 'pending' ? t('admin.needs_acceptance', 'Needs Acceptance') : t('admin.no_action_needed', 'No Action Needed')}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {property.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => setApprovalModalProperty(property)}
                            disabled={activePropertyId === property.id}
                            className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <FaCheck className="h-3 w-3" />
                            {t('admin.approve', 'Approve')}
                          </button>
                          <button
                            onClick={() => handleStatusChange(property.id, 'rejected')}
                            disabled={activePropertyId === property.id}
                            className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <FaTimes className="h-3 w-3" />
                            {t('admin.reject', 'Reject')}
                          </button>
                        </>
                      ) : (
                        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                          {t('admin.no_action_needed', 'No Action Needed')}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approval Modal */}
      {approvalModalProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setApprovalModalProperty(null)}></div>
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-neutral-900 border border-gray-100 dark:border-white/10 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="text-xl font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-4">
                {t('admin.approve_property', 'Approve Property')}
              </h3>
              
              <div className="mb-6 rounded-2xl overflow-hidden bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-white/5">
                {approvalModalProperty.deed_photo ? (
                  <img 
                    src={approvalModalProperty.deed_photo} 
                    alt="Deed Photo" 
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <div className="flex h-64 items-center justify-center text-sm text-gray-500 uppercase tracking-widest">
                    {t('admin.no_deed_photo', 'No Deed Photo Available')}
                  </div>
                )}
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex justify-between border-b border-gray-100 dark:border-white/5 pb-2">
                  <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">{t('admin.title', 'Title')}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{approvalModalProperty.title}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 dark:border-white/5 pb-2">
                  <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">{t('admin.type', 'Type')}</span>
                  <span className="text-sm font-medium uppercase text-gray-900 dark:text-white">{approvalModalProperty.property_type}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 dark:border-white/5 pb-2">
                  <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">{t('admin.owner', 'Owner')}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {approvalModalProperty.user?.name || approvalModalProperty.admin?.email || t('admin.admin_uploaded', 'Admin')}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setApprovalModalProperty(null)}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-gray-700 transition hover:bg-gray-50 dark:border-white/10 dark:bg-neutral-800 dark:text-gray-300 dark:hover:bg-neutral-700 cursor-pointer"
                >
                  {t('admin.cancel', 'Cancel')}
                </button>
                <button
                  onClick={() => {
                    handleStatusChange(approvalModalProperty.id, 'approved');
                    setApprovalModalProperty(null);
                  }}
                  disabled={activePropertyId === approvalModalProperty.id}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-600 hover:shadow-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                >
                  <FaCheck className="h-4 w-4" />
                  {t('admin.confirm_approve', 'Confirm Approve')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties;
