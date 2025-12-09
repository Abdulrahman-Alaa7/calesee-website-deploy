import { useTranslations } from "next-intl";
import { Truck, CreditCard, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FEATURE_CARDS_DATA = [
  { key: "Feat1", icon: Truck, descriptionKey: "Feat1desc" },
  { key: "Feat2", icon: CreditCard, descriptionKey: "Feat2desc" },
  { key: "Feat3", icon: Heart, descriptionKey: "Feat3desc" },
];

export function WhyChooseUsSection() {
  const t = useTranslations("SomeFeatures");

  const brandPrimary = "text-[#8B4513]";
  const accentLight = "bg-gradient-to-br from-[#fbe5d8] to-[#f5d0b5]";

  return (
    <section className="pt-10 pb-16 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className={`text-4xl md:text-6xl font-extrabold text-center mb-16 tracking-tight ${brandPrimary}`}
        >
          {t("someFeaTitle")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {FEATURE_CARDS_DATA.map((feature) => {
            const IconComponent = feature.icon;

            return (
              <Card
                key={feature.key}
                className="group  bg-gradient-to-r from-primary/10 via-primary/5 to-transparent backdrop-blur-lg rounded-3xl p-8 border border-[#f0d9c4] shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
              >
                <CardHeader className="p-0 mb-2 flex items-center justify-center">
                  <div
                    className={`w-24 h-24 rounded-3xl ${accentLight} flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-inner`}
                  >
                    <IconComponent
                      className={`w-12 h-12 ${brandPrimary} transition-all duration-300 group-hover:scale-110`}
                    />
                  </div>
                </CardHeader>

                <CardContent className="p-0 text-center">
                  <CardTitle
                    className={`text-2xl font-bold mb-4 ${brandPrimary}`}
                  >
                    {t(`${feature.key}Tit`)}
                  </CardTitle>
                  <p className="text-gray-600 text-base leading-relaxed">
                    {t(feature.descriptionKey)}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
