"use client";

import React, { useMemo } from "react";
import { useTranslations } from "next-intl";
import { ScanSearch } from "lucide-react";
import { useSearchParams } from "next/navigation";
import MainLoading from "../../components/ui/main-loading";
import { ProductsHome } from "../products/products-home";
import { useQuery } from "@apollo/client/react";
import { GET_RECENT_PRODUCTS } from "@/graphql/actions/queries/products/getAllRecentProducts";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product.types";
import { FaStore } from "react-icons/fa";

interface ProductsData {
  getProductsPublic: Product[];
}

const Search = () => {
  const searchParams = useSearchParams();
  const search = (searchParams?.get("search") || "").trim();
  const tHeader = useTranslations("AllHeader");

  const { data, loading: getProductsLoading } =
    useQuery<ProductsData>(GET_RECENT_PRODUCTS);

  const products: Product[] = useMemo(
    () => data?.getProductsPublic ?? [],
    [data]
  );

  const filteredProducts: Product[] = useMemo(() => {
    if (!search) return [];
    const lower = search.toLowerCase();

    return products.filter((item) => item.name.toLowerCase().includes(lower));
  }, [products, search]);

  const isLoading = getProductsLoading;

  return (
    <div className="fadeIn mt-6 px-4 md:px-12 ">
      <h1 className="1200px:text-[70px] 1100px:text-[60px] pb-6 1000px:text-[50px] 800px:text-[45px] 600px:text-[40px] text-[35px] font-bold  gradient-text  text-center tracking-tight">
        {tHeader("searchTitle")}
      </h1>

      {isLoading ? (
        <div className="flex justify-center items-center mx-auto my-6">
          <MainLoading />
        </div>
      ) : (
        <>
          {filteredProducts.length > 0 ? (
            <div
              dir="ltr"
              className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 transition-all pb-8"
            >
              {filteredProducts.map((value) => (
                <div className="fadeIn" key={value.id}>
                  <ProductsHome product={value} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center mx-auto ">
              <ScanSearch size={120} className="text-muted-foreground" />
              <p className="flex justify-center items-center mx-auto mt-6 text-[25px] my-3 font-bold text-muted-foreground">
                {tHeader("searchResults")}
              </p>
            </div>
          )}
        </>
      )}

      <div className="flex justify-center items-center my-8">
        <Link href={`/store`}>
          <Badge
            variant={`outline`}
            className="font-normal rounded-3xl mb-5 mx-auto gap-2 text-white text-[18px] bg-primary hover:bg-primary/80  hover:text-white  w-[250px] flex justify-center items-center py-2"
          >
            <FaStore />
            {tHeader("store")}
          </Badge>
        </Link>
      </div>
    </div>
  );
};

export default Search;
