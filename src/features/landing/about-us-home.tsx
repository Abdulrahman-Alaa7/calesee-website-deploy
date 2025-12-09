import React from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import AboutHomeImage from "../../../public/assets/images/home-about.jpg";

const AboutUsHome = () => {
  const lang = useLocale();
  const t = useTranslations("MoreInfoAboutUs");
  return (
    <div className=" bg-secondary  flex justify-between lg:justify-center rounded-t-3xl items-center flex-col lg:flex-row mx-auto gap-3 lg:gap-36 py-12 lg:py-16 px-3 lg:px-26">
      <div className="w-full xl:w-1/2  !flex flex-col ">
        <div
          className={`w-[200px]  h-[170px]  bg-[#c98f84] ${
            lang === "ar" ? "rounded-l-full mr-auto" : "rounded-r-full ml-auto"
          } `}
        ></div>
        <div
          className={`bg-[#f1e7dd] w-[350px] sm:w-[370px] min-h-[250px] rounded-3xl p-8 ${
            lang === "ar" ? "mr-auto" : "ml-auto"
          } `}
        >
          <h3 className="font-bold text-[25px] mb-2">{t("moreInfoTitle")}</h3>
          <p className="text-[20px]">{t("moreInfodesc")}</p>
        </div>
      </div>
      <div className="relative w-full xl:w-1/2 flex justify-center items-center px-0 lg:px-3">
        <div
          className={`relative w-full lg:w-[80%] h-[500px] bg-[#d9b9a0] overflow-hidden shadow-xl 
 ${
   lang === "ar"
     ? " rounded-3xl lg:rounded-bl-[250px] lg:rounded-tr-[80px]"
     : "rounded-3xl lg:rounded-br-[250px] lg:rounded-tl-[80px]"
 }

   `}
        >
          <Image
            src={AboutHomeImage}
            alt="About_Us_Home_Image"
            className="object-cover w-full h-full object-center"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsHome;
