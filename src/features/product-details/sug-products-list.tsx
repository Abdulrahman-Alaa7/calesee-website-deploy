import React from "react";
import { useTranslations } from "next-intl";
import { ProductsHome } from "../products/products-home";
import { Badge } from "../../components/ui/badge";
import { Link } from "../../i18n/routing";
import { FaStore } from "react-icons/fa";
import { Product } from "@/types/product.types";

type Props = {
  SugProducts: Product[];
};

export const SugProductsList = ({ SugProducts }: Props) => {
  const tHomeProducts = useTranslations("HomeProducts");
  const tHeader = useTranslations("AllHeader");

  return (
    <div className="animate-slide-in">
      <h3 className="relative w-fit mx-auto mt-12 mb-6 text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight text-center">
        <span className="relative z-10 px-6 py-2.5 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-full">
          {tHomeProducts("SugForYou")}
        </span>
      </h3>

      <>
        {SugProducts?.length > 0 ? (
          <div
            dir="ltr"
            className="my-12 grid grid-flow-row gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
          >
            {SugProducts?.slice(0, 4).map((product: Product) => (
              <div className="fadeIn" key={product.id}>
                <ProductsHome product={product} isQuickCard={true} />
              </div>
            ))}
          </div>
        ) : (
          <>
            <p className="flex justify-center items-center mx-auto my-12">
              {tHomeProducts("noProducts")}
            </p>
          </>
        )}
      </>
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
  );
};

export default SugProductsList;
