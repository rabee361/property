import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaGlobe } from 'react-icons/fa';
import brandIcon from '../../assets/icon.webp';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(nextLang);
  };

  const navLinks = [
    { name: t('nav.owner'), href: '/owner' },
    { name: t('nav.home'), href: '#home' },
    { name: t('nav.properties'), href: '#properties' },
    { name: t('nav.about'), href: '#about' },
    { name: t('nav.services'), href: '#services' },
    { name: t('nav.contact'), href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-admin-sidebar shadow-md py-4' 
          : 'bg-linear-to-b from-black/80 to-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3">
          <img src={brandIcon} alt="Brand Icon" className="h-10 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6 xl:space-x-8">
          {navLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              className="text-white/90 text-[13px] uppercase tracking-widest font-medium hover:text-brand-gold transition-colors"
            >
              {link.name}
            </a>
          ))}

          {isAuthenticated ? (
            <>
              <Link
                to={isAdmin ? '/admin' : '/owner'}
                className="text-white/90 text-[13px] uppercase tracking-widest font-medium hover:text-brand-gold transition-colors"
              >
                {isAdmin ? t('auth.admin_login_link', 'Admin Login') : t('nav.owner')}
              </Link>
              <button
                type="button"
                onClick={logout}
                className="px-5 py-2 border border-brand-gold text-brand-gold text-[13px] uppercase tracking-widest font-medium hover:bg-brand-gold hover:text-brand-dark transition-all duration-300 cursor-pointer"
              >
                {t('profile.logout', 'Logout')}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white/90 text-[13px] uppercase tracking-widest font-medium hover:text-brand-gold transition-colors"
              >
                {t('nav.login')}
              </Link>

              <Link
                to="/signup"
                className="px-5 py-2 border border-brand-gold text-brand-gold text-[13px] uppercase tracking-widest font-medium hover:bg-brand-gold hover:text-brand-dark transition-all duration-300"
              >
                {t('nav.signup')}
              </Link>
            </>
          )}

          <button
            onClick={toggleLanguage}
            className="text-white hover:text-brand-gold transition-colors p-2"
          >
            <FaGlobe className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white p-2"
          >
            {isMobileMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-admin-sidebar/95 backdrop-blur-md transition-all duration-300 flex flex-col items-center py-6 space-y-5 border-t border-white/10 ${
          isMobileMenuOpen ? 'opacity-100 visible shadow-xl' : 'opacity-0 invisible'
        }`}
      >
        {navLinks.map((link, idx) => (
          <a
            key={idx}
            href={link.href}
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-white text-sm uppercase tracking-widest hover:text-brand-gold transition-colors"
          >
            {link.name}
          </a>
        ))}
        {isAuthenticated ? (
          <>
            <Link
              to={isAdmin ? '/admin' : '/owner'}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white text-sm uppercase tracking-widest hover:text-brand-gold transition-colors"
            >
              {isAdmin ? t('auth.admin_login_link', 'Admin Login') : t('nav.owner')}
            </Link>
            <button
              type="button"
              onClick={() => {
                logout();
                setIsMobileMenuOpen(false);
              }}
              className="px-5 py-2 border border-brand-gold text-brand-gold text-sm uppercase tracking-widest hover:bg-brand-gold hover:text-brand-dark transition-all duration-300"
            >
              {t('profile.logout', 'Logout')}
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white text-sm uppercase tracking-widest hover:text-brand-gold transition-colors"
            >
              {t('nav.login')}
            </Link>
            <Link
              to="/signup"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-5 py-2 border border-brand-gold text-brand-gold text-sm uppercase tracking-widest hover:bg-brand-gold hover:text-brand-dark transition-all duration-300"
            >
              {t('nav.signup')}
            </Link>
          </>
        )}
        <button
          onClick={() => {
            toggleLanguage();
            setIsMobileMenuOpen(false);
          }}
          className="text-brand-gold flex items-center space-x-2 pt-2"
        >
          <FaGlobe className="w-5 h-5" />
          <span className="uppercase text-sm tracking-widest">
            {i18n.language === 'en' ? 'العربية' : 'English'}
          </span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;