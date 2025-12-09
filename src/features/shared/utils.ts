import { ColorType, SizeType } from "@/types/store.types";

type OptionShape = SizeType | ColorType | Record<string, unknown>;

export const getOptionValue = (opt?: OptionShape): string => {
  if (!opt) return "";

  const anyOpt = opt as Record<string, unknown>;

  if (typeof anyOpt.sizeValue === "string") return anyOpt.sizeValue;
  if (typeof anyOpt.valueSize === "string") return anyOpt.valueSize;
  if (typeof anyOpt.hex === "string") return anyOpt.hex;

  return "";
};

export const isOptionSoldOut = (opt?: OptionShape): boolean => {
  if (!opt) return false;
  const anyOpt = opt as Record<string, unknown>;

  const hasSoldOut =
    typeof anyOpt.soldOut === "boolean" ? anyOpt.soldOut : undefined;
  const hasSoldout =
    typeof anyOpt.soldout === "boolean" ? anyOpt.soldout : undefined;

  return Boolean(hasSoldOut !== undefined ? hasSoldOut : hasSoldout ?? false);
};
