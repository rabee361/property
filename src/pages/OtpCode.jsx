import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { FaGlobe, FaArrowLeft } from 'react-icons/fa';
import heroBg from '../assets/hero.jpg';
import brandIcon from '../assets/icon.webp';

const OtpCode = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newCode = [...code];
    newCode[index] = value.substring(value.length - 1);
    setCode(newCode);

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 6).split('');
    if (pasteData.some(isNaN)) return;

    const newCode = [...code];
    pasteData.forEach((char, idx) => {
      newCode[idx] = char;
    });
    setCode(newCode);

    const lastFilledIndex = pasteData.length - 1;
    if (lastFilledIndex < 5) {
      inputs.current[lastFilledIndex + 1].focus();
    } else {
      inputs.current[5].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullCode = code.join('');
    console.log('Verifying OTP:', fullCode);
    navigate('/change-password');
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
          <Link to="/otp-email" className="absolute top-6 left-6 rtl:left-auto rtl:right-6 text-white/70 hover:text-white transition-colors">
            <FaArrowLeft className="w-5 h-5 rtl:rotate-180" />
          </Link>

          <div className="flex justify-center mb-6">
            <Link to="/"><img src={brandIcon} alt="Brand" className="h-12 w-auto" /></Link>
          </div>

          <h1 className="text-2xl font-light text-white text-center uppercase tracking-widest mb-2">
            {t('auth.otp_code_title', 'Enter OTP')}
          </h1>
          <p className="text-white/80 text-sm text-center mb-8">
            {t('auth.otp_code_subtitle', 'We sent a 6-digit code to your email')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between gap-1 sm:gap-2" dir="ltr">
              {code.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  ref={(el) => (inputs.current[index] = el)}
                  value={data}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  className="w-10 h-12 sm:w-12 sm:h-14 bg-transparent text-white text-center text-xl font-semibold border border-white/30 rounded-lg focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30 transition-colors"
                />
              ))}
            </div>
            <button type="submit" className="w-full py-3 bg-brand-gold text-white text-xs uppercase tracking-widest-extra font-semibold rounded-lg hover:bg-brand-gold/90 transition-all duration-300 mt-2 cursor-pointer shadow-md">
              {t('auth.verify_btn', 'Verify Code')}
            </button>
          </form>

          <p className="text-center text-sm text-white/80 mt-6">
            {t('auth.didnt_receive', "Didn't receive code?")}{' '}
            <button type="button" className="text-brand-gold font-semibold hover:underline">
              {t('auth.resend_code', 'Resend Code')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtpCode;
