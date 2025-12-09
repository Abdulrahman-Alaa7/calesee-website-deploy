import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const TermsOfService = () => {
  const lang = useLocale();
  const tHeader = useTranslations("AllHeader");
  const tPage = useTranslations("terms-of-service");

  return (
    <section
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="min-h-screen w-full py-3 pb-12 md:py-12 animate-slide-in bg-transparent"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight 
                       bg-clip-text text-transparent bg-gradient-to-r from-[#a7603a] to-[#c98f84]"
          >
            {tHeader("termsofser")}
          </h1>
        </div>

        <Card className="rounded-3xl shadow-md overflow-hidden bg-[#fdf9f8] dark:bg-[#151515]/70 border border-transparent">
          <CardContent className="p-6 sm:p-8 md:p-10">
            <div
              className={`text-[#444] dark:text-[#ffffffb3] font-Poppins leading-relaxed
                          text-sm sm:text-base md:text-lg space-y-10 ${
                            lang === "ar" ? "text-right" : "text-left"
                          }`}
            >
              {Array.from({ length: 9 }).map((_, i) => {
                const index = i + 1;
                const title = tPage(`title${index}`);
                const paragraph = tPage(`p${index}`);

                return (
                  <div key={index}>
                    {title && (
                      <h2 className="text-2xl sm:text-2xl md:text-3xl font-semibold text-[#a7603a] mb-3">
                        {title}
                      </h2>
                    )}
                    {paragraph && (
                      <p className="text-[#4b3b35] dark:text-[#dcdcdc] leading-relaxed">
                        {paragraph}
                        {index === 9 && (
                          <>
                            {" "}
                            <a
                              href="mailto:info@calesee.com"
                              className="text-[#a7603a] font-medium hover:underline"
                            >
                              info@calesee.com
                            </a>
                            .
                          </>
                        )}
                      </p>
                    )}
                    {index !== 9 && (
                      <Separator className="my-8 bg-[#d9b9a0]/40 dark:bg-gray-700" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default TermsOfService;
