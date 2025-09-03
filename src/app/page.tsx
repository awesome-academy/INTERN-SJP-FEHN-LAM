import Image from "next/image";
import NewProducts from "@/components/product/NewProduct";
import FeaturedProducts from "@/components/product/FeaturedProduct";
import Bestsellers from "@/components/product/BestSeller";
import BrandPromotions from "@/components/promo/BrandPromotions";
import PromoBanner from "@/components/promo/PromoBanner";
import BannerDesktopSplitWithImages from "@/components/BannerDesktop";
export default function Home() {
  return (
    <div>
      <BannerDesktopSplitWithImages />
      <FeaturedProducts />
      <NewProducts />
      <BrandPromotions />
      <Bestsellers />
      <PromoBanner />
    </div>
  );
}
