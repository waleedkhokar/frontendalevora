import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = ({ darkMode }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const hoodieImage = darkMode ? '/images/hoodie-black.jpeg' : '/images/hoodie-white.jpeg';

  return (
    <div className="min-h-screen flex items-center">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        {/* MOBILE: Image First with Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:hidden mb-8 md:mb-12"
        >
          <div className="relative">
            {/* Image Container */}
            <div className="relative rounded-xl md:rounded-2xl overflow-hidden">
              {!imageLoaded && (
                <div className={`aspect-[4/5] flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                  <div className="w-12 h-12 border-3 border-transparent border-t-yellow-500 rounded-full animate-spin"></div>
                </div>
              )}
              
              <motion.img
                src={hoodieImage}
                alt="Premium products"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ 
                  opacity: imageLoaded ? 1 : 0,
                  scale: imageLoaded ? 1 : 1.05
                }}
                transition={{ duration: 0.8 }}
                onLoad={() => setImageLoaded(true)}
                className="w-full aspect-[4/5] object-cover"
              />
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 lg:gap-16">
          {/* Left Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="flex-1 max-w-xl lg:max-w-2xl"
          >
            {/* Brand Name - Single Line with Stagger */}
            <div className="overflow-hidden mb-4">
              <motion.h1
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  duration: 1.2,
                  delay: 0.4,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none"
              >
                KhokharMart
              </motion.h1>
            </div>

            {/* Tagline with Fade In */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="mb-6"
            >
              <div className={`h-0.5 w-16 ${darkMode ? 'bg-yellow-500' : 'bg-black'} mb-4`}></div>
              <p className={`text-lg md:text-xl font-light tracking-widest uppercase ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Shop Aloe Vera
              </p>
            </motion.div>

            {/* Main Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className={`text-xl md:text-2xl leading-relaxed mb-8 md:mb-10 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
            Cold-pressed organic gel for face & body.
Natural skincare, zero additives.
            </motion.p>

            {/* Features Grid - Recommended */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="flex flex-wrap justify-center sm:justify-start gap-2 md:gap-4 mb-10 md:mb-12"
            >
              {[
                { text: "100% Natural", emoji: "✨", bg: darkMode ? "bg-purple-500/10" : "bg-purple-100", border: darkMode ? "border-purple-500/30" : "border-purple-300" },
                { text: "Organic", emoji: "😌", bg: darkMode ? "bg-blue-500/10" : "bg-blue-100", border: darkMode ? "border-blue-500/30" : "border-blue-300" },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.3 + idx * 0.1 }}
                  whileHover={{ 
                    scale: 1.08, 
                    y: -3, 
                    boxShadow: darkMode 
                      ? '0 10px 25px rgba(251,191,36,0.3)' 
                      : '0 10px 25px rgba(0,0,0,0.15)'
                  }}
                  className="inline-flex"
                >
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg relative overflow-hidden ${item.bg} border ${item.border}`}>
                    {/* Gradient overlay on hover */}
                    <div className={`absolute inset-0 rounded-lg bg-gradient-to-tr from-yellow-500/10 via-transparent to-yellow-600/10 opacity-0 group-hover:opacity-100 transition-opacity`} />
                    <span className="text-lg z-10">{item.emoji}</span>
                    <span className={`text-sm font-medium whitespace-nowrap z-10 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {item.text}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Button - Perfect Balance */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.8, type: "spring", stiffness: 100 }}
            >
              <Link
                to="/products"
                className="group relative inline-block"
              >
                {/* Button Container */}
                <div className={`relative px-8 md:px-10 py-3 md:py-4 rounded-full font-bold overflow-hidden ${darkMode ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white' : 'bg-gradient-to-br from-white via-gray-50 to-white text-black'} border-2 ${darkMode ? 'border-gray-800 group-hover:border-yellow-500/50' : 'border-gray-300 group-hover:border-black/50'} shadow-xl transition-all duration-300 group-hover:shadow-2xl`}>
                  
                  {/* Animated Gradient Background */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ opacity: 1, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-r from-yellow-500/20 via-yellow-600/30 to-yellow-500/20' : 'bg-gradient-to-r from-black/10 via-gray-800/20 to-black/10'}`}
                  />
                  
                  {/* Content */}
                  <div className="relative flex items-center justify-center gap-3">
                    {/* Text with Wave Animation */}
                    <div className="flex">
                      {"Shop Collection".split("").map((char, i) => (
                        <motion.span
                          key={i}
                          initial={{ y: 0 }}
                          whileHover={{ 
                            y: [0, -10, 0],
                            transition: {
                              duration: 0.4,
                              delay: i * 0.03
                            }
                          }}
                          className="inline-block"
                        >
                          {char}
                        </motion.span>
                      ))}
                    </div>
                    
                    {/* Arrow Container */}
                    <div className="relative">
                      {/* Main Arrow */}
                      <motion.svg
                        initial={{ x: 0 }}
                        whileHover={{ 
                          x: 12,
                          rotate: 360,
                          transition: {
                            x: { duration: 0.3 },
                            rotate: { duration: 0.5 }
                          }
                        }}
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </motion.svg>
                      
                      {/* Glow Effect */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        whileHover={{ 
                          opacity: 0.7,
                          scale: 2,
                          transition: { duration: 0.4 }
                        }}
                        className={`absolute inset-0 rounded-full ${darkMode ? 'bg-yellow-500' : 'bg-black'} blur-md -z-10`}
                      />
                    </div>
                  </div>
                  
                  {/* Click Ripple */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileTap={{ scale: 10, opacity: 0.2 }}
                    transition={{ duration: 0.6 }}
                    className={`absolute rounded-full ${darkMode ? 'bg-white' : 'bg-black'}`}
                  />
                </div>
                
                {/* Floating Shadow */}
                <motion.div
                  animate={{ 
                    y: [0, -8, 0],
                    opacity: [0.4, 0.7, 0.4]
                  }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut"
                  }}
                  className={`absolute -bottom-3 left-2 right-2 h-4 rounded-full blur-lg ${darkMode ? 'bg-yellow-500/30' : 'bg-black/30'} -z-10`}
                />
              </Link>
            </motion.div>
          </motion.div>

          {/* DESKTOP: Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ 
              duration: 1.2,
              delay: 0.5,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="flex-1 max-w-2xl xl:max-w-3xl hidden lg:block"
          >
            <div className="relative">
              {/* Main Image Container */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`relative rounded-2xl lg:rounded-3xl overflow-hidden ${darkMode ? 'shadow-[0_25px_50px_-12px_rgba(251,191,36,0.15)]' : 'shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)]'}`}
              >
                {/* Loading State */}
                {!imageLoaded && (
                  <div className={`absolute inset-0 flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                    <div className="w-16 h-16 border-4 border-transparent border-t-yellow-500 rounded-full animate-spin"></div>
                  </div>
                )}
                
                {/* Hoodie Image */}
                <motion.img
                  src={hoodieImage}
                  alt={`${darkMode ? 'Black' : 'White'} Hoodie`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: imageLoaded ? 1 : 0 }}
                  transition={{ duration: 0.8 }}
                  onLoad={() => setImageLoaded(true)}
                  className="w-full h-auto object-cover"
                />

                {/* Hover Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.8 }}
                  className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-tr from-yellow-500/10 via-transparent to-yellow-600/10' : 'bg-gradient-to-tr from-white/10 via-transparent to-gray-400/10'}`}
                />
              </motion.div>

              {/* Decorative Elements */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className={`absolute -top-4 -right-4 w-12 h-12 rounded-xl backdrop-blur-sm flex items-center justify-center ${darkMode ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-black/10 border border-black/20'}`}
              >
                ✨
              </motion.div>
              
              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ repeat: Infinity, duration: 3, delay: 0.5, ease: "easeInOut" }}
                className={`absolute -bottom-4 -left-4 w-12 h-12 rounded-xl backdrop-blur-sm flex items-center justify-center ${darkMode ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-black/10 border border-black/20'}`}
              >
                ⚡
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:block"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className={`w-6 h-10 rounded-full border flex items-start justify-center p-1 ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}
          >
            <motion.div
              animate={{ scaleY: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className={`w-1 h-3 rounded-full ${darkMode ? 'bg-yellow-500' : 'bg-black'}`}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;