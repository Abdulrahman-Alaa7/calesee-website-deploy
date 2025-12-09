"use client";

import { createContext, useEffect, useState, ReactNode } from "react";
import type {
  Product,
  ShippingItem,
  WishingItem,
} from "../types/product.types";

type LoadingStates = {
  fetching: boolean;
  adding: boolean;
  deleting: boolean;
};

type AppContextType = {
  shippingList: ShippingItem[];
  setShippingList: (list: ShippingItem[]) => void;
  wishingList: WishingItem[];
  setWishingList: (list: WishingItem[]) => void;

  handleAddNewItemShipping: (
    item: Product,
    quantity: number,
    size: string,
    color: string
  ) => void;
  handleDeleteItemShipping: (id: string, size?: string, color?: string) => void;
  handleDeleteAllShippingList: () => void;
  handleItemShippingIncreaseOrDecrease: (
    id: string,
    quantity: number,
    size?: string,
    color?: string
  ) => void;

  handleAddToWishingList: (item: Product) => void;
  handleDeleteFromWishingList: (id: string) => void;
  handleDeleteAllWishingList: () => void;

  loadingStates: LoadingStates;
};

export const AppContext = createContext<AppContextType>({} as AppContextType);

type Props = { children: ReactNode };

export const AppStorage = ({ children }: Props) => {
  const [shippingList, setShippingList] = useState<ShippingItem[]>([]);
  const [wishingList, setWishingList] = useState<WishingItem[]>([]);
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    fetching: true,
    adding: false,
    deleting: false,
  });

  useEffect(() => {
    setLoadingStates((prev) => ({ ...prev, fetching: true }));

    const savedShippingList =
      typeof window !== "undefined"
        ? localStorage.getItem("shippingList")
        : null;
    const savedWishingList =
      typeof window !== "undefined"
        ? localStorage.getItem("wishingList")
        : null;

    if (savedShippingList) setShippingList(JSON.parse(savedShippingList));
    if (savedWishingList) setWishingList(JSON.parse(savedWishingList));

    setLoadingStates((prev) => ({ ...prev, fetching: false }));
  }, []);

  useEffect(() => {
    if (!loadingStates.fetching) {
      localStorage.setItem("shippingList", JSON.stringify(shippingList));
      localStorage.setItem("wishingList", JSON.stringify(wishingList));
    }
  }, [shippingList, wishingList, loadingStates.fetching]);

  const handleAddNewItemShipping = (
    item: Product,
    quantity: number,
    size: string,
    color: string
  ) => {
    setLoadingStates((s) => ({ ...s, adding: true }));

    setShippingList((prev) => {
      const updated = [...prev];
      const index = updated.findIndex(
        (p) => p.id === item.id && p.size === size && p.color === color
      );

      if (index === -1) {
        updated.push({
          id: item.id,
          name: item.name,
          mainImage: item.images[0].url,
          price:
            item.estimatedPrice && item.estimatedPrice > 0
              ? item.estimatedPrice
              : item.price,
          quantity,
          size,
          color,
        });
      } else {
        updated[index] = {
          ...updated[index],
          quantity: updated[index].quantity + quantity,
        };
      }

      return updated;
    });

    setLoadingStates((s) => ({ ...s, adding: false }));
  };

  const handleDeleteItemShipping = (
    id: string,
    size?: string,
    color?: string
  ) => {
    setLoadingStates((s) => ({ ...s, deleting: true }));

    setShippingList((prev) =>
      prev.filter((p) => !(p.id === id && p.size === size && p.color === color))
    );

    setLoadingStates((s) => ({ ...s, deleting: false }));
  };

  const handleDeleteAllShippingList = () => {
    setLoadingStates((s) => ({ ...s, deleting: true }));
    setShippingList([]);
    setLoadingStates((s) => ({ ...s, deleting: false }));
  };

  const handleItemShippingIncreaseOrDecrease = (
    id: string,
    quantity: number,
    size?: string,
    color?: string
  ) => {
    setLoadingStates((s) => ({ ...s, adding: true }));

    setShippingList((prev) => {
      const updated = [...prev];
      const index = updated.findIndex(
        (p) => p.id === id && p.size === size && p.color === color
      );

      if (index !== -1) {
        if (quantity <= 0) updated.splice(index, 1);
        else updated[index].quantity = quantity;
      }
      return updated;
    });

    setLoadingStates((s) => ({ ...s, adding: false }));
  };

  const handleAddToWishingList = (item: Product) => {
    setLoadingStates((s) => ({ ...s, adding: true }));

    setWishingList((prev) => {
      if (prev.some((p) => p.id === item.id)) return prev;
      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          mainImage: item.images[0].url,
          price:
            item.estimatedPrice && item.estimatedPrice > 0
              ? item.estimatedPrice
              : item.price,
        },
      ];
    });

    setLoadingStates((s) => ({ ...s, adding: false }));
  };

  const handleDeleteFromWishingList = (id: string) => {
    setLoadingStates((s) => ({ ...s, deleting: true }));
    setWishingList((prev) => prev.filter((p) => p.id !== id));
    setLoadingStates((s) => ({ ...s, deleting: false }));
  };

  const handleDeleteAllWishingList = () => {
    setLoadingStates((s) => ({ ...s, deleting: true }));
    setWishingList([]);
    setLoadingStates((s) => ({ ...s, deleting: false }));
  };

  return (
    <AppContext.Provider
      value={{
        shippingList,
        setShippingList,
        wishingList,
        setWishingList,
        handleAddNewItemShipping,
        handleDeleteItemShipping,
        handleDeleteAllShippingList,
        handleItemShippingIncreaseOrDecrease,
        handleAddToWishingList,
        handleDeleteFromWishingList,
        handleDeleteAllWishingList,
        loadingStates,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
