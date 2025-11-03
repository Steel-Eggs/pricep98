import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Accessory, ProductAccessory } from "@/types/product";

export const useAccessories = () => {
  return useQuery({
    queryKey: ["accessories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("accessories")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as Accessory[];
    },
  });
};

export const useProductAccessories = (productId: string) => {
  return useQuery({
    queryKey: ["product-accessories", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_accessories")
        .select(`
          *,
          accessory:accessories(*)
        `)
        .eq("product_id", productId)
        .eq("is_available", true);

      if (error) throw error;
      return data as ProductAccessory[];
    },
    enabled: !!productId,
  });
};
