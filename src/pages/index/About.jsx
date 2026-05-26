import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import heroImg from '../../assets/hero.jpg';

const About = () => {
  const { t } = useTranslation();

  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left: Image */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-square md:aspect-[4/3] lg:aspect-square">
              <img 
                src={heroImg} 
                alt={t('about.section_title')} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-brand-dark/10"></div>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-brand-gold/10 rounded-full blur-2xl -z-10 hidden md:block"></div>
            <div className="absolute -top-6 -left-6 w-48 h-48 bg-brand-accent/5 rounded-full blur-3xl -z-10 hidden md:block"></div>
          </motion.div>

          {/* Right: Content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="w-full lg:w-1/2 flex flex-col justify-center"
          >
            <h2 className="text-sm font-semibold text-brand-gold uppercase tracking-widest mb-3">
              {t('about.section_title')}
            </h2>
            <h3 className="text-3xl md:text-5xl font-light text-brand-dark leading-tight mb-8">
              {t('nav.brand')}
            </h3>
            
            <div className="space-y-6 text-gray-600 text-lg leading-relaxed font-light">
              <p>
                {t('about.text_1')}
              </p>
              <p>
                {t('about.text_2')}
              </p>
            </div>
            
            <div className="mt-10 flex items-center gap-8">
              <div className="flex flex-col">
                <span className="text-4xl font-light text-brand-dark mb-1">10+</span>
                <span className="text-xs uppercase tracking-widest text-gray-500">Years Exp</span>
              </div>
              <div className="w-px h-12 bg-gray-200"></div>
              <div className="flex flex-col">
                <span className="text-4xl font-light text-brand-dark mb-1">250+</span>
                <span className="text-xs uppercase tracking-widest text-gray-500">Properties</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;
