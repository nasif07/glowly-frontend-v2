"use client";

import { useRef, useState } from "react";
import { UploadCloud, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

type SingleProps = {
  multiple?: false;
  value?: string;
  onChange: (value: string) => void;
};

type MultiProps = {
  multiple: true;
  value?: string[];
  onChange: (value: string[]) => void;
};

type ImageUploaderProps = (SingleProps | MultiProps) & {
  label?: string;
  required?: boolean;
  error?: string;
  max?: number;
  className?: string;
};

/**
 * Cloudinary unsigned image uploader, ported from glowly-frontend. Handles both
 * single (string) and multiple (string[]) values with drag & drop + previews.
 */
export function ImageUploader({
  label = "Image",
  required = false,
  value,
  onChange,
  error,
  multiple = false,
  max = 5,
  className,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const images: string[] = multiple
    ? ((value as string[]) ?? [])
    : value
      ? [value as string]
      : [];

  const emit = (next: string[]) => {
    if (multiple) (onChange as MultiProps["onChange"])(next);
    else (onChange as SingleProps["onChange"])(next[0] ?? "");
  };

  const handleImageUpload = async (file?: File) => {
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Each file must be under 2MB");
      return;
    }

    if (multiple && images.length >= max) {
      toast.error(`You can upload maximum ${max} images`);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET ?? "");

    try {
      setUploading(true);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
        { method: "POST", body: formData },
      );
      const data = await res.json();
      if (!data.secure_url) throw new Error("Upload failed");

      if (multiple) emit([...images, data.secure_url]);
      else emit([data.secure_url]);
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    emit(images.filter((_, i) => i !== index));
  };

  return (
    <div className={className}>
      <label className="mb-2 flex items-center gap-1 text-sm font-medium text-[#4B2E2B]">
        <ImageIcon className="h-4 w-4" />
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div
        className="relative flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D4BFAA] bg-[#FDF8F3] p-6 transition-all duration-300 hover:border-[#6B4A3D] hover:bg-[#F9F1EA]"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file) handleImageUpload(file);
        }}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={(e) => handleImageUpload(e.target.files?.[0])}
          className="hidden"
        />

        {!uploading && (
          <div className="text-center">
            <UploadCloud className="mx-auto mb-2 h-6 w-6 text-[#6B4A3D]" />
            <p className="text-sm font-medium text-[#4B2E2B]">
              {multiple
                ? `Upload images (${images.length}/${max})`
                : "Upload image"}
            </p>
            <p className="text-[11px] text-[#6B4A3D]">Click or drag & drop</p>
          </div>
        )}

        {uploading && (
          <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#D4BFAA] border-t-[#6B4A3D]" />
        )}
      </div>

      {images.length > 0 && (
        <div className={cn(multiple ? "mt-4 grid grid-cols-3 gap-3" : "mt-4 flex justify-center")}>
          {images.map((img, index) => (
            <div key={index} className="group relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={`Preview ${index}`}
                className={
                  multiple
                    ? "h-24 w-full rounded-lg border object-cover shadow-sm"
                    : "h-32 w-32 rounded-lg border object-cover shadow-sm"
                }
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white opacity-0 shadow-lg transition group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-2 flex items-center gap-1 text-xs text-red-500">
          <span className="h-1 w-1 rounded-full bg-red-500" />
          {error}
        </p>
      )}
    </div>
  );
}
