import React from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";

const PrivacyPolicy = () => {
  const tHeader = useTranslations("AllHeader");
  const tPage = useTranslations("privacy-policy");

  return (
    <section className="animate-slide-in px-4 sm:px-8 md:px-12 lg:px-20 py-3 md:py-12 max-w-5xl mx-auto">
      <h1 className="text-center text-3xl sm:text-4xl md:text-5xl font-extrabold leading-20 tracking-tight mb-4 md:mb-10 bg-gradient-to-r from-[#a7603a] via-[#c98f84] to-[#f2d5cf] text-transparent bg-clip-text">
        {tHeader("privacyPol")}
      </h1>

      <Card className="shadow-md border-none bg-[#fdf9f8]  rounded-3xl overflow-hidden">
        <CardContent className="p-6 sm:p-8 md:p-10">
          <div className="text-[#444] font-Poppins leading-relaxed text-sm sm:text-base md:text-lg space-y-6">
            <p>{tPage("p1")}</p>
            <p>{tPage("p2")}</p>

            <Section title={tPage("title1")} />
            <SubSection title={tPage("title2")} />
            <ul className="list-disc list-inside space-y-2 ps-4">
              <li>{tPage("lt1")}</li>
              <li>{tPage("lt2")}</li>
              <li>{tPage("lt3")}</li>
            </ul>

            <SubSection title={tPage("title3")} />
            <p>{tPage("pt2")}</p>

            <Section title={tPage("title4")} />
            <p>{tPage("pt3")}</p>
            <ul className="list-disc list-inside space-y-2 ps-4">
              <li>{tPage("lt41")}</li>
              <li>{tPage("lt42")}</li>
              <li>{tPage("lt43")}</li>
              <li>{tPage("lt44")}</li>
            </ul>

            <Section title={tPage("title5")} />
            <p>{tPage("pt4")}</p>

            <Section title={tPage("title6")} />
            <p>{tPage("pt5")}</p>

            <Section title={tPage("title7")} />
            <p>{tPage("pt6")}</p>

            <Section title={tPage("title8")} />
            <p>{tPage("pt7")}</p>

            <Section title={tPage("title9")} />
            <p>
              {tPage("pt8")}{" "}
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
    </section>
  );
};

const Section = ({ title }: { title: string }) => (
  <h2 className="text-2xl sm:text-3xl font-semibold text-[#a7603a] mt-10 mb-4 border-s-4 border-[#c98f84] ps-3">
    {title}
  </h2>
);

const SubSection = ({ title }: { title: string }) => (
  <h3 className="text-xl font-semibold text-[#c98f84] mt-6 mb-2">{title}</h3>
);

export default PrivacyPolicy;
