import { Metadata } from "next";
import ReturnandRefundPolicy from "@/features/static-pages/return-and-refund-policy";
import seoMetadata from "@/data/seoMetadata";

type PageProps = {
  params: Promise<{ locale: "ar" | "en" }>;
};

const baseUrl = "https://calesee.com";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const seo = seoMetadata.refund[locale];

  const url = `${baseUrl}/${locale}/return-and-refund-policy`;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: url,
      languages: {
        en: `${baseUrl}/en/return-and-refund-policy`,
        ar: `${baseUrl}/ar/return-and-refund-policy`,
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
export default function ReturnandRefundPolicyPage() {
  return (
    <div>
      <ReturnandRefundPolicy />
    </div>
  );
}
