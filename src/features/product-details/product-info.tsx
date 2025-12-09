"use client";
import React, {
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  memo,
} from "react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Minus, Plus, Text } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { useRouter } from "../../i18n/routing";
import { AppContext } from "../../utils/AppContext";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import MainLoading from "../../components/ui/main-loading";
import {
  Gallery,
  type ImageItem as GalleryImage,
  type GalleryController,
} from "./image-box/gallery";
import { ProductProvider } from "./image-box/product-context";
import { isShippingItem } from "../shared/types";
import type { Product, ShippingItem } from "@/types/product.types";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { cn } from "@/lib/utils";
import ShareButtons from "../shared/share-buttons";
import SugProductsList from "./sug-products-list";

const SectionContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <section
    className={cn(
      "w-full mx-auto my-1 md:my-8 bg-white dark:bg-zinc-950",
      "transition-all duration-500 rounded-3xl",
      className
    )}
  >
    {children}
  </section>
);

const PriceBlock: React.FC<{
  lang: string;
  price?: number | null;
  estimatedPrice?: number | null;
  tHeader: (key: string) => string;
  discountPercentage: number;
}> = ({ lang, price = 0, estimatedPrice = 0, tHeader, discountPercentage }) => {
  const dir = lang === "ar" ? "rtl" : "ltr";

  const hasDiscount =
    typeof estimatedPrice === "number" &&
    estimatedPrice > 0 &&
    typeof price === "number" &&
    price > 0 &&
    estimatedPrice < price;

  const mainPrice = hasDiscount ? estimatedPrice : price;
  const oldPrice = hasDiscount ? price : null;

  return (
    <div
      dir={dir}
      className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mt-2 mb-6"
    >
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-primary">
          {mainPrice}{" "}
          <span className="text-lg font-medium text-gray-500">
            {tHeader("pound")}
          </span>
        </span>

        {hasDiscount && oldPrice !== null && (
          <span className="text-lg text-muted-foreground line-through decoration-red-500/50 decoration-2">
            {oldPrice} {tHeader("pound")}
          </span>
        )}
      </div>

      {hasDiscount && discountPercentage > 0 && (
        <Badge
          variant="destructive"
          className="animate-pulse px-3 py-1 text-sm font-bold rounded-full bg-red-100 text-red-600 hover:bg-red-200 border-none shadow-sm"
        >
          -{discountPercentage}%
        </Badge>
      )}
    </div>
  );
};

const QuantitySelector: React.FC<{
  value: number;
  onInc: () => void;
  onDec: () => void;
  disabled?: boolean;
}> = ({ value, onInc, onDec, disabled }) => (
  <div className="flex items-center border border-gray-200 dark:border-gray-800 rounded-full p-1 shadow-sm w-fit bg-gray-50 dark:bg-zinc-900">
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-10 w-10 rounded-full hover:bg-white hover:shadow-md transition-all active:scale-90"
      onClick={onDec}
      disabled={value === 1 || disabled}
    >
      <Minus size={16} />
    </Button>

    <span className="w-12 text-center font-bold text-lg tabular-nums">
      {value}
    </span>

    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-10 w-10 rounded-full hover:bg-white hover:shadow-md transition-all active:scale-90"
      onClick={onInc}
      disabled={disabled}
    >
      <Plus size={16} />
    </Button>
  </div>
);

type Props = {
  product: Product | ShippingItem;
  relatedProducts: Product[];
};

