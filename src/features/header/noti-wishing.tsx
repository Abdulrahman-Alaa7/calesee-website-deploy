"use client";
import React, { useContext } from "react";
import { AppContext } from "../../utils/AppContext";

const NotiWishing = () => {
  const { wishingList } = useContext(AppContext);
  return (
    <div>
      <span
        className={`${
          wishingList?.length <= 0 && "!hidden"
        } fadeIn transition-all flex justify-center items-center mx-auto text-xs font-bold absolute -top-[8px] -right-2 bg-primary w-7 h-7 rounded-full  text-white/90`}
      >
        {wishingList?.length > 9 ? "+9" : wishingList?.length}
      </span>
    </div>
  );
};

export default NotiWishing;
