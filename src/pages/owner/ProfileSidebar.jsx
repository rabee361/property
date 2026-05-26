import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  FaAngleLeft, 
  FaAngleRight, 
  FaSignOutAlt, 
  FaSun, 
  FaMoon, 
  FaBuilding, 
  FaUserEdit,
  FaHome,
  FaLock
} from 'react-icons/fa';
import brandIcon from '../../assets/icon.webp';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const ProfileSidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  const isRtl = i18n.dir() === 'rtl';

  const navItems = [
    { name: t('profile.my_properties', 'My Properties'), path: '/owner', icon: FaBuilding },
    { name: t('profile.profile_info', 'Profile Info'), path: '/owner/info', icon: FaUserEdit },
    { name: t('profile.change_password', 'Change Password'), path: '/owner/change-password', icon: FaLock },
  ];

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      {/* Mobile backdrop overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar sidebar */}
      <aside
        className={`fixed top-0 bottom-0 z-40 flex h-full flex-col bg-neutral-900
        transition-all duration-300 border-r border-white/10
        ${collapsed ? 'w-20' : 'w-64'}
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${isRtl ? 'right-0 border-l border-r-0' : 'left-0'}
        `}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-evenly px-4 border-b border-white/10">
          {!collapsed && (
            <Link to="/" className="flex items-center gap-1 overflow-hidden" onClick={() => setMobileOpen(false)}>
              <img src={brandIcon} alt="Brand Icon" className="h-10 w-auto" />
            </Link>
          )}

          {/* Desktop collapse toggle */}
          <button
            onClick={handleToggleCollapse}
            className={`hidden md:flex h-6 w-6 items-center justify-center rounded-md bg-white/10 text-gray-400 hover:text-white ${collapsed ? 'mx-auto mt-0' : ''}`}
          >
            {collapsed ? (
              <FaAngleRight className="h-4 w-4" />
            ) : (
              <FaAngleLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-3">
          {navItems.map((item) => {
             // For dashboard/index use exact match, for others use startsWith to keep active state on sub-pages
            const isActive = item.path === '/owner' 
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center rounded-lg px-3 py-3 transition-colors ${
                  isActive
                    ? 'bg-brand-gold text-white shadow-md'
                    : 'text-gray-400 hover:bg-white/10 hover:text-white'
                } ${collapsed ? 'justify-center' : ''}`}
              >
                <item.icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-white' : ''}`} />
                {!collapsed && (
                  <span className="ml-3 rtl:ml-0 rtl:mr-3 text-sm font-medium tracking-wide uppercase">
                    {item.name}
                  </span>
                )}
              </Link>
            )
          })}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 p-3 flex flex-col gap-2">
          
          {/* Back to Home */}
          <Link
            to="/"
            className={`flex w-full items-center rounded-lg px-3 py-3 text-gray-400 hover:bg-white/10 hover:text-white transition-colors ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <FaHome className="h-5 w-5 shrink-0" />
            {!collapsed && (
              <span className="ml-3 rtl:ml-0 rtl:mr-3 text-sm tracking-wide uppercase">
                {t('profile.back_to_home', 'BACK TO HOME')}
              </span>
            )}
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`flex w-full items-center rounded-lg px-3 py-3 text-gray-400 transition-colors hover:bg-admin-sidebar-hover hover:text-white ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            {theme === 'dark' ? (
              <FaSun className="h-5 w-5 shrink-0" />
            ) : (
              <FaMoon className="h-5 w-5 shrink-0" />
            )}
            {!collapsed && (
              <span className="ml-3 rtl:ml-0 rtl:mr-3 text-sm tracking-wide uppercase">
                {theme === 'dark' ? t('admin.light_mode', 'LIGHT MODE') : t('admin.dark_mode', 'DARK MODE')}
              </span>
            )}
          </button>

          {/* Logout */}
          <button
            onClick={() => {
              void logout()
            }}
            className={`flex w-full items-center rounded-lg px-3 py-3 text-gray-400 hover:bg-white/10 hover:text-white transition-colors ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <FaSignOutAlt className="h-5 w-5 shrink-0" />
            {!collapsed && (
              <span className="ml-3 rtl:ml-0 rtl:mr-3 text-sm tracking-wide uppercase">
                {t('profile.logout', 'LOGOUT')}
              </span>
            )}
          </button>
          
        </div>
      </aside>
    </>
  );
};

export default ProfileSidebar;
