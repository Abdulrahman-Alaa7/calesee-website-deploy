"use client";
import React from "react";
import Image from "next/image";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "../../components/ui/tooltip";
import { Link as LinkNav } from "../../i18n/routing";
import { Mail, MapPin, Phone } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import LogoPng from "../../../public/assets/images/logo.png";
import { Separator } from "../../components/ui/separator";
import { useQuery } from "@apollo/client/react";
import { GET_SETTINGS } from "@/graphql/actions/queries/getSettings";
import { Settings } from "@/types/landing.types";

interface SettingsData {
  getSettings: Settings[];
}

const Footer = () => {
  const tFooter = useTranslations("AllFooter");
  const t = useTranslations("HomeProducts");
  const lang = useLocale();
  const { data, loading } = useQuery<SettingsData>(GET_SETTINGS);
  const featShip = data?.getSettings[0];

  const socialLinks = [
    {
      href: "https://www.instagram.com/calesee.eg?igsh=MWtreWp3eDRsaHJkdQ==",
      imgSrc: <FaInstagram size={25} />,
      alt: "Instagram logo",
      tooltipText: `${tFooter("FolloInsta")}`,
    },
    {
      href: "https://www.tiktok.com/@calesee.eg?_r=1&_t=ZS-91hVaGDjwPq",
      imgSrc: <FaTiktok size={25} />,
      alt: "tiktok Logo",
      tooltipText: `${tFooter("FolloTikTok")}`,
    },
    {
      href: "https://www.facebook.com/share/1BoNrxRYde/",
      imgSrc: <FaFacebook size={25} />,
      alt: "Facebook Logo",
      tooltipText: `${tFooter("FolloFacebook")}`,
    },
  ];

  const footerStoreLinks = [
    { href: "/store", text: tFooter("footLink1"), type: "store" as const },
    {
      href: "/store?category=new",
      text: tFooter("footLinkNew"),
      type: "new" as const,
    },
    {
      href: "/store?category=hot",
      text: tFooter("footLinkHot"),
      type: "hot" as const,
    },
    {
      href: "/categories",
      text: t("productsFilCat"),
      type: "category" as const,
    },
  ];

  return (
    <footer className="text-center bg-background" aria-label="Footer">
      <Separator className=" bg-[#9e9e9e29]" />

      <div
        className={`mx-6 my-3 py-4 text-center ${
          lang == "ar" ? "md:!text-right" : "md:text-left"
        } `}
      >
        <div className="grid-1 grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div className=" flex flex-col gap-6  ">
            <LinkNav
              href={`/`}
              className="w-fit  flex items-center justify-center mx-auto font-semibold md:justify-start  "
            >
              <Image
                src={LogoPng}
                alt="Logo_Footer"
                width={100}
                height={100}
                className="rounded-lg"
              />
            </LinkNav>
            <div className="flex items-center  mx-auto  md:gap-6 gap-6">
              <TooltipProvider>
                {socialLinks.map((link, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild className="">
                      <Link
                        href={link.href}
                        className="text-gray-700  text-xl hover:text-[#a8603a] transition-all duration-300 hover:scale-110"
                        target="_blank"
                        aria-label={`Follow us on ${link.alt.split(" ")[0]}`}
                      >
                        {link.imgSrc}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent
                      className="bg-black text-white border-[#292524]"
                      side="top"
                    >
                      <p>{link.tooltipText}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          </div>

          <div>
            <h2 className="mb-4 flex justify-center font-semibold md:justify-start text-[20px]">
              {tFooter("linkTitle1")}
            </h2>
            <div className="flex flex-col gap-2">
              {[
                { href: "/about-us", text: tFooter("footLink2") },
                { href: "/privacy-policy", text: tFooter("footLink4") },
                { href: "/terms-of-service", text: tFooter("footLink5") },
                { href: "/shipping-policy", text: tFooter("footLink6") },
                {
                  href: "/return-and-refund-policy",
                  text: tFooter("footLink7"),
                },
              ].map((link, index) => (
                <LinkNav
                  key={index}
                  href={link.href}
                  className="w-fit mx-auto md:mx-0 hover:underline hover:underline-offset-4 text-[#666] leading-loose text-[14px]  hover:text-primary  transition-all duration-300"
                >
                  {link.text}
                </LinkNav>
              ))}
            </div>
          </div>
          <div>
            <h2 className="mb-4 flex justify-center font-semibold md:justify-start text-[20px]">
              {tFooter("linkTitle2")}
            </h2>
            <div className="flex flex-col gap-2">
              {footerStoreLinks.map((link, index) => (
                <LinkNav
                  key={index}
                  href={link.href}
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      if (link.type === "hot") {
                        sessionStorage.setItem("selectedStoreCategory", "hot");
                      } else {
                        sessionStorage.removeItem("selectedStoreCategory");
                      }
                      if (link.type === "new") {
                        sessionStorage.setItem("selectedStoreCategory", "new");
                      } else {
                        sessionStorage.removeItem("selectedStoreCategory");
                      }
                    }
                  }}
                  className="w-fit mx-auto md:mx-0 hover:underline hover:underline-offset-4 text-[#666] leading-loose text-[14px]  hover:text-primary  transition-all duration-300"
                >
                  {link.text}
                </LinkNav>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center items-center md:justify-start md:items-start gap-1">
            <h2 className="text-left mb-4 flex justify-center font-semibold md:justify-start text-[20px]">
              {tFooter("contactTitle")}
            </h2>

            {loading ? (
              <p>...</p>
            ) : (
              <p
                dir="ltr"
                className="text-left mb-4 flex items-center justify-center md:justify-start gap-2 text-[#666] leading-loose text-[14px] "
              >
                <MapPin />
                {featShip?.address}
              </p>
            )}

            <Link
              dir="ltr"
              href={`mailto:info@calesee.com`}
              className="text-left  md:mx-0 mb-4 flex items-center justify-center md:justify-start gap-2 text-[#666] leading-loose text-[14px]  hover:!text-primary  !transition-all !duration-300"
            >
              <Mail />
              info@calesee.com
            </Link>
            <Link
              dir="ltr"
              href={`tel:+201098198827`}
              className="text-left md:mx-0 mb-4 flex items-center justify-center md:justify-start gap-2 text-[#666] leading-loose text-[14px] hover:text-primary  transition-all duration-300"
            >
              <Phone /> <span>+20 1098 198 827</span>
            </Link>
          </div>
        </div>
      </div>
      <Separator className=" bg-[#9e9e9e29]" />
      <div
        className={`bg-background p-6 text-center flex justify-center items-center gap-1 text-sm text-gray-700 `}
        dir="ltr"
      >
        <div
          className={`flex justify-center items-center  gap-1 text-sm text-gray-700`}
        >
          &copy; <span>{new Date().getFullYear()}</span>
        </div>
        <span className="font-semibold text-primary ">
          {tFooter("lastPFooter")}
        </span>{" "}
        | {tFooter("allrights")}
      </div>
    </footer>
  );
};

export default Footer;
