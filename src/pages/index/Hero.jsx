import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';

import hero1 from '../../assets/hero.jpg';
import hero2 from '../../assets/hero2.webp';
import hero3 from '../../assets/hero3.webp';

const Hero = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 0,
      image: hero1,
      title: t('hero.slide1_title'),
      subtitle: t('hero.slide1_subtitle'),
    },
    {
      id: 1,
      image: hero2,
      title: t('hero.slide2_title'),
      subtitle: t('hero.slide2_subtitle'),
    },
    {
      id: 2,
      image: hero3,
      title: t('hero.slide3_title'),
      subtitle: t('hero.slide3_subtitle'),
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const isRtl = i18n.dir() === 'rtl';

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden bg-brand-dark">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Dark overlay matching the reference specifically towards the bottom for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end pb-32 px-10 md:px-24">
        
        {/* Animated Text Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl drop-shadow-xl"
          >
            <h1 className="text-4xl md:text-6xl font-light text-white uppercase tracking-widest-extra mb-4 leading-tight bg-black/30 backdrop-blur-sm p-4 inline-block">
              {slides[currentSlide].title}
            </h1>
            <p className="text-brand-gold text-sm md:text-base tracking-[0.2em] font-medium uppercase mb-8 pl-4 rtl:pl-0 rtl:pr-4">
              {slides[currentSlide].subtitle}
            </p>
            
            <button
              onClick={() => navigate('/signup')}
              className="ml-4 rtl:ml-0 rtl:mr-4 px-8 py-3 bg-transparent border border-white text-white text-xs uppercase tracking-widest-extra hover:bg-white hover:text-black transition-all duration-300"
            >
              {t('hero.cta')}
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={isRtl ? nextSlide : prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white hover:bg-black/50 transition-colors z-10"
      >
        <FaChevronLeft className="w-8 h-8" />
      </button>
      <button
        onClick={isRtl ? prevSlide : nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white hover:bg-black/50 transition-colors z-10"
      >
        <FaChevronRight className="w-8 h-8" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 rtl:space-x-reverse z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className="group relative flex justify-center items-center h-4 w-4"
          >
            <span
              className={`block rounded-full transition-all duration-300 ${
                currentSlide === idx
                  ? 'bg-white w-3 h-3'
                  : 'bg-transparent border border-white w-2 h-2 group-hover:bg-white/50'
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
};

export default Hero;