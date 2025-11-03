import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "./ProductCard";
import { ProductModal } from "./ProductModal";
import { useProductsByCategory } from "@/hooks/useProducts";
import { Skeleton } from "./ui/skeleton";
import type { Product } from "@/types/product";

interface ProductSectionProps {
  id: string;
  title: string;
  categorySlug: string;
}

export const ProductSection = ({ id, title, categorySlug }: ProductSectionProps) => {
  const [showAll, setShowAll] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const { data: products = [], isLoading, error } = useProductsByCategory(categorySlug);

  const displayedProducts = showAll ? products : products.slice(0, 6);

  if (error) {
    return (
      <section id={id} className="py-12 md:py-16 bg-background">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{title}</h2>
          <p className="text-center text-muted-foreground">Ошибка загрузки товаров</p>
        </div>
      </section>
    );
  }

  return (
    <section id={id} className="py-16 md:py-20 scroll-mt-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          {title}
        </h2>
        
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {displayedProducts.map((product, idx) => (
                <div
                  key={product.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <ProductCard
                    product={product}
                    onClick={() => setSelectedProduct(product)}
                  />
                </div>
              ))}
            </div>

            {products.length > 6 && (
              <div className="text-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowAll(!showAll)}
                  className="hover:bg-primary hover:text-primary-foreground transition-all shadow-md"
                >
                  {showAll ? "Свернуть" : "Показать все модели"}
                </Button>
              </div>
            )}
          </>
        )}

        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            open={!!selectedProduct}
            onOpenChange={(open) => !open && setSelectedProduct(null)}
          />
        )}
      </div>
    </section>
  );
};
