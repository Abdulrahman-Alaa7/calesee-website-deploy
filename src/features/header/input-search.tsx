"use client";
import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "../../i18n/routing";
import { Search, XIcon } from "lucide-react";

const InputSearch = () => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const tHeader = useTranslations("AllHeader");
  const lang = useLocale();
  const router = useRouter();

  const handleSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (search === "") {
      return;
    } else {
      router.push(`/results?search=${search}`);
      setIsOpen(false);
      setSearch("");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger accessKey="Open_search" aria-label="Search" asChild>
        <Button
          name="search"
          variant="ghost"
          className=" w-12 h-12 rounded-full   flex justify-center items-center"
          accessKey="Open_search_Buuton"
        >
          <Search size={35} />
        </Button>
      </SheetTrigger>
      <SheetContent
        side={`top`}
        className="flex flex-col items-center min-h-[170px] rounded-b-3xl"
      >
        <SheetHeader>
          <SheetTitle className="font-bold text-4xl lg:text-5xl pt-6 pb-4">
            {" "}
            {tHeader("inputSearchTitle")}
          </SheetTitle>
        </SheetHeader>
        <div className="relative w-full sm:w-[460px] md:w-[650px] px-1">
          <Search
            size={25}
            className={`absolute top-0 bottom-0 w-6 h-6 my-auto text-gray-400 ${
              lang == "en" ? "left-4" : "right-4"
            }`}
          />
          <div className="flex justify-center items-center gap-2">
            <input
              type="text"
              placeholder={`${tHeader("inputSearchPlaceHolder")}`}
              className="w-full py-3 pl-12 pr-12  border  outline-none bg-muted rounded-full "
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
            {search.length > 0 && (
              <XIcon
                size={25}
                className={`fadeIn absolute top-0 bottom-0 w-6 h-6 my-auto text-gray-400 ${
                  lang == "en" ? "right-20" : "left-20"
                } cursor-pointer`}
                onClick={() => setSearch("")}
              />
            )}
            <Button
              className=" w-12 h-12 rounded-full bg-[#a8603a] hover:bg-[#947268]"
              type="button"
              onClick={handleSearch}
              name="search_btn"
              accessKey="Search_Button"
            >
              <Search size={25} />
            </Button>
          </div>
        </div>

        <SheetFooter></SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default InputSearch;
