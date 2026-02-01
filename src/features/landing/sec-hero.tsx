"use client";
import React from "react";
import SecHeroImg from "../../../public/assets/images/secHero.jpg";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { trackEvent } from "@/utils/trackEvent";

const SecHero = () => {
  const t = useTranslations("SecHero");
  const lang = useLocale();
  const isArabic = lang === "ar";

  const circleSize = "w-[150px] h-[150px] md:w-[250px] md:h-[250px]";

  return (
    <section
      className=" bg-secondary mx-auto py-12 lg:py-16 px-4 md:px-8  rounded-3xl"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="    flex flex-col lg:flex-row justify-between items-center gap-6 md:gap-12 px-3 py-4 md:px-8 md:py-8 ">
        <div className="w-full lg:w-2/5 flex justify-center items-center order-2 lg:order-1">
          <div className="flex flex-col gap-0.5">
            <div className={`flex mx-auto `}>
              <div className={`${circleSize} bg-[#f1e7dd] rounded-full`}></div>

              <div
                className={`${circleSize} bg-[#f2d5cf] rounded-b-full overflow-hidden`}
              >
                <Image
                  src={SecHeroImg}
                  alt="Calesee Shoes Collection"
                  priority
                  className="object-cover w-full h-full brightness-90"
                />
              </div>
            </div>

            <div className={`flex mx-auto ${isArabic ? "" : ""}`}>
              <div
                className={`${circleSize} bg-[#c98f84] ${
                  isArabic ? "rounded-l-full" : "rounded-r-full"
                }`}
              ></div>
              <div className={`${circleSize} bg-[#d9b9a0]  `}></div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col justify-center gap-4 text-center lg:text-start order-1 lg:order-2">
          <p className="text-xl text-[#a7603a] font-semibold">{t("para1")}</p>

          <h2 className="font-extrabold text-xl md:text-3xl 2xl:text-5xl text-gray-800 ">
            {t("mainDesc")}
          </h2>

          <Link
            href={`/store`}
            onClick={() => {
              trackEvent({
                event: "explore_collection_click",
                source: "landing_page",
              });
            }}
            className="mt-4 w-fit mx-auto lg:mx-0 bg-[#a8603a] hover:bg-[#947268] text-white font-bold py-5 px-8 rounded-full shadow-lg transition duration-300"
          >
            {isArabic ? "اكتشف مجموعتنا" : "Explore Our Collection"}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SecHero;
