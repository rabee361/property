import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../lib/api';

const Notifications = () => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadNotifications = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await apiRequest('/api/notifications/mine', {
          token,
        });

        if (isMounted) {
          setNotifications(response?.notifications || []);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message || t('profile.notifications_load_failed', 'Failed to load notifications.'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (token) {
      loadNotifications();
    }

    return () => {
      isMounted = false;
    };
  }, [t, token]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-widest uppercase text-gray-900 dark:text-white">
          {t('profile.notifications_title', 'NOTIFICATIONS')}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('profile.notifications_subtitle', 'Stay updated with your property status and account activities.')}
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
                <th className="px-6 py-4 font-semibold">{t('profile.notifications_timestamp', 'TIMESTAMP')}</th>
                <th className="px-6 py-4 font-semibold">{t('profile.notifications_subject', 'TITLE')}</th>
                <th className="px-6 py-4 font-semibold">{t('profile.notifications_content', 'CONTENT')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/5 text-gray-700 dark:text-gray-300">
              {isLoading ? (
                <tr>
                  <td colSpan="3" className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    {t('profile.loading_notifications', 'Loading notifications...')}
                  </td>
                </tr>
              ) : notifications.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    {t('profile.no_notifications', 'No notifications found.')}
                  </td>
                </tr>
              ) : (
                notifications.map((notification) => (
                  <tr 
                    key={notification.id} 
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {formatDate(notification.timestamp)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {notification.title}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
                        {notification.content}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
