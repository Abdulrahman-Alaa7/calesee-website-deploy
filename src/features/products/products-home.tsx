"use client";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link, useRouter } from "../../i18n/routing";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { Button } from "../../components/ui/button";
import { AppContext } from "../../utils/AppContext";
import { toast } from "sonner";
import { Badge } from "../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { ArrowRight, Minus, Plus } from "lucide-react";
import MainLoading from "../../components/ui/main-loading";
import type { Product } from "@/types/product.types";
import { getOptionValue, isOptionSoldOut } from "../shared/utils";
import { isShippingItem, ProductsHomeProps } from "../shared/types";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { trackEvent } from "@/utils/trackEvent";
import { generateSlug } from "@/utils/generateSlug";

export const ProductsHome = ({
  product,
  isQuickCard,
  isList,
  isShip,
}: ProductsHomeProps) => {
  const t = useTranslations("HomeProducts");
  const tS = useTranslations("AllHeader");
  const lang = useLocale();
  const router = useRouter();

  const {
    wishingList,
    handleAddToWishingList,
    handleDeleteFromWishingList,
    shippingList,
    handleAddNewItemShipping,
    handleItemShippingIncreaseOrDecrease,
    handleDeleteItemShipping,
  } = useContext(AppContext);

  const [hoverImage, setHoverImage] = useState(false);
  const [loadingBuy, setLoadingBuy] = useState(false);
  const [displayedQuantity, setDisplayedQuantity] = useState<number>(1);

  const isShipItem = isShippingItem(product);
  const typedProduct = !isShipItem ? (product as Product) : null;

  const mainImageUrl = useMemo(() => {
    if (isShipItem) {
      return product.mainImage;
    }

    if (!typedProduct || !typedProduct.images?.length)
      return "/placeholder.jpg";

    const main = typedProduct.images.find((img) => img.isMain);
    return main?.url ?? typedProduct.images[0]?.url ?? "/placeholder.jpg";
  }, [isShipItem, product, typedProduct]);

  const secondImageUrl = useMemo(() => {
    if (isShipItem || !typedProduct?.images?.length) return undefined;
    const nonMain = typedProduct.images.find((img) => !img.isMain);
    return nonMain?.url;
  }, [isShipItem, typedProduct]);

  // const allColors = useMemo(() => {
  //   if (!typedProduct?.sizes?.length) return [];

  //   type ColorType = NonNullable<
  //     NonNullable<Product["sizes"]>[number]["colors"]
  //   >[number];

  //   const map = new Map<string, ColorType>();

  //   typedProduct.sizes.forEach((size) => {
  //     size.colors?.forEach((color) => {
  //       const val = getOptionValue(color); // hex
  //       if (color && !map.has(val)) map.set(val, color);
  //     });
  //   });

  //   return Array.from(map.values());
  // }, [typedProduct]);

  const initialSize = useMemo(() => {
    if (isShipItem) return "";
    if (!typedProduct?.sizes?.length) return "";

    const first = typedProduct.sizes.find((s) => !isOptionSoldOut(s));
    return first
      ? getOptionValue(first)
      : getOptionValue(typedProduct.sizes[0]);
  }, [isShipItem, typedProduct]);

  const [selectedSize, setSelectedSize] = useState<string>(initialSize ?? "");
  const [selectedColor, setSelectedColor] = useState<string>("");

  const selectedSizeEntity = useMemo(() => {
    if (!typedProduct?.sizes?.length) return undefined;

    if (selectedSize) {
      const byValue = typedProduct.sizes.find(
        (s) => getOptionValue(s) === selectedSize,
      );
      if (byValue) return byValue;
    }

    const firstAvailable =
      typedProduct.sizes.find((s) => !isOptionSoldOut(s)) ??
      typedProduct.sizes[0];

    return firstAvailable;
  }, [typedProduct, selectedSize]);

  const colorsForSelectedSize = useMemo(() => {
    if (!selectedSizeEntity?.colors?.length) return [];
    return selectedSizeEntity.colors;
  }, [selectedSizeEntity]);

  useEffect(() => {
    if (!isShipItem && typedProduct?.sizes?.length) {
      if (!selectedSize && initialSize) {
        setSelectedSize(initialSize);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typedProduct, initialSize]);

  useEffect(() => {
    if (!isShipItem && colorsForSelectedSize) {
      if (!colorsForSelectedSize.length) {
        setSelectedColor("");
        return;
      }

      const exists = colorsForSelectedSize.some(
        (c) => getOptionValue(c) === selectedColor,
      );

      if (!exists) {
        const firstAvailable =
          colorsForSelectedSize.find((c) => !isOptionSoldOut(c)) ??
          colorsForSelectedSize[0];

        setSelectedColor(getOptionValue(firstAvailable));
      }
    }
  }, [isShipItem, colorsForSelectedSize, selectedColor]);

  useEffect(() => {
    setDisplayedQuantity(1);
  }, [selectedSize, selectedColor]);

  const handleSizeChange = (value: string) => setSelectedSize(value);
  const handleColorChange = (value: string) => setSelectedColor(value);

  const AddToList = useCallback(
    (item: Product, size: string, color?: string) => {
      handleAddNewItemShipping(item, displayedQuantity, size, color ?? "");

      trackEvent({
        event: "add_to_cart",
        product_id: item.id,
        product_name: item.name,
        price: Number(
          item.estimatedPrice && item.estimatedPrice > 0
            ? item.estimatedPrice
            : item.price,
        ),
        quantity: displayedQuantity,
        currency: "EGP",
      });

      toast.success(tS("successAddedBag"));
      setDisplayedQuantity(1);
    },
    [handleAddNewItemShipping, displayedQuantity, tS],
  );

  const handleIncrease = useCallback(
    () => setDisplayedQuantity((p) => p + 1),
    [],
  );
  const handleDecrease = useCallback(
    () => setDisplayedQuantity((p) => Math.max(1, p - 1)),
    [],
  );

  const calculateDiscountPercentage = useCallback(
    (price: number, estimatedPrice: number) => {
      if (!price || !estimatedPrice) return 0;
      const discountAmount = price - estimatedPrice;
      return Math.round((discountAmount / price) * 100);
    },
    [],
  );

  const discountPercentage = useMemo(() => {
    if (!typedProduct) return 0;
    const price = typedProduct.price ?? 0;
    const est = typedProduct.estimatedPrice ?? 0;
    return calculateDiscountPercentage(price, est);
  }, [typedProduct, calculateDiscountPercentage]);

  const handleAddWishingList = useCallback(
    (item: Product) => {
      handleAddToWishingList(item);
      toast.success(tS("successAddedFav"));
    },
    [handleAddToWishingList, tS],
  );

  const handleDeleteWishingList = useCallback(
    (id: string) => {
      handleDeleteFromWishingList(id);
      toast(tS("successDelFav"));
    },
    [handleDeleteFromWishingList, tS],
  );

  const isExistInWish = useMemo(
    () => wishingList?.some((w) => w.id === product.id),
    [wishingList, product?.id],
  );

  const handleBuyItNow = (p: Product, size: string, color?: string) => {
    if (!size) {
      toast.error(t("selectSizeFirst"));
      return;
    }
    setLoadingBuy(true);
    AddToList(p, size, color);

    trackEvent({
      event: "buy_now_click",
      product_id: p.id,
      product_name: p.name,
      price: Number(
        p.estimatedPrice && p.estimatedPrice > 0 ? p.estimatedPrice : p.price,
      ),
      currency: "EGP",
    });

    router.push("/checkout");
    setLoadingBuy(false);
  };

  const handleIncreaseShip = (id: string, size?: string, color?: string) => {
    const current = shippingList.find(
      (it) => it.id === id && it.size === size && it.color === color,
    );
    if (current)
      handleItemShippingIncreaseOrDecrease(
        id,
        current.quantity + 1,
        size,
        color,
      );
  };

  const handleDecreaseShip = (id: string, size?: string, color?: string) => {
    const current = shippingList.find(
      (it) => it.id === id && it.size === size && it.color === color,
    );
    if (current && current.quantity > 1)
      handleItemShippingIncreaseOrDecrease(
        id,
        current.quantity - 1,
        size,
        color,
      );
  };

  return (
    <div
      key={product.id}
      className="relative w-full flex flex-col justify-center items-center mx-auto rounded-3xl transition-all hover:bg-secondary"
    >
      {!isShip && !isShipItem && typedProduct && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild className="transition-all duration-300">
              <Button
                variant="outline"
                type="button"
                className="z-40 absolute top-2 right-3 rounded-full w-12 h-12 flex justify-center items-center p-0 transition-all duration-300 shadow-md"
                onClick={() =>
                  isExistInWish
                    ? handleDeleteWishingList(product.id)
                    : handleAddWishingList(typedProduct)
                }
                aria-label={
                  isExistInWish
                    ? `Delete ${product.name} From wishlist`
                    : `Add ${product.name} to wishlist`
                }
                name={isExistInWish ? "deleteWishList" : "addToWishList"}
              >
                {isExistInWish ? (
                  <BsHeartFill size={35} className="text-primary" />
                ) : (
                  <BsHeart size={35} />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent
              className="bg-black text-white border-[#292524]"
              side="left"
            >
              <p>
                {isExistInWish ? t("deleteFromWishList") : t("addToWishList")}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <Link
        href={`/store/${generateSlug(product.name)}-${product.id}`}
        onMouseEnter={() => setHoverImage(true)}
        onMouseLeave={() => setHoverImage(false)}
        className={`w-full h-full ${
          isQuickCard ? "px-2 pt-8 pb-10" : "pb-2 px-2 pt-8"
        }`}
      >
        <div
          className={`overflow-hidden w-[330px] md:w-[350px] h-[330px] md:h-[350px] mx-auto transition-all duration-700 ${
            hoverImage ? "rounded-radtwo" : "rounded-radone"
          }`}
        >
          <div className="relative w-full h-full">
            <Image
              src={mainImageUrl}
              alt={`${product?.name}_Main_Image`}
              width={350}
              height={350}
              className={`${
                !isList && hoverImage && secondImageUrl
                  ? "!opacity-0"
                  : "!opacity-100"
              } object-cover object-center align-middle w-full h-full transition-opacity duration-300`}
            />

            {!isList && !isShipItem && secondImageUrl && (
              <Image
                src={secondImageUrl}
                alt={`${product?.name}_Sec_Image`}
                width={350}
                height={350}
                className={`${
                  hoverImage ? "!opacity-100" : "!opacity-0"
                } absolute top-0 left-0 object-cover object-center align-middle w-full h-full transition-opacity duration-300`}
              />
            )}
          </div>
        </div>

        <div className="absolute left-2 top-2 flex items-start gap-1 z-20 flex-col">
          {"soldOut" in product && product.soldOut && (
            <Badge
              variant="default"
              className={`${
                lang === "ar" && "flex-row-reverse"
              } text-sm rounded-full px-4 bg-black  text-white hover:!bg-primary hover:!text-white flex justify-center items-center gap-1`}
            >
              {t("soldOutBtn")}
            </Badge>
          )}
        </div>

        <div
          className={`${
            isShip ? "mt-3" : "my-3"
          } flex flex-col gap-2 items-center justify-center mx-auto`}
        >
          <h2 className="text-base font-semibold">{product.name}</h2>

          {typedProduct?.estimatedPrice && typedProduct.estimatedPrice > 0 ? (
            <div
              dir={lang === "ar" ? "rtl" : "ltr"}
              className="prices flex justify-center items-center gap-3 mt-1 mb-4"
            >
              <span className="font-semibold block line-through text-muted-foreground">
                {typedProduct.price} {tS("pound")}
              </span>
              <Badge
                variant="secondary"
                className="font-bold text-sm bg-gradient-to-r from-primary/10 via-primary/5 to-transparent"
              >
                {typedProduct.estimatedPrice} {tS("pound")}
              </Badge>
              <Badge
                variant="default"
                className="text-primary text-xs font-bold rounded-full py-1 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent"
              >
                {discountPercentage}% {t("offer")}
              </Badge>
            </div>
          ) : (
            <div
              dir={lang === "ar" ? "rtl" : "ltr"}
              className="prices flex justify-center items-center gap-3 mt-1 mb-4"
            >
              <Badge
                variant="secondary"
                className="font-bold text-sm bg-gradient-to-r from-primary/10 via-primary/5 to-transparent"
              >
                {typedProduct ? typedProduct.price : product.price}{" "}
                {tS("pound")}
              </Badge>
            </div>
          )}
        </div>
      </Link>

      {!isShipItem && typedProduct && isQuickCard && (
        <Dialog>
          <DialogTrigger
            onClick={() =>
              trackEvent({
                event: "quick_view",
                product_id: product.id,
                product_name: product.name,
                price: Number(
                  product.estimatedPrice && product.estimatedPrice > 0
                    ? product.estimatedPrice
                    : product.price,
                ),
                currency: "EGP",
                source: "product_card_popup",
              })
            }
            className="absolute cursor-pointer bg-primary py-2.5 text-white hover:opacity-80 transition-all bottom-2.5 left-1/2 transform -translate-x-1/2 z-40 w-[230px] rounded-full mx-auto flex justify-center items-center"
          >
            {t("QuickView")}
          </DialogTrigger>

          <DialogContent className="fadeIn flex justify-center items-center py-8 w-[365px] md:w-[450px] !mx-auto max-h-[700px] lg:max-h-[750px] overflow-x-hidden overflow-y-auto">
            <DialogHeader>
              <DialogTitle></DialogTitle>

              <div className="overflow-hidden flex justify-center mt-28 items-center w-[310px] md:w-[350px] h-[320px] md:h-[350px] mx-auto transition-all rounded-3xl">
                <Image
                  src={mainImageUrl}
                  alt={`${product.name}_Main_Image`}
                  width={310}
                  height={350}
                  className={`${
                    hoverImage ? "!opacity-0" : "!opacity-100"
                  } object-cover object-center align-middle w-full h-full transition-opacity duration-300`}
                />
              </div>

              <div className="my-3 flex flex-col gap-2 items-center justify-center mx-auto">
                <h3 className="text-base font-semibold">{product.name}</h3>

                {typedProduct.estimatedPrice &&
                typedProduct.estimatedPrice > 0 ? (
                  <div
                    dir={lang === "ar" ? "rtl" : "ltr"}
                    className="prices flex justify-center items-center gap-3 mt-1 mb-2"
                  >
                    <span className="font-semibold block text-sm line-through text-muted-foreground">
                      {typedProduct.price} {tS("pound")}
                    </span>
                    <Badge
                      variant="secondary"
                      className="font-bold text-sm rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent"
                    >
                      {typedProduct.estimatedPrice} {tS("pound")}
                    </Badge>
                    <Badge
                      variant="default"
                      className="text-white font-bold rounded-full py-1"
                    >
                      {discountPercentage}% {t("offer")}
                    </Badge>
                  </div>
                ) : (
                  <div
                    dir={lang === "ar" ? "rtl" : "ltr"}
                    className="prices flex justify-center items-center gap-3 my-3"
                  >
                    <Badge
                      variant="secondary"
                      className="font-bold text-sm rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent"
                    >
                      {typedProduct.price} {tS("pound")}
                    </Badge>
                  </div>
                )}
              </div>

              {typedProduct.sizes && (
                <div className="fadeIn transition-all">
                  <fieldset className="space-y-3">
                    <RadioGroup
                      className="flex justify-center items-center gap-2 flex-wrap mx-auto my-1"
                      value={selectedSize}
                      onValueChange={handleSizeChange}
                      dir={lang === "ar" ? "rtl" : "ltr"}
                    >
                      {typedProduct.sizes.map((item, index) => {
                        const val = getOptionValue(item);
                        const sold = isOptionSoldOut(item);
                        const isSelected = selectedSize === val;

                        return (
                          <label
                            key={item.id ?? index}
                            className={`
                relative w-12 h-12 rounded-full text-xs flex cursor-pointer flex-col items-center justify-center gap-2
                border px-3 py-2 text-center font-medium transition-all
                ${sold ? "opacity-50 !cursor-not-allowed" : "hover:bg-muted/40"}
                ${
                  isSelected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border"
                }
              `}
                          >
                            <RadioGroupItem
                              id={`size-${item.id ?? index}`}
                              value={val}
                              className="sr-only"
                              disabled={sold}
                            />
                            <span>{item.sizeValue}</span>
                            {sold && (
                              <span className="absolute left-0 top-1/2 w-full h-[2px] bg-red-500 rotate-45" />
                            )}
                          </label>
                        );
                      })}
                    </RadioGroup>
                  </fieldset>
                </div>
              )}

              {colorsForSelectedSize.length > 0 && (
                <div className="fadeIn transition-all mt-4">
                  <fieldset className="space-y-3">
                    <RadioGroup
                      className="flex justify-center items-center gap-2 flex-wrap mx-auto mb-3"
                      value={selectedColor}
                      onValueChange={handleColorChange}
                      dir={lang === "ar" ? "rtl" : "ltr"}
                    >
                      {colorsForSelectedSize.map((item, index) => {
                        const val = getOptionValue(item); // hex
                        const sold = isOptionSoldOut(item);
                        const isSelected = selectedColor === val;

                        return (
                          <label
                            key={item.id ?? index}
                            className={`
                relative flex cursor-pointer items-center justify-center
                rounded-full border p-[2px] transition-all
                ${sold ? "opacity-50 !cursor-not-allowed" : "hover:scale-105"}
                ${
                  isSelected
                    ? "border-primary ring-2 ring-primary/40"
                    : "border-border"
                }
              `}
                          >
                            <RadioGroupItem
                              id={`color-${item.id ?? index}`}
                              value={val}
                              className="sr-only"
                              disabled={sold}
                            />
                            <span
                              className="w-7 h-7 rounded-full shadow-md"
                              style={{ backgroundColor: val }}
                            />
                            {sold && (
                              <span className="absolute left-0 top-1/2 w-full h-[2px] bg-red-500 rotate-45" />
                            )}
                          </label>
                        );
                      })}
                    </RadioGroup>
                  </fieldset>
                </div>
              )}

              <div>
                <div
                  className={`flex justify-center item-center gap-2 !transition-all fadeIn ${
                    lang === "ar" && "flex-row-reverse"
                  }`}
                >
                  <Button
                    type="button"
                    className="w-9 h-9 rounded-full"
                    onClick={handleDecrease}
                    disabled={displayedQuantity === 1 || loadingBuy}
                    aria-label="less"
                    name="minus"
                    accessKey={`Less_quantity_${product.name}`}
                  >
                    <Minus size={20} />
                  </Button>

                  <Badge className="fadeIn transition-all shadow-md bg-gradient-to-r from-primary/10 via-primary/5 to-transparent text-md w-10 h-10 rounded-full font-bold text-black">
                    {displayedQuantity}
                  </Badge>

                  <Button
                    type="button"
                    className="w-9 h-9 rounded-full"
                    onClick={handleIncrease}
                    aria-label="More"
                    name="plus"
                    disabled={loadingBuy}
                    accessKey={`More_Quantity_${product.name}`}
                  >
                    <Plus size={20} />
                  </Button>
                </div>
              </div>

              {product.soldOut ? (
                <Button className="w-[90%] py-6 !cursor-not-allowed !mt-5 bg-primary/50 hover:bg-primary/60 text-white rounded-full mx-auto flex justify-center items-center">
                  {t("soldOutBtn")}
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    className="w-[90%] rounded-full p-6 !mt-5 mx-auto flex justify-center items-center"
                    onClick={() =>
                      AddToList(typedProduct, selectedSize, selectedColor)
                    }
                    aria-label={`Add ${product.name} to bag`}
                    accessKey={`Add_To_Bag_${product.name}`}
                    disabled={
                      ("soldOut" in product && product.soldOut) || loadingBuy
                    }
                  >
                    {t("addToBagBtn")}
                  </Button>

                  <Button
                    disabled={
                      ("soldOut" in product && product.soldOut) || loadingBuy
                    }
                    className="w-[90%] bg-[#000000] hover:bg-[#947268] p-6 rounded-full mx-auto flex justify-center items-center"
                    onClick={() =>
                      handleBuyItNow(typedProduct, selectedSize, selectedColor)
                    }
                  >
                    {loadingBuy ? <MainLoading /> : `${t("buyItBtn")}`}
                  </Button>
                </>
              )}

              <Link
                href={`/store/${generateSlug(product.name)}-${product.id}`}
                className="mx-auto rounded-full py-2 px-4 w-fit text-black underline underline-offset-4 !z-30 mb-3 lg:mb-0 hover:opacity-90 flex justify-center items-center gap-1"
              >
                {t("allDetails")}
                <ArrowRight
                  size={16}
                  className={`text-gray-700 ${lang === "ar" && "rotate-180"}`}
                />
              </Link>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}

      {isShip && isShipItem && (
        <>
          <div>
            <span className="flex gap-1 items-center text-[#666] text-sm font-normal mt-0 mb-3">
              {product.size && <>({product.size})</>}
              {product.color && (
                <>
                  {" "}
                  -{" "}
                  <span
                    className="w-4 h-4 rounded-full shadow-lg"
                    style={{ backgroundColor: `${product.color}` }}
                  />
                </>
              )}
            </span>
          </div>

          <div key={`${product.id}-${product.size}-${product.color}`}>
            <div
              className={`flex justify-center item-center gap-2 !transition-all fadeIn ${
                lang === "ar" && "flex-row-reverse"
              }`}
            >
              <Button
                type="button"
                className="w-9 h-9 rounded-full transition-all fadeIn"
                onClick={() =>
                  handleDecreaseShip(product.id, product.size, product.color)
                }
                disabled={product.quantity === 1}
                aria-label="less"
                name="minus"
                accessKey={`Less_quantity_${product.name}`}
              >
                <Minus size={20} />
              </Button>

              <Badge className="fadeIn transition-all shadow-md bg-gradient-to-r text-md px-4 p1-2 rounded-lg font-bold text-black">
                {product.quantity}
              </Badge>

              <Button
                type="button"
                className="w-9 h-9 rounded-full transition-all fadeIn"
                onClick={() =>
                  handleIncreaseShip(product.id, product.size, product.color)
                }
                aria-label="More"
                name="plus"
                accessKey={`More_Quantity_${product.name}`}
              >
                <Plus size={20} />
              </Button>
            </div>
          </div>

          {product.soldOut ? (
            <Button className="w-[90%] !mt-5 bg-primary/50 hover:bg-primary/60 text-white cursor-not-allowed rounded-full mx-auto flex justify-center items-center">
              {t("soldOutBtn")}
            </Button>
          ) : (
            <Button
              type="button"
              className="w-[90%] rounded-full !mt-5 mx-auto flex justify-center items-center my-3 !py-6"
              onClick={() =>
                handleDeleteItemShipping(
                  product.id,
                  product.size,
                  product.color,
                )
              }
              aria-label={`Remove ${product.name} from bag`}
              accessKey={`Remove_From_Bag_${product.name}`}
              disabled={loadingBuy}
            >
              {t("delFromBagBtn")}
            </Button>
          )}
        </>
      )}
    </div>
  );
};
