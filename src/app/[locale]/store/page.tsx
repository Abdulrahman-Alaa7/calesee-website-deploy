import { Metadata } from "next";
import { getClient } from "@/lib/apollo-rsc";
import { GET_SEO_BY_PAGE } from "@/graphql/actions/queries/getSeo";
import { SEO } from "@/types/seo.types";
import { CategoryType } from "@/types/categories.types";
import { GET_ALL_CATEGORIES } from "@/graphql/actions/queries/getAllCategories";
import { Product } from "@/types/product.types";
import StorePage from "@/features/store/store-page";
import { GET_RECENT_PRODUCTS } from "@/graphql/actions/queries/products/getAllRecentProducts";
import { ColorType, SizeType } from "@/types/store.types";
import { GET_SIZES } from "@/graphql/actions/queries/getSizes";
import { GET_COLORS } from "@/graphql/actions/queries/getColors";
import { GET_TOP_PRODUCTS } from "@/graphql/actions/queries/products/getTopProducts";

interface SeoData {
  getSeoByPage: SEO;
}

interface CategoriesData {
  getCategories: CategoryType[];
}

interface ProductsData {
  getProductsPublic: Product[];
}

interface TopProductsData {
  getTopSellingProducts: Product[];
}

interface SizesData {
  getSizes: SizeType[];
}

interface ColorsData {
  getColors: ColorType[];
}

type Params = { params: Promise<{ locale: "ar" | "en" }> };

const baseUrl = "https://calesee.com";

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;

  const client = getClient();

  const url = `${baseUrl}/${locale}/store`;

  const { data } = await client.query<SeoData>({
    query: GET_SEO_BY_PAGE,
    variables: { page: "Store" },
  });

  const seo = data?.getSeoByPage;
  const isArabic = locale === "ar";

  const title = isArabic ? seo?.titleAr : seo?.titleEn;
  const desc = isArabic ? seo?.descAr : seo?.descEn;

  const rawKeywords = isArabic ? seo?.keywordsAr : seo?.keywordsEn;

  let keywords: string[] | undefined;

  if (Array.isArray(rawKeywords)) {
    keywords = rawKeywords;
  } else if (typeof rawKeywords === "string") {
    keywords = rawKeywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
  }

  const finalTitle = title || "Calesee | Store";
  const finalDesc = desc || "Calesee description";

  return {
    title: finalTitle,
    description: finalDesc,
    keywords: keywords || ["Calesee"],
    alternates: {
      canonical: url,
      languages: {
        en: `${baseUrl}/en/store`,
        ar: `${baseUrl}/ar/store`,
      },
    },
    openGraph: {
      title: finalTitle,
      description: finalDesc,
      url,
      siteName: "Calesee",
      type: "website",
    },
    icons: { icon: "/favicon.ico" },
  };
}

export default async function Home() {
  const client = getClient();

  const [
    { data: categoriesData },
    { data: sizesData },
    { data: colorsData },
    { data: productsRecentData },
    { data: topProductsData },
  ] = await Promise.all([
    client.query<CategoriesData>({ query: GET_ALL_CATEGORIES }),
    client.query<SizesData>({ query: GET_SIZES }),
    client.query<ColorsData>({ query: GET_COLORS }),
    client.query<ProductsData>({ query: GET_RECENT_PRODUCTS }),
    client.query<TopProductsData>({ query: GET_TOP_PRODUCTS }),
  ]);

  const sizes = sizesData?.getSizes ?? [];
  const colors = colorsData?.getColors ?? [];
  const categories = categoriesData?.getCategories ?? [];
  const recentProducts = productsRecentData?.getProductsPublic ?? [];
  const topProducts = topProductsData?.getTopSellingProducts ?? [];

  if (!recentProducts.length && !topProducts.length) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-xl font-semibold mb-2">المتجر غير متوفر حاليًا</h2>
        <p className="text-gray-600 max-w-md">
          لا توجد منتجات متاحة في الوقت الحالي. الرجاء المحاولة لاحقًا.
        </p>
      </div>
    );
  }

  return (
    <div>
      <StorePage
        products={recentProducts}
        topProducts={topProducts}
        categories={categories}
        sizes={sizes}
        colors={colors}
      />
    </div>
  );
}
