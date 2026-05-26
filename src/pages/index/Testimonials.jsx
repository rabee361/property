import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import avatar from '../../assets/avatar.png';

const Testimonials = () => {
  const { t, i18n } = useTranslation();
  const [isPaused, setIsPaused] = useState(false);

  const isRtl = i18n.dir() === 'rtl';

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      nameAr: "\u0633\u0627\u0631\u0629 \u062c\u0648\u0646\u0633\u0648\u0646",
      rating: 5,
      text: "Exceptional service! They helped us find our dream home in just two weeks. The team was professional and attentive to every detail.",
      textAr: "\u062e\u062f\u0645\u0629 \u0627\u0633\u062a\u062b\u0646\u0627\u0626\u064a\u0629! \u0633\u0627\u0639\u062f\u0648\u0646\u0627 \u0641\u064a \u0627\u0644\u0639\u062b\u0648\u0631 \u0639\u0644\u0649 \u0645\u0646\u0632\u0644 \u0623\u062d\u0644\u0627\u0645\u0646\u0627 \u0641\u064a \u0623\u0633\u0628\u0648\u0639\u064a\u0646 \u0641\u0642\u0637. \u0643\u0627\u0646 \u0627\u0644\u0641\u0631\u064a\u0642 \u0645\u062d\u062a\u0631\u0641\u0627\u064b \u0648\u0645\u0647\u062a\u0645\u0627\u064b \u0628\u0643\u0644 \u0627\u0644\u062a\u0641\u0627\u0635\u064a\u0644.",
    },
    {
      id: 2,
      name: "Ahmed Al-Rashid",
      nameAr: "\u0623\u062d\u0645\u062f \u0627\u0644\u0631\u0627\u0634\u062f",
      rating: 5,
      text: "The best real estate experience I've ever had. Their market knowledge is unmatched and they negotiated an excellent deal for us.",
      textAr: "\u0623\u0641\u0636\u0644 \u062a\u062c\u0631\u0628\u0629 \u0639\u0642\u0627\u0631\u064a\u0629 \u0645\u0631\u0631\u062a \u0628\u0647\u0627. \u0645\u0639\u0631\u0641\u062a\u0647\u0645 \u0628\u0627\u0644\u0633\u0648\u0642 \u0644\u0627 \u0645\u062b\u064a\u0644 \u0644\u0647\u0627 \u0648\u062a\u0641\u0627\u0648\u0636\u0648\u0627 \u0639\u0644\u0649 \u0635\u0641\u0642\u0629 \u0645\u0645\u062a\u0627\u0632\u0629 \u0644\u0646\u0627.",
    },
    {
      id: 3,
      name: "Maria Santos",
      nameAr: "\u0645\u0627\u0631\u064a\u0627 \u0633\u0627\u0646\u062a\u0648\u0633",
      rating: 4,
      text: "Very impressed with the quality of listings and the transparency throughout the process. Highly recommended for luxury properties.",
      textAr: "\u0645\u0639\u062c\u0628\u0629 \u062c\u062f\u0627\u064b \u0628\u062c\u0648\u062f\u0629 \u0627\u0644\u0639\u0631\u0648\u0636 \u0648\u0627\u0644\u0634\u0641\u0627\u0641\u064a\u0629 \u062e\u0644\u0627\u0644 \u0627\u0644\u0639\u0645\u0644\u064a\u0629. \u0623\u0646\u0635\u062d \u0628\u0647\u0645 \u0628\u0634\u062f\u0629 \u0644\u0644\u0639\u0642\u0627\u0631\u0627\u062a \u0627\u0644\u0641\u0627\u062e\u0631\u0629.",
    },
    {
      id: 4,
      name: "Omar Khaled",
      nameAr: "\u0639\u0645\u0631 \u062e\u0627\u0644\u062f",
      rating: 5,
      text: "From the first consultation to closing the deal, everything was seamless. Their dedication to client satisfaction is remarkable.",
      textAr: "\u0645\u0646 \u0627\u0644\u0627\u0633\u062a\u0634\u0627\u0631\u0629 \u0627\u0644\u0623\u0648\u0644\u0649 \u062d\u062a\u0649 \u0625\u062a\u0645\u0627\u0645 \u0627\u0644\u0635\u0641\u0642\u0629\u060c \u0643\u0644 \u0634\u064a\u0621 \u0643\u0627\u0646 \u0633\u0644\u0633\u0627\u064b. \u062a\u0641\u0627\u0646\u064a\u0647\u0645 \u0641\u064a \u0625\u0631\u0636\u0627\u0621 \u0627\u0644\u0639\u0645\u0644\u0627\u0621 \u0645\u0630\u0647\u0644.",
    },
    {
      id: 5,
      name: "Elena Petrova",
      nameAr: "\u0625\u064a\u0644\u064a\u0646\u0627 \u0628\u064a\u062a\u0631\u0648\u0641\u0627",
      rating: 5,
      text: "Outstanding portfolio of premium properties. The virtual tours and detailed descriptions made our search so much easier.",
      textAr: "\u0645\u062c\u0645\u0648\u0639\u0629 \u0631\u0627\u0626\u0639\u0629 \u0645\u0646 \u0627\u0644\u0639\u0642\u0627\u0631\u0627\u062a \u0627\u0644\u0645\u0645\u064a\u0632\u0629. \u0627\u0644\u062c\u0648\u0644\u0627\u062a \u0627\u0644\u0627\u0641\u062a\u0631\u0627\u0636\u064a\u0629 \u0648\u0627\u0644\u0623\u0648\u0635\u0627\u0641 \u0627\u0644\u062a\u0641\u0635\u064a\u0644\u064a\u0629 \u062c\u0639\u0644\u062a \u0628\u062d\u062b\u0646\u0627 \u0623\u0633\u0647\u0644 \u0628\u0643\u062b\u064a\u0631.",
    },
    {
      id: 6,
      name: "Khaled Mansour",
      nameAr: "\u062e\u0627\u0644\u062f \u0645\u0646\u0635\u0648\u0631",
      rating: 4,
      text: "Professional team with deep market expertise. They guided us through every step and found us the perfect investment property.",
      textAr: "\u0641\u0631\u064a\u0642 \u0645\u062d\u062a\u0631\u0641 \u0628\u062e\u0628\u0631\u0629 \u0639\u0645\u064a\u0642\u0629 \u0641\u064a \u0627\u0644\u0633\u0648\u0642. \u0623\u0631\u0634\u062f\u0648\u0646\u0627 \u0641\u064a \u0643\u0644 \u062e\u0637\u0648\u0629 \u0648\u0648\u062c\u062f\u0648\u0627 \u0644\u0646\u0627 \u0627\u0644\u0639\u0642\u0627\u0631 \u0627\u0644\u0627\u0633\u062a\u062b\u0645\u0627\u0631\u064a \u0627\u0644\u0645\u062b\u0627\u0644\u064a.",
    },
  ];

  const duplicated = [...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="py-20 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-light text-brand-dark uppercase tracking-widest mb-4">
            {t('testimonials.section_title')}
          </h2>
          <div className="w-24 h-1 bg-brand-gold mx-auto"></div>
        </motion.div>
      </div>

      {/* Carousel */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className={`flex gap-6 ${isRtl ? 'animate-scroll-rtl' : 'animate-scroll'}`}
          style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
        >
          {duplicated.map((item, index) => {
            const displayName = i18n.language === 'ar' ? item.nameAr : item.name;
            const displayText = i18n.language === 'ar' ? item.textAr : item.text;

            return (
              <div
                key={`${item.id}-${index}`}
                className="min-w-[300px] max-w-[300px] bg-white rounded-xl p-6 shadow-md border border-gray-100 flex flex-col gap-4 shrink-0"
              >
                {/* Avatar + Name + Stars */}
                <div className="flex items-center gap-4">
                  <img
                    src={avatar}
                    alt={displayName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-brand-gold/30"
                  />
                  <div>
                    <h4 className="font-semibold text-brand-dark text-sm">
                      {displayName}
                    </h4>
                    <div className="flex gap-0.5 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= item.rating ? 'text-brand-gold' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Opinion Text */}
                <p className="text-gray-600 text-sm leading-relaxed font-light">
                  {displayText}
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

export default Testimonials;
