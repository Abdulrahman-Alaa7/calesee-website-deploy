import { Metadata } from "next";
import PrivacyPolicy from "@/features/static-pages/privacy-policy";
import seoMetadata from "@/data/seoMetadata";

type PageProps = {
  params: Promise<{ locale: "ar" | "en" }>;
};

const baseUrl = "https://calesee.com";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const seo = seoMetadata.privacy[locale];

  const url = `${baseUrl}/${locale}/privacy-policy`;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: url,
      languages: {
        en: `${baseUrl}/en/privacy-policy`,
        ar: `${baseUrl}/ar/privacy-policy`,
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

export default function PrivacyPolicyPage() {
  return (
    <div>
      <PrivacyPolicy />
    </div>
  );
}
