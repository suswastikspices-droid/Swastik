import Blog from "../components/Blog";
import CategorySection from "../components/CategorySection";
import FoodVideoGallery from "../components/FoodVideoGallery";
import ProductsPage from "../components/Productspage";

 export default function Products() {
   return (
    <>
   <ProductsPage/>
   <CategorySection/>
   <FoodVideoGallery/>
   <Blog/>
    </>
   );
 }