"use client";
import { Link } from "@/i18n/routing";
import { CategoryType } from "@/types/categories.types";
import { generateSlug } from "@/utils/generateSlug";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { usePathname } from "next/navigation";

type Props = {
  categories: CategoryType[];
};

export default function CategoriesSection({ categories }: Props) {
  const local = useLocale();
  const tC = useTranslations("Categories");
  const t = useTranslations("HomeProducts");
  const pathname = usePathname();

  const isCategoriesPage =
    pathname === "/categories" || pathname?.endsWith("/categories");

  const sortedCategories = [...categories].sort((a, b) => {
    if (a.createdAt && b.createdAt) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }

    return Number(b.id) - Number(a.id);
  });

  const visibleCategories = isCategoriesPage
    ? sortedCategories
    : sortedCategories.slice(0, 4);

  return (
    <section className="py-12 lg:py-16 px-4 md:px-8 lg:px-16 bg-gray-50">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{tC("title")}</h2>
        <p className="text-gray-500">{tC("mainDesc")}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {visibleCategories.map((category: CategoryType) => (
          <Link
            href={`/store?category=${generateSlug(category.nameEn)}`}
            key={category.id}
            className="group relative overflow-hidden rounded-3xl shadow-md bg-white hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <div className="relative w-full h-52 overflow-hidden rounded-3xl">
              <Image
                src={category.imageUrl}
                alt={category.nameEn}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/30 to-transparent" />
            </div>

            <div className="absolute w-fit top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 mx-auto text-center">
              <h3 className="text-white text-xl md:text-3xl font-semibold drop-shadow-md">
                {local === "ar" ? category.nameAr : category.nameEn}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      {!isCategoriesPage && sortedCategories.length > 4 && (
        <div>
          <Link
            href="/categories"
            className="mx-auto mt-12 rounded-full bg-[#a8603a] py-4 px-4 !z-30 mb-3 lg:mb-0 hover:bg-[#947268] hover:opacity-80 text-white flex justify-center items-center !w-[300px]"
          >
            {t("viewAllBtn")}
          </Link>
        </div>
      )}
    </section>
  );
}
