"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

type ProductState = {
  [key: string]: string | number | boolean | undefined;
  image?: string;
  lightboxOpen?: boolean;
  zoom?: number;
  panX?: number;
  panY?: number;
};

type ProductContextType = {
  state: ProductState;
  updateOption: (name: string, value: string) => void;
  updateImage: (index: string) => void;
  openLightbox: (index?: string) => void;
  closeLightbox: () => void;
  setZoom: (z: number) => void;
  setPan: (x: number, y: number) => void;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProductState>({
    image: "0",
    lightboxOpen: false,
    zoom: 1,
    panX: 0,
    panY: 0,
  });

  const updateOption = (name: string, value: string) => {
    setState((prev) => ({ ...prev, [name]: value }));
  };
  const updateImage = (index: string) => {
    setState((prev) => ({ ...prev, image: index }));
  };
  const openLightbox = (index?: string) => {
    setState((prev) => ({
      ...prev,
      lightboxOpen: true,
      image: index ?? prev.image ?? "0",
      zoom: 1,
      panX: 0,
      panY: 0,
    }));
  };
  const closeLightbox = () => {
    setState((prev) => ({
      ...prev,
      lightboxOpen: false,
      zoom: 1,
      panX: 0,
      panY: 0,
    }));
  };
  const setZoom = (z: number) => {
    const clamped = Math.max(1, Math.min(3, z));
    setState((prev) => ({ ...prev, zoom: clamped }));
  };
  const setPan = (x: number, y: number) => {
    setState((prev) => ({ ...prev, panX: x, panY: y }));
  };

  const value = useMemo<ProductContextType>(
    () => ({
      state,
      updateOption,
      updateImage,
      openLightbox,
      closeLightbox,
      setZoom,
      setPan,
    }),
    [state]
  );

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}

export function useProduct(): ProductContextType {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProduct must be used within a ProductProvider");
  return ctx;
}
