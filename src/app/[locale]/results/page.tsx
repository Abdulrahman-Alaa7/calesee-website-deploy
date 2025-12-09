import Search from "@/features/search/Search";
import { Metadata } from "next";
import seoMetadata from "@/data/seoMetadata";

type PageProps = {
  params: Promise<{ locale: "ar" | "en" }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const seo = seoMetadata.search[locale];

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    icons: {
      icon: "/favicon.ico",
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function SearchResultsPage() {
  return (
    <div className={`mt-[20px] md:mt-[60px]`}>
      <Search />
    </div>
  );
}
