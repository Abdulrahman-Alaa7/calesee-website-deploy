import React from "react";
import type { Metadata } from "next";
import ProductInfo from "@/features/product-details/product-info";
import { Product } from "@/types/product.types";
import { getClient } from "@/lib/apollo-rsc";
import { GET_PRODUCT } from "@/graphql/actions/queries/products/getProduct";
import { truncateForSeo, normalizeKeywords } from "@/lib/seo-helpers";

type dateType = {
  product: Product;
  relatedProducts: Product[];
};

interface ProductData {
  getProductByIdPublic: dateType;
  relatedProducts: Product[] | null;
}

type PageProps = {
  params: Promise<{ id: string; locale: "ar" | "en" }>;
};

const baseUrl = "https://calesee.com";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id, locale } = await params;

  const client = getClient();
  const { data } = await client.query<ProductData>({
    query: GET_PRODUCT,
    variables: { id },
  });

  const product = data?.getProductByIdPublic.product;

  if (!product) {
    const url = `${baseUrl}/${locale}/store/${id}`;

    return {
      title: "Calesee | Product Details",
      description: "Calesee product's description",
      keywords: ["Calesee"],
      icons: { icon: "/favicon.ico" },
      alternates: { canonical: url },
    };
  }

  const isArabic = locale === "ar";

  const title = truncateForSeo(product.name, 60) ?? "Calesee | Product Details";

  const rawDescription = isArabic
    ? product.descriptionAr
    : product.descriptionEn;

  const rawKeywords = isArabic ? product.keywordsAr : product.keywordsEn;

  const description =
    truncateForSeo(rawDescription, 150) ?? "Calesee product's description";

  const normalizedKeywords = normalizeKeywords(rawKeywords, 10) ?? ["Calesee"];

  const url = `${baseUrl}/${locale}/store/${id}`;

  const mainImage = product.images?.find((img) => img.isMain)?.url;

  return {
    title,
    description,
    keywords: normalizedKeywords,
    icons: { icon: "/favicon.ico" },
    alternates: {
      canonical: url,
      languages: {
        en: `${baseUrl}/en/store/${id}`,
        ar: `${baseUrl}/ar/store/${id}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Calesee",
      type: "website",
      images: mainImage ? [{ url: mainImage, alt: title }] : [],
    },
  };
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  const client = getClient();
  const { data } = await client.query<ProductData>({
    query: GET_PRODUCT,
    variables: { id },
  });

  const product = data?.getProductByIdPublic.product;

  const relatedProducts = data?.getProductByIdPublic?.relatedProducts ?? [];

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center">
        <p className="text-gray-600 text-sm md:text-base">No Product Found</p>
      </div>
    );
  }

  return (
    <div className="py-3">
      <ProductInfo product={product} relatedProducts={relatedProducts} />
    </div>
  );
};

export default Page;
