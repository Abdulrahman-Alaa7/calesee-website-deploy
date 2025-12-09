import type { Product, ShippingItem } from "@/types/product.types";

export const isShippingItem = (x: Product | ShippingItem): x is ShippingItem =>
  typeof (x as ShippingItem)?.quantity === "number" &&
  "size" in (x as ShippingItem) &&
  "color" in (x as ShippingItem);

export type ProductsHomeProps = {
  product: Product | ShippingItem;
  isQuickCard?: boolean;
  isList?: boolean;
  isShip?: boolean;
};
