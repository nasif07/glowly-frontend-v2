import HeroSlider from "@/components/home/hero-slider";
import Categories from "@/components/home/categories";
import FeaturedProduct from "@/components/home/featured-product";
import Brands from "@/components/home/brands";
import AllProduct from "@/components/home/all-product";
import Faq from "@/components/home/faq";
import SkinTypes from "@/components/home/skin-types";
import ComboDeals from "@/components/home/combo-deals";
import NewArrivals from "@/components/home/new-arrivals";

export default function Home() {
  return (
    <div>
      <HeroSlider />
      <Categories />
      <NewArrivals />
      <SkinTypes />
      <FeaturedProduct />
      <ComboDeals />
      <Brands />
      <AllProduct />
      <Faq />
    </div>
  );
}
