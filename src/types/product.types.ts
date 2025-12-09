export type Product = {
  id: string;
  name: string;
  price: number;
  estimatedPrice?: number | null;
  soldOut: boolean;
  category?: {
    id: string;
    nameEn: string;
    nameAr: string;
  } | null;
  images: {
    id?: string;
    url: string;
    isMain: boolean;
    linkedColorHex?: string | null;
  }[];
  categoryId?: string;
  sku?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  keywordsEn?: string[];
  keywordsAr?: string[];
  sizes?: {
    id: string;
    sizeValue: string;
    catalogSizeId: string;
    soldout: boolean;
    colors?: {
      id: string;
      hex: string;
      catalogColorId: string;
      nameEn: string;
      nameAr: string;
      soldout: boolean;
    }[];
  }[];
  createdAt?: string;
  updatedAt?: string;
  relatedProducts?: Product[];
};

export type ShippingItem = {
  id: string;
  name: string;
  mainImage: string;
  price: number;
  estimatedPrice?: number;
  quantity: number;
  size: string;
  color: string;
  soldOut?: boolean;
};

export type WishingItem = {
  id: string;
  name: string;
  mainImage: string;
  price: number;
  estimatedPrice?: number;
};
