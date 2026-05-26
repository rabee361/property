import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTag, FaTimesCircle, FaUserShield, FaWarehouse } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../lib/api';

const Dashboard = () => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [statsData, setStatsData] = useState({
    profiles: 0,
    sale_properties: 0,
    rent_properties: 0,
    rejected_properties: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await apiRequest('/api/admin/stats/index', {
          token,
        });

        if (isMounted) {
          setStatsData(response?.stats || {});
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message || t('admin.stats_load_failed', 'Failed to load dashboard stats.'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (token) {
      loadStats();
    }

    return () => {
      isMounted = false;
    };
  }, [t, token]);

  const statCards = [
    { 
      label: t('admin.profiles_count', 'Profiles'), 
      value: statsData.profiles, 
      icon: FaUserShield, 
      color: 'text-brand-gold',
      bgColor: 'bg-brand-gold/10'
    },
    { 
      label: t('admin.sale_properties', 'Sale Properties'), 
      value: statsData.sale_properties, 
      icon: FaTag, 
      color: 'text-brand-gold',
      bgColor: 'bg-brand-gold/10'
    },
    { 
      label: t('admin.rent_properties', 'Rent Properties'), 
      value: statsData.rent_properties, 
      icon: FaWarehouse, 
      color: 'text-brand-gold',
      bgColor: 'bg-brand-gold/10'
    },
    { 
      label: t('admin.rejected_properties', 'Rejected Properties'), 
      value: statsData.rejected_properties, 
      icon: FaTimesCircle, 
      color: 'text-brand-gold',
      bgColor: 'bg-brand-gold/10'
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-widest uppercase text-gray-900 dark:text-white">
          {t('admin.dashboard_title', 'DASHBOARD')}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('admin.dashboard_subtitle', 'Overview and key metrics')}
        </p>
      </div>

      {errorMessage ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
          {errorMessage}
        </div>
      ) : null}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div 
            key={idx} 
            className="rounded-xl border border-gray-200 bg-white dark:bg-neutral-900 p-6 shadow-sm transition-all hover:shadow-md dark:border-white/10 dark:shadow-none"
          >
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${stat.bgColor} ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{isLoading ? '...' : stat.value}</p>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
