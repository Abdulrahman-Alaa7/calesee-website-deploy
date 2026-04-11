"use client";
import React, { useContext, useState } from "react";
import { Heart, Trash, ChevronRight } from "lucide-react";
import { TbHeartX } from "react-icons/tb";
import { Link } from "../../i18n/routing";
import { Button } from "../../components/ui/button";
import MainBtn from "../../components/ui/main-button";
import { AppContext } from "../../utils/AppContext";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import dynamic from "next/dynamic";
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
import { generateSlug } from "@/utils/generateSlug";
const NotiWishing = dynamic(() => import("./noti-wishing"));

const WishingListMenu = () => {
  const lang = useLocale();

  const tHeader = useTranslations("AllHeader");
  const [isOpen, setIsOpen] = useState(false);

  const {
    wishingList,
    handleDeleteFromWishingList,
    handleDeleteAllWishingList,
  } = useContext(AppContext);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger
        name="Fav_Btn"
        accessKey="Open_Fav_List"
        aria-label="Wishing_List"
        className="relative rounded-full cursor-pointer  w-12 h-12  border border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      >
        <NotiWishing />
        <Heart size={18} />
      </SheetTrigger>
      <SheetContent side={`bottom`} className="!max-h-[520px] rounded-t-3xl ">
        <SheetTitle></SheetTitle>
        {wishingList?.length <= 0 ? (
          <div className="fadeIn flex justify-center items-center my-6 flex-col gap-4 py-8">
            <div className="flex justify-center items-center  flex-col gap-1">
              <TbHeartX size={125} className=" text-muted-foreground" />
              <SheetTitle className=" text-[25px] font-bold">
                {tHeader("wishingListTitle")}
              </SheetTitle>
              <SheetDescription className="text-center sm:text-[18px] text-[15px]">
                {tHeader("wishingListdesc")}
              </SheetDescription>
            </div>
            <Link href={`/store`} className="z-50" onClick={handleLinkClick}>
              <MainBtn
                accessKey="Store_Button_Wishing"
                title={`${tHeader("shopNowBtn")}`}
              />
            </Link>
          </div>
        ) : (
          <ScrollArea className="h-[550px] w-full lg:w-[50%] overflow-auto mx-auto">
            <Table className="mt-6 w-full" dir={lang === "ar" ? "rtl" : "ltr"}>
              <TableCaption className="pt-2 pb-36 ">
                {tHeader("wishingListCap")}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]"></TableHead>
                  <TableHead>{tHeader("wishingListName")}</TableHead>
                  <TableHead>{tHeader("wishingListViewHead")}</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="mx-auto">
                {wishingList.map((el) => (
                  <TableRow key={el.id} className="items-center">
                    <TableCell className="font-medium">
                      <Image
                        src={el.mainImage}
                        alt={el.name}
                        width={70}
                        height={70}
                        className="object-cover object-center w-[100px] h-[50px]"
                      />
                    </TableCell>
                    <TableCell className="font-semibold my-3">
                      {el.name.length > 13
                        ? `${el.name.substring(0, 13)}...`
                        : el.name}
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link
                              href={`/store/${generateSlug(el.name)}-${el.id}`}
                              className="rounded-full h-10 w-10 shadow-md inline-flex justify-center items-center whitespace-nowrap border border-input bg-background hover:bg-accent hover:text-accent-foreground text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                              onClick={handleLinkClick}
                            >
                              <ChevronRight
                                size={22}
                                className={`${lang === "ar" && "rotate-180"}`}
                              />
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent
                            className="bg-black text-white border-[#292524]"
                            side="top"
                          >
                            <p>{tHeader("wishingListViewProducToolTip")}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={`outline`}
                              className="rounded-full"
                              onClick={() => handleDeleteFromWishingList(el.id)}
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
            </Table>
            <div className="fixed bottom-0 left-1/2 transform !w-full shadow-sm -translate-x-1/2  hover:bg-background rounded-3xl bg-background   ">
              <div className="flex justify-center items-center gap-2 py-6 bg-background border-t border-t-border ">
                <div>
                  <Link
                    href={`/wishlist`}
                    className=" h-10 px-4 py-2  inline-flex justify-center items-center whitespace-nowrap rounded-3xl bg-secondary hover:opacity-80 hover:text-accent-foreground text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    onClick={handleLinkClick}
                  >
                    {tHeader("wishingListReviewBtn")}
                  </Link>
                </div>
                <div className="">
                  {" "}
                  <Button
                    variant={`destructive`}
                    className=" h-10  py-2 hover:opacity-80"
                    onClick={() => handleDeleteAllWishingList()}
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

export default WishingListMenu;
