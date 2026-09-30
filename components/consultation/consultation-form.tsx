"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Loader2,
  Lock,
  MessageCircle,
  RotateCcw,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { useLang } from "@/hooks/use-language";
import { useSubmitConsultation } from "@/hooks/use-consultations";
import {
  AGE_RANGE_LABEL,
  SKIN_TYPE_LABEL,
  consultT,
} from "@/lib/consultation-i18n";
import {
  makeConsultationFormSchema,
  type ConsultationFormInput,
  type ConsultationFormValues,
} from "@/lib/schemas";
import { getErrorMessage } from "@/lib/api-error";
import { uploadConsultationPhoto, MAX_UPLOAD_KB } from "@/lib/upload";
import { cn } from "@/lib/utils";
import { AGE_RANGES, SKIN_TYPES } from "@/types";
import LanguageToggle from "@/components/blog/language-toggle";
import { GlowButton } from "@/components/forms/glow-button";

const MAX_PHOTOS = 4;
// HEIC isn't accepted by the API; iOS converts to JPEG when this is asked for.
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
/** What the picker takes; bigger photos are shrunk below the API's 4MB. */
const MAX_PICK_BYTES = 25 * 1024 * 1024;
/** Long edge after shrinking — the API resizes to 1600px anyway. */
const SHRINK_MAX_EDGE = 2000;

/**
 * Re-encode a photo as a JPEG no larger than SHRINK_MAX_EDGE on its long edge,
 * so a 6–12MB phone picture fits the API's 4MB upload limit. Small files go
 * through untouched. Falls back to the original if the browser can't decode.
 */
async function shrinkPhoto(file: File): Promise<File> {
  if (file.size <= 1.5 * 1024 * 1024) return file;
  try {
    // `from-image` applies the EXIF rotation, so portraits stay upright.
    const bitmap = await createImageBitmap(file, {
      imageOrientation: "from-image",
    });
    const scale = Math.min(
      1,
      SHRINK_MAX_EDGE / Math.max(bitmap.width, bitmap.height),
    );
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas
      .getContext("2d")
      ?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.85),
    );
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", {
      type: "image/jpeg",
    });
  } catch {
    return file;
  }
}

type PhotoSlot = {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: "uploading" | "done" | "error";
  token?: string;
  error?: string;
};

/**
 * Bangla font, and no letter-spacing anywhere inside: the tracked, uppercase
 * styles used for English labels and buttons pull Bangla vowel signs and
 * conjuncts apart.
 */
const BANGLA = "font-bengali [&_*]:tracking-normal!";

const labelStyle =
  "mb-1.5 block text-[13px] font-black uppercase tracking-wider text-[#8D6E63]";
const inputStyle =
  "w-full rounded-xl border border-[#EFEBE9] bg-[#FAF9F6] px-4 py-3.5 text-base font-medium outline-none transition-colors focus:border-[#A1887F]";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs font-bold text-rose-500">
      <AlertCircle size={12} /> {message}
    </p>
  );
}

const defaultValues: ConsultationFormInput = {
  name: "",
  whatsapp: "",
  ageRange: "",
  skinType: "",
  concern: "",
  consent: false,
  website: "",
};

