import React from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import LOGO from "../../../public/assets/images/logo-png.png";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const AboutUs = () => {
  const lang = useLocale();
  const tHeader = useTranslations("AllHeader");
  const tAboutUs = useTranslations("About-Us");

  return (
    <section
      dir={lang == "ar" ? "rtl" : "lrt"}
      className="min-h-screen w-full py-3 md:py-12  animate-slide-in"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4 md:mb-10">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-20
            bg-clip-text text-transparent bg-gradient-to-r from-[#a7603a] to-[#c98f84]"
          >
            {tHeader("about-us")}
          </h1>
          <p className="text-[#5c4b44] dark:text-[#e5e5e5] text-base md:text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
            {tAboutUs("p1")}
          </p>
        </div>

        <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-10 md:gap-20 mb-16">
          <div
            className={`flex-1 ${lang == "ar" ? "text-right" : "text-left"}`}
          >
            <p className="text-[#4b3b35] dark:text-[#dcdcdc] leading-relaxed text-[17px] mb-4">
              {tAboutUs("p2")}
            </p>
            <p className="text-[#4b3b35] dark:text-[#dcdcdc] leading-relaxed text-[17px] mb-4">
              {tAboutUs("p3")}
            </p>
            <p className="text-[#4b3b35] dark:text-[#dcdcdc] leading-relaxed text-[17px]">
              {tAboutUs("p4")}
            </p>
          </div>

          <div className="flex justify-center md:justify-start flex-1">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#c98f84] to-[#a7603a] rounded-3xl blur-lg opacity-20"></div>
              <Card className="rounded-3xl shadow-lg overflow-hidden backdrop-blur-sm bg-[#fef9f8]/80 dark:bg-gray-800/80 border border-[#d9b9a0]/50">
                <CardContent className="p-6 flex justify-center items-center">
                  <Image
                    src={LOGO}
                    alt="شعار المتجر"
                    width={350}
                    height={350}
                    className="rounded-2xl object-contain w-[250px] sm:w-[300px] md:w-[350px] h-auto"
                    priority
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Separator className="my-12 bg-[#d9b9a0]/40 dark:bg-gray-700" />

        <div className={`mb-16 ${lang == "ar" ? "text-right" : "text-left"}`}>
          <h2 className="text-2xl md:text-3xl font-semibold text-[#a7603a] mb-4">
            {tAboutUs("titleV")}
          </h2>
          <p
            className={`text-[#4b3b35] dark:text-[#dcdcdc] leading-relaxed text-[17px] max-w-3xl ${
              lang == "ar" ? "ml-auto" : "mr-auto"
            } `}
          >
            {tAboutUs("pV1")}
          </p>
        </div>

        <div className={`${lang == "ar" ? "text-right" : "text-left"}`}>
          <h2 className="text-2xl md:text-3xl font-semibold text-[#a7603a] mb-4">
            {tAboutUs("titleM")}
          </h2>
          <p
            className={`text-[#4b3b35] dark:text-[#dcdcdc] leading-relaxed text-[17px] max-w-3xl ${
              lang == "ar" ? "ml-auto" : "mr-auto"
            } `}
          >
            {tAboutUs("pM1")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
