"use client";
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";
import { Link } from "../../i18n/routing";
import { Separator } from "../../components/ui/separator";
import { useLocale, useTranslations } from "next-intl";
import { CiMenuBurger } from "react-icons/ci";
import { FaInstagram, FaFacebookF, FaTiktok } from "react-icons/fa";

type MenuLink = {
  id: string;
  href: string;
  label: string;
  storeCategory: string | null;
};

const menuLinks = [
  {
    id: "01",
    href: "/",
    label: "mainTitBreak",
    storeCategory: null as string | null,
  },
  { id: "02", href: "/store", label: "footLink1", storeCategory: null },
  { id: "03", href: "/store", label: "footLinkNew", storeCategory: "new" },
  { id: "04", href: "/store", label: "footLinkHot", storeCategory: "hot" },
  { id: "05", href: "/categories", label: "footLinkHot", storeCategory: null },
  { id: "06", href: "/about-us", label: "footLink2", storeCategory: null },
  {
    id: "07",
    href: "/privacy-policy",
    label: "footLink4",
    storeCategory: null,
  },
  {
    id: "08",
    href: "/terms-of-service",
    label: "footLink5",
    storeCategory: null,
  },
  {
    id: "09",
    href: "/shipping-policy",
    label: "footLink6",
    storeCategory: null,
  },
  {
    id: "10",
    href: "/return-and-refund-policy",
    label: "footLink7",
    storeCategory: null,
  },
];

const socialLinks = [
  {
    icon: <FaInstagram />,
    href: "https://www.instagram.com/calesee.eg?igsh=MWtreWp3eDRsaHJkdQ==",
    label: "Instagram",
  },
  {
    icon: <FaFacebookF />,
    href: "https://www.facebook.com/share/1BoNrxRYde/",
    label: "Facebook",
  },
  {
    icon: <FaTiktok />,
    href: "https://www.tiktok.com/@calesee.eg?_r=1&_t=ZS-91hVaGDjwPq",
    label: "TikTok",
  },
];

const MoreHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const tHeader = useTranslations("AllHeader");
  const tFooter = useTranslations("AllFooter");
  const t = useTranslations("HomeProducts");
  const lang = useLocale();

  const closeMenu = () => setIsOpen(false);

  const handleNavigationItemClick = (item: MenuLink) => {
    closeMenu();

    if (typeof window !== "undefined" && item.href === "/store") {
      if (item.storeCategory === "hot") {
        sessionStorage.setItem("selectedStoreCategory", "hot");
      } else {
        sessionStorage.removeItem("selectedStoreCategory");
      }
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger
        aria-label="Menu"
        className="hover:bg-accent cursor-pointer hover:text-accent-foreground h-12 w-12 inline-flex items-center justify-center rounded-full transition-all duration-300"
      >
        <CiMenuBurger size={25} />
      </SheetTrigger>

      <SheetContent
        side={lang === "ar" ? "left" : "right"}
        className={`${
          lang == "ar"
            ? "rounded-tr-3xl rounded-br-3xl"
            : "rounded-tl-3xl rounded-bl-3xl"
        } px-6 py-8 backdrop-blur-md shadow-2xl transition-all duration-500 w-[360px] h-auto max-h-[100vh] overflow-y-auto`}
      >
        <SheetHeader className="mb-2 text-center p-0">
          <SheetTitle
            className={`text-2xl sm:text-3xl ${
              lang == "ar" && "text-center"
            } font-bold text-[#a8603a] tracking-wide uppercase`}
          >
            {tHeader("menuTitle")}
          </SheetTitle>
        </SheetHeader>

        <Separator className=" bg-[#9e9e9e29]" />

        <div className="flex flex-col gap-1 fadeIn">
          {menuLinks.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => handleNavigationItemClick(item)}
              className="group relative gap-1 flex items-start w-full py-2 transition-all duration-300 hover:translate-x-2 uppercase"
            >
              <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900  group-hover:text-[#947268] transition-colors duration-300">
                {item.href === "/categories"
                  ? t("productsFilCat")
                  : tFooter(item.label)}
              </span>
              <span className="text-[10px] sm:text-xs text-[#a8603a] mb-1 tracking-wider group-hover:text-[#947268] transition-colors duration-300">
                {item.id}
              </span>
            </Link>
          ))}
        </div>

        <Separator className=" bg-[#9e9e9e29]" />

        <div className="flex items-center justify-center gap-5 mt-3">
          {socialLinks.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg sm:text-xl text-gray-700  hover:text-[#a8603a] transition-all duration-300 hover:scale-110"
            >
              {s.icon}
            </a>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MoreHeader;
