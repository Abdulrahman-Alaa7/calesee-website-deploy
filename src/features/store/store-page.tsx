"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import FiltersPanel from "./filter-panal";
import { ProductsHome } from "@/features/products/products-home";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ListFilter, Rows3, Rows2, List } from "lucide-react";
import type { Product } from "@/types/product.types";
import { ColorType, SizeType } from "@/types/store.types";
import { CategoryType } from "@/types/categories.types";
import { trackEvent } from "@/utils/trackEvent";
import { generateSlug } from "@/utils/generateSlug";
import ProductSkeleton from "./product-skeleton";

type StorePageProps = {
  products: Product[];
  topProducts: Product[];
  categories: CategoryType[];
  colors: ColorType[];
  sizes: SizeType[];
};

export default function StorePage({
  products,
  topProducts,
  categories,
  colors,
  sizes,
}: StorePageProps) {
  const t = useTranslations("HomeProducts");
  const locale = useLocale();

  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [isLoading, setIsLoading] = useState(true);
  const [priceRange, setPriceRange] = useState<number[]>([0, 2000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("hot");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const categorySlug = params.get("category");

      if (categorySlug) {
        const matchedCategory = categories.find(
          (c) => generateSlug(c.nameEn) === categorySlug,
        );

        if (matchedCategory) {
          setSelectedCategory(matchedCategory.id);
        }
      }
    }
  }, [categories]);
  const [viewMode, setViewMode] = useState<
    "grid-large" | "grid-compact" | "list"
  >("grid-large");
  const [sortBy, setSortBy] = useState<string>("default");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 20;

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = useMemo(
    () =>
      filteredProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage,
      ),
    [filteredProducts, currentPage],
  );

  useEffect(() => {
    if (!products.length) {
      setPriceRange([0, 0]);
      setIsLoading(false);
      return;
    }

    const prices = products.map((p) =>
      p.estimatedPrice && p.estimatedPrice > 0 ? p.estimatedPrice : p.price,
    );

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    setPriceRange([minPrice, maxPrice]);
    setFilteredProducts(products);
    setCurrentPage(1);

    setIsLoading(false);
  }, [products]);

  useEffect(() => {
    trackEvent({
      event: "view_content",
      source: "store_page",
    });
  }, []);

  const applyFilters = useCallback(() => {
    const baseList =
      selectedCategory === "hot" && topProducts.length > 0
        ? topProducts
        : products;

    const filtered = baseList.filter((p) => {
      const price =
        p.estimatedPrice && p.estimatedPrice > 0 ? p.estimatedPrice : p.price;

      const inPrice = price >= priceRange[0] && price <= priceRange[1];

      const inNew = selectedCategory === "new" ? true : true;

      const inCategory =
        selectedCategory !== "new" && selectedCategory !== "hot"
          ? p.category?.id === selectedCategory
          : true;

      const inSize =
        selectedSizes.length === 0 ||
        p.sizes?.some((s) =>
          s.catalogSizeId ? selectedSizes.includes(s.catalogSizeId) : false,
        );

      const inColor =
        selectedColors.length === 0 ||
        p.sizes?.some((size) =>
          size.colors?.some((c) =>
            c.catalogColorId
              ? selectedColors.includes(c.catalogColorId)
              : false,
          ),
        );

      return inPrice && inNew && inCategory && inSize && inColor;
    });

    const sorted = [...filtered];

    switch (sortBy) {
      case "price-asc":
        sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case "price-desc":
        sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case "newest":
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt ?? 0).getTime() -
            new Date(a.createdAt ?? 0).getTime(),
        );
        break;
      case "oldest":
        sorted.sort(
          (a, b) =>
            new Date(a.createdAt ?? 0).getTime() -
            new Date(b.createdAt ?? 0).getTime(),
        );
        break;
      case "az":
        sorted.sort((a, b) => a.name.localeCompare(b.name, locale));
        break;
      case "za":
        sorted.sort((a, b) => b.name.localeCompare(a.name, locale));
        break;
      default:
        break;
    }

    setFilteredProducts(sorted);
  }, [
    products,
    topProducts,
    priceRange,
    selectedSizes,
    selectedColors,
    selectedCategory,
    sortBy,
    locale,
  ]);

  useEffect(() => {
    applyFilters();
    setCurrentPage(1);
  }, [
    priceRange,
    selectedSizes,
    selectedColors,
    selectedCategory,
    sortBy,
    applyFilters,
  ]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (typeof window !== "undefined") {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    }
  };

  const toggleSize = (sizeId: string) =>
    setSelectedSizes((prev) =>
      prev.includes(sizeId)
        ? prev.filter((x) => x !== sizeId)
        : [...prev, sizeId],
    );

  const toggleColor = (colorId: string) =>
    setSelectedColors((prev) =>
      prev.includes(colorId)
        ? prev.filter((x) => x !== colorId)
        : [...prev, colorId],
    );

  const resetFilters = () => {
    if (!products.length) {
      setPriceRange([0, 0]);
    } else {
      const prices = products.map((p) =>
        p.estimatedPrice && p.estimatedPrice > 0 ? p.estimatedPrice : p.price,
      );
      setPriceRange([Math.min(...prices), Math.max(...prices)]);
    }

    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedCategory("new");
    setSortBy("default");
  };

  return (
    <div className="min-h-screen bg-[#fbfbfb] animate-slide-in">
      <div className="relative w-full h-48 md:h-56 lg:h-64 overflow-hidden rounded-b-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent z-10" />
        <Image
          src="/assets/images/banner-img.jpg"
          alt="banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center mx-auto text-center p-6 z-20">
          <h1 className="text-2xl md:text-4xl font-bold">
            {t("allProductsTitle")}
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-2">
            {t("allProductsDesc")}
          </p>
        </div>
      </div>

      <div className="w-full mx-auto px-4 md:px-8 py-8 grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
        <FiltersPanel
          products={products}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          selectedSizes={selectedSizes}
          toggleSize={toggleSize}
          selectedColors={selectedColors}
          toggleColor={toggleColor}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          resetFilters={resetFilters}
          categories={categories}
          availableColors={colors}
          availableSizes={sizes}
        />

        <main className="flex flex-col min-h-[60vh]">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="text-sm text-gray-600">
              {filteredProducts.length} {t("productsNum")}
            </div>

            <div className="flex items-center gap-2 mb-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <ListFilter />
                    {sortBy === "default"
                      ? t("productsFilCatDef")
                      : sortBy === "price-asc"
                        ? t("productsFilterAlphPl")
                        : sortBy === "price-desc"
                          ? t("productsFilterAlphPh")
                          : sortBy === "oldest"
                            ? t("productsFilterAlphPDo")
                            : sortBy === "newest"
                              ? t("productsFilterAlphPDn")
                              : sortBy === "az"
                                ? t("productsFilterAlphA")
                                : sortBy === "za"
                                  ? t("productsFilterAlphZ")
                                  : t("productsFilCatDef")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  className="py-2 mx-1 w-[200px]"
                >
                  <DropdownMenuItem
                    className="w-full flex justify-center items-center mx-auto text-center text-xs my-1 cursor-pointer"
                    onClick={() => setSortBy("default")}
                  >
                    {t("productsFilCatDef")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="w-full flex justify-center items-center mx-auto text-center text-xs my-1 cursor-pointer"
                    onClick={() => setSortBy("price-asc")}
                  >
                    {t("productsFilterAlphPl")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="w-full flex justify-center items-center mx-auto text-center text-xs my-1 cursor-pointer"
                    onClick={() => setSortBy("price-desc")}
                  >
                    {t("productsFilterAlphPh")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="w-full flex justify-center items-center mx-auto text-center text-xs my-1 cursor-pointer"
                    onClick={() => setSortBy("oldest")}
                  >
                    {t("productsFilterAlphPDo")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="w-full flex justify-center items-center mx-auto text-center text-xs my-1 cursor-pointer"
                    onClick={() => setSortBy("newest")}
                  >
                    {t("productsFilterAlphPDn")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="w-full flex justify-center items-center mx-auto text-center text-xs my-1 cursor-pointer"
                    onClick={() => setSortBy("az")}
                  >
                    {t("productsFilterAlphA")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="w-full flex justify-center items-center mx-auto text-center text-xs my-1 cursor-pointer"
                    onClick={() => setSortBy("za")}
                  >
                    {t("productsFilterAlphZ")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="hidden 2xl:flex items-center gap-2">
                <Button
                  variant={viewMode === "grid-large" ? "default" : "outline"}
                  onClick={() => setViewMode("grid-large")}
                  title="Grid (large)"
                >
                  <Rows3 className="rotate-90" />
                </Button>
                <Button
                  variant={viewMode === "grid-compact" ? "default" : "outline"}
                  onClick={() => setViewMode("grid-compact")}
                  title="Grid (compact)"
                >
                  <Rows2 className="rotate-90" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  onClick={() => setViewMode("list")}
                  title="List"
                >
                  <List />
                </Button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-6 grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div
              className={`grid gap-6 ${
                viewMode === "grid-large"
                  ? "grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3"
                  : viewMode === "grid-compact"
                    ? "grid-cols-1 xl:grid-cols-2"
                    : "grid-cols-1"
              }`}
            >
              {currentProducts.map((product) => (
                <ProductsHome key={product.id} product={product} isQuickCard />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500">
              {t("noProducts")}
            </div>
          )}

          {filteredProducts.length > productsPerPage && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              >
                {t("prevPageBtn")}
              </Button>
              <div className="px-4 py-2 bg-white border rounded-2xl">
                {currentPage} / {totalPages}
              </div>
              <Button
                disabled={currentPage === totalPages}
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
              >
                {t("nextPageBtn")}
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
