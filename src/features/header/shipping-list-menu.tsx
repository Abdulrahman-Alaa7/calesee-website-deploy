"use client";
import React, { useState, useContext } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { TbShoppingBagX } from "react-icons/tb";
import { Link } from "../../i18n/routing";
import { Button } from "../../components/ui/button";
import MainBtn from "../../components/ui/main-button";
import { AppContext } from "../../utils/AppContext";
import { Badge } from "../../components/ui/badge";
import dynamic from "next/dynamic";
import { Trash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Image from "next/image";
import { ScrollArea } from "../../components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { useLocale, useTranslations } from "next-intl";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";
import { ShippingItem } from "@/types/product.types";
import { trackEvent } from "@/utils/trackEvent";
import { generateSlug } from "@/utils/generateSlug";

const NotiShipping = dynamic(() => import("./noti-shipping"));

const ShippingListMenu = () => {
  const lang = useLocale();
  const tHeader = useTranslations("AllHeader");
  const [isOpen, setIsOpen] = useState(false);

  const {
    shippingList,
    handleDeleteItemShipping,
    handleDeleteAllShippingList,
    handleItemShippingIncreaseOrDecrease,
  } = useContext(AppContext);

  const sumPrice = (order: ShippingItem[]) => {
    let TotalPrice = 0;
    for (let i = 0; i < order?.length; i++) {
      TotalPrice += order[i].price * order[i].quantity;
    }
    return TotalPrice;
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const handleIncrease = (id: string, size?: string, color?: string) => {
    const currentItem = shippingList.find(
      (item) => item.id === id && item.size === size && item.color === color,
    );
    if (currentItem) {
      const newQuantity = currentItem.quantity + 1;
      handleItemShippingIncreaseOrDecrease(id, newQuantity, size, color);
    }
  };

  const handleDecrease = (id: string, size?: string, color?: string) => {
    const currentItem = shippingList.find(
      (item) => item.id === id && item.size === size && item.color === color,
    );
    if (currentItem && currentItem.quantity > 1) {
      const newQuantity = currentItem.quantity - 1;
      handleItemShippingIncreaseOrDecrease(id, newQuantity, size, color);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger
        name="Ship_Btn"
        accessKey="Open_Shippping_List"
        aria-label="Shipping_List"
        className="relative px-2 h-12 w-12 cursor-pointer  rounded-full  border border-input bg-background hover:bg-accent hover:text-accent-foreground   inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      >
        <NotiShipping />
        <ShoppingBag size={18} />
      </SheetTrigger>
      <SheetContent side={`bottom`} className="!max-h-[520px] rounded-t-3xl  ">
        <SheetTitle></SheetTitle>
        {shippingList?.length <= 0 ? (
          <div className="fadeIn flex justify-center items-center my-6 flex-col gap-4 py-8">
            <div className="flex justify-center items-center  flex-col gap-1">
              <TbShoppingBagX size={125} className=" text-muted-foreground" />
              <SheetTitle className=" text-[25px] font-bold">
                {tHeader("shippingListTitle")}
              </SheetTitle>
              <SheetDescription className="text-center sm:text-[18px] text-[15px]">
                {tHeader("shippingListdesc")}
              </SheetDescription>
            </div>
            <Link href={`/store`} onClick={handleLinkClick} className="z-50">
              <MainBtn
                accessKey="Store_Button_Shipping"
                title={`${tHeader("shopNowBtn")}`}
              />
            </Link>
          </div>
        ) : (
          <ScrollArea className="h-[520px] !w-full lg:!w-[50%] overflow-auto mx-auto">
            <Table className=" w-full" dir={lang === "ar" ? "rtl" : "ltr"}>
              <TableCaption className="pt-2 pb-36 ">
                {tHeader("shippingListCap")}
              </TableCaption>
              <TableHeader></TableHeader>
              <TableBody className=" mx-auto !w-full">
                {shippingList?.map((el, index: number) => (
                  <TableRow key={index} className="">
                    <TableCell className="font-medium flex gap-3 items-center">
                      <Link
                        href={`/store/${generateSlug(el.name)}-${el.id}`}
                        onClick={handleLinkClick}
                      >
                        <Image
                          src={el.mainImage}
                          alt={el.name}
                          width={70}
                          height={70}
                          className="object-cover object-center w-[100px] h-[70px]"
                        />
                      </Link>
                      <p className="flex flex-col">
                        <Link
                          href={`/store/${generateSlug(el.name)}-${el.id}`}
                          className="hover:underline hover:underline-offset-4 transition-all"
                          onClick={handleLinkClick}
                        >
                          {el.name.length > 28
                            ? `${el.name.substring(0, 28)}...`
                            : el.name}{" "}
                        </Link>
                        <span className="flex gap-1 items-center text-[#666] text-sm font-normal">
                          {el?.size && <>({el.size})</>}
                          {el?.color && (
                            <>
                              {" "}
                              -{" "}
                              <span
                                className={`w-4 h-4  shadow-lg rounded-full `}
                                style={{
                                  backgroundColor: `${el?.color}`,
                                }}
                              ></span>
                            </>
                          )}
                        </span>
                      </p>
                    </TableCell>
                    <TableCell className="!text-sm  flex justify-between items-center gap-2 mx-2">
                      <p className="flex gap-2 items-center">
                        <span className=" text-[14px] mx-2 text-sm rounded-3xl px-2 py-1 border">
                          {el.quantity}
                        </span>
                        {lang === "ar" ? (
                          <>
                            {el.price} {tHeader("pound")}
                          </>
                        ) : (
                          <>
                            {" "}
                            {tHeader("pound")} {el.price}
                          </>
                        )}
                      </p>
                      <div key={`${el.id}-${el.size}-${el.color}`}>
                        <div
                          className={`
        flex justify-center item-center gap-2 
        !transition-all fadeIn ${lang == "ar" && "flex-row-reverse"} `}
                        >
                          <Button
                            type="button"
                            className={`w-10 h-10 rounded-full   transition-all fadeIn`}
                            onClick={() =>
                              handleDecrease(el.id, el.size, el.color)
                            }
                            disabled={el.quantity === 1}
                            aria-label="less"
                            name="minus"
                            accessKey={`Less_quantity_${el.name}`}
                          >
                            <Minus size={20} />
                          </Button>

                          <Badge
                            className={`fadeIn transition-all shadow-md bg-gradient-to-r from-primary/10 via-primary/5 to-transparent text-md w-10 h-10 rounded-full font-bold text-black border border-[#9e9e9e29]`}
                          >
                            {el.quantity}
                          </Badge>

                          <Button
                            type="button"
                            className={`w-10 h-10 rounded-full  transition-all fadeIn`}
                            onClick={() =>
                              handleIncrease(el.id, el.size, el.color)
                            }
                            aria-label="More"
                            name="plus"
                            accessKey={`More_Quantity_${el.name}`}
                          >
                            <Plus size={20} />
                          </Button>
                        </div>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={`outline`}
                              className="rounded-full w-10 h-10"
                              onClick={() =>
                                handleDeleteItemShipping(
                                  el.id,
                                  el?.size,
                                  el?.color,
                                )
                              }
                            >
                              <Trash size={20} className="text-[crimson]" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent
                            className="bg-black text-white border-[#292524]"
                            side="top"
                          >
                            <p>{tHeader("deleteFromListBtn")}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter className="!w-full bg-background ">
                <TableRow className="w-full">
                  <TableCell className="flex justify-center items-center mx-auto mt-3 font-semibold text-muted-foreground text-[18px]">
                    {lang === "ar" ? (
                      <>
                        {sumPrice(shippingList)} {tHeader("pound")}
                      </>
                    ) : (
                      <>
                        {tHeader("pound")} {sumPrice(shippingList)}
                      </>
                    )}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
            <div className="fixed bottom-0 left-1/2 transform !w-full shadow-sm -translate-x-1/2  hover:bg-background rounded-3xl bg-background   ">
              <div className="flex justify-center items-center gap-2 py-6 bg-background border-t border-t-border ">
                <div>
                  <Link
                    href={`/checkout`}
                    className=" h-10 px-4 py-2 rounded-3xl shadow-md inline-flex justify-center items-center whitespace-nowrap  bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => {
                      handleLinkClick();
                      trackEvent({
                        event: "begin_checkout",
                        source: "header_cart",
                      });
                    }}
                  >
                    {tHeader("checkoutBtn")}
                  </Link>
                </div>
                <div>
                  <Link
                    href={`/bag`}
                    className=" h-10 px-4 py-2 rounded-3xl shadow-md inline-flex justify-center items-center whitespace-nowrap bg-secondary hover:opacity-80 hover:text-accent-foreground text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    onClick={handleLinkClick}
                  >
                    {tHeader("shippingListReviewBtn")}
                  </Link>
                </div>
                <div className="">
                  {" "}
                  <Button
                    variant={`destructive`}
                    className=" h-10  py-2 rounded-3xl hover:opacity-80"
                    onClick={() => handleDeleteAllShippingList()}
                  >
                    {tHeader("clearAllBrn")}
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ShippingListMenu;
