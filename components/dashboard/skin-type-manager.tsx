"use client";

import { useState } from "react";
import { Droplets, Film, Image as ImageIcon, Pencil, Sparkles, X } from "lucide-react";
import { toast } from "sonner";

import {
  useSkinTypeMedia,
  useUpdateSkinTypeMedia,
} from "@/hooks/use-skin-types";
import { SKIN_TYPES } from "@/lib/skin";
import { getErrorMessage } from "@/lib/api-error";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import Button from "@/components/common/button";
import { MediaUploader } from "@/components/forms/media-uploader";
import type { SkinTypeMedia } from "@/types/skin-type";

type TileType = (typeof SKIN_TYPES)[number] & { value: SkinTypeMedia["skinType"] };

const TILE_TYPES = SKIN_TYPES.filter((t) => t.value !== "all") as TileType[];

/* ============================================================
   Tile edit modal
============================================================ */
function SkinTypeForm({
  type,
  initial,
  onClose,
}: {
  type: TileType;
  initial?: SkinTypeMedia;
  onClose: () => void;
}) {
  const [mediaType, setMediaType] = useState<"image" | "video">(
    initial?.mediaType || "image",
  );
  const [mediaUrl, setMediaUrl] = useState(initial?.mediaUrl || "");
  const [mediaKey, setMediaKey] = useState<string | null>(
    initial?.mediaKey ?? null,
  );
  const [description, setDescription] = useState(initial?.description || "");

  const update = useUpdateSkinTypeMedia();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    update.mutate(
      {
        skinType: type.value,
        payload: { mediaType, mediaUrl, mediaKey, description },
      },
      {
        onSuccess: () => {
          toast.success(`${type.short} tile saved`);
          onClose();
        },
        onError: (error) =>
          toast.error(getErrorMessage(error, "Failed to save tile")),
      },
    );
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-[#EFDFE7] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#F5E9EF] px-6 py-4">
          <h3 className="flex items-center gap-2 font-bold text-[#300332]">
            <Droplets className="h-4 w-4 text-[#C4891E]" />
            {type.label}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-[#8A6F80] hover:bg-[#FBF4F7]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <MediaUploader
            label={mediaType === "video" ? "Tile Video" : "Tile Image"}
            type={mediaType}
            folder="skin-types"
            value={mediaUrl}
            onChange={({ url, key, type: detected }) => {
              setMediaUrl(url);
              setMediaKey(key);
              if (url) setMediaType(detected);
            }}
          />
          <p className="-mt-3 text-[11px] text-[#8A6F80]">
            Shown full-bleed in a portrait (3:4) card, with the title over the
            bottom — keep faces in the upper half. Remove the media to go back
            to the icon card.
          </p>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#300332]">
              <Sparkles className="h-3.5 w-3.5 text-[#C4891E]" />
              Description{" "}
              <span className="font-normal text-[#B89AAC]">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              maxLength={200}
              placeholder={type.description}
              className="w-full resize-none rounded-2xl border border-[#E3CFDA] bg-[#FBF4F7] px-4 py-3 text-[#300332] transition-all focus:border-[#6B2D5C] focus:ring-4 focus:ring-[#6B2D5C]/5 focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-[#8A6F80]">
              Leave empty to use the default shown above.
            </p>
          </div>

          <Button
            type="submit"
            disabled={update.isPending}
            fullWidth
            variant="primary"
          >
            {update.isPending ? "Saving..." : "Save Tile"}
          </Button>
        </form>
      </div>
    </div>
  );
}

/* ============================================================
   Skin type manager page
============================================================ */
export function SkinTypeManager() {
  const { data: media = [], isLoading } = useSkinTypeMedia();
  const [editing, setEditing] = useState<TileType | null>(null);

  const byType = new Map(media.map((m) => [m.skinType, m]));

  return (
    <div className="mx-auto min-h-screen md:p-4">
      <div className="mb-8">
        <DashboardHeader title="Skin Types" Icon={Droplets} />
        <p className="mt-2 text-sm text-[#8A6F80]">
          Image or video for each tile in the homepage &ldquo;Shop by Skin
          Type&rdquo; section.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {TILE_TYPES.map((type) => {
          const entry = byType.get(type.value);

          return (
            <div
              key={type.value}
              className="flex flex-col overflow-hidden rounded-2xl border border-[#EAD9E2] bg-white shadow-sm"
            >
              <div className="relative aspect-3/4 w-full bg-[#FBF4F7]">
                {isLoading ? (
                  <div className="h-full w-full animate-pulse bg-[#F3E9DC]" />
                ) : entry?.mediaUrl ? (
                  <>
                    {entry.mediaType === "video" ? (
                      <video
                        src={entry.mediaUrl}
                        muted
                        loop
                        autoPlay
                        playsInline
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={entry.mediaUrl}
                        alt={type.label}
                        className="h-full w-full object-cover"
                      />
                    )}
                    <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[8px] font-bold text-white uppercase">
                      {entry.mediaType === "video" ? (
                        <Film className="h-2.5 w-2.5" />
                      ) : (
                        <ImageIcon className="h-2.5 w-2.5" />
                      )}
                      {entry.mediaType}
                    </span>
                  </>
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-[#B89AAC]">
                    <ImageIcon className="h-8 w-8" />
                    <span className="text-[10px] font-bold tracking-wider uppercase">
                      No media
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="flex-1">
                  <p className="font-bold text-[#300332]">{type.short}</p>
                  <p className="mt-1 text-xs leading-snug text-[#8A6F80]">
                    {entry?.description || type.description}
                  </p>
                </div>
                <Button
                  variant="primary"
                  disabled={isLoading}
                  onClick={() => setEditing(type)}
                  className="flex items-center justify-center gap-2"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {editing && (
        <SkinTypeForm
          type={editing}
          initial={byType.get(editing.value)}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
