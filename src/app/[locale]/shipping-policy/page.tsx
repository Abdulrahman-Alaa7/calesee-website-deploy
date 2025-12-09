import { Metadata } from "next";
import ShippingPolicy from "@/features/static-pages/shipping-policy";
import seoMetadata from "@/data/seoMetadata";

type PageProps = {
  params: Promise<{ locale: "ar" | "en" }>;
};

const baseUrl = "https://calesee.com";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const seo = seoMetadata.shipping[locale];

  const url = `${baseUrl}/${locale}/shipping-policy`;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: url,
      languages: {
        en: `${baseUrl}/en/shipping-policy`,
        ar: `${baseUrl}/ar/shipping-policy`,
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

export default function ShippingPolicyPage() {
  return (
    <div>
      <ShippingPolicy />
    </div>
  );
}
