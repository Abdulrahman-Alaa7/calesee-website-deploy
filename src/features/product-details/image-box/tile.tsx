import clsx from "clsx";
import Image from "next/image";
import React from "react";

type GridTileImageProps = {
  isInteractive?: boolean;
  active?: boolean;
} & Omit<React.ComponentProps<typeof Image>, "alt"> & { alt?: string };

export function GridTileImage({
  isInteractive = true,
  active,
  alt,
  ...props
}: GridTileImageProps) {
  return (
    <div
      className={clsx(
        " group flex h-full w-full items-center justify-center overflow-hidden rounded-md border-2 bg-white hover:border-primary/80 ",
        {
          "border-primary": !!active,
          "border-neutral-200 ": !active,
        },
      )}
    >
      {props.src ? (
        <Image
          {...props}
          alt={alt ?? "product image"}
          className={clsx("relative h-full w-full object-cover object-center", {
            "transition duration-300 ease-in-out group-hover:scale-105":
              isInteractive,
          })}
        />
      ) : null}
    </div>
  );
}
