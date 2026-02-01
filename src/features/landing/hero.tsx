"use client";
import * as React from "react";
import { useLocale } from "next-intl";
import { Link } from "../../i18n/routing";
import Image from "next/image";
import { Truck } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Settings, Slides } from "@/types/landing.types";
import { trackEvent } from "@/utils/trackEvent";

type Props = {
  slides: Slides[];
  settings: Settings;
};

export default function Hero({ slides, settings }: Props) {
  const lang = useLocale();

  const isArabic = lang === "ar";

  const [activeIndex, setActiveIndex] = React.useState(0);
  const [animateKey, setAnimateKey] = React.useState(0);

  const autoplayPlugin = React.useRef(
    Autoplay({
      delay: 7000,
      stopOnInteraction: false,
    }),
  );

  const [carouselApi, setCarouselApi] = React.useState<CarouselApi>();

  React.useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setActiveIndex(carouselApi.selectedScrollSnap());
      setAnimateKey((prev) => prev + 1);
    };

    carouselApi.on("select", onSelect);
    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  return (
    <section
      className="relative w-full h-[700px] overflow-hidden rounded-3xl"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <Carousel
        setApi={setCarouselApi}
        plugins={[autoplayPlugin.current]}
        opts={{
          direction: isArabic ? "rtl" : "ltr",
        }}
        className="w-full h-full"
      >
        <CarouselContent className="h-full">
          {slides.map((slide, index) => (
            <CarouselItem key={slide.id} className="relative h-[835px]">
              <div className="absolute inset-0 z-0">
                <Image
                  src={slide.image}
                  alt={isArabic ? slide.titleAr : slide.titleEn}
                  fill
                  priority
                  className="object-cover brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/40 to-transparent" />
              </div>

              <div
                key={animateKey + "-" + index}
                className={`relative z-10 w-full lg:w-[80%] px-6 md:px-12 py-20 h-[750px] flex flex-col items-center mx-auto justify-center gap-8 text-center transition-all duration-500`}
              >
                <Badge className="animate-slidein opacity-0 [--slidein-delay:200ms] text-[13px] md:text-[15px] bg-[#a8603a] hover:bg-[#947268]/90 py-2 px-6 rounded-full text-white flex items-center gap-2">
                  <Truck size={70} />
                  <span>
                    {isArabic
                      ? settings?.freeShipDescAr
                      : settings?.freeShipDescEn}
                  </span>
                </Badge>

                <h1 className="text-white font-extrabold text-[42px] md:text-[70px] leading-tight animate-slidein opacity-0 [--slidein-delay:400ms]">
                  {isArabic ? slide.titleAr : slide.titleEn}
                </h1>

                <p className="text-white/90 text-[18px] md:text-[22px] max-w-[580px] leading-relaxed animate-slidein opacity-0 [--slidein-delay:600ms]">
                  {isArabic ? slide.descAr : slide.descEn}
                </p>

                <Link
                  href={slide.link}
                  onClick={() => {
                    trackEvent({
                      event: "hero_click_button",
                      source: "hero_section",
                    });
                  }}
                  className="bg-[#a8603a] hover:bg-[#947268]/90 text-white font-semibold text-lg px-10 py-4 rounded-full shadow-md transition-all duration-300 hover:scale-105 animate-slidein opacity-0 [--slidein-delay:800ms]"
                >
                  {isArabic ? slide.linkTitleAr : slide.linkTitleEn}
                </Link>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-20">
          {slides.length > 1 &&
            slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => carouselApi?.scrollTo(i)}
                className={`w-3 h-3 cursor-pointer rounded-full transition-all ${
                  activeIndex === i
                    ? "bg-[#a8603a] scale-125"
                    : "bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
        </div>
      </Carousel>
    </section>
  );
}
