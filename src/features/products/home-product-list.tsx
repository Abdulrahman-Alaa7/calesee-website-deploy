import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "../../i18n/routing";
import { ProductsHome } from "./products-home";
import { Product } from "@/types/product.types";

type Props = {
  Products: Product[];
};

const HomeProductList = ({ Products }: Props) => {
  const t = useTranslations("HomeProducts");

  return (
    <div>
      <div className=" px-3 py-12 lg:py-16  bg-white">
        <h2 className="mb-6 italic text-[30px] md:text-[45px] mx-auto flex justify-center items-center font-bold gap-2 uppercase drop-shadow-lg tracking-tighter">
          <span className="text-[#a8603a]">{t("homeProductsTitle1")}</span>
          <span className="text-[#947268]">{t("homeProductsTitle2")}</span>
        </h2>

        <div className="my-12 grid grid-flow-row gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {Products?.map((product) => (
            <div key={product.id}>
              <ProductsHome product={product} />
            </div>
          ))}
        </div>

        <Link
          href="/store"
          className="mx-auto rounded-full bg-[#a8603a] py-4 px-4 !z-30 mb-3 lg:mb-0 hover:bg-[#947268] hover:opacity-80 text-white flex justify-center items-center !w-[300px]"
        >
          {t("viewAllBtn")}
        </Link>
      </div>
    </div>
  );
};

export default HomeProductList;
