import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const ChangePassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { accountType, changePassword } = useAuth();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [showPwd, setShowPwd] = useState({
    new: false,
    confirm: false
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const toggleVisibility = (field) => {
    setShowPwd(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage(t('auth.passwords_do_not_match', 'The password confirmation does not match.'));
      return;
    }

    try {
      setIsSubmitting(true);
      await changePassword({
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      navigate(accountType === 'admin' ? '/admin/login' : '/login', { replace: true });
    } catch (error) {
      setErrorMessage(error.message || t('auth.change_password_failed', 'Failed to update the password.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-neutral-900 md:p-10">
        <div className="mb-8 flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-gold/10 text-brand-gold">
            <FaLock className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-widest text-gray-900 dark:text-white">
            {t('auth.change_password_title', 'Change Password')}
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {t('auth.change_password_subtitle', 'Securely update your password')}
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.24em] text-brand-gold">
              {t('auth.change_password_hint', 'You will be logged out after the password is updated.')}
            </p>
          </div>
        </div>

        {errorMessage ? (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
            {errorMessage}
          </div>
        ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="relative">
              <FaLock className="absolute top-1/2 -translate-y-1/2 left-4 rtl:left-auto rtl:right-4 text-gray-400 w-4 h-4" />
              <input
                type={showPwd.new ? "text" : "password"}
                name="newPassword"
                required
                placeholder={t('auth.new_password', 'New Password')}
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-11 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30 dark:border-white/10 dark:bg-neutral-950 dark:text-white dark:placeholder:text-gray-500"
              />
              <button type="button" onClick={() => toggleVisibility('new')} className="absolute top-1/2 -translate-y-1/2 right-4 rtl:right-auto rtl:left-4 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors cursor-pointer">
                {showPwd.new ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
              </button>
            </div>

            <div className="relative">
              <FaLock className="absolute top-1/2 -translate-y-1/2 left-4 rtl:left-auto rtl:right-4 text-gray-400 w-4 h-4" />
              <input
                type={showPwd.confirm ? "text" : "password"}
                name="confirmPassword"
                required
                placeholder={t('auth.confirm_password', 'Confirm Password')}
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-11 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30 dark:border-white/10 dark:bg-neutral-950 dark:text-white dark:placeholder:text-gray-500"
              />
              <button type="button" onClick={() => toggleVisibility('confirm')} className="absolute top-1/2 -translate-y-1/2 right-4 rtl:right-auto rtl:left-4 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors cursor-pointer">
                {showPwd.confirm ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
              </button>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-brand-gold py-3 text-xs font-semibold uppercase tracking-widest-extra text-white transition-all duration-300 mt-2 cursor-pointer shadow-md hover:bg-brand-gold/90 disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? t('auth.updating_password', 'Updating Password...') : t('auth.update_password_btn', 'Update Password')}
            </button>
          </form>
      </div>
    </div>
  );
};

export default ChangePassword;
