import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaGlobe, FaArrowLeft } from 'react-icons/fa';
import heroBg from '../assets/hero.jpg';
import brandIcon from '../assets/icon.webp';

const OtpEmail = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sending OTP to:', email);
    navigate('/otp-code');
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(nextLang);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>

      <button onClick={toggleLanguage} className="absolute top-6 right-6 rtl:right-auto rtl:left-6 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-300 cursor-pointer">
        <FaGlobe className="w-4 h-4" />
        <span className="text-xs uppercase tracking-widest">{i18n.language === 'en' ? 'العربية' : 'English'}</span>
      </button>

      <div className="relative z-10 w-full max-w-md mx-4 my-8">
        <div className="bg-white/40 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-10">
          <Link to="/login" className="absolute top-6 left-6 rtl:left-auto rtl:right-6 text-white/70 hover:text-white transition-colors">
            <FaArrowLeft className="w-5 h-5 rtl:rotate-180" />
          </Link>

          <div className="flex justify-center mb-6">
            <Link to="/"><img src={brandIcon} alt="Brand" className="h-12 w-auto" /></Link>
          </div>

          <h1 className="text-2xl font-light text-white text-center uppercase tracking-widest mb-2">
            {t('auth.forgot_password_title', 'Forgot Password')}
          </h1>
          <p className="text-white/80 text-sm text-center mb-8">
            {t('auth.forgot_password_subtitle', 'Enter your email to receive an OTP')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <FaEnvelope className="absolute top-1/2 -translate-y-1/2 left-4 rtl:left-auto rtl:right-4 text-white/60 w-4 h-4" />
              <input
                type="email"
                name="email"
                required
                placeholder={t('auth.email', 'Email Address')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 rtl:pl-4 rtl:pr-11 pr-4 py-3 bg-transparent text-white placeholder:text-white/60 border border-white/30 rounded-lg text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30 transition-colors"
              />
            </div>
            <button type="submit" className="w-full py-3 bg-brand-gold text-white text-xs uppercase tracking-widest-extra font-semibold rounded-lg hover:bg-brand-gold/90 transition-all duration-300 mt-2 cursor-pointer shadow-md">
              {t('auth.send_otp_btn', 'Send OTP')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OtpEmail;
