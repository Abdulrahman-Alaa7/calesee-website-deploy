"use client";
import React, { useContext } from "react";
import { Link } from "../../i18n/routing";
import { AppContext } from "../../utils/AppContext";
import { useTranslations } from "next-intl";
import { ProductsHome } from "../products/products-home";
import { Badge } from "../../components/ui/badge";
import MainBtn from "../../components/ui/main-button";
import { TbShoppingBagX } from "react-icons/tb";
import { ShippingItem } from "@/types/product.types";

const ShippingListPage = () => {
  const tHeader = useTranslations("AllHeader");
  const { shippingList } = useContext(AppContext);

  const sumPrice = (order: ShippingItem[]) => {
    let TotalPrice = 0;
    for (let i = 0; i < order.length; i++) {
      TotalPrice += order[i].price * order[i].quantity;
    }
    return TotalPrice;
  };

  return (
    <>
      {shippingList.length >= 1 ? (
        <div className="fadeIn mt-6 px-4 md:px-12 ">
          <h1
            className={`1200px:text-[70px] 1100px:text-[60px] pb-3 1000px:text-[50px] 800px:text-[45px] 600px:text-[40px] text-[35px] font-bold  gradient-text  text-center tracking-tight `}
          >
            {tHeader("shippingListReviewBtn")}
          </h1>
          <div className="bg-secondary p-5 rounded-3xl flex justify-between items-center gap-3 my-4 w-full md:w-[80%] mx-auto flex-col md:flex-row ">
            <p className=" text-[25px] font-bold ">
              {tHeader("payInFull")} : {sumPrice(shippingList)} {"  "}
              {tHeader("pound")}
            </p>
            <Link href={`/checkout`} className="">
              <Badge
                variant={`outline`}
                className="font-normal py-3 md:py-4 text-white text-[18px] bg-[#a8603a] hover:bg-[#947268] rounded-full hover:text-white w-[250px] flex justify-center items-center"
              >
                {" "}
                {tHeader("checkoutBtn")}
              </Badge>
            </Link>
          </div>
          <div className="my-12 grid grid-flow-row gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 px-3 pb-6">
            {shippingList?.map((product: ShippingItem, index: number) => (
              <div className="fadeIn" key={index}>
                <ProductsHome product={product} isList={true} isShip={true} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="fadeIn flex justify-center items-center my-6 flex-col gap-4 min-h-[450px]">
          <div className="flex justify-center items-center  flex-col gap-1">
            <TbShoppingBagX size={125} className=" text-muted-foreground" />
            <h1 className=" text-[25px] font-bold">
              {tHeader("shippingListTitle")}
            </h1>
            <p className="text-center sm:text-[18px] text-[15px]">
              {tHeader("shippingListdesc")}
            </p>
          </div>
          <Link href={`/store`} className="z-50">
            <MainBtn title={`${tHeader("shopNowBtn")}`} />
          </Link>
        </div>
      )}
    </>
  );
};

export default ShippingListPage;
