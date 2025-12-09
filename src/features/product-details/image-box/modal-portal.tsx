"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type ModalPortalProps = {
  open: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  ariaLabel?: string;
};

export function ModalPortal({ open, children, ariaLabel }: ModalPortalProps) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  if (!elRef.current && typeof document !== "undefined") {
    elRef.current = document.createElement("div");
  }

  useEffect(() => {
    if (!elRef.current || typeof document === "undefined") return;
    const el = elRef.current;
    document.body.appendChild(el);
    return () => {
      try {
        document.body.removeChild(el);
      } catch {}
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    const timer = window.setTimeout(() => {
      (
        elRef.current?.querySelector<HTMLElement>("[data-autofocus]") ??
        elRef.current?.querySelector<HTMLElement>("[role='dialog']")
      )?.focus();
    }, 0);
    return () => {
      window.clearTimeout(timer);
      lastFocusedRef.current?.focus?.();
    };
  }, [open]);

  if (!open || !elRef.current) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      tabIndex={-1}
      className="fixed max-w-full max-h-full overflow-hidden mx-auto inset-0 z-[100] flex flex-col justify-center items-center "
    >
      {children}
    </div>,
    elRef.current
  );
}