export function ConsultationForm() {
  const { lang } = useLang();
  const t = consultT(lang);
  const submit = useSubmitConsultation();

  const schema = useMemo(() => makeConsultationFormSchema(lang), [lang]);
  const form = useForm<ConsultationFormInput, unknown, ConsultationFormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<
      ConsultationFormInput,
      unknown,
      ConsultationFormValues
    >,
    defaultValues,
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const [photos, setPhotos] = useState<PhotoSlot[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [doneId, setDoneId] = useState<string | null | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  // Revoke preview URLs when the page goes away.
  const photosRef = useRef(photos);
  photosRef.current = photos;
  useEffect(
    () => () =>
      photosRef.current.forEach((p) => URL.revokeObjectURL(p.preview)),
    [],
  );

  const patch = (id: string, update: Partial<PhotoSlot>) =>
    setPhotos((all) => all.map((p) => (p.id === id ? { ...p, ...update } : p)));

  const upload = async (slot: PhotoSlot) => {
    patch(slot.id, { status: "uploading", progress: 0, error: undefined });
    try {
      // Phone photos are often over the API's 4MB limit; shrink them first.
      const file = await shrinkPhoto(slot.file);
      if (file.size > MAX_UPLOAD_KB * 1024) throw new Error(t("tooLarge"));
      const { token } = await uploadConsultationPhoto(file, (progress) =>
        patch(slot.id, { progress }),
      );
      patch(slot.id, { status: "done", token, progress: 100 });
    } catch (error) {
      patch(slot.id, {
        status: "error",
        error: error instanceof Error ? error.message : t("uploadFailed"),
      });
    }
  };

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return;
    setPhotoError(null);

    const room = MAX_PHOTOS - photos.length;
    if (room <= 0) {
      toast.error(t("maxPhotos"));
      return;
    }
    const picked = Array.from(files);
    if (picked.length > room) toast.error(t("maxPhotos"));

    const slots: PhotoSlot[] = [];
    for (const file of picked.slice(0, room)) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast.error(t("notImage"));
        continue;
      }
      if (file.size > MAX_PICK_BYTES) {
        toast.error(t("tooLarge"));
        continue;
      }
      slots.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
        status: "uploading",
      });
    }
    if (!slots.length) return;
    setPhotos((all) => [...all, ...slots]);
    slots.forEach(upload);
  };

  const removePhoto = (id: string) => {
    setPhotos((all) => {
      const gone = all.find((p) => p.id === id);
      if (gone) URL.revokeObjectURL(gone.preview);
      return all.filter((p) => p.id !== id);
    });
  };

  const clearPhotos = () => {
    photos.forEach((p) => URL.revokeObjectURL(p.preview));
    setPhotos([]);
  };

  const onValid = (values: ConsultationFormValues) => {
    if (photos.some((p) => p.status === "uploading")) {
      toast.error(t("waitForUploads"));
      return;
    }
    const tokens = photos
      .filter((p) => p.status === "done")
      .map((p) => p.token!);
    if (!tokens.length) {
      setPhotoError(t("photosRequired"));
      toast.error(t("fixFields"));
      return;
    }

    submit.mutate(
      {
        name: values.name,
        whatsapp: values.whatsapp,
        ageRange: values.ageRange || undefined,
        skinType: values.skinType || undefined,
        concern: values.concern,
        photoTokens: tokens,
        consent: true,
        language: lang,
        website: values.website,
      },
      {
        onSuccess: ({ consultationId }) => {
          setDoneId(consultationId);
          reset(defaultValues);
          clearPhotos();
          window.scrollTo({ top: 0, behavior: "smooth" });
        },
        onError: (error) => {
          const status =
            error instanceof AxiosError ? error.response?.status : undefined;
          const message = getErrorMessage(error, t("sendFailed"));
          if (status === 429) {
            toast.error(t("tooManyRequests"));
          } else if (/expired/i.test(message)) {
            // The upload tokens ran out; the photos have to go up again.
            clearPhotos();
            setPhotoError(t("photosExpired"));
            toast.error(t("photosExpired"));
          } else {
            toast.error(lang === "en" ? message : t("sendFailed"));
          }
        },
      },
    );
  };

  const onInvalid = () => {
    if (!photos.some((p) => p.status === "done"))
      setPhotoError(t("photosRequired"));
    toast.error(t("fixFields"));
  };

  const header = (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="max-w-2xl">
        <p className="mb-2 text-[13px] font-bold tracking-[0.25em] text-[#A67B5B] uppercase">
          {t("kicker")}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-[#2D1B14] md:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-[#5D4037]">
          {t("subtitle")}
        </p>
      </div>
      <LanguageToggle className="shrink-0 self-start" />
    </div>
  );

  if (doneId !== undefined) {
    return (
      <div
        className={cn("px-4 py-8 sm:px-6 sm:py-12", lang === "bn" && BANGLA)}
      >
        <div className="mx-auto max-w-3xl">
          {header}
          <div
            role="status"
            className="rounded-3xl border border-[#EFEBE9] bg-white p-8 text-center shadow-sm"
          >
            <CheckCircle2 className="mx-auto mb-4 text-emerald-500" size={44} />
            <h2 className="text-2xl font-bold text-[#2D1B14]">
              {t("doneTitle")}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-[#5D4037]">
              {t("doneBody")}
            </p>
            {doneId && (
              <p className="mt-5 text-sm text-[#8D6E63]">
                {t("reference")}:{" "}
                <span className="font-montserrat font-bold text-[#2D1B14]">
                  {doneId}
                </span>
              </p>
            )}
            <GlowButton
              variant="outline"
              className="mx-auto mt-8"
              onClick={() => setDoneId(undefined)}
            >
              {t("newRequest")}
            </GlowButton>
          </div>
        </div>
      </div>
    );
  }

  const uploading = photos.some((p) => p.status === "uploading");

  return (
    <div className={cn("px-4 py-8 sm:px-6 sm:py-12", lang === "bn" && BANGLA)}>
      <div className="mx-auto max-w-3xl">
        {header}

        <form
          onSubmit={handleSubmit(onValid, onInvalid)}
          noValidate
          className="space-y-6 rounded-3xl border border-[#EFEBE9] bg-white p-5 shadow-sm md:p-8"
        >
          {/* Honeypot: off-screen and skipped by keyboard and screen readers. */}
          <div
            aria-hidden
            className="absolute -left-[9999px] h-px w-px overflow-hidden"
          >
            <label htmlFor="consult-website">Website</label>
            <input
              id="consult-website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...register("website")}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className={labelStyle} htmlFor="consult-name">
                {t("name")}
              </label>
              <input
                id="consult-name"
                autoComplete="name"
                placeholder={t("namePlaceholder")}
                className={inputStyle}
                {...register("name")}
              />
              <FieldError message={errors.name?.message} />
            </div>

            <div>
              <label className={labelStyle} htmlFor="consult-whatsapp">
                {t("whatsapp")}
              </label>
              <input
                id="consult-whatsapp"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="01XXX-XXXXXX"
                className={`${inputStyle} font-montserrat`}
                {...register("whatsapp")}
              />
              <p className="mt-1 text-xs text-[#8D6E63]">{t("whatsappHint")}</p>
              <FieldError message={errors.whatsapp?.message} />
            </div>

            <div>
              <label className={labelStyle} htmlFor="consult-age">
                {t("ageRange")}{" "}
                <span className="font-medium normal-case tracking-normal">
                  ({t("optional")})
                </span>
              </label>
              <select
                id="consult-age"
                className={inputStyle}
                {...register("ageRange")}
              >
                <option value="">{t("choose")}</option>
                {AGE_RANGES.map((range) => (
                  <option key={range} value={range}>
                    {AGE_RANGE_LABEL[range][lang]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelStyle} htmlFor="consult-skin">
                {t("skinType")}{" "}
                <span className="font-medium normal-case tracking-normal">
                  ({t("optional")})
                </span>
              </label>
              <select
                id="consult-skin"
                className={inputStyle}
                {...register("skinType")}
              >
                <option value="">{t("choose")}</option>
                {SKIN_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {SKIN_TYPE_LABEL[type][lang]}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className={labelStyle} htmlFor="consult-concern">
                {t("concern")}
              </label>
              <textarea
                id="consult-concern"
                rows={5}
                placeholder={t("concernPlaceholder")}
                className={inputStyle}
                {...register("concern")}
              />
              <FieldError message={errors.concern?.message} />
            </div>
          </div>

          {/* Photos */}
          <div>
            <p className={labelStyle}>{t("photos")}</p>
            <p className="mb-3 text-sm text-[#8D6E63]">{t("photosHint")}</p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="relative aspect-square overflow-hidden rounded-2xl border border-[#EFEBE9] bg-[#FAF9F6]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.preview}
                    alt={`${t("photos")} ${index + 1}`}
                    className={cn(
                      "h-full w-full object-cover",
                      photo.status !== "done" && "opacity-50",
                    )}
                  />

                  {photo.status === "uploading" && (
                    <div className="absolute inset-x-2 bottom-2">
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/80">
                        <div
                          className="h-full rounded-full bg-[#300332] transition-[width]"
                          style={{ width: `${photo.progress}%` }}
                        />
                      </div>
                      <p className="mt-1 text-center text-[11px] font-bold text-[#300332]">
                        {t("uploading")}
                      </p>
                    </div>
                  )}

                  {photo.status === "error" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/85 p-2 text-center">
                      <p className="text-[11px] font-bold text-rose-600">
                        {photo.error || t("uploadFailed")}
                      </p>
                      <button
                        type="button"
                        onClick={() => upload(photo)}
                        className="inline-flex items-center gap-1 rounded-full bg-[#300332] px-3 py-1 text-[11px] font-bold text-white"
                      >
                        <RotateCcw size={12} /> {t("retry")}
                      </button>
                    </div>
                  )}

                  {photo.status === "done" && (
                    <CheckCircle2
                      className="absolute bottom-2 left-2 rounded-full bg-white text-emerald-500"
                      size={20}
                    />
                  )}

                  <button
                    type="button"
                    onClick={() => removePhoto(photo.id)}
                    aria-label={t("remove")}
                    className="absolute top-2 right-2 rounded-full bg-white/90 p-1 text-[#2D1B14] shadow"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              {photos.length < MAX_PHOTOS && (
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#D4BFAA] bg-[#FDF8F3] text-[#6B4A3D] transition-colors hover:border-[#6B4A3D]"
                >
                  <Camera size={24} />
                  <span className="text-xs font-bold">{t("addPhoto")}</span>
                  <span className="font-montserrat text-[11px]">
                    {photos.length}/{MAX_PHOTOS}
                  </span>
                </button>
              )}
            </div>

            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED_TYPES.join(",")}
              multiple
              className="hidden"
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = "";
              }}
            />
            <FieldError message={photoError ?? undefined} />
            <p className="mt-3 flex items-start gap-2 text-xs text-[#8D6E63]">
              <Lock size={14} className="mt-0.5 shrink-0" />{" "}
              {t("photosPrivate")}
            </p>
          </div>

          {/* Consent */}
          <div>
            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[#EFEBE9] bg-[#FAF9F6] p-4">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 shrink-0 accent-[#300332]"
                {...register("consent")}
              />
              <span className="text-sm leading-relaxed text-[#2D1B14]">
                {t("consent")}
              </span>
            </label>
            <FieldError message={errors.consent?.message} />
          </div>

          <p className="text-xs leading-relaxed text-[#8D6E63]">
            {t("notMedical")}
          </p>

          <GlowButton
            type="submit"
            fullWidth
            disabled={submit.isPending || uploading}
            className="py-4 text-base"
          >
            {submit.isPending ? (
              <>
                <Loader2 className="animate-spin" size={20} /> {t("submitting")}
              </>
            ) : (
              <>
                <MessageCircle size={20} /> {t("submit")}
              </>
            )}
          </GlowButton>
        </form>
      </div>
    </div>
  );
}
