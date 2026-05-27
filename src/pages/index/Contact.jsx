import { motion } from 'framer-motion';
import {
  FaEnvelope,
  FaFacebookF,
  FaPhoneAlt,
  FaWhatsapp,
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const contactMethods = [
  {
    id: 'email',
    title: 'Email Us',
    value: 'info@sunshadow.sy',
    description: 'Send us your questions, listing inquiries, or partnership requests.',
    href: 'mailto:info@sunshadow.sy',
    icon: FaEnvelope,
    accent: 'from-amber-400/20 to-amber-200/5',
  },
  {
    id: 'phone',
    title: 'Call the Team',
    value: '(+963) 555-0147',
    description: 'Reach our advisors directly for availability, tours, and pricing.',
    href: 'tel:+3728456',
    icon: FaPhoneAlt,
    accent: 'from-sky-400/20 to-sky-200/5',
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp',
    value: '(+963) 555-0147',
    description: 'Chat with us for quick updates, photo requests, and viewing times.',
    href: 'https://wa.me/9635550147',
    icon: FaWhatsapp,
    accent: 'from-emerald-400/20 to-emerald-200/5',
  },
  {
    id: 'facebook',
    title: 'Facebook Page',
    value: 'facebook.com/sunshadow',
    description: 'Follow the latest property showcases, announcements, and open houses.',
    href: 'https://www.facebook.com/sunshadow',
    icon: FaFacebookF,
    accent: 'from-indigo-400/20 to-indigo-200/5',
  },
];

const Contact = () => {
  const { t, i18n } = useTranslation();

  return (
    <section id="contact" className="bg-white py-20 transition-colors duration-300 dark:bg-neutral-950">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-light uppercase tracking-widest text-brand-dark dark:text-white md:text-4xl">
            {t('contact.section_title')}
          </h2>
          <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
            {t('contact.section_subtitle')}
          </p>
          <div className="w-24 h-1 bg-brand-gold mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {contactMethods.map((method, index) => (
            <motion.a
              key={method.id}
              href={method.href}
              target={method.id === 'facebook' || method.id === 'whatsapp' ? '_blank' : undefined}
              rel={method.id === 'facebook' || method.id === 'whatsapp' ? 'noreferrer' : undefined}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.25 }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-3xl border border-black/5 bg-white p-7 shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition-shadow duration-300 hover:shadow-[0_24px_70px_rgba(15,23,42,0.14)] dark:border-white/10 dark:bg-neutral-900 dark:shadow-none"
            >
              <div
                className={`absolute inset-x-0 top-0 h-24 bg-linear-to-br ${method.accent}`}
                aria-hidden="true"
              />

              <div className="relative flex h-full flex-col">
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-dark text-white">
                  <method.icon className="h-5 w-5" />
                </div>

                <div className="mb-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-gray-400 dark:text-gray-500">
                    {method.title}
                  </p>
                  <h3 className="wrap-break-word text-xl font-semibold text-brand-dark dark:text-white">
                    {method.value}
                  </h3>
                </div>

                <p className="mb-8 flex-1 text-sm font-light leading-6 text-gray-500 dark:text-gray-400">
                  {method.description}
                </p>

              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;