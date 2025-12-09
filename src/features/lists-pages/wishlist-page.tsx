"use client";
import React, { useContext } from "react";
import { Link } from "../../i18n/routing";
import { AppContext } from "../../utils/AppContext";
import { useTranslations } from "next-intl";
import { ProductsHome } from "../products/products-home";
import MainBtn from "../../components/ui/main-button";
import { TbHeartX } from "react-icons/tb";
import { Product } from "@/types/product.types";

const WishListPage = () => {
  const tHeader = useTranslations("AllHeader");
  const { wishingList } = useContext(AppContext);

  return (
    <div>
      {wishingList.length >= 1 ? (
        <div className="fadeIn mt-6 px-4 md:px-12 ">
          <h1
            className={`1200px:text-[70px] 1100px:text-[60px] pb-6 1000px:text-[50px] 800px:text-[45px] 600px:text-[40px] text-[35px] font-bold  gradient-text  text-center tracking-tight `}
          >
            {tHeader("wishingListReviewBtn")}
          </h1>
          <div className="my-12 grid grid-flow-row gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 px-3 pb-6">
            {wishingList?.map((product) => {
              const adaptedProduct = {
                ...product,
                images: [
                  {
                    url: product.mainImage,
                    isMain: true,
                  },
                ],
                price: product.price,
                estimatedPrice:
                  product.estimatedPrice && product.estimatedPrice,
                soldOut: false,
              } as Product;
              return (
                <div className="animate-slide-in" key={product.id}>
                  <ProductsHome product={adaptedProduct} isList={true} />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="fadeIn flex justify-center items-center my-6 flex-col gap-4 min-h-[450px]">
          <div className="flex justify-center items-center  flex-col gap-1">
            <TbHeartX size={125} className=" text-muted-foreground" />
            <h1 className=" text-[25px] font-bold">
              {tHeader("wishingListTitle")}
            </h1>
            <p className="text-center sm:text-[18px] text-[15px]">
              {tHeader("wishingListdesc")}
            </p>
          </div>
          <Link href={`/store`} className="z-50">
            <MainBtn
              accessKey="Store_Button_In_Whishing_List"
              title={`${tHeader("shopNowBtn")}`}
            />
          </Link>
        </div>
      )}
    </div>
  );
};

export default WishListPage;
