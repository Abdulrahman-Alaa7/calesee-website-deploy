import { Metadata } from "next";
import TermsofService from "@/features/static-pages/terms-of-service";
import seoMetadata from "@/data/seoMetadata";

type PageProps = {
  params: Promise<{ locale: "ar" | "en" }>;
};

const baseUrl = "https://calesee.com";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const seo = seoMetadata.terms[locale];

  const url = `${baseUrl}/${locale}/terms-of-service`;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: url,
      languages: {
        en: `${baseUrl}/en/terms-of-service`,
        ar: `${baseUrl}/ar/terms-of-service`,
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

export default function TermsOfServicePage() {
  return (
    <div>
      <TermsofService />
    </div>
  );
}
