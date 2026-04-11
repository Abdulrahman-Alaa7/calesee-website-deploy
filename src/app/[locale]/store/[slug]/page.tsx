import React from "react";
import type { Metadata } from "next";
import ProductInfo from "@/features/product-details/product-info";
import { Product } from "@/types/product.types";
import { getClient } from "@/lib/apollo-rsc";
import { GET_PRODUCT } from "@/graphql/actions/queries/products/getProduct";
import { truncateForSeo, normalizeKeywords } from "@/lib/seo-helpers";
import { generateSlug } from "@/utils/generateSlug";
import { redirect } from "@/i18n/routing";

type dateType = {
  product: Product;
  relatedProducts: Product[];
};

interface ProductData {
  getProductByIdPublic: dateType;
  relatedProducts: Product[] | null;
}

type PageProps = {
  params: Promise<{ slug: string; locale: "ar" | "en" }>;
};

const extractIdFromSlug = (slug: string) => {
  const match = slug.match(
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  );
  return match ? match[0] : null;
};

const baseUrl = "https://calesee.com";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const id = extractIdFromSlug(decodedSlug);

  if (!id) {
    return {
      title: "Invalid Product",
      description: "Invalid product URL",
    };
  }

  const client = getClient();
  const { data } = await client.query<ProductData>({
    query: GET_PRODUCT,
    variables: { id },
  });

  const product = data?.getProductByIdPublic.product;

  if (!product) {
    const safeSlug = decodedSlug.toLowerCase();
    const url = `${baseUrl}/${locale}/store/${safeSlug}`;
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

  const slugUrl = `${generateSlug(product.name)}-${product.id}`;
  const url = `${baseUrl}/${locale}/store/${slugUrl}`;

  const mainImage = product.images?.find((img) => img.isMain)?.url;

  return {
    title,
    description,
    keywords: normalizedKeywords,
    icons: { icon: "/favicon.ico" },
    alternates: {
      canonical: url,
      languages: {
        en: `${baseUrl}/en/store/${slugUrl}`,
        ar: `${baseUrl}/ar/store/${slugUrl}`,
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
  const { slug, locale } = await params;

  const decodedSlug = decodeURIComponent(slug);

  const id = extractIdFromSlug(decodedSlug);

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

  const correctSlug = `${generateSlug(product.name)}-${product.id}`;

  if (decodedSlug !== correctSlug) {
    redirect({
      href: `/store/${correctSlug}`,
      locale,
    });
  }

  return (
    <div className="py-3">
      <ProductInfo product={product} relatedProducts={relatedProducts} />
    </div>
  );
};

export default Page;
