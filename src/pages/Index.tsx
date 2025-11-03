import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { BenefitsSection } from "@/components/BenefitsSection";
import { QualityBadge } from "@/components/QualityBadge";
import { ProductSection } from "@/components/ProductSection";
import { LocationSection } from "@/components/LocationSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <BenefitsSection />
        <QualityBadge />
        <ProductSection id="single-axle" title="Одноосные" categorySlug="single-axle" />
        <ProductSection id="dual-axle" title="Двухосные" categorySlug="dual-axle" />
        <ProductSection id="water-tech" title="Прицепы для водной техники" categorySlug="water-tech" />
        <ProductSection id="quad" title="Прицепы к квадроциклам" categorySlug="quad" />
        <LocationSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
