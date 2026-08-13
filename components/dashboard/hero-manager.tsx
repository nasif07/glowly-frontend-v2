"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Images,
  Plus,
  GripVertical,
  Pencil,
  Trash2,
  Film,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Sparkles,
  Link2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import {
  useHeroManage,
  useUpdateBanner,
  useAddSlide,
  useUpdateSlide,
  useDeleteSlide,
  useReorderSlides,
} from "@/hooks/use-hero";
import { heroBannerSchema, type HeroBannerInput } from "@/lib/schemas";
import { getErrorMessage } from "@/lib/api-error";
import { confirmDelete } from "@/components/dashboard/confirm-delete";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import Button from "@/components/common/button";
import { MediaUploader } from "@/components/forms/media-uploader";
import type { HeroSlide } from "@/types/hero";

const sortSlides = (list: HeroSlide[] = []) =>
  [...list].sort((a, b) => a.order - b.order);

/* ============================================================
   Slide add/edit modal
============================================================ */
function SlideForm({
  initial,
  onClose,
}: {
  initial: HeroSlide | null;
  onClose: () => void;
}) {
  const [type, setType] = useState<"image" | "video">(initial?.type || "image");
  const [mediaUrl, setMediaUrl] = useState(initial?.mediaUrl || "");
  const [mediaKey, setMediaKey] = useState<string | null>(
    initial?.mediaKey ?? null,
  );
  const [title, setTitle] = useState(initial?.title || "");
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);

  const addSlide = useAddSlide();
  const updateSlide = useUpdateSlide();
  const isEdit = Boolean(initial?._id);
  const saving = addSlide.isPending || updateSlide.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaUrl) {
      toast.error("Please upload an image or video first");
      return;
    }

    const payload = { type, mediaUrl, mediaKey, title, isActive };
    const opts = {
      onSuccess: () => {
        toast.success(isEdit ? "Slide updated" : "Slide added");
        onClose();
      },
      onError: (error: unknown) =>
        toast.error(getErrorMessage(error, "Failed to save slide")),
    };

    if (isEdit && initial) {
      updateSlide.mutate({ id: initial._id, payload }, opts);
    } else {
      addSlide.mutate(payload, opts);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-[#E8D8C3] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#F1E6DA] px-6 py-4">
          <h3 className="flex items-center gap-2 font-bold text-[#4B2E2B]">
            <Images className="h-4 w-4 text-[#A67B5B]" />
            {isEdit ? "Edit Slide" : "New Slide"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-[#8C6A5E] hover:bg-[#F9F1E7]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Media type */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#4B2E2B]">
              <Film className="h-3.5 w-3.5 text-[#A67B5B]" />
              Media Type
            </label>
            <div className="flex gap-2">
              {(["image", "video"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`flex-1 rounded-2xl border py-2.5 text-xs font-bold tracking-wider uppercase transition-all ${
                    type === t
                      ? "border-[#4B2E2B] bg-[#4B2E2B] text-white"
                      : "border-[#D4BFAA] bg-[#FCFAF8] text-[#8C6A5E] hover:border-[#6B4A3D]"
                  }`}
                >
                  {t === "image" ? "Image" : "Video"}
                </button>
              ))}
            </div>
          </div>

          {/* Media upload */}
          <MediaUploader
            label={type === "video" ? "Slide Video" : "Slide Image"}
            required
            type={type}
            value={mediaUrl}
            onChange={({ url, key, type: detected }) => {
              setMediaUrl(url);
              setMediaKey(key);
              if (url) setType(detected);
            }}
          />

          {/* Optional caption */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#4B2E2B]">
              <Sparkles className="h-3.5 w-3.5 text-[#A67B5B]" />
              Slide Caption{" "}
              <span className="font-normal text-[#B9A48F]">(optional)</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., New Winter Collection"
              className="w-full rounded-2xl border border-[#D4BFAA] bg-[#FCFAF8] px-5 py-3 text-[#4B2E2B] transition-all focus:border-[#6B4A3D] focus:ring-4 focus:ring-[#6B4A3D]/5 focus:outline-none"
            />
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between rounded-2xl border border-[#E8D8C3] bg-[#F9F1E7] px-5 py-4">
            <div>
              <p className="text-xs font-bold tracking-wider text-[#4B2E2B] uppercase">
                Active
              </p>
              <p className="text-[10px] text-[#8C6A5E]">
                Show this slide on the storefront
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              <div className="peer h-6 w-10 rounded-full bg-[#D4BFAA] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#22C55E] peer-checked:after:translate-x-4" />
            </label>
          </div>

          <Button type="submit" disabled={saving} fullWidth variant="primary">
            {saving ? "Saving..." : isEdit ? "Update Slide" : "Add Slide"}
          </Button>
        </form>
      </div>
    </div>
  );
}

/* ============================================================
   Hero manager page
============================================================ */
export function HeroManager() {
  const { data: banner, isLoading } = useHeroManage();
  const updateBanner = useUpdateBanner();
  const updateSlide = useUpdateSlide();
  const deleteSlide = useDeleteSlide();
  const reorderSlides = useReorderSlides();

  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);

  const { register, handleSubmit, reset, watch } = useForm<HeroBannerInput>({
    resolver: zodResolver(heroBannerSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      ctaText: "",
      ctaLink: "",
      isPublished: false,
    },
  });

  // Seed the form + slide list whenever the banner (re)loads.
  useEffect(() => {
    if (!banner) return;
    reset({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      ctaText: banner.ctaText || "",
      ctaLink: banner.ctaLink || "",
      isPublished: !!banner.isPublished,
    });
    setSlides(sortSlides(banner.slides));
  }, [banner, reset]);

  const onSaveBanner = (values: HeroBannerInput) => {
    updateBanner.mutate(values, {
      onSuccess: () => toast.success("Hero banner saved"),
      onError: (error) => toast.error(getErrorMessage(error, "Failed to save banner")),
    });
  };

  const toggleSlideActive = (slide: HeroSlide) => {
    updateSlide.mutate(
      { id: slide._id, payload: { isActive: !slide.isActive } },
      { onError: (error) => toast.error(getErrorMessage(error, "Failed to update slide")) },
    );
  };

  const handleDeleteSlide = (slide: HeroSlide) => {
    confirmDelete({
      title: "Delete this slide?",
      description: "This removes it from the homepage hero.",
      onConfirm: () =>
        deleteSlide.mutate(slide._id, {
          onSuccess: () => toast.success("Slide removed"),
          onError: (error) => toast.error(getErrorMessage(error, "Failed to delete slide")),
        }),
    });
  };

  /* ----- drag & drop reorder (native HTML5) ----- */
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    setSlides((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      return next;
    });
    setDragIndex(index);
  };

  const persistOrder = () => {
    setDragIndex(null);
    reorderSlides.mutate(
      slides.map((s) => s._id),
      { onError: (error) => toast.error(getErrorMessage(error, "Failed to save order")) },
    );
  };

  const isPublished = watch("isPublished");

  return (
    <div className="mx-auto min-h-screen md:p-4">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <DashboardHeader title="Hero Banner" Icon={Images} />
        <Button
          variant="primary"
          onClick={() => {
            setEditingSlide(null);
            setModalOpen(true);
          }}
          className="flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add Slide
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-24 w-full animate-pulse rounded-2xl border border-[#E0C9A6] bg-white"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_360px]">
          {/* ---- Slides ---- */}
          <section>
            <h2 className="mb-4 text-[10px] font-black tracking-widest text-[#A67B5B] uppercase">
              Slides{" "}
              {slides.length > 0 && `(${slides.length}) — drag to reorder`}
            </h2>

            {slides.length === 0 ? (
              <div className="rounded-3xl border-2 border-dashed border-[#E0C9A6] bg-white p-12 text-center">
                <Images className="mx-auto mb-4 h-12 w-12 text-[#E0C9A6]" />
                <h3 className="text-lg font-bold text-[#4B2E2B]">No slides yet</h3>
                <p className="text-[#8C6A5E]">
                  Add image or video slides to build the homepage hero.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {slides.map((slide, index) => (
                  <div
                    key={slide._id}
                    draggable
                    onDragStart={() => setDragIndex(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={persistOrder}
                    className={`flex items-center gap-4 rounded-2xl border border-[#E0C9A6] bg-white p-3 shadow-sm transition-all ${
                      dragIndex === index ? "opacity-60 ring-2 ring-[#D4BFAA]" : ""
                    }`}
                  >
                    <GripVertical className="h-5 w-5 shrink-0 cursor-grab text-[#C9B7A5] active:cursor-grabbing" />

                    {/* Preview */}
                    <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-[#E0C9A6] bg-[#FBF6EF]">
                      {slide.type === "video" ? (
                        <video
                          src={slide.mediaUrl}
                          muted
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={slide.mediaUrl}
                          alt={slide.title || "slide"}
                          className="h-full w-full object-cover"
                        />
                      )}
                      <span className="absolute bottom-1 left-1 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[8px] font-bold text-white uppercase">
                        {slide.type === "video" ? (
                          <Film className="h-2.5 w-2.5" />
                        ) : (
                          <ImageIcon className="h-2.5 w-2.5" />
                        )}
                        {slide.type}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-[#4B2E2B]">
                        {slide.title || (
                          <span className="font-normal text-[#B9A48F] italic">
                            No caption
                          </span>
                        )}
                      </p>
                      <button
                        type="button"
                        onClick={() => toggleSlideActive(slide)}
                        className={`mt-1 inline-flex items-center gap-1.5 text-[10px] font-bold tracking-tight uppercase ${
                          slide.isActive ? "text-emerald-600" : "text-gray-400"
                        }`}
                      >
                        {slide.isActive ? (
                          <Eye className="h-3.5 w-3.5" />
                        ) : (
                          <EyeOff className="h-3.5 w-3.5" />
                        )}
                        {slide.isActive ? "Active" : "Hidden"}
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingSlide(slide);
                          setModalOpen(true);
                        }}
                        className="rounded-lg p-2 text-[#6B4A3D] transition-colors hover:bg-[#F9F1E7]"
                        aria-label="Edit slide"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSlide(slide)}
                        className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50"
                        aria-label="Delete slide"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ---- Banner settings ---- */}
          <section>
            <h2 className="mb-4 text-[10px] font-black tracking-widest text-[#A67B5B] uppercase">
              Banner Content
            </h2>
            <form
              onSubmit={handleSubmit(onSaveBanner)}
              className="space-y-5 rounded-3xl border border-[#E8D8C3] bg-white p-6 shadow-sm"
            >
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#4B2E2B]">
                  <Sparkles className="h-3.5 w-3.5 text-[#A67B5B]" />
                  Title
                </label>
                <input
                  type="text"
                  {...register("title")}
                  placeholder="The Art of Authentic Glow"
                  className="w-full rounded-2xl border border-[#D4BFAA] bg-[#FCFAF8] px-4 py-3 text-[#4B2E2B] transition-all focus:border-[#6B4A3D] focus:ring-4 focus:ring-[#6B4A3D]/5 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#4B2E2B]">
                  <Sparkles className="h-3.5 w-3.5 text-[#A67B5B]" />
                  Subtitle
                </label>
                <textarea
                  {...register("subtitle")}
                  rows={3}
                  placeholder="100% authentic skincare sourced directly from global origins."
                  className="w-full resize-none rounded-2xl border border-[#D4BFAA] bg-[#FCFAF8] px-4 py-3 text-[#4B2E2B] transition-all focus:border-[#6B4A3D] focus:ring-4 focus:ring-[#6B4A3D]/5 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#4B2E2B]">
                  <Sparkles className="h-3.5 w-3.5 text-[#A67B5B]" />
                  CTA Text
                </label>
                <input
                  type="text"
                  {...register("ctaText")}
                  placeholder="Shop the Lineup"
                  className="w-full rounded-2xl border border-[#D4BFAA] bg-[#FCFAF8] px-4 py-3 text-[#4B2E2B] transition-all focus:border-[#6B4A3D] focus:ring-4 focus:ring-[#6B4A3D]/5 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#4B2E2B]">
                  <Link2 className="h-3.5 w-3.5 text-[#A67B5B]" />
                  CTA Link
                </label>
                <input
                  type="text"
                  {...register("ctaLink")}
                  placeholder="/shop"
                  className="w-full rounded-2xl border border-[#D4BFAA] bg-[#FCFAF8] px-4 py-3 text-[#4B2E2B] transition-all focus:border-[#6B4A3D] focus:ring-4 focus:ring-[#6B4A3D]/5 focus:outline-none"
                />
              </div>

              {/* Published toggle */}
              <div className="flex items-center justify-between rounded-2xl border border-[#E8D8C3] bg-[#F9F1E7] px-5 py-4">
                <div>
                  <p className="text-xs font-bold tracking-wider text-[#4B2E2B] uppercase">
                    Published
                  </p>
                  <p className="text-[10px] text-[#8C6A5E]">
                    {isPublished ? "Live on the homepage" : "Hidden from visitors"}
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    {...register("isPublished")}
                  />
                  <div className="peer h-6 w-10 rounded-full bg-[#D4BFAA] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#22C55E] peer-checked:after:translate-x-4" />
                </label>
              </div>

              <Button
                type="submit"
                disabled={updateBanner.isPending}
                fullWidth
                variant="primary"
              >
                {updateBanner.isPending ? "Saving..." : "Save Banner"}
              </Button>
            </form>
          </section>
        </div>
      )}

      {modalOpen && (
        <SlideForm
          initial={editingSlide}
          onClose={() => {
            setModalOpen(false);
            setEditingSlide(null);
          }}
        />
      )}
    </div>
  );
}
