import Hero from "@/features/landing/hero";
import CategoriesSection from "@/features/landing/categories-section";
import SecHero from "@/features/landing/sec-hero";
import HomeProductList from "@/features/products/home-product-list";
import AboutUsHome from "@/features/landing/about-us-home";
import { Metadata } from "next";
import { WhyChooseUsSection } from "@/features/landing/some-features";
import { getClient } from "@/lib/apollo-rsc";
import { GET_LANDINGS } from "@/graphql/actions/queries/getLanding";
import { GET_SETTINGS } from "@/graphql/actions/queries/getSettings";
import { Settings, Slides } from "@/types/landing.types";
import { GET_SEO_BY_PAGE } from "@/graphql/actions/queries/getSeo";
import { SEO } from "@/types/seo.types";
import { CategoryType } from "@/types/categories.types";
import { GET_ALL_CATEGORIES } from "@/graphql/actions/queries/getAllCategories";
import { Product } from "@/types/product.types";
import { GET_RECENT_LIMITED_PRODUCTS } from "@/graphql/actions/queries/products/getRecentLimitedProducts";

interface SeoData {
  getSeoByPage: SEO;
}

interface LandingData {
  getLandings: Slides[];
}

interface SettingsData {
  getSettings: Settings[];
}

interface CategoriesData {
  getCategories: CategoryType[];
}

interface ProductsData {
  getRecentProducts: Product[];
}

type Params = { params: Promise<{ locale: "ar" | "en" }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;

  const client = getClient();

  const { data } = await client.query<SeoData>({
    query: GET_SEO_BY_PAGE,
    variables: { page: "Home" },
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

  return {
    title: title || "Calesee",
    description: desc || "Calesee description",
    keywords: keywords || ["Calesee"],
  };
}

export default async function Home() {
  const client = getClient();

  const [
    heroResult,
    settingsResult,
    categoriesResult,
    productsRecentLimitedResult,
  ] = await Promise.all([
    client.query<LandingData>({
      query: GET_LANDINGS,
    }),
    client.query<SettingsData>({
      query: GET_SETTINGS,
    }),
    client.query<CategoriesData>({
      query: GET_ALL_CATEGORIES,
    }),
    client.query<ProductsData>({
      query: GET_RECENT_LIMITED_PRODUCTS,
    }),
  ]);

  const slides = heroResult.data?.getLandings ?? [];
  const settings = settingsResult.data?.getSettings?.[0];
  const categories = categoriesResult.data?.getCategories ?? [];
  const recentLimitedProducts =
    productsRecentLimitedResult.data?.getRecentProducts ?? [];

  if (!slides.length || !settings) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-xl font-semibold mb-2">المحتوى غير متوفر الآن</h2>
        <p className="text-gray-600 max-w-md">
          يبدو أن الصفحة الرئيسية تحت التجهيز حاليًا. الرجاء المحاولة لاحقًا.
        </p>
      </div>
    );
  }

  return (
    <div>
      <Hero slides={slides} settings={settings} />

      {categories.length > 0 && <CategoriesSection categories={categories} />}

      <SecHero />

      {recentLimitedProducts.length > 0 && (
        <HomeProductList Products={recentLimitedProducts} />
      )}

      <WhyChooseUsSection />
      <AboutUsHome />
    </div>
  );
}
