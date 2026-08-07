import HeroSlider from "@/components/home/hero-slider";
import Categories from "@/components/home/categories";
import FeaturedProduct from "@/components/home/featured-product";
import Brands from "@/components/home/brands";
import AllProduct from "@/components/home/all-product";
import Faq from "@/components/home/faq";

export default function Home() {
  return (
    <div>
      <HeroSlider />
      <Categories />
      <FeaturedProduct />
      <Brands />
      <AllProduct />
      <Faq />
    </div>
  );
}
