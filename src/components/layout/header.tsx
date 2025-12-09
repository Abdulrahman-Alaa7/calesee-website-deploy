"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "../../i18n/routing";
import LangMenu from "../../features/header/lang-menu";
import InputSearch from "../../features/header/input-search";
import { useTranslations } from "next-intl";
import WishingListMenu from "../../features/header/wishlist-menu";
import ShippingListMenu from "../../features/header/shipping-list-menu";
import MoreHeader from "../../features/header/more-header";
import Logo from "../../../public/assets/images/logo-png.png";

const Header = () => {
  const [active, setActive] = useState(false);
  const tHeader = useTranslations("AllHeader");
  const tFooter = useTranslations("AllFooter");
  const t = useTranslations("HomeProducts");

  useEffect(() => {
    const handleScroll = () => {
      setActive(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const linksData = [
    {
      url: "/",
      text: `${tFooter("mainTitBreak")}`,
      storeCategory: null as string | null,
    },
    {
      url: "/store",
      text: `${tHeader("store")}`,
      storeCategory: null,
    },
    {
      url: "/store",
      text: `${tFooter("footLinkNew")}`,
      storeCategory: "new",
    },
    {
      url: "/store",
      text: `${tFooter("footLinkHot")}`,
      storeCategory: "hot",
    },
    {
      url: "/categories",
      text: `${t("productsFilCat")}`,
      storeCategory: null,
    },
    {
      url: "/about-us",
      text: `${tHeader("about-us")}`,
      storeCategory: null,
    },
  ];

  return (
    <header
      className={`sticky inset-x-0 top-0 z-50 mx-auto w-full md:px-2 transition-all duration-300 ${
        active && "border-b  border-[#ccc] shadow   "
      } bg-white/80 dark:!bg-background py-2  backdrop-blur-lg`}
      aria-label="Main Navigation"
    >
      <div className="px-1 relative">
        <div className="flex  items-center justify-between relative">
          <div className="flex items-center  ">
            <Link
              href="/"
              aria-label="Go to Homepage"
              className="relative w-[65px] h-[65px] overflow-hidden  "
            >
              <Image
                src={Logo}
                alt="Calesse Logo"
                priority
                width={65}
                height={65}
                className="object-cover  w-full h-full mx-auto"
              />
            </Link>
          </div>
          <div className="hidden lg:flex justify-center items-center absolute left-1/2 -translate-x-1/2 w-[55%]">
            {linksData.map((link, index: number) => (
              <Link
                key={index}
                className="inline-block px-4 py-2 text-xs xl:text-sm 2xl:text-base rounded-3xl text-gray-900 dark:text-gray-100 dark:hover:text-gray-900 transition-all duration-200 hover:bg-secondary hover:text-gray-900"
                href={link.url}
                onClick={() => {
                  if (typeof window !== "undefined" && link.url === "/store") {
                    if (link.storeCategory === "hot") {
                      sessionStorage.setItem("selectedStoreCategory", "hot");
                    } else {
                      sessionStorage.removeItem("selectedStoreCategory");
                    }
                  }
                }}
              >
                {link.text}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-1 mx-1">
            <div className="flex items-center gap-0">
              <LangMenu />
              <InputSearch />
            </div>
            <WishingListMenu />
            <ShippingListMenu />
            <MoreHeader />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
