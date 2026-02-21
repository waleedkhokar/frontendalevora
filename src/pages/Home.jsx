import Hero from '../components/home/Hero.jsx';
import StatsSection from '../components/home/StatsSection.jsx';
import FeaturedProducts from '../components/home/FeaturedProducts.jsx';  
import FeaturesSection from '../components/home/FeaturesSection.jsx';

const Home = ({ darkMode }) => {
    return (
        <div>
            <Hero darkMode={darkMode} />
            <StatsSection darkMode={darkMode} />
            <FeaturedProducts darkMode={darkMode} />   {/* FIXED */}
            <FeaturesSection darkMode={darkMode} />
        </div>
    );
};

export default Home;