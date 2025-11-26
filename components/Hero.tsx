import React from 'react';
import { motion } from 'framer-motion';
import { AppData, Language } from '../types';
import { ArrowDown } from 'lucide-react';

interface HeroProps {
  data: AppData;
  lang: Language;
}

const Hero: React.FC<HeroProps> = ({ data, lang }) => {
  const { profile } = data;

  return (
    <section className="min-h-screen flex flex-col justify-center relative px-6 md:px-12 max-w-7xl mx-auto">
      <div className="max-w-3xl z-10">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
            {profile.name}
            </h1>
            <h2 className="text-2xl md:text-3xl text-primary-600 dark:text-primary-400 font-medium mb-6">
            {profile.role[lang]}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8 max-w-2xl">
            {profile.tagline[lang]}
            </p>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex gap-4"
        >
            <a href="#history" className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-full hover:opacity-90 transition-opacity">
                {data.ui.history[lang]}
            </a>
            <a href="#projects" className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-semibold rounded-full hover:bg-gray-100 dark:hover:bg-dark-card transition-colors">
                {data.ui.projects[lang]}
            </a>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-gray-400"
      >
        <ArrowDown size={32} />
      </motion.div>
      
      {/* Abstract Background Element */}
      <div className="absolute top-1/4 right-0 w-64 h-64 md:w-96 md:h-96 bg-primary-500/10 rounded-full blur-3xl -z-0" />
      <div className="absolute bottom-1/4 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl -z-0" />
    </section>
  );
};

export default Hero;