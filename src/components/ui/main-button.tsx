import React from "react";
import { Button } from "./button";

type Props = {
  title: string;
  accessKey?: string;
};

const MainBtn = ({ title, accessKey }: Props) => {
  return (
    <Button
      name="Main_Btn"
      accessKey={accessKey}
      className=" bg-[#a8603a]  text-lg px-8 h-[46px]   !z-50  hover:bg-[#947268] hover:opacity-90 text-white"
    >
      {title}
    </Button>
  );
};

export default MainBtn;
