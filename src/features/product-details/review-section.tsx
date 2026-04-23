/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Skeleton } from "@/components/ui/skeleton";

import { Star, UploadCloud, X, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { useReviews } from "@/hooks/useReviews";
import { Product } from "@/types/product.types";
import Image from "next/image";

const createSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(2, t("name_required")),
    rating: z.number().min(1, t("rating_required")),
    comment: z.string().min(5, t("comment_required")),
    image: z.instanceof(File).optional(),
  });

type FormData = {
  name: string;
  rating: number;
  comment: string;
  image?: File;
};

const StarRating = ({
  value,
  onChange,
  isCreate = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  isCreate?: boolean;
}) => (
  <div className="flex gap-1 w-full my-2 justify-center items-center mx-auto">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        onClick={() => onChange?.(s)}
        className={cn(
          " cursor-pointer transition",
          s <= value
            ? "fill-primary text-primary scale-110"
            : "text-muted-foreground",
          isCreate ? "w-8 h-8 cursor-pointer" : "w-5 h-5 cursor-default",
        )}
      />
    ))}
  </div>
);

const ExpandableText = ({
  text,
  t,
}: {
  text: string;
  t: (key: string) => string;
}) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > 120;

  return (
    <div>
      <p
        className={cn(
          "text-sm text-muted-foreground leading-relaxed",
          !expanded && "line-clamp-3",
        )}
      >
        {text}
      </p>

      {isLong && (
        <button
          onClick={() => setExpanded((p) => !p)}
          className="text-xs text-primary mt-1 hover:underline cursor-pointer"
        >
          {expanded ? t("show_less") : t("read_more")}
        </button>
      )}
    </div>
  );
};

const ReviewSkeleton = () => (
  <Card className="p-4 space-y-3">
    <div className="flex items-center gap-3">
      <Skeleton className="w-9 h-9 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="w-20 h-3" />
        <Skeleton className="w-16 h-3" />
      </div>
    </div>
    <Skeleton className="w-full h-14" />
    <Skeleton className="w-full h-40 rounded-xl" />
  </Card>
);

const UploadBox = ({
  t,
  onSelect,
}: {
  t: (key: string) => string;
  onSelect: (file: File, previewUrl: string) => void;
}) => (
  <label className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center cursor-pointer hover:bg-muted/50 transition">
    <UploadCloud className="w-6 h-6 mb-2 text-muted-foreground" />
    <p className="text-sm">{t("upload_image")}</p>
    <span className="text-xs text-muted-foreground">
      {t("upload_hint")} ({t("optional")})
    </span>
    <input
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) onSelect(f, URL.createObjectURL(f));
      }}
    />
  </label>
);

type ReviewFormProps = {
  t: (key: string) => string;
  creating: boolean;
  onSubmit: (data: FormData, file: File | null) => Promise<boolean>;
};

const ReviewForm = ({
  t,
  creating,
  onSubmit: onSubmitProp,
}: ReviewFormProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(createSchema(t)),
    defaultValues: { name: "", rating: 0, comment: "" },
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileSelect = (f: File, previewUrl: string) => {
    setFile(f);
    setPreview(previewUrl);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    form.setValue("image", undefined);
  };

  const handleSubmit = async (data: FormData) => {
    const success = await onSubmitProp(data, file);
    if (success) {
      setFile(null);
      setPreview(null);
      form.reset();
    }
  };

  const rating = form.watch("rating");

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <Input
        {...form.register("name")}
        placeholder={t("your_name")}
        className="h-[48px]"
        disabled={creating}
      />
      {form.formState.errors.name && (
        <p className="text-xs text-red-500 ">{t("name_required")}</p>
      )}
      <div>
        <p className="text-sm mb-1">
          {t("rating")} <span className="text-red-500">*</span>
        </p>
        <StarRating
          value={rating}
          onChange={(v) =>
            form.setValue("rating", v, {
              shouldValidate: form.formState.isSubmitted,
            })
          }
          isCreate
        />

        {form.formState.errors.rating && (
          <p className="text-xs text-red-500 text-center ">
            {t("rating_required")}
          </p>
        )}
      </div>

      <Textarea
        {...form.register("comment")}
        placeholder={t("comment")}
        className=" resize-none min-h-[80px] max-h-[90px] overflow-y-auto "
        disabled={creating}
      />

      {form.formState.errors.comment && (
        <p className="text-xs text-red-500 ">{t("comment_required")}</p>
      )}

      {!preview && <UploadBox t={t} onSelect={handleFileSelect} />}

      {preview && (
        <div className="relative group">
          <img
            src={preview}
            alt={t("upload_image")}
            className="rounded-xl max-h-40 w-full object-cover"
          />
          <button
            type="button"
            onClick={handleRemoveFile}
            className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full  transition cursor-pointer"
          >
            <X size={12} />
          </button>
        </div>
      )}

      <Button type="submit" disabled={creating} className="w-full">
        {t("submit")}
      </Button>
    </form>
  );
};

