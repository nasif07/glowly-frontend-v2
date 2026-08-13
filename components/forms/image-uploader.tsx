"use client";

import { useRef, useState } from "react";
import { UploadCloud, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import {
  uploadImage,
  formatSize,
  MAX_UPLOAD_KB,
  type UploadFolder,
} from "@/lib/upload";

type SingleProps = {
  multiple?: false;
  value?: string;
  /** `key` is the R2 object key — store it so the file can be deleted later. */
  onChange: (value: string, key: string | null) => void;
};

type MultiProps = {
  multiple: true;
  value?: string[];
  /** `keys` is index-aligned with `value`. */
  onChange: (value: string[], keys: (string | null)[]) => void;
};

type ImageUploaderProps = (SingleProps | MultiProps) & {
  label?: string;
  required?: boolean;
  error?: string;
  max?: number;
  /** R2 folder prefix this control uploads into. */
  folder: UploadFolder;
  /** Per-file size cap in KB, checked before the request is sent. */
  maxSizeKb?: number;
  className?: string;
};

/**
 * Image uploader backed by the R2 upload API. Handles both single (string) and
 * multiple (string[]) values with drag & drop + previews.
 *
 * The server converts every upload to WebP under 100KB, so any common image
 * format is accepted here — the size check below only guards the request.
 */
export function ImageUploader({
  label = "Image",
  required = false,
  value,
  onChange,
  error,
  multiple = false,
  max = 5,
  folder,
  maxSizeKb = MAX_UPLOAD_KB,
  className,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keys for files uploaded in this session, so removals can report them back.
  const keysByUrl = useRef(new Map<string, string>());

  const requirementHint = `JPG, PNG or WebP · max ${formatSize(maxSizeKb)} · optimised to WebP on upload`;

  const images: string[] = multiple
    ? ((value as string[]) ?? [])
    : value
      ? [value as string]
      : [];

  const emit = (next: string[]) => {
    const keys = next.map((url) => keysByUrl.current.get(url) ?? null);

    if (multiple) (onChange as MultiProps["onChange"])(next, keys);
    else (onChange as SingleProps["onChange"])(next[0] ?? "", keys[0] ?? null);
  };

  const handleImageUpload = async (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    if (file.size > maxSizeKb * 1024) {
      toast.error(`Each file must be under ${formatSize(maxSizeKb)}`);
      return;
    }

    if (multiple && images.length >= max) {
      toast.error(`You can upload maximum ${max} images`);
      return;
    }

    try {
      setUploading(true);
      setProgress(0);
      const uploaded = await uploadImage(file, folder, setProgress);
      keysByUrl.current.set(uploaded.url, uploaded.key);

      if (multiple) emit([...images, uploaded.url]);
      else emit([uploaded.url]);
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to upload image",
      );
    } finally {
      setUploading(false);
      setProgress(0);
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
            <p className="mt-1 text-[11px] font-medium text-[#A67B5B]">
              {requirementHint}
            </p>
          </div>
        )}

        {uploading && (
          <div className="w-full max-w-55 text-center">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E8D8C3]">
              <div
                className="h-full rounded-full bg-[#6B4A3D] transition-[width] duration-200 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] font-medium text-[#6B4A3D]">
              Uploading… {progress}%
            </p>
          </div>
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
