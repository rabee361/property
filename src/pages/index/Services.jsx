import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaBuilding, FaMapMarkedAlt, FaHome, FaPaintBrush } from 'react-icons/fa';

const Services = () => {
  const { t } = useTranslation();

  const services = [
    {
      id: 1,
      icon: FaBuilding,
      title: "Years of Experience in Property Development",
      description: "With years of experience in property development investment, marketing, renovating, property management and residential sales, we are a company that is committed to each client's best interests.",
    },
    {
      id: 2,
      icon: FaMapMarkedAlt,
      title: "Strategic Locations for Investment and Lifestyle",
      description: "When choosing locations to build, we carefully select areas with highest potential in market growth, close proximity to the essential amenities, and with the most pleasant view and atmosphere.",
    },
    {
      id: 3,
      icon: FaHome,
      title: "Truly Liveable and Enjoyable Residences",
      description: "The 2 and 3 bedroom apartments have been carefully designed to maximise the available space. They are both inspired and sensible. They offer open, spacious living areas with full height and full width thermal glazed windows, expansive balconies, extensive storage in the bedrooms and kitchen and quality floor ceramics in all areas.",
    },
    {
      id: 4,
      icon: FaPaintBrush,
      title: "Aesthetic Designs Infused with Build Quality",
      description: "Attractive developments which are both economically viable and aesthetically pleasing. Developments which are consistently innovative and environmentally responsible in their design, construction and sustainability. Management and construction in line with European industry standards and quality assurance principles.",
    },
  ];

  return (
    <section id="services" className="bg-white py-20 transition-colors duration-300 dark:bg-neutral-900">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-light uppercase tracking-widest text-brand-dark dark:text-white md:text-4xl">
            {t('services.section_title')}
          </h2>
          <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
            {t('services.section_subtitle')}
          </p>
          <div className="w-24 h-1 bg-brand-gold mx-auto"></div>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12 mt-16">
          {services.map((item, index) => (
            <motion.div 
              key={item.id} 
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex items-start gap-5"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-brand-gold/10 dark:bg-brand-gold/15">
                <item.icon className="w-7 h-7 text-brand-gold" />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-brand-dark dark:text-white">{item.title}</h3>
                <p className="text-sm font-light leading-relaxed text-gray-500 dark:text-gray-400">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
