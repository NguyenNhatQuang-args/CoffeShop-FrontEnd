import HeroSlider from '../components/sections/HeroSlider';
import AboutSection from '../components/sections/AboutSection';
import CategoryShowcase from '../components/sections/CategoryShowcase';
import FeaturedProducts from '../components/sections/FeaturedProducts';
import CoffeeProcess from '../components/sections/CoffeeProcess';
import LatestBlog from '../components/sections/LatestBlog';
import CTABanner from '../components/sections/CTABanner';

export default function Home() {
  return (
    <>
      <HeroSlider />
      <AboutSection />
      <CategoryShowcase />
      <FeaturedProducts />
      <CoffeeProcess />
      <LatestBlog />
      <CTABanner />
    </>
  );
}