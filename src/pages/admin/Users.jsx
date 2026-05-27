import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../lib/api';

const Profiles = () => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeActionId, setActiveActionId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadProfiles = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await apiRequest('/api/admin/profiles/index', {
          token,
        });

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
  }, [t, token]);

  const handleProfileAction = async (profileId, action) => {
    setActiveActionId(profileId);
    setErrorMessage('');

    try {
      const response = await apiRequest(`/api/admin/profiles/${action}/${profileId}`, {
        method: action === 'approve' ? 'POST' : 'DELETE',
        token,
      });

      setProfiles((currentProfiles) =>
        currentProfiles.map((profile) =>
          profile.id === profileId
            ? {
                ...profile,
                ...(response?.profile || {}),
                is_verified: action === 'approve',
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
                  <td colSpan="6" className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    {t('admin.loading_profiles', 'Loading profiles...')}
                  </td>
                </tr>
              ) : profiles.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    {t('admin.no_profiles', 'No profiles found.')}
                  </td>
                </tr>
              ) : profiles.map((profile) => (
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
                    <span 
                      className={`rounded px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white ${
                        profile.is_verified ? 'bg-emerald-500/90' : 'bg-amber-500/90'
                      }`}
                    >
                      {profile.is_verified ? t('admin.verified', 'Verified') : t('admin.pending', 'Pending')}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {profile.is_verified ? (
                        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                          {t('admin.no_action_needed', 'No Action Needed')}
                        </span>
                      ) : (
                        <>
                          <button
                            onClick={() => handleProfileAction(profile.id, 'approve')}
                            disabled={activeActionId === profile.id}
                            className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <FaCheck className="h-3 w-3" />
                            {t('admin.approve', 'Approve')}
                          </button>
                          <button
                            onClick={() => handleProfileAction(profile.id, 'reject')}
                            disabled={activeActionId === profile.id}
                            className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <FaTimes className="h-3 w-3" />
                            {t('admin.reject', 'Reject')}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Profiles;
