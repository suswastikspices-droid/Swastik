import Image from "next/image";
import HeroSection from "./components/HeroSection";
import SubCategorySection from "./components/SubCategorySection";
import ProductsPage from "./components/Productspage";
 
import HandmadeSection from "./components/HandmadeSection";
import ReviewSection from "./components/ReviewSection";
 
 
import Blog from "./components/Blog";
import UspRibbonSection from "./components/UspRibbonSection";
import FoodVideoGallery from "./components/FoodVideoGallery";
import CategorySection from "./components/CategorySection";
import ComparisonSection from "./components/ComparisonSection";
import SuswastikB2B from "./components/SuswastikB2B";
import SuswastikPopup from "./components/SuswastikPopup";
 

export default function Home() {
  return (
   <>
    <SubCategorySection/>
   <HeroSection/>
  <UspRibbonSection/>

   <HandmadeSection/>
   <FoodVideoGallery/>
   <CategorySection/>
   <ProductsPage/>
   <ComparisonSection/>
   <SuswastikB2B/>
   <ReviewSection/>
   <SuswastikPopup/>
   <Blog/>
    
  
   </>
  );
}
