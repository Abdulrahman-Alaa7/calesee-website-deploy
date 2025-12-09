import { Metadata } from "next";
import AboutUs from "@/features/static-pages/about-us";
import { SEO } from "@/types/seo.types";
import { getClient } from "@/lib/apollo-rsc";
import { GET_SEO_BY_PAGE } from "@/graphql/actions/queries/getSeo";

interface SeoData {
  getSeoByPage: SEO;
}

type Params = { params: Promise<{ locale: "ar" | "en" }> };

const baseUrl = "https://calesee.com";

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;

  const client = getClient();

  const { data } = await client.query<SeoData>({
    query: GET_SEO_BY_PAGE,
    variables: { page: "About Us" },
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
  const url = `${baseUrl}/${locale}/about-us`;

  const finalTitle = title || "Calesee | About Us";
  const finalDesc = desc || "Calesee description";

  return {
    title: finalTitle,
    description: finalDesc,
    keywords: keywords || ["Calesee"],
    alternates: {
      canonical: url,
      languages: {
        en: `${baseUrl}/en/about-us`,
        ar: `${baseUrl}/ar/about-us`,
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

export default function AboutUsPage() {
  return (
    <div>
      <AboutUs />
    </div>
  );
}
