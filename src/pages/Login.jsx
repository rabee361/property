import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaGlobe } from 'react-icons/fa';
import heroBg from '../assets/hero.jpg';
import brandIcon from '../assets/icon.webp';
import { useAuth } from '../context/AuthContext';

const Login = ({ mode = 'user' }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { loginAdmin, loginUser } = useAuth();
  const isAdminMode = mode === 'admin';
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setErrorMessage('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      if (isAdminMode) {
        await loginAdmin(formData);
        navigate('/admin', { replace: true });
        return;
      }

      await loginUser(formData);
      navigate(location.state?.from || '/owner', { replace: true });
    } catch (error) {
      setErrorMessage(error.message || t('auth.login_failed', 'Login failed.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(nextLang);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background Image */}
      <img
        src={heroBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-black/70"></div>

      {/* Floating Language Toggle */}
      <button
        onClick={toggleLanguage}
        className="absolute top-6 right-6 rtl:right-auto rtl:left-6 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-300 cursor-pointer"
      >
        <FaGlobe className="w-4 h-4" />
        <span className="text-xs uppercase tracking-widest">
          {i18n.language === 'en' ? '\u0627\u0644\u0639\u0631\u0628\u064a\u0629' : 'English'}
        </span>
      </button>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-4 my-8">
        <div className="bg-white/40 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-10">
          {/* Brand Logo */}
          <div className="flex justify-center mb-6">
            <Link to="/">
              <img src={brandIcon} alt="Brand" className="h-12 w-auto" />
            </Link>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-light text-white text-center uppercase tracking-widest mb-2">
            {isAdminMode
              ? t('auth.admin_login_title', 'ADMIN ACCESS')
              : t('auth.login_title')}
          </h1>
          <p className="text-white/80 text-sm text-center mb-8">
            {isAdminMode
              ? t('auth.admin_login_subtitle', 'Sign in with your admin credentials')
              : t('auth.login_subtitle')}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute top-1/2 -translate-y-1/2 left-4 rtl:left-auto rtl:right-4 text-white/60 w-4 h-4" />
              <input
                type="email"
                name="email"
                placeholder={t('auth.email')}
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-11 rtl:pl-4 rtl:pr-11 pr-4 py-3 bg-transparent text-white placeholder:text-white/60 border border-white/30 rounded-lg text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30 transition-colors"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FaLock className="absolute top-1/2 -translate-y-1/2 left-4 rtl:left-auto rtl:right-4 text-white/60 w-4 h-4" />
              <input
                type="password"
                name="password"
                placeholder={t('auth.password')}
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-11 rtl:pl-4 rtl:pr-11 pr-4 py-3 bg-transparent text-white placeholder:text-white/60 border border-white/30 rounded-lg text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30 transition-colors"
              />
            </div>

            {errorMessage ? (
              <p className="rounded-lg border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                {errorMessage}
              </p>
            ) : null}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-brand-gold text-white text-xs uppercase tracking-widest-extra font-semibold rounded-lg hover:bg-brand-gold/90 transition-all duration-300 cursor-pointer"
            >
              {isSubmitting
                ? t('auth.logging_in', 'Signing In...')
                : isAdminMode
                  ? t('auth.admin_login_btn', 'ADMIN LOGIN')
                  : t('auth.login_btn')}
            </button>
          </form>

          {/* Footer Link */}
          {isAdminMode ? (
            <p className="text-center text-sm text-white/80 mt-6">
              {t('auth.owner_login_prompt', 'Need the owner portal instead?')}{' '}
              <Link to="/login" className="text-brand-gold font-semibold hover:underline">
                {t('auth.owner_login_link', 'Owner Login')}
              </Link>
            </p>
          ) : (
            <>
              <p className="text-center text-sm text-white/80 mt-6">
                {t('auth.no_account')}{' '}
                <Link to="/signup" className="text-brand-gold font-semibold hover:underline">
                  {t('auth.signup_link')}
                </Link>
              </p>
              <p className="text-center text-sm text-white/70 mt-3">
                {t('auth.admin_login_prompt', 'Are you an admin?')}{' '}
                <Link to="/admin/login" className="text-brand-gold font-semibold hover:underline">
                  {t('auth.admin_login_link', 'Admin Login')}
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
