"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { ArrowLeft, ArrowRight, Maximize2 } from "lucide-react";
import { GridTileImage } from "./tile";
import { useProduct } from "./product-context";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";
import Lightbox from "./light-box";

export interface ImageItem {
  src: string;
  altText: string;
  linkedColorHex?: string | null;
  isMain?: boolean;
}

export interface GalleryController {
  goToImageByColor: (hex: string) => void;
}

export interface GalleryProps {
  mainImage: ImageItem;
  images?: ImageItem[];
  onRegisterController?: (controller: GalleryController) => void;
}

export function Gallery({
  mainImage,
  images = [],
  onRegisterController,
}: GalleryProps) {
  const lang = useLocale();
  const dir: "rtl" | "ltr" = lang === "ar" ? "rtl" : "ltr";

  const [thumbApi, setThumbApi] = useState<CarouselApi | null>(null);
  const { state, updateImage, openLightbox } = useProduct();

  const allImages: ImageItem[] = useMemo(() => {
    const validMain =
      mainImage?.src && mainImage?.altText ? mainImage : undefined;

    const validImages = Array.isArray(images)
      ? images.filter((i) => i?.src && i?.altText)
      : [];

    return [validMain, ...validImages].filter((i): i is ImageItem =>
      Boolean(i),
    );
  }, [mainImage, images]);

  const imageIndex = useMemo(() => {
    if (!allImages.length) return 0;
    const idx = Number.isFinite(Number(state.image)) ? Number(state.image) : 0;
    return idx >= 0 && idx < allImages.length ? idx : 0;
  }, [allImages, state.image]);

  const hasMultiple = allImages.length > 1;

  const nextIndex = hasMultiple ? (imageIndex + 1) % allImages.length : 0;
  const prevIndex = hasMultiple
    ? imageIndex === 0
      ? allImages.length - 1
      : imageIndex - 1
    : 0;

  const scrollThumbTo = useCallback((api: CarouselApi | null, i: number) => {
    if (!api) return;
    try {
      api.scrollTo(i, true);
    } catch {
      // ignore
    }
  }, []);

  const goPrevImage = useCallback(() => {
    if (!hasMultiple) return;
    updateImage(prevIndex.toString());
    scrollThumbTo(thumbApi, prevIndex);
  }, [hasMultiple, prevIndex, updateImage, scrollThumbTo, thumbApi]);

  const goNextImage = useCallback(() => {
    if (!hasMultiple) return;
    updateImage(nextIndex.toString());
    scrollThumbTo(thumbApi, nextIndex);
  }, [hasMultiple, nextIndex, updateImage, scrollThumbTo, thumbApi]);

  useEffect(() => {
    if (!thumbApi) return;
    if (Number.isFinite(imageIndex)) scrollThumbTo(thumbApi, imageIndex);
  }, [thumbApi, imageIndex, scrollThumbTo]);

  const goToImageByColor = useCallback(
    (hex: string) => {
      if (!hex || !allImages.length) return;

      const normalized = hex.toLowerCase();

      let targetIndex = allImages.findIndex(
        (img) =>
          img.linkedColorHex &&
          img.linkedColorHex.toLowerCase() === normalized &&
          img.isMain,
      );

      if (targetIndex === -1) {
        targetIndex = allImages.findIndex(
          (img) =>
            img.linkedColorHex &&
            img.linkedColorHex.toLowerCase() === normalized,
        );
      }

      if (targetIndex === -1) return;

      updateImage(targetIndex.toString());
      scrollThumbTo(thumbApi, targetIndex);
    },
    [allImages, updateImage, scrollThumbTo, thumbApi],
  );

  useEffect(() => {
    if (!onRegisterController) return;
    onRegisterController({ goToImageByColor });
  }, [onRegisterController, goToImageByColor]);

  const buttonClass =
    "cursor-pointer h-full px-4 sm:px-5 transition-all ease-in-out hover:scale-110 hover:text-black flex items-center justify-center";

  return (
    <div dir={dir} className="space-y-4">
      <div className=" cursor-zoom-in relative mx-auto aspect-[4/5] w-full max-w-2xl overflow-hidden rounded-2xl bg-neutral-50  sm:aspect-square lg:max-h-[550px]">
        {allImages.length > 0 ? (
          <Image
            fill
            priority
            sizes="(min-width: 1024px) 480px, 100vw"
            src={allImages[imageIndex].src}
            alt={allImages[imageIndex].altText}
            className="h-full w-full object-contain"
            onClick={() => openLightbox(imageIndex.toString())}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gray-100 ">
            <p className="text-sm text-gray-500 ">
              {dir === "rtl" ? "لا توجد صورة متاحة" : "No image available"}
            </p>
          </div>
        )}

        {hasMultiple && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/10 to-transparent" />
        )}

        {hasMultiple && (
          <div className="pointer-events-auto absolute inset-x-0 bottom-4 flex justify-center">
            <div className="flex h-11 items-center gap-2 rounded-full border border-white/70 bg-neutral-50/90 px-2 text-neutral-700 backdrop-blur-sm 0 shadow-md">
              <button
                type="button"
                aria-label={dir === "rtl" ? "الصورة السابقة" : "Previous"}
                className={buttonClass}
                onClick={goPrevImage}
              >
                <ArrowLeft
                  className={`w-5 ${lang === "ar" ? "rotate-180" : ""}`}
                />
              </button>

              <div className="mx-1 h-6 w-px bg-neutral-400/60" />

              <span className="hidden text-xs font-medium text-neutral-700  sm:inline">
                {imageIndex + 1}{" "}
                <span className="opacity-70">/ {allImages.length}</span>
              </span>

              <div className="mx-1 hidden h-6 w-px bg-neutral-400/60 sm:block" />

              <button
                type="button"
                aria-label={dir === "rtl" ? "الصورة التالية" : "Next"}
                className={buttonClass}
                onClick={goNextImage}
              >
                <ArrowRight
                  className={`w-5 ${lang === "ar" ? "rotate-180" : ""}`}
                />
              </button>

              <div className="mx-1 h-6 w-px bg-neutral-400/60" />

              <button
                type="button"
                aria-label={dir === "rtl" ? "تكبير" : "Open fullscreen"}
                className={buttonClass}
                onClick={() => openLightbox(imageIndex.toString())}
              >
                <Maximize2 className="h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {hasMultiple && (
        <div className="mb-2 mt-2">
          <Carousel
            setApi={setThumbApi}
            opts={{
              direction: dir,
              align: "start",
              loop: false,
            }}
            className="relative mx-auto flex w-full max-w-xl items-center justify-center"
          >
            <CarouselContent className={` ${lang ? "ml-3" : "mr-3"} `}>
              {allImages.map((img, index) => {
                const isActive = imageIndex === index;

                return (
                  <CarouselItem
                    key={`${img.src}-${index}`}
                    className="mx-2 basis-[66px] shrink-0 sm:basis-[72px] md:basis-[80px] lg:basis-[88px] xl:basis-[96px]"
                  >
                    <button
                      type="button"
                      aria-label={`Select product image ${index + 1}`}
                      className=" group block h-18 w-18  cursor-pointer rounded-xl border border-transparent transition hover:border-neutral-300 hover:shadow-sm md:h-20 md:w-20"
                      onClick={() => {
                        updateImage(index.toString());
                        scrollThumbTo(thumbApi, index);
                      }}
                    >
                      <GridTileImage
                        alt={img.altText}
                        src={img.src}
                        width={100}
                        height={100}
                        active={isActive}
                      />
                    </button>
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between  ">
              <CarouselPrevious
                className={`pointer-events-auto h-9 w-9 rounded-full bg-white/90 text-black shadow-sm hover:bg-white
      ${lang === "ar" ? "[&>svg]:-scale-x-100 left-[105%]" : ""}`}
              />
              <CarouselNext
                className={`pointer-events-auto h-9 w-9 rounded-full bg-white/90 text-black shadow-sm hover:bg-white
      ${lang === "ar" ? "[&>svg]:-scale-x-100 right-[105%]" : ""}`}
              />
            </div>
          </Carousel>
        </div>
      )}

      <Lightbox images={allImages} />
    </div>
  );
}
