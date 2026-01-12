import { Header } from "@/components/Header";
// import { HeroSection } from "@/components/HeroSection"; // Закомментировано - можно активировать через админку
import { BannerSlider } from "@/components/BannerSlider";
import { BenefitsSection } from "@/components/BenefitsSection";
import { QualityBadge } from "@/components/QualityBadge";
import { ProductSection } from "@/components/ProductSection";
import { LocationSection } from "@/components/LocationSection";
import { Footer } from "@/components/Footer";
import { useCategories } from "@/hooks/useCategories";
// import { NewYearModal } from "@/components/NewYearModal"; // Скрыто - можно активировать при необходимости

const Index = () => {
  const { data: categories, isLoading } = useCategories();

  return (
    <div className="min-h-screen bg-background">
      {/* <NewYearModal /> */}
      <Header />
      <main>
        {/* <HeroSection /> */}
        <BannerSlider />
        <BenefitsSection />
        <QualityBadge />
        {!isLoading && categories?.map((category) => (
          <ProductSection 
            key={category.id}
            id={category.slug} 
            title={category.name} 
            categorySlug={category.slug} 
          />
        ))}
        <LocationSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
