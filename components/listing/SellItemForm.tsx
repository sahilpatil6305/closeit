"use client";

import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createListingSchema, CreateListingFormInput } from "@/schemas/listing";

const SAMPLE_PHOTOS = [
  {
    url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800",
    label: "Leather Jacket",
  },
  {
    url: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800",
    label: "T-Shirt",
  },
  {
    url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
    label: "Sneakers",
  },
  {
    url: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=800",
    label: "Denim Jacket",
  },
];

const CATEGORY_PRESETS = [
  "Outerwear",
  "Tops",
  "Denim",
  "Footwear",
  "Accessories",
  "Vintage",
];

const CONDITION_OPTIONS = [
  { value: "NEW_WITH_TAGS", label: "New With Tags", desc: "Brand new, never worn with tags attached" },
  { value: "LIKE_NEW", label: "Like New", desc: "Worn once or twice, flawless condition" },
  { value: "EXCELLENT", label: "Excellent", desc: "Lightly used with no visible flaws" },
  { value: "GOOD", label: "Good", desc: "Minor signs of wear, well cared for" },
  { value: "FAIR", label: "Fair", desc: "Noticeable wear or minor flaws" },
];

export function SellItemForm(): React.ReactElement {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [customImageUrl, setCustomImageUrl] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateListingFormInput>({
    resolver: zodResolver(createListingSchema),
    defaultValues: {
      title: "",
      description: "",
      price: undefined,
      currency: "INR",
      condition: "EXCELLENT",
      status: "ACTIVE",
      brandName: "",
      categoryName: "Outerwear",
      size: "",
      color: "",
      material: "",
      images: [],
    },
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("Outerwear");
  const [selectedCondition, setSelectedCondition] = useState<string>("EXCELLENT");

  const handleAddImage = (url: string) => {
    if (!url || imageUrls.includes(url)) return;
    const newUrls = [...imageUrls, url];
    setImageUrls(newUrls);
    setValue(
      "images",
      newUrls.map((u) => ({ imageUrl: u }))
    );
    setCustomImageUrl("");
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const newUrls = imageUrls.filter((_, idx) => idx !== indexToRemove);
    setImageUrls(newUrls);
    setValue(
      "images",
      newUrls.map((u) => ({ imageUrl: u }))
    );
  };

  const onSubmit = async (data: CreateListingFormInput) => {
    setServerError(null);

    // If user provided image URLs locally, ensure they are synced into payload
    const finalData = {
      ...data,
      images:
        imageUrls.length > 0
          ? imageUrls.map((url) => ({ imageUrl: url }))
          : data.images,
    };

    try {
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      });

      const resData = await response.json();

      if (!response.ok) {
        setServerError(
          resData.error || "Failed to create listing. Please try again."
        );
        return;
      }

      // Phase 5 Success Flow: Redirect to /listings with success flag
      router.push("/listings?created=true");
      router.refresh();
    } catch (err) {
      console.error("Error submitting listing:", err);
      setServerError("A network error occurred. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
      {serverError && (
        <div
          className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm flex items-start gap-3 shadow-xs"
          role="alert"
        >
          <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>{serverError}</div>
        </div>
      )}

      {/* ─── 1. Photos Section ────────────────────────────────────────── */}
      <section className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Item Photos</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Add up to 4 photos. First image will be used as the cover preview.
          </p>
        </div>

        {/* Thumbnail Preview Grid */}
        {imageUrls.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {imageUrls.map((url, idx) => (
              <div key={idx} className="relative group rounded-xl overflow-hidden aspect-square border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900">
                <Image src={url} alt={`Preview ${idx + 1}`} fill unoptimized className="object-cover" sizes="100vw" />
                {idx === 0 && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[10px] font-bold tracking-wide shadow-xs">
                    COVER
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-slate-900/70 text-white hover:bg-rose-600 transition-colors opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
                  aria-label="Remove image"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Sample Photo Pickers */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Quick Sample Photos:
          </label>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PHOTOS.map((sample) => (
              <button
                key={sample.url}
                type="button"
                onClick={() => handleAddImage(sample.url)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:border-indigo-300 dark:hover:border-indigo-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
              >
                + {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Image URL Input */}
        <div className="flex gap-2 pt-2">
          <input
            type="url"
            value={customImageUrl}
            onChange={(e) => setCustomImageUrl(e.target.value)}
            placeholder="Paste custom image URL (https://...)"
            className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="button"
            onClick={() => handleAddImage(customImageUrl)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-semibold transition-colors"
          >
            Add URL
          </button>
        </div>
      </section>

      {/* ─── 2. Title & Description ───────────────────────────────────── */}
      <section className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-5">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Item Details</h2>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Listing Title <span className="text-rose-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            {...register("title")}
            placeholder="e.g. Vintage 90s Leather Jacket in Black"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-white ${
              errors.title
                ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200 dark:focus:ring-rose-900/50"
                : "border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-900/50"
            }`}
          />
          {errors.title && (
            <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            {...register("description")}
            placeholder="Describe condition, fit, measurements, or flaws..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/50 dark:bg-slate-900 dark:text-white text-sm transition-colors resize-y"
          />
          {errors.description && (
            <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400">{errors.description.message}</p>
          )}
        </div>
      </section>

      {/* ─── 3. Pricing & Category ────────────────────────────────────── */}
      <section className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-5">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Price & Category</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Price (₹) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">₹</span>
              <input
                id="price"
                type="number"
                step="0.01"
                {...register("price")}
                placeholder="2499"
                className={`w-full pl-8 pr-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-white ${
                  errors.price
                    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200 dark:focus:ring-rose-900/50"
                    : "border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-900/50"
                }`}
              />
            </div>
            {errors.price && (
              <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400">{errors.price.message}</p>
            )}
          </div>

          {/* Brand */}
          <div>
            <label htmlFor="brandName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Brand
            </label>
            <input
              id="brandName"
              type="text"
              {...register("brandName")}
              placeholder="e.g. Nike, Schott, Vintage"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/50 dark:bg-slate-900 dark:text-white text-sm transition-colors"
            />
          </div>
        </div>

        {/* Category Presets */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_PRESETS.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setValue("categoryName", cat);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. Fashion Attributes & Condition ────────────────────────── */}
      <section className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-5">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Item Specs</h2>

        {/* Condition Picker */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Condition <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {CONDITION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setSelectedCondition(opt.value);
                  setValue("condition", opt.value as CreateListingFormInput["condition"]);
                }}
                className={`flex flex-col text-left p-3.5 rounded-xl border transition-all ${
                  selectedCondition === opt.value
                    ? "border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-indigo-600 text-slate-700 dark:text-slate-300"
                }`}
              >
                <span className="text-xs font-bold">{opt.label}</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Size, Color, Material */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="size" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Size
            </label>
            <input
              id="size"
              type="text"
              {...register("size")}
              placeholder="e.g. M, L, 32x30"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/50 dark:bg-slate-900 dark:text-white text-xs"
            />
          </div>

          <div>
            <label htmlFor="color" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Color
            </label>
            <input
              id="color"
              type="text"
              {...register("color")}
              placeholder="e.g. Black, Washed Blue"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/50 dark:bg-slate-900 dark:text-white text-xs"
            />
          </div>

          <div>
            <label htmlFor="material" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Material
            </label>
            <input
              id="material"
              type="text"
              {...register("material")}
              placeholder="e.g. 100% Cotton, Denim"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/50 dark:bg-slate-900 dark:text-white text-xs"
            />
          </div>
        </div>
      </section>

      {/* ─── Submit Action ───────────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-60 text-white font-semibold text-sm transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Publishing Listing...</span>
            </>
          ) : (
            <span>Publish Listing</span>
          )}
        </button>
      </div>
    </form>
  );
}
