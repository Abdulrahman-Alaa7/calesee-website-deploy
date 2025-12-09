"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocale } from "next-intl";
import {
  ArrowLeft,
  ArrowRight,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";
import { GridTileImage } from "./tile";
import { useProduct } from "./product-context";
import { ModalPortal } from "./modal-portal";
import { useLockBodyScroll } from "./use-lock-body-scroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";
import type { ImageItem } from "./gallery";

function computeContainSize(
  vw: number,
  vh: number,
  iw: number,
  ih: number
): { w: number; h: number } {
  if (vw <= 0 || vh <= 0 || iw <= 0 || ih <= 0) return { w: 0, h: 0 };
  const vr = vw / vh;
  const ir = iw / ih;
  if (ir > vr) {
    const w = vw;
    const h = vw / ir;
    return { w, h };
  }
  const h = vh;
  const w = vh * ir;
  return { w, h };
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

type LightboxProps = { images: ImageItem[] };

function Lightbox({ images }: LightboxProps) {
  const { state, updateImage, closeLightbox, setZoom, setPan } = useProduct();
  const lang = useLocale();
  const dir: "rtl" | "ltr" = lang === "ar" ? "rtl" : "ltr";
  const [popupThumbApi, setPopupThumbApi] = useState<CarouselApi | null>(null);

  const open = Boolean(state.lightboxOpen);
  useLockBodyScroll(open);

  const idx = state.image ? parseInt(state.image, 10) || 0 : 0;
  const zoom = (state.zoom ?? 1) as number;
  const panX = (state.panX ?? 0) as number;
  const panY = (state.panY ?? 0) as number;

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const imgNatural = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const gestureRef = useRef<HTMLDivElement | null>(null);
  const startRef = useRef<{
    x: number;
    y: number;
    panX: number;
    panY: number;
  } | null>(null);
  const zoomRef = useRef<number>(zoom);

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  const hasImages = images.length > 0 && images[idx];

  const scrollPopupThumbTo = useCallback(
    (api: CarouselApi | null, i: number) => {
      if (!api) return;
      try {
        api.scrollTo(i, true);
      } catch {
        // ignore
      }
    },
    []
  );

  useEffect(() => {
    if (!popupThumbApi) return;
    if (Number.isFinite(idx)) scrollPopupThumbTo(popupThumbApi, idx);
  }, [popupThumbApi, idx, scrollPopupThumbTo]);

  const nextImage = useCallback(() => {
    if (!images.length) return;
    const n = (idx + 1) % images.length;
    updateImage(String(n));
    setZoom(1);
    setPan(0, 0);
    scrollPopupThumbTo(popupThumbApi, n);
  }, [
    idx,
    images.length,
    updateImage,
    setZoom,
    setPan,
    scrollPopupThumbTo,
    popupThumbApi,
  ]);

  const prevImage = useCallback(() => {
    if (!images.length) return;
    const p = idx === 0 ? images.length - 1 : idx - 1;
    updateImage(String(p));
    setZoom(1);
    setPan(0, 0);
    scrollPopupThumbTo(popupThumbApi, p);
  }, [
    idx,
    images.length,
    updateImage,
    setZoom,
    setPan,
    scrollPopupThumbTo,
    popupThumbApi,
  ]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowRight") {
        if (dir === "rtl") prevImage();
        else nextImage();
      } else if (e.key === "ArrowLeft") {
        if (dir === "rtl") nextImage();
        else prevImage();
      } else if (e.key === "+" || e.key === "=") {
        setZoom(Math.min(3, zoomRef.current + 0.25));
      } else if (e.key === "-") {
        setZoom(Math.max(1, zoomRef.current - 0.25));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeLightbox, dir, nextImage, prevImage, setZoom]);

  useEffect(() => {
    const el = gestureRef.current;
    if (!open || !el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.2 : 0.2;
      const nextZoom = clamp(zoomRef.current + delta, 1, 3);
      setZoom(nextZoom);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [open, setZoom]);

  const clampPan = useCallback((px: number, py: number, z: number) => {
    const vp = viewportRef.current;
    if (!vp || imgNatural.current.w === 0 || imgNatural.current.h === 0)
      return { x: px, y: py };
    const vw = vp.clientWidth;
    const vh = vp.clientHeight;
    const { w: fitW, h: fitH } = computeContainSize(
      vw,
      vh,
      imgNatural.current.w,
      imgNatural.current.h
    );
    const sw = fitW * z;
    const sh = fitH * z;
    const maxX = Math.max(0, (sw - fitW) / 2);
    const maxY = Math.max(0, (sh - fitH) / 2);
    return { x: clamp(px, -maxX, maxX), y: clamp(py, -maxY, maxY) };
  }, []);

  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    startRef.current = { x: e.clientX, y: e.clientY, panX, panY };
  };

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!startRef.current) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    if (zoomRef.current > 1.01) {
      const clamped = clampPan(
        startRef.current.panX + dx,
        startRef.current.panY + dy,
        zoomRef.current
      );
      setPan(clamped.x, clamped.y);
    }
  };

  const onPointerUp: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!startRef.current) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;

    if (
      !(zoomRef.current > 1.01) &&
      Math.abs(dx) > 60 &&
      Math.abs(dx) > Math.abs(dy)
    ) {
      if (dir === "rtl") {
        if (dx > 0) nextImage();
        else prevImage();
      } else {
        if (dx > 0) prevImage();
        else nextImage();
      }
    }

    startRef.current = null;
  };

  const onImageLoaded = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const el = e.currentTarget as HTMLImageElement;
    imgNatural.current = { w: el.naturalWidth || 0, h: el.naturalHeight || 0 };
    setPan(0, 0);
  };

  const zoomIn = () => setZoom(clamp(zoomRef.current + 0.25, 1, 3));
  const zoomOut = () => setZoom(clamp(zoomRef.current - 0.25, 1, 3));
  const reset = () => {
    setZoom(1);
    setPan(0, 0);
  };

  const transform = useMemo(
    () =>
      `translate(-50%, -50%) translate(${panX}px, ${panY}px) scale(${zoom})`,
    [panX, panY, zoom]
  );

  if (!open) return null;

  return (
    <ModalPortal
      open={open}
      ariaLabel={dir === "rtl" ? "عارض صور المنتج" : "Product image viewer"}
    >
      <div
        className="flex-1 bg-black/70 backdrop-blur-sm"
        onClick={closeLightbox}
      />

      <div
        role="document"
        dir={dir}
        className="relative grid w-full place-items-center bg-black px-3 text-white"
        style={{ height: "100vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pointer-events-auto absolute left-0 right-0 top-0 z-30 flex items-center justify-between px-4 py-3">
          <button
            data-autofocus
            onClick={closeLightbox}
            aria-label={dir === "rtl" ? "إغلاق" : "Close"}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm hover:bg-white/20"
          >
            <X className="h-5 w-5" />
            <span>{dir === "rtl" ? "إغلاق" : "Close"}</span>
          </button>

          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={zoomOut}
              aria-label="Zoom out"
              className="cursor-pointer rounded-full bg-white/10 p-2 hover:bg-white/20"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            <button
              onClick={zoomIn}
              aria-label="Zoom in"
              className="cursor-pointer rounded-full bg-white/10 p-2 hover:bg-white/20"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
            <button
              onClick={reset}
              aria-label="Reset"
              className="cursor-pointer rounded-full bg-white/10 p-2 hover:bg-white/20"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={viewportRef}
          className="relative z-10 h-[calc(80vh-80px)] w-full max-w-[min(96vw,1400px)] overflow-hidden rounded-xl bg-black/60"
        >
          <div
            className="absolute left-1/2 top-1/2 will-change-transform"
            style={{ transform, transformOrigin: "center center" }}
          >
            {hasImages && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={images[idx].src}
                alt={images[idx].altText}
                onLoad={onImageLoaded}
                draggable={false}
                className="block max-h-[calc(80vh-80px)] max-w-[96vw] select-none object-contain md:max-h-[calc(72vh-80px)]"
              />
            )}
          </div>

          {images.length > 1 && (
            <>
              <button
                aria-label={dir === "rtl" ? "الصورة التالية" : "Previous image"}
                className="absolute left-2 top-1/2 z-30 -translate-y-1/2 cursor-pointer rounded-full bg-white/12 p-3 text-white backdrop-blur hover:bg-white/20"
                onClick={dir === "rtl" ? nextImage : prevImage}
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <button
                aria-label={dir === "rtl" ? "الصورة السابقة" : "Next image"}
                className="absolute right-2 top-1/2 z-30 -translate-y-1/2 cursor-pointer rounded-full bg-white/12 p-3 text-white backdrop-blur hover:bg-white/20"
                onClick={dir === "rtl" ? prevImage : nextImage}
              >
                <ArrowRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div
            ref={gestureRef}
            className="pointer-events-auto absolute inset-0"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onDoubleClick={() => (zoomRef.current > 1 ? reset() : zoomIn())}
            style={{ touchAction: "none", overscrollBehavior: "contain" }}
          />
        </div>

        {images.length > 1 && (
          <div className="pointer-events-auto absolute bottom-4 left-0 right-0 z-30">
            <Carousel
              setApi={setPopupThumbApi}
              opts={{
                direction: dir,
                align: "start",
                loop: false,
              }}
              className="relative mx-auto flex w-full max-w-xl items-center justify-center "
            >
              <CarouselContent className={`  ${lang ? "ml-3  " : "!mr-3"} `}>
                {images.map((img, i) => (
                  <CarouselItem
                    key={`${img.src}-thumb-${i}`}
                    className="mx-3 basis-[66px] shrink-0 sm:basis-[72px] md:basis-[80px] lg:basis-[88px] xl:basis-[96px]"
                  >
                    <button
                      onClick={() => {
                        updateImage(String(i));
                        setZoom(1);
                        setPan(0, 0);
                        scrollPopupThumbTo(popupThumbApi, i);
                      }}
                      aria-label={`Go to image ${i + 1}`}
                      className="group block h-18 w-18  cursor-pointer rounded-xl border border-transparent transition hover:border-neutral-300 hover:shadow-sm md:h-20 md:w-20"
                    >
                      <GridTileImage
                        alt={img.altText}
                        src={img.src}
                        width={64}
                        height={64}
                        active={i === idx}
                      />
                    </button>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <div
                className={`pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-1 ${
                  lang === "ar" ? "flex-row-reverse" : ""
                }`}
              >
                <CarouselPrevious
                  className={`pointer-events-auto h-9 w-9 rounded-full bg-white/80 text-black shadow-sm hover:bg-white
      ${lang === "ar" ? "[&>svg]:-scale-x-100 left-[105%]" : ""}`}
                />
                <CarouselNext
                  className={`pointer-events-auto h-9 w-9 rounded-full bg-white/80 text-black shadow-sm hover:bg-white
      ${lang === "ar" ? "[&>svg]:-scale-x-100 right-[105%]" : ""}`}
                />
              </div>
            </Carousel>
          </div>
        )}
      </div>
    </ModalPortal>
  );
}

export default Lightbox;
