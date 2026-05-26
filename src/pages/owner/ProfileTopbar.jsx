import { FaBars } from 'react-icons/fa';
import avatarImg from '../../assets/avatar.png';
import { useAuth } from '../../context/AuthContext';

const ProfileTopbar = ({ collapsed, onMenuClick }) => {
  const { user } = useAuth();

  return (
    <div className={`sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b 
      bg-white dark:bg-neutral-900 border-gray-200 dark:border-white/10 
      px-4 sm:px-6 shadow-sm dark:shadow-none transition-colors duration-300`}
    >
      <div className="flex items-center">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="mr-4 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white md:hidden"
        >
          <span className="sr-only">Open sidebar</span>
          <FaBars className="h-6 w-6" />
        </button>
        {/* Optional Page Title can go here, but omitted to match admin topbar */}
      </div>

      <div className="flex items-center gap-4">
        {/* User Info */}
        <div className="flex items-center gap-3">
          <span className="text-gray-900 dark:text-white font-medium text-sm hidden md:block">
            {user?.name || 'Owner'}
          </span>
          <img
            src={avatarImg}
            alt="User Avatar"
            className="h-10 w-10 rounded-full border-2 border-brand-gold object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileTopbar;
