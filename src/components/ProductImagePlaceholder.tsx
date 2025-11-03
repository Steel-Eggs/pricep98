import { Package } from "lucide-react";

interface ProductImagePlaceholderProps {
  name: string;
  className?: string;
}

export const ProductImagePlaceholder = ({ name, className = "" }: ProductImagePlaceholderProps) => {
  return (
    <div className={`flex flex-col items-center justify-center bg-muted/20 rounded-lg ${className}`}>
      <Package className="w-16 h-16 text-muted-foreground/40 mb-4" />
      <p className="text-sm text-muted-foreground text-center px-4">
        {name}
      </p>
      <p className="text-xs text-muted-foreground/60 mt-2">
        Изображение скоро будет добавлено
      </p>
    </div>
  );
};
