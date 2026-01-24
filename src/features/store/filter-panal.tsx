"use client";

import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import type { Product } from "@/types/product.types";
import { DialogTitle } from "@/components/ui/dialog";
import { useLocale, useTranslations } from "next-intl";
import { ColorType, SizeType } from "@/types/store.types";
import { CategoryType } from "@/types/categories.types";

interface Props {
  products: Product[];
  priceRange: number[];
  setPriceRange: (v: number[]) => void;
  selectedSizes: string[];
  toggleSize: (sizeId: string) => void;
  selectedColors: string[];
  toggleColor: (colorId: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  resetFilters: () => void;
  categories: CategoryType[];
  availableColors: ColorType[];
  availableSizes: SizeType[];
}

export default function FiltersPanel({
  products,
  priceRange,
  setPriceRange,
  selectedSizes,
  toggleSize,
  selectedColors,
  toggleColor,
  selectedCategory,
  setSelectedCategory,
  resetFilters,
  categories,
  availableColors,
  availableSizes,
}: Props) {
  const lang = useLocale();
  const t = useTranslations("HomeProducts");

  const min = useMemo(() => {
    if (!products.length) return 0;
    return Math.min(
      ...products.map((p) =>
        p.estimatedPrice && p.estimatedPrice > 0 ? p.estimatedPrice : p.price,
      ),
    );
  }, [products]);

  const max = useMemo(() => {
    if (!products.length) return 0;
    return Math.max(
      ...products.map((p) =>
        p.estimatedPrice && p.estimatedPrice > 0 ? p.estimatedPrice : p.price,
      ),
    );
  }, [products]);

  const sizeOptions = useMemo(
    () =>
      [...availableSizes].sort(
        (a, b) => Number(a.valueSize) - Number(b.valueSize),
      ),
    [availableSizes],
  );

  const colorOptions = useMemo(() => [...availableColors], [availableColors]);

  const getCategoryLabel = (c: CategoryType) =>
    lang === "ar" ? c.nameAr : c.nameEn;

  const getSizeLabel = (s: SizeType) => s.valueSize;

  return (
    <div className="space-y-6">
      <div className="hidden md:block bg-white border rounded-2xl p-3 shadow-sm border-gray-100 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-lg">{t("productsFilter")}</h4>
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            {t("resetBtn")}
          </Button>
        </div>

        <div className="mb-6">
          <h5 className="text-sm font-medium mb-3">
            {t("priceFilter") ?? "Price"}
          </h5>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              min={min}
              max={max}
              step={10}
            />
            <div className="text-sm text-gray-600 mt-2">
              {priceRange[0]} - {priceRange[1]}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h5 className="text-sm font-medium mb-2">{t("productsFilCat")}</h5>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={selectedCategory === "hot" ? "default" : "outline"}
              onClick={() => setSelectedCategory("hot")}
            >
              {t("whatHot")}
            </Button>
            <Button
              variant={selectedCategory === "new" ? "default" : "outline"}
              onClick={() => setSelectedCategory("new")}
            >
              {t("newArrive")}
            </Button>

            {categories.map((c) => (
              <Button
                key={c.id}
                variant={selectedCategory === c.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(c.id)}
              >
                {getCategoryLabel(c)}
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h5 className="text-sm font-medium mb-2">{t("sizesFilter")}</h5>
          <div className="flex flex-wrap gap-2 justify-center items-center mx-auto">
            {sizeOptions.map((s) => (
              <Badge
                key={s.id}
                className={`cursor-pointer hover:opacity-80 ${
                  selectedSizes.includes(s.id)
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => toggleSize(s.id)}
              >
                {getSizeLabel(s)}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h5 className="text-sm font-medium mb-2">{t("colors")}</h5>
          <div className="flex gap-2 flex-wrap">
            {colorOptions.map((c) => (
              <button
                key={c.id}
                aria-label={`color-${c.hex}`}
                onClick={() => toggleColor(c.id)}
                className={`w-7 h-7 cursor-pointer rounded-full border ${
                  selectedColors.includes(c.id)
                    ? "ring-2 ring-primary"
                    : "border-gray-200"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button className="md:hidden w-full border py-6 rounded-full border-gray-100">
            {t("productsFilter")}
          </Button>
        </SheetTrigger>

        <SheetContent
          side={lang === "ar" ? "right" : "left"}
          className="py-8 w-[350px] rounded-r-3xl"
        >
          <DialogTitle></DialogTitle>
          <div className="p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-lg">{t("productsFilter")}</h4>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  {t("resetBtn")}
                </Button>
              </div>
            </div>

            <div className="overflow-y-auto space-y-6 pb-6">
              <div>
                <h5 className="text-sm font-medium mb-3">{t("priceFilter")}</h5>
                <div className="px-2">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={min}
                    max={max}
                    step={10}
                  />
                  <div className="text-sm text-gray-600 mt-2">
                    {priceRange[0]} - {priceRange[1]}
                  </div>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium mb-2">
                  {t("productsFilCat")}
                </h5>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={selectedCategory === "new" ? "default" : "outline"}
                    onClick={() => setSelectedCategory("new")}
                  >
                    {t("newArrive")}
                  </Button>

                  <Button
                    variant={selectedCategory === "hot" ? "default" : "outline"}
                    onClick={() => setSelectedCategory("hot")}
                  >
                    {t("whatHot")}
                  </Button>

                  {categories.map((c) => (
                    <Button
                      key={c.id}
                      variant={
                        selectedCategory === c.id ? "default" : "outline"
                      }
                      onClick={() => setSelectedCategory(c.id)}
                    >
                      {getCategoryLabel(c)}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium mb-2">{t("size")}</h5>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map((s) => (
                    <Badge
                      key={s.id}
                      className={`cursor-pointer ${
                        selectedSizes.includes(s.id)
                          ? "bg-primary text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                      onClick={() => toggleSize(s.id)}
                    >
                      {getSizeLabel(s)}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="px-2">
                <h5 className="text-sm font-medium mb-2">{t("colors")}</h5>
                <div className="flex gap-2 flex-wrap">
                  {colorOptions.map((c) => (
                    <button
                      key={c.id}
                      aria-label={`color-${c.hex}`}
                      onClick={() => toggleColor(c.id)}
                      className={`w-8 h-8 rounded-full border ${
                        selectedColors.includes(c.id)
                          ? "ring-2 ring-primary"
                          : "border-gray-200"
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
