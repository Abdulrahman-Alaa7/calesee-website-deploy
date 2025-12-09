import CategoriesSection from "@/features/landing/categories-section";
import { Metadata } from "next";
import { getClient } from "@/lib/apollo-rsc";
import { CategoryType } from "@/types/categories.types";
import { GET_ALL_CATEGORIES } from "@/graphql/actions/queries/getAllCategories";
import seoMetadata from "@/data/seoMetadata";

interface CategoriesData {
  getCategories: CategoryType[];
}

type PageProps = {
  params: Promise<{ locale: "ar" | "en" }>;
};

const baseUrl = "https://calesee.com";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const seo = seoMetadata.categories[locale];

  const url = `${baseUrl}/${locale}/categories`;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: url,
      languages: {
        en: `${baseUrl}/en/categories`,
        ar: `${baseUrl}/ar/categories`,
      },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url,
      siteName: "Calesee",
      type: "website",
    },
    icons: {
      icon: "/favicon.ico",
    },
  };
}

export default async function Home() {
  const client = getClient();

  const { data } = await client.query<CategoriesData>({
    query: GET_ALL_CATEGORIES,
  });

  const categories = data?.getCategories ?? [];

  return (
    <div>
      {categories.length > 0 && <CategoriesSection categories={categories} />}
    </div>
  );
}
