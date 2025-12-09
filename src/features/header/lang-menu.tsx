"use client";
import React from "react";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { usePathname, useRouter } from "../../i18n/routing";
import { Languages } from "lucide-react";

const LangMenu = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="!p-0">
        <Button
          variant={`ghost`}
          size="icon"
          className="w-12 h-12 !p- rounded-full  "
        >
          <Languages size={20} />
          <span className="sr-only">Language Menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className={`mt-2.5 py-2`}>
        <button
          type="button"
          onClick={() => router.push(pathname, { locale: "en" })}
          className="!text-center block w-full  mx-auto "
        >
          <DropdownMenuItem className="flex justify-center items-center h-[45px] cursor-pointer ">
            English
          </DropdownMenuItem>
        </button>
        <button
          type="button"
          onClick={() => router.push(pathname, { locale: "ar" })}
          className="!text-center block w-full  mx-auto "
        >
          <DropdownMenuItem className="flex justify-center items-center h-[45px] cursor-pointer ">
            العربية
          </DropdownMenuItem>
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LangMenu;
