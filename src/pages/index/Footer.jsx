import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import brandIcon from '../../assets/icon.webp';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#0b0f17] text-white pt-20 pb-10 border-t border-white/10">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Info */}
          <div className="col-span-1 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img src={brandIcon} alt="Brand Icon" className="h-10 w-auto opacity-90" />
              <span className="text-white text-xl font-bold tracking-widest uppercase">
                {t('nav.brand')}
              </span>
            </Link>
            <p className="text-gray-400 text-sm font-light leading-relaxed mb-8">
              {t('footer.desc')}
            </p>
            {/* Socials */}
            <div className="flex space-x-4 rtl:space-x-reverse">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-brand-gold hover:text-brand-dark transition-all duration-300">
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-brand-gold hover:text-brand-dark transition-all duration-300">
                <FaInstagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-brand-gold hover:text-brand-dark transition-all duration-300">
                <FaTwitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold uppercase tracking-wider mb-6 text-white/90">
              {t('footer.quick_links')}
            </h4>
            <ul className="space-y-3">
              <li><a href="#home" className="text-gray-400 hover:text-brand-gold text-sm transition-colors">{t('nav.home')}</a></li>
              <li><a href="#properties" className="text-gray-400 hover:text-brand-gold text-sm transition-colors">{t('nav.properties')}</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-brand-gold text-sm transition-colors">{t('nav.about')}</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-brand-gold text-sm transition-colors">{t('nav.services')}</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1 lg:col-span-2">
            <h4 className="text-lg font-semibold uppercase tracking-wider mb-6 text-white/90">
              {t('footer.contact_info')}
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <FaMapMarkerAlt className="w-5 h-5 text-brand-gold mt-0.5 shrink-0" />
                <span className="text-gray-400 text-sm">{t('footer.address')}</span>
              </div>
              <div className="flex items-center gap-4">
                <FaPhoneAlt className="w-5 h-5 text-brand-gold shrink-0" />
                <span className="text-gray-400 text-sm ltr:font-sans">{t('footer.phone')}</span>
              </div>
              <div className="flex items-center gap-4">
                <FaEnvelope className="w-5 h-5 text-brand-gold shrink-0" />
                <span className="text-gray-400 text-sm font-sans">{t('footer.email')}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-white/10 text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            {t('footer.copyright')}
          </p>
          <div className="flex space-x-6 rtl:space-x-reverse text-xs text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
