import products from "@/data/dataset_rewe.json";

interface RawProduct {
  id?: string;
  name?: string;
  image?: string;
  price?: number;
  detail_link?: string;
  grammage?: string;
  is_promo?: boolean;
  currency?: string;
  category?: string[];
}

export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  detailLink: string;
  grammage: string;
  isPromo: boolean;
  currency: string;
  category: string[];
}

const normalizedProducts: Product[] = (products as RawProduct[]).map((raw, index) => ({
  id: raw.id ?? String(index),
  name: raw.name ?? "Unbekanntes Produkt",
  image: raw.image ?? "",
  price: typeof raw.price === "number" ? raw.price : 0,
  detailLink: raw.detail_link ?? "",
  grammage: raw.grammage ?? "",
  isPromo: raw.is_promo ?? false,
  currency: raw.currency ?? "€",
  category: Array.isArray(raw.category) ? raw.category : [],
}));

export function useProducts(): Product[] {
  return normalizedProducts;
}
