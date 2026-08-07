"use client";

import { useRef, useState } from "react";
import { UploadCloud, X, Film, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

// Photos stay small; clips can be larger.
const IMAGE_MAX_MB = 2;
const VIDEO_MAX_MB = 50;

type MediaType = "image" | "video";

interface MediaUploaderProps {
  label?: string;
  required?: boolean;
  value?: string;
  /** Controls the preview + which max size applies. */
  type?: MediaType;
  onChange: (next: { url: string; type: MediaType }) => void;
  error?: string;
  className?: string;
}

/**
 * Cloudinary unsigned uploader for a single image OR video (via `auto/upload`).
 * Sibling to ImageUploader — leaves that image-only component untouched.
 */
export function MediaUploader({
  label = "Media",
  required = false,
  value,
  type = "image",
  onChange,
  error,
  className,
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file?: File) => {
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    if (!isImage && !isVideo) {
      toast.error("Only image or video files are allowed");
      return;
    }

    const maxMb = isVideo ? VIDEO_MAX_MB : IMAGE_MAX_MB;
    if (file.size > maxMb * 1024 * 1024) {
      toast.error(`${isVideo ? "Videos" : "Images"} must be under ${maxMb}MB`);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET ?? "");

    try {
      setUploading(true);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
        { method: "POST", body: formData },
      );
      const data = await res.json();
      if (!data.secure_url) throw new Error("Upload failed");
      onChange({ url: data.secure_url, type: isVideo ? "video" : "image" });
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Failed to upload media");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={className}>
      <label className="mb-2 flex items-center gap-1 text-sm font-medium text-[#4B2E2B]">
        {type === "video" ? (
          <Film className="h-4 w-4" />
        ) : (
          <ImageIcon className="h-4 w-4" />
        )}
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div
        className="relative flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D4BFAA] bg-[#FDF8F3] p-6 transition-all duration-300 hover:border-[#6B4A3D] hover:bg-[#F9F1EA]"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file) handleUpload(file);
        }}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          onChange={(e) => handleUpload(e.target.files?.[0])}
          className="hidden"
        />

        {!uploading && (
          <div className="text-center">
            <UploadCloud className="mx-auto mb-2 h-6 w-6 text-[#6B4A3D]" />
            <p className="text-sm font-medium text-[#4B2E2B]">Upload media</p>
            <p className="text-[11px] text-[#6B4A3D]">
              Image (≤{IMAGE_MAX_MB}MB) or video (≤{VIDEO_MAX_MB}MB)
            </p>
          </div>
        )}

        {uploading && (
          <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#D4BFAA] border-t-[#6B4A3D]" />
        )}
      </div>

      {value && (
        <div className="mt-4 flex justify-center">
          <div className="group relative">
            {type === "video" ? (
              <video
                src={value}
                muted
                loop
                playsInline
                className="h-28 w-48 rounded-lg border object-cover shadow-sm"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value}
                alt="Preview"
                className="h-28 w-48 rounded-lg border object-cover shadow-sm"
              />
            )}
            <button
              type="button"
              onClick={() => onChange({ url: "", type })}
              className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white opacity-0 shadow-lg transition group-hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
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
