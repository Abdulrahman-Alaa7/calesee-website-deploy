import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getClient } from "@/lib/apollo-rsc";
import { GET_ALL_CATEGORIES } from "@/graphql/actions/queries/getAllCategories";
import { generateSlug } from "@/utils/generateSlug";
import { CategoryType } from "@/types/categories.types";

type PageProps = {
  params: Promise<{ slug: string; locale: "ar" | "en" }>;
};

type CategoriesData = {
  getCategories: CategoryType[];
};

const baseUrl = "https://calesee.com";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;

  const decodedSlug = decodeURIComponent(slug);

  const formattedName = decodedSlug.replace(/-/g, " ");

  const url = `${baseUrl}/${locale}/categories/${decodedSlug}`;

  return {
    title: `${formattedName} | Calesee`,
    description:
      locale === "ar"
        ? `تسوق منتجات ${formattedName} من Calesee`
        : `Shop ${formattedName} products from Calesee`,
    alternates: {
      canonical: url,
      languages: {
        en: `${baseUrl}/en/categories/${decodedSlug}`,
        ar: `${baseUrl}/ar/categories/${decodedSlug}`,
      },
    },
    openGraph: {
      title: `${formattedName} | Calesee`,
      description:
        locale === "ar"
          ? `تسوق منتجات ${formattedName}`
          : `Shop ${formattedName}`,
      url,
      siteName: "Calesee",
      type: "website",
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug, locale } = await params;

  const decodedSlug = decodeURIComponent(slug);

  const client = getClient();

  const { data } = await client.query<CategoriesData>({
    query: GET_ALL_CATEGORIES,
  });

  const categories = data?.getCategories ?? [];

  const category = categories.find(
    (c: CategoryType) => generateSlug(c.nameEn) === decodedSlug,
  );

  if (!category) {
    redirect(`/${locale}/categories`);
  }

  redirect(`/${locale}/store?category=${decodedSlug}`);
}
