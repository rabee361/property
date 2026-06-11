import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { FaCheck, FaTimes, FaTrash } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../lib/api';

const Profiles = () => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeActionId, setActiveActionId] = useState(null);
  const [approvalModalProfile, setApprovalModalProfile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchTerm]);

  useEffect(() => {
    let isMounted = true;

    const loadProfiles = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const params = new URLSearchParams();

        if (debouncedSearchTerm) {
          params.set('full_name', debouncedSearchTerm);
        }

        const response = await apiRequest(
          `/api/admin/profiles/index${params.toString() ? `?${params.toString()}` : ''}`,
          {
          token,
          },
        );

        if (isMounted) {
          setProfiles(response?.data?.data || []);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message || t('admin.profiles_load_failed', 'Failed to load profiles.'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (token) {
      loadProfiles();
    }

    return () => {
      isMounted = false;
    };
  }, [debouncedSearchTerm, t, token]);

  const handleStatusChange = async (profileId, status) => {
    setActiveActionId(profileId);
    setErrorMessage('');

    try {
      const response = await apiRequest(`/api/admin/profiles/changeStatus/${profileId}`, {
        method: 'POST',
        token,
        data: { status }
      });

      setProfiles((currentProfiles) =>
        currentProfiles.map((profile) =>
          profile.id === profileId
            ? {
                ...profile,
                ...(response?.profile || {}),
                status: status,
                is_verified: status === 'approved',
              }
            : profile,
        ),
      );
      toast.success(t('admin.profile_status_updated', 'Profile status updated successfully!'));
    } catch (error) {
      const msg = error.message || t('admin.profile_action_failed', 'Failed to update profile status.');
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setActiveActionId(null);
    }
  };

  const handleDelete = async (profileId) => {
    if (!window.confirm(t('admin.confirm_delete_profile', 'Are you sure you want to delete this profile? This action cannot be undone.'))) {
      return;
    }

    setActiveActionId(profileId);
    setErrorMessage('');

    try {
      await apiRequest(`/api/admin/profiles/delete/${profileId}`, {
        method: 'DELETE',
        token,
      });

      setProfiles((currentProfiles) => currentProfiles.filter(p => p.id !== profileId));
      toast.success(t('admin.profile_deleted', 'Profile deleted successfully!'));
    } catch (error) {
      const msg = error.message || t('admin.profile_delete_failed', 'Failed to delete profile.');
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setActiveActionId(null);
    }
  };

  const handleStatusSelect = (profile, newStatus) => {
    if (newStatus === (profile.status || (profile.is_verified ? 'approved' : 'pending'))) return;
    
    if (newStatus === 'approved') {
      setApprovalModalProfile(profile);
    } else {
      handleStatusChange(profile.id, newStatus);
    }
  };

  const getProfileStatusBadgeClass = (status) => {
    if (status === 'approved') return 'bg-emerald-500/90';
    if (status === 'rejected') return 'bg-red-500/90';
    return 'bg-amber-500/90';
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-widest uppercase text-gray-900 dark:text-white">
          {t('admin.profiles_title', 'PROFILE MANAGEMENT')}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('admin.profiles_subtitle', 'Review owner verification profiles and approve pending submissions.')}
        </p>
      </div>

      <div className="max-w-md">
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder={t('admin.search_profiles_placeholder', 'Search profiles by full name')}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/10 dark:border-white/10 dark:bg-neutral-900 dark:text-gray-100"
        />
      </div>

      {errorMessage ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
          {errorMessage}
        </div>
      ) : null}

      <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white dark:bg-neutral-900 shadow-sm dark:border-white/10 dark:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full min-w-245 text-left text-sm">
            <thead className="border-b border-gray-200 dark:border-white/10 bg-gray-50/50 text-xs uppercase tracking-wider text-gray-500 dark:bg-transparent dark:text-brand-gold">
              <tr>
                <th className="px-6 py-4 font-semibold">{t('admin.id', 'ID')}</th>
                <th className="px-6 py-4 font-semibold">{t('admin.profile_name', 'PROFILE NAME')}</th>
                <th className="px-6 py-4 font-semibold">{t('admin.contact', 'CONTACT')}</th>
                <th className="px-6 py-4 font-semibold">{t('admin.city', 'CITY')}</th>
                <th className="px-6 py-4 font-semibold">{t('admin.national_number', 'NATIONAL NUMBER')}</th>
                <th className="px-6 py-4 font-semibold">{t('admin.status', 'STATUS')}</th>
                <th className="px-6 py-4 font-semibold text-right">{t('admin.actions', 'ACTIONS')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/5 text-gray-700 dark:text-gray-300">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    {t('admin.loading_profiles', 'Loading profiles...')}
                  </td>
                </tr>
              ) : profiles.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    {t('admin.no_profiles', 'No profiles found.')}
                  </td>
                </tr>
              ) : profiles.map((profile) => {
                const profileStatus = profile.status || (profile.is_verified ? 'approved' : 'pending');
                const needsReview = profileStatus === 'pending';

                return (
                  <tr
                    key={profile.id}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
                  >
                    <td className="whitespace-nowrap px-6 py-4">#{profile.id}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 dark:text-white">{profile.full_name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">{t('admin.dob', 'DOB')}: {profile.date_of_birth || t('admin.not_available', 'N/A')}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 dark:text-white">{profile.user?.email || t('admin.not_available', 'N/A')}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{profile.user?.phone || t('admin.not_available', 'N/A')}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">{profile.city || t('admin.not_available', 'N/A')}</td>
                    <td className="whitespace-nowrap px-6 py-4">{profile.national_number || t('admin.not_available', 'N/A')}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <select
                        value={profileStatus}
                        onChange={(e) => handleStatusSelect(profile, e.target.value)}
                        disabled={activeActionId === profile.id}
                        className={`rounded px-2 py-1 text-xs font-semibold uppercase tracking-widest text-white outline-none cursor-pointer disabled:opacity-50 ${getProfileStatusBadgeClass(profileStatus)} appearance-none text-center`}
                        style={{ textAlignLast: 'center' }}
                      >
                        <option value="pending" className="bg-white text-gray-900">{t('admin.status_pending', 'Pending')}</option>
                        <option value="approved" className="bg-white text-gray-900">{t('admin.status_approved', 'Approved')}</option>
                        <option value="rejected" className="bg-white text-gray-900">{t('admin.status_rejected', 'Rejected')}</option>
                      </select>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleDelete(profile.id)}
                          disabled={activeActionId === profile.id}
                          className="inline-flex items-center justify-center rounded-lg bg-rose-500/10 p-2 text-rose-500 transition hover:bg-rose-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 dark:bg-rose-500/20 dark:hover:bg-rose-500"
                          title={t('admin.delete', 'Delete')}
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approval Modal */}
      {approvalModalProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setApprovalModalProfile(null)}></div>
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-neutral-900 border border-gray-100 dark:border-white/10 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="text-xl font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-4">
                {t('admin.approve_profile', 'Approve Profile')}
              </h3>
              
              <div className="mb-6 rounded-2xl overflow-hidden bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-white/5">
                {approvalModalProfile.id_card_photo ? (
                  <a 
                    href={approvalModalProfile.id_card_photo} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full h-64"
                  >
                    <img 
                      src={approvalModalProfile.id_card_photo} 
                      alt="ID Card Photo" 
                      className="w-full h-full object-cover cursor-pointer transition hover:opacity-80"
                    />
                  </a>
                ) : (
                  <div className="flex h-64 items-center justify-center text-sm text-gray-500 uppercase tracking-widest">
                    {t('admin.no_id_photo', 'No ID Photo Available')}
                  </div>
                )}
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex justify-between border-b border-gray-100 dark:border-white/5 pb-2">
                  <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">{t('admin.full_name', 'Full Name')}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{approvalModalProfile.full_name}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 dark:border-white/5 pb-2">
                  <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">{t('admin.national_number', 'National Number')}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{approvalModalProfile.national_number}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 dark:border-white/5 pb-2">
                  <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">{t('admin.contact', 'Contact')}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {approvalModalProfile.user?.email || approvalModalProfile.user?.phone || t('admin.not_available', 'N/A')}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setApprovalModalProfile(null)}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-gray-700 transition hover:bg-gray-50 dark:border-white/10 dark:bg-neutral-800 dark:text-gray-300 dark:hover:bg-neutral-700 cursor-pointer"
                >
                  {t('admin.cancel', 'Cancel')}
                </button>
                <button
                  onClick={() => {
                    handleStatusChange(approvalModalProfile.id, 'approved');
                    setApprovalModalProfile(null);
                  }}
                  disabled={activeActionId === approvalModalProfile.id}
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

export default Profiles;