const ReviewSection = ({ product }: { product: Product }) => {
  const t = useTranslations("HomeProducts");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { reviews, loading, createReview, creating } = useReviews(product.id);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);
  const [sort, setSort] = useState("latest");

  const sorted = useMemo(() => {
    if (sort === "highest") {
      return [...reviews].sort((a, b) => b.rating - a.rating);
    }
    return [...reviews].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [reviews, sort]);

  const visible = sorted.slice(0, visibleCount);

  const handleCreateReview = async (
    data: FormData,
    file: File | null,
  ): Promise<boolean> => {
    try {
      await createReview({
        variables: {
          input: {
            productId: product.id,
            name: data.name,
            rating: data.rating,
            comment: data.comment,
            image: file ?? undefined,
          },
        },
      });
      toast.success(t("success_message"));
      setDialogOpen(false);
      setDrawerOpen(false);
      return true;
    } catch (error) {
      toast.error(
        t("error_message"),
        error instanceof Error ? { description: error.message } : undefined,
      );
      return false;
    }
  };

  return (
    <section dir={isRTL ? "rtl" : "ltr"} className="space-y-8 mt-6 mb-4">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <h2 className="text-xl font-semibold">
          {t("reviews")} ({reviews.length})
        </h2>

        <div className="flex gap-2 mt-3 md:mt-0">
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-32 cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest" className="cursor-pointer">
                {t("latest")}
              </SelectItem>
              <SelectItem value="highest" className="cursor-pointer">
                {t("highest")}
              </SelectItem>
            </SelectContent>
          </Select>

          <div className="hidden md:block">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>{t("add_review")}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-center mb-4">
                    {t("add_review")}
                  </DialogTitle>
                </DialogHeader>
                <ReviewForm
                  t={t}
                  creating={creating}
                  onSubmit={handleCreateReview}
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className="md:hidden">
            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
              <DrawerTrigger asChild>
                <Button>{t("add_review")}</Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>{t("add_review")}</DrawerTitle>
                </DrawerHeader>
                <div className="p-4">
                  <ReviewForm
                    t={t}
                    creating={creating}
                    onSubmit={handleCreateReview}
                  />
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>

      {loading && (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {[...Array(6)].map((_, i) => (
            <ReviewSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && reviews.length === 0 && (
        <div className="flex flex-col items-center py-20 text-center space-y-6">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center">
            <MessageSquare />
          </div>

          <div>
            <h3 className="text-lg font-semibold">{t("empty_title")}</h3>
            <p className="text-sm text-muted-foreground">{t("empty_desc")}</p>
          </div>

          <Button onClick={() => setDialogOpen(true)}>{t("empty_cta")}</Button>
        </div>
      )}

      {!loading && reviews.length > 0 && (
        <>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5 mx-2 md:mx-0">
            {visible.map((r) => (
              <Card
                key={r.id}
                className="break-inside-avoid p-4 space-y-3 gap-2! md:gap-3!"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-muted rounded-full flex items-center justify-center">
                    {r.name[0]}
                  </div>

                  <div>
                    <p className="text-sm font-medium">{r.name}</p>
                    <StarRating value={r.rating} />
                  </div>
                </div>

                <ExpandableText text={r.comment} t={t} />

                {r.imageUrl && (
                  <Image
                    src={r.imageUrl}
                    alt={r.name}
                    width={500}
                    height={500}
                    className="rounded-xl w-full object-cover"
                  />
                )}
              </Card>
            ))}
          </div>

          {visibleCount < reviews.length && (
            <div className="text-center">
              <Button onClick={() => setVisibleCount((p) => p + 8)}>
                {t("load_more")}
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ReviewSection;
