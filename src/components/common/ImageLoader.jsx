import React from 'react';
import { motion } from 'framer-motion';

const ImageLoader = ({ src, alt, darkMode, className = '' }) => {
    const [loaded, setLoaded] = React.useState(false);

    return (
        <div className="relative">
            {/* Loading skeleton */}
            {!loaded && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`absolute inset-0 rounded-lg ${
                        darkMode ? 'bg-gray-800' : 'bg-gray-200'
                    }`}
                >
                    <div className="flex items-center justify-center h-full">
                        <div className="w-12 h-12 border-4 border-transparent border-t-yellow-500 border-r-yellow-500 rounded-full animate-spin"></div>
                    </div>
                </motion.div>
            )}
            
            {/* Actual image */}
            <motion.img
                src={src}
                alt={alt}
                initial={{ opacity: 0 }}
                animate={{ opacity: loaded ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                onLoad={() => setLoaded(true)}
                className={`${className} ${loaded ? 'block' : 'invisible'}`}
            />
        </div>
    );
};

export default ImageLoader;