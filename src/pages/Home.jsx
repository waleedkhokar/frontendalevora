import React from 'react';
import Hero from '../components/home/Hero';
import StatsSection from '../components/home/StatsSection';
import FeaturedHoodies from '../components/home/FeaturedHoodies';
import FeaturesSection from '../components/home/FeaturesSection';

const Home = ({ darkMode }) => {
    return (
        <div>
            <Hero darkMode={darkMode} />
            <StatsSection darkMode={darkMode} />
            <FeaturedHoodies darkMode={darkMode} />
            <FeaturesSection darkMode={darkMode} />
            
            
        </div>
    );
};

export default Home;