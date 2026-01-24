import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "../../i18n/routing";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const ShippingPolicy = () => {
  const lang = useLocale();
  const tHeader = useTranslations("AllHeader");
  const tPage = useTranslations("shipping-policy");

  return (
    <section
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="min-h-screen w-full py-3 pb-12  md:py-12  animate-slide-in bg-transparent"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4 md:mb-10">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-20 
                       bg-clip-text text-transparent bg-gradient-to-r from-[#a7603a] to-[#c98f84]"
          >
            {tHeader("shippingPol")}
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
              <Separator className="my-6 bg-[#d9b9a0]/40 " />

              <Section title={tPage("title2")} />
              <p>{tPage("p2")}</p>
              <Separator className="my-6 bg-[#d9b9a0]/40 " />

              <Section title={tPage("title3")} />
              <p>{tPage("p3")}</p>
              <Separator className="my-6 bg-[#d9b9a0]/40 " />

              <Section title={tPage("title4")} />
              <p>{tPage("p4")}</p>
              <Separator className="my-6 bg-[#d9b9a0]/40 " />

              <Section title={tPage("title5")} />
              <p>{tPage("p5")}</p>
              <Separator className="my-6 bg-[#d9b9a0]/40 " />

              <Section title={tPage("title6")} />
              <p>
                {tPage("p61")}&nbsp;
                <a
                  href="mailto:info@calesee.com"
                  className="text-[#a7603a] font-medium hover:underline"
                >
                  info@calesee.com
                </a>
                &nbsp;{tPage("p62")}
              </p>
              <Separator className="my-6 bg-[#d9b9a0]/40 " />

              <Section title={tPage("title7")} />
              <p>
                {tPage("p71")}&nbsp;
                <Link
                  href="/return-and-refund-policy"
                  className="text-[#a7603a] font-medium hover:underline"
                >
                  {tPage("p72")}
                </Link>
                &nbsp;{tPage("p73")}
              </p>
              <Separator className="my-6 bg-[#d9b9a0]/40 " />

              <Section title={tPage("title8")} />
              <p>{tPage("p8")}</p>
              <Separator className="my-6 bg-[#d9b9a0]/40 " />

              <Section title={tPage("title9")} />
              <p>
                {tPage("p9")}&nbsp;
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

export default ShippingPolicy;
