import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const ReturnandRefundPolicy = () => {
  const lang = useLocale();
  const tHeader = useTranslations("AllHeader");
  const tPage = useTranslations("return-and-refund-policy");

  return (
    <section
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="min-h-screen w-full py-3 pb-12 md:py-12 animate-slide-in bg-transparent"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4 md:mb-12">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-20 
                       bg-clip-text text-transparent bg-gradient-to-r from-[#a7603a] to-[#c98f84]"
          >
            {tHeader("returnAndRe")}
          </h1>
        </div>

        <Card className="rounded-3xl shadow-md overflow-hidden bg-[#fdf9f8]  border border-transparent">
          <CardContent className="p-6 sm:p-8 md:p-10">
            <div
              className={`text-[#444]  font-Poppins leading-relaxed
                          text-sm sm:text-base md:text-lg space-y-6 ${
                            lang === "ar" ? "text-right" : "text-left"
                          }`}
            >
              <Section title={tPage("title1")} />
              <p>{tPage("p1")}</p>
              <p>
                {tPage("p2")}&nbsp;
                <a
                  href="mailto:info@calesee.com"
                  className="text-[#a7603a] font-medium hover:underline"
                >
                  info@calesee.com
                </a>
                &nbsp;{tPage("p21")}
              </p>
              <p>{tPage("p3")}</p>

              <Separator className="my-6 bg-[#d9b9a0]/40 " />

              <Section title={tPage("title2")} />
              <p>{tPage("pt21")}</p>

              <Separator className="my-6 bg-[#d9b9a0]/40 " />

              <Section title={tPage("title3")} />
              <p>
                {tPage("pt31")}&nbsp;
                <a
                  href="mailto:info@calesee.com"
                  className="text-[#a7603a] font-medium hover:underline"
                >
                  info@calesee.com
                </a>
                &nbsp;{tPage("pt312")}
              </p>
              <p>{tPage("pt32")}</p>

              <Separator className="my-6 bg-[#d9b9a0]/40 " />

              <Section title={tPage("title4")} />
              <p>
                {tPage("pt41")}&nbsp;
                <a
                  href="mailto:info@calesee.com"
                  className="text-[#a7603a] font-medium hover:underline"
                >
                  info@calesee.com
                </a>
                .
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

const Section = ({ title }: { title?: string }) => {
  if (!title) return null;
  return (
    <h2 className="text-2xl sm:text-2xl md:text-3xl font-semibold text-[#a7603a] mb-3">
      {title}
    </h2>
  );
};

export default ReturnandRefundPolicy;
