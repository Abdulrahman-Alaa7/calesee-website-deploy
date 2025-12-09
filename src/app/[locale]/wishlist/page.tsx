import WishListPage from "@/features/lists-pages/wishlist-page";
import { Metadata } from "next";
import seoMetadata from "@/data/seoMetadata";

type PageProps = {
  params: Promise<{ locale: "ar" | "en" }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const seo = seoMetadata.wishlist[locale];

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

export default function WishingListPage() {
  return (
    <div>
      <WishListPage />
    </div>
  );
}
