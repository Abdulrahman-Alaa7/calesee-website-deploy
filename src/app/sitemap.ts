import type { MetadataRoute } from "next";
import { getClient } from "@/lib/apollo-rsc";
import { GET_RECENT_PRODUCTS } from "@/graphql/actions/queries/products/getAllRecentProducts";
import { generateSlug } from "@/utils/generateSlug";

const locales = ["ar", "en"] as const;

type ProductForSitemap = {
  id: string;
  name: string;
  updatedAt: string;
};

type ProductsData = {
  getProductsPublic: ProductForSitemap[];
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://calesee.com";

  const staticPaths = [
    "",
    "store",
    "about-us",
    "privacy-policy",
    "terms-of-service",
    "shipping-policy",
    "return-and-refund-policy",
  ] as const;

  const staticRoutes: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    staticPaths.map((path) => {
      const localePath = path === "" ? "" : `/${path}`;
      return {
        url: `${baseUrl}/${locale}${localePath}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: path === "" ? 1 : 0.7,
      };
    }),
  );

  const client = getClient();
  const { data } = await client.query<ProductsData>({
    query: GET_RECENT_PRODUCTS,
  });

  const products = data?.getProductsPublic ?? [];

  const productRoutes: MetadataRoute.Sitemap = products.flatMap((product) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/store/${generateSlug(product.name)}-${product.id}`,
      lastModified: product.updatedAt
        ? new Date(product.updatedAt)
        : new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    })),
  );

  return [...staticRoutes, ...productRoutes];
}