const ProductInfo: React.FC<Props> = memo(({ product, relatedProducts }) => {
  const lang = useLocale();
  const tHeader = useTranslations("AllHeader");
  const tHomeProducts = useTranslations("HomeProducts");
  const router = useRouter();
  const dir = lang === "ar" ? "rtl" : "ltr";

  const {
    wishingList,
    handleAddToWishingList,
    handleDeleteFromWishingList,
    handleAddNewItemShipping,
  } = useContext(AppContext);

  const isShipItem = isShippingItem(product);
  const typedProduct = !isShipItem ? (product as Product) : null;

  const [loadingBuy, setLoadingBuy] = useState(false);
  const [displayedQuantity, setDisplayedQuantity] = useState<number>(1);
  const [galleryController, setGalleryController] =
    useState<GalleryController | null>(null);

  const mainImage = useMemo<GalleryImage>(() => {
    if (isShipItem) {
      const src = (product as ShippingItem).mainImage || "/placeholder.jpg";

      return {
        src,
        altText: product.name,
      };
    }

    if (!typedProduct?.images?.length) {
      return {
        src: "/placeholder.png",
        altText: product.name,
      };
    }

    const main =
      typedProduct.images.find((img) => img.isMain) ?? typedProduct.images[0];

    return {
      src: main.url,
      altText: product.name,
      linkedColorHex: main.linkedColorHex ?? null,
      isMain: !!main.isMain,
    };
  }, [isShipItem, product, typedProduct]);

  const galleryImages = useMemo<GalleryImage[]>(() => {
    if (isShipItem) return [];

    if (typedProduct?.images?.length) {
      const filteredImages = typedProduct.images.filter(
        (img) => img.url !== mainImage.src
      );

      return filteredImages.slice(0, 10).map((image, index) => ({
        src: image.url,
        altText: `${typedProduct.name} view ${index + 1}`,
        linkedColorHex: image.linkedColorHex ?? null,
        isMain: !!image.isMain,
      }));
    }
    return [];
  }, [isShipItem, typedProduct, mainImage.src]);

  const initialSize = useMemo(() => {
    if (isShipItem) return "";
    if (!typedProduct?.sizes?.length) return "";
    const firstAvailable =
      typedProduct.sizes.find((s) => !s.soldout) ?? typedProduct.sizes[0];
    return firstAvailable.sizeValue;
  }, [isShipItem, typedProduct]);

  const [selectedSize, setSelectedSize] = useState<string>(initialSize ?? "");
  const [selectedColor, setSelectedColor] = useState<string>("");

  const selectedSizeEntity = useMemo(() => {
    if (!typedProduct?.sizes?.length) return undefined;
    if (selectedSize) {
      return typedProduct.sizes.find((s) => s.sizeValue === selectedSize);
    }
    return typedProduct.sizes.find((s) => !s.soldout) ?? typedProduct.sizes[0];
  }, [typedProduct, selectedSize]);

  const colorsForSelectedSize = useMemo(() => {
    return selectedSizeEntity?.colors ?? [];
  }, [selectedSizeEntity]);

  useEffect(() => {
    if (
      !isShipItem &&
      typedProduct?.sizes?.length &&
      !selectedSize &&
      initialSize
    ) {
      setSelectedSize(initialSize);
    }
  }, [typedProduct, initialSize, selectedSize, isShipItem]);

  useEffect(() => {
    if (isShipItem) return;
    if (!colorsForSelectedSize.length) {
      setSelectedColor("");
      return;
    }
    const exists = colorsForSelectedSize.some((c) => c.hex === selectedColor);
    if (!exists) {
      const firstAvailable =
        colorsForSelectedSize.find((c) => !c.soldout) ??
        colorsForSelectedSize[0];
      setSelectedColor(firstAvailable.hex);
    }
  }, [isShipItem, colorsForSelectedSize, selectedColor]);

  useEffect(() => {
    setDisplayedQuantity(1);
  }, [selectedSize, selectedColor]);

  const AddToList = useCallback(
    (item: Product, size: string, color?: string) => {
      const hasSizes = (item.sizes?.length ?? 0) > 0;

      if (hasSizes && !size) {
        toast.error(tHomeProducts("selectSizeFirst"));
        return;
      }

      if (colorsForSelectedSize.length > 0 && !color && hasSizes) {
        toast.error(tHomeProducts("selectColorFirst"));
        return;
      }
      handleAddNewItemShipping(item, displayedQuantity, size, color ?? "");
      toast.success(tHeader("successAddedBag"));
      setDisplayedQuantity(1);
    },
    [
      handleAddNewItemShipping,
      displayedQuantity,
      tHeader,
      tHomeProducts,
      colorsForSelectedSize,
    ]
  );

  const discountPercentage = useMemo(() => {
    const price = !isShipItem
      ? (product as Product).price
      : (product as ShippingItem).price;
    const est = !isShipItem
      ? (product as Product).estimatedPrice
      : (product as ShippingItem).estimatedPrice;
    if (!price || !est) return 0;
    return Math.max(0, Math.round(((price - est) / price) * 100));
  }, [product, isShipItem]);

  const isExistInWish = useMemo(
    () => wishingList?.some((w) => w.id === product.id),
    [wishingList, product.id]
  );

  const handleBuyItNow = () => {
    setLoadingBuy(true);
    AddToList(typedProduct as Product, selectedSize, selectedColor);
    router.push("/checkout");
    setLoadingBuy(false);
  };

  const description = useMemo(() => {
    if (!typedProduct) return "";
    return lang === "ar"
      ? typedProduct.descriptionAr ?? ""
      : typedProduct.descriptionEn ?? "";
  }, [typedProduct, lang]);

  return (
    <div
      className="animate-in fade-in slide-in-from-bottom-4 duration-700 md:px-4 lg:px-12 px-0 pb-12 w-full overflow-x-hidden"
      dir={dir}
    >
      <SectionContainer className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 bg-transparent px-2 md:p-0">
        <div className="lg:col-span-7 w-full">
          <ProductProvider>
            <div className="w-full relative">
              <div className="w-full px-1 md:px-0">
                <Suspense
                  fallback={
                    <div className="aspect-[4/5] w-full rounded-3xl bg-gray-100 animate-pulse" />
                  }
                >
                  <Gallery
                    mainImage={mainImage}
                    images={galleryImages}
                    onRegisterController={setGalleryController}
                  />
                </Suspense>
              </div>

              {product?.soldOut && (
                <div
                  className={cn(
                    "absolute top-6 z-20",
                    lang === "ar" ? "right-6" : "left-6"
                  )}
                >
                  <Badge
                    variant="destructive"
                    className="text-md md:text-lg px-4 py-1.5 shadow-lg"
                  >
                    {tHomeProducts("soldOutBtn")}
                  </Badge>
                </div>
              )}
            </div>
          </ProductProvider>
        </div>

        <div className="lg:col-span-5 relative mt-4 lg:mt-0 px-2 md:px-4">
          <aside className="lg:sticky lg:top-24 flex flex-col gap-6 h-fit bg-white/60 backdrop-blur-md dark:bg-zinc-900/60 p-4 md:p-6 rounded-3xl border border-white/20 shadow-sm md:shadow-xl">
            <div className="border-b border-gray-100 pb-4 dark:border-gray-800 text-center lg:text-start">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                {product?.name}
              </h1>

              <PriceBlock
                lang={lang}
                price={
                  !isShipItem
                    ? typedProduct?.price
                    : (product as ShippingItem).price
                }
                estimatedPrice={
                  !isShipItem
                    ? typedProduct?.estimatedPrice
                    : (product as ShippingItem).estimatedPrice
                }
                tHeader={tHeader}
                discountPercentage={discountPercentage}
              />
            </div>

            <div className="space-y-6">
              {typedProduct?.sizes && typedProduct.sizes.length > 0 && (
                <div className=" duration-500 delay-100">
                  <div className="flex justify-between items-center mb-3 px-1">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {tHomeProducts("size")}
                    </span>
                    <span className="text-sm text-primary font-medium uppercase tracking-wider">
                      {selectedSize}
                    </span>
                  </div>

                  <RadioGroup
                    value={selectedSize}
                    onValueChange={setSelectedSize}
                    dir={dir}
                    className="flex flex-wrap gap-3 justify-center lg:justify-start"
                  >
                    {typedProduct.sizes.map((item, i) => {
                      const disabled = item.soldout;
                      return (
                        <label
                          key={i}
                          className={cn(
                            "relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl cursor-pointer border-2 transition-all duration-300",
                            disabled
                              ? "opacity-40 cursor-not-allowed bg-gray-100"
                              : "hover:border-primary/50 hover:bg-primary/5",
                            selectedSize === item.sizeValue
                              ? "border-primary bg-primary/10 text-primary shadow-sm scale-110"
                              : "border-gray-200 bg-white"
                          )}
                        >
                          <RadioGroupItem
                            value={item.sizeValue}
                            className="sr-only"
                            disabled={disabled}
                          />
                          <span className="font-bold text-sm md:text-base">
                            {item.sizeValue}
                          </span>
                          {disabled && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-full h-px bg-red-400 rotate-45 transform scale-110"></div>
                            </div>
                          )}
                        </label>
                      );
                    })}
                  </RadioGroup>
                </div>
              )}

              {colorsForSelectedSize.length > 0 && (
                <div className=" duration-500 delay-200">
                  <div className="flex justify-between items-center mb-3 px-1">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {tHomeProducts("colors")}
                    </span>
                    {selectedColor && (
                      <span className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-0.5 rounded-md">
                        {selectedColor}
                      </span>
                    )}
                  </div>
                  <RadioGroup
                    value={selectedColor}
                    onValueChange={(val) => {
                      setSelectedColor(val);
                      galleryController?.goToImageByColor(val);
                    }}
                    dir={dir}
                    className="flex flex-wrap gap-3 justify-center lg:justify-start"
                  >
                    {colorsForSelectedSize.map((item, i) => {
                      const disabled = item.soldout;
                      return (
                        <TooltipProvider key={i}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <label
                                className={cn(
                                  "relative flex items-center justify-center p-1 rounded-full cursor-pointer transition-all duration-300",
                                  disabled
                                    ? "opacity-50 cursor-not-allowed grayscale"
                                    : "hover:scale-110",
                                  selectedColor === item.hex
                                    ? "ring-2 ring-offset-2 ring-primary"
                                    : "ring-1 ring-transparent"
                                )}
                              >
                                <RadioGroupItem
                                  value={item.hex}
                                  className="sr-only"
                                  disabled={disabled}
                                />
                                <span
                                  className="w-8 h-8 md:w-10 md:h-10 rounded-full shadow-inner border border-black/5"
                                  style={{ backgroundColor: item.hex }}
                                />
                                {disabled && (
                                  <div className="absolute top-0 right-0 -mt-1 -mr-1 bg-white rounded-full p-0.5 shadow-sm">
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                  </div>
                                )}
                              </label>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{lang === "ar" ? item.nameAr : item.nameEn}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      );
                    })}
                  </RadioGroup>
                </div>
              )}

              <div className=" duration-500 delay-300 flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4">
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {tHomeProducts("quantity")}
                </span>
                <QuantitySelector
                  value={displayedQuantity}
                  onInc={() => setDisplayedQuantity((p) => p + 1)}
                  onDec={() => setDisplayedQuantity((p) => Math.max(1, p - 1))}
                  disabled={loadingBuy || product.soldOut}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-2">
              {product?.soldOut ? (
                <Button
                  disabled
                  className="w-full h-14 rounded-full text-lg bg-gray-300 text-gray-500"
                >
                  {tHomeProducts("soldOutBtn")}
                </Button>
              ) : (
                <div className="flex flex-col gap-3 w-full">
                  <div className="flex gap-3 w-full">
                    <Button
                      onClick={() =>
                        AddToList(
                          typedProduct as Product,
                          selectedSize,
                          selectedColor
                        )
                      }
                      disabled={loadingBuy}
                      className="flex-1 h-12 md:h-14 rounded-full text-base md:text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1"
                    >
                      {tHomeProducts("addToBagBtn")}
                    </Button>

                    {!isShipItem && typedProduct && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          isExistInWish
                            ? handleDeleteFromWishingList(product.id)
                            : handleAddToWishingList(typedProduct)
                        }
                        className={cn(
                          "h-12 w-12 md:h-14 md:w-14 rounded-full border-2 transition-all hover:scale-105 active:scale-95 shrink-0",
                          isExistInWish
                            ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-100"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        {isExistInWish ? (
                          <BsHeartFill size={22} />
                        ) : (
                          <BsHeart size={22} />
                        )}
                      </Button>
                    )}
                  </div>

                  <Button
                    variant="secondary"
                    onClick={handleBuyItNow}
                    disabled={loadingBuy}
                    className="w-full h-12 md:h-14 rounded-full text-base md:text-lg font-bold bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 shadow-xl transition-all hover:-translate-y-1"
                  >
                    {loadingBuy ? <MainLoading /> : tHomeProducts("buyItBtn")}
                  </Button>
                </div>
              )}
            </div>

            <ShareButtons product={product} />

            <div className="text-sm text-gray-500 space-y-4 pt-2">
              {(description || tHomeProducts("descPro")) && (
                <div className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-dashed border-gray-200">
                  {tHomeProducts("descPro")?.trim() && (
                    <div className="flex items-center gap-2 mb-2 font-medium text-gray-900 dark:text-gray-100">
                      <Text size={16} />
                      <span>{tHomeProducts("descPro")}</span>
                    </div>
                  )}
                  <p className="leading-relaxed opacity-80 text-justify">
                    {description ||
                      (lang === "ar"
                        ? "لا يوجد وصف"
                        : "No description available")}
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </SectionContainer>
      <SugProductsList SugProducts={relatedProducts} />
    </div>
  );
});

ProductInfo.displayName = "ProductInfo";
export default ProductInfo;
