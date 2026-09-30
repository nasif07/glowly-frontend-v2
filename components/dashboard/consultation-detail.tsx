"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  ImageOff,
  Loader2,
  MessageCircle,
  NotebookPen,
  Phone,
  Stethoscope,
  Trash2,
  User,
} from "lucide-react";
import { toast } from "sonner";

import {
  useAddConsultationNote,
  useConsultation,
  useDeleteConsultation,
  useUpdateConsultationStatus,
} from "@/hooks/use-consultations";
import { getErrorMessage } from "@/lib/api-error";
import { whatsAppLink } from "@/lib/whatsapp";
import { AGE_RANGE_LABEL, SKIN_TYPE_LABEL } from "@/lib/consultation-i18n";
import { confirmDelete } from "@/components/dashboard/confirm-delete";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import {
  CONSULTATION_STATUS_LABEL,
  ConsultationStatusBadge,
} from "@/components/dashboard/consultation-status";
import Button from "@/components/common/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CONSULTATION_STATUSES,
  type Consultation,
  type ConsultationStatus,
} from "@/types";

const formatDateTime = (value?: string) =>
  value
    ? new Date(value).toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

/** Opening message, in the language the customer used on the form. */
const greeting = (c: Consultation) =>
  c.language === "bn"
    ? `আসসালামু আলাইকুম ${c.name}, Glowly-র স্কিনকেয়ার টিম থেকে বলছি — আপনার ত্বক পরামর্শের অনুরোধ (${c.consultationId}) নিয়ে।`
    : `Hi ${c.name}, this is Glowly's skincare team about your skin consultation (${c.consultationId}).`;

const card = "rounded-xl border border-gray-200 bg-white p-5";
const cardTitle =
  "mb-3 flex items-center gap-2 text-[11px] font-black tracking-widest text-gray-400 uppercase";

export function ConsultationDetail({ id }: { id: string }) {
  const router = useRouter();
  const { data: consultation, isLoading, isError } = useConsultation(id);
  const updateStatus = useUpdateConsultationStatus(id);
  const addNote = useAddConsultationNote(id);
  const deleteConsultation = useDeleteConsultation();
  const [note, setNote] = useState("");

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#300332]" />
      </div>
    );
  }
  if (isError || !consultation) {
    return (
      <div className="p-10 text-center font-bold text-red-500">
        Consultation not found
      </div>
    );
  }

  const c = consultation;
  const chatLink = whatsAppLink(c.whatsapp, greeting(c));

  const changeStatus = (value: string) =>
    updateStatus.mutate(value as ConsultationStatus, {
      onSuccess: () => toast.success("Status updated"),
      onError: (error) => toast.error(getErrorMessage(error, "Failed to update status")),
    });

  const openWhatsApp = () => {
    if (!chatLink) return;
    window.open(chatLink, "_blank", "noopener,noreferrer");
    // Opening the chat is the contact; record it unless that already happened.
    if (c.status === "new" || c.status === "in_review") changeStatus("contacted");
  };

  const saveNote = () => {
    const body = note.trim();
    if (!body) return;
    addNote.mutate(body, {
      onSuccess: () => {
        setNote("");
        toast.success("Note added");
      },
      onError: (error) => toast.error(getErrorMessage(error, "Failed to add note")),
    });
  };

  const remove = () =>
    confirmDelete({
      title: `Delete ${c.name}'s consultation?`,
      description: "Its photos and notes are deleted too. This can't be undone.",
      onConfirm: () =>
        deleteConsultation.mutate(c._id, {
          onSuccess: () => {
            toast.success("Consultation deleted");
            router.push("/dashboard/consultations");
          },
          onError: (error) => toast.error(getErrorMessage(error, "Failed to delete")),
        }),
    });

  return (
    <div className="min-h-screen md:p-4">
      <DashboardHeader
        title={`Consultation ${c.consultationId ?? ""}`}
        Icon={Stethoscope}
        onBack={() => router.push("/dashboard/consultations")}
      />

      {/* Actions */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <ConsultationStatusBadge status={c.status} />
        <div className="w-44">
          <Select value={c.status} onValueChange={changeStatus} disabled={updateStatus.isPending}>
            <SelectTrigger aria-label="Change status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CONSULTATION_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {CONSULTATION_STATUS_LABEL[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          <Button
            variant="primary"
            onClick={openWhatsApp}
            disabled={!chatLink}
            className="flex items-center gap-2"
          >
            <MessageCircle size={18} /> Open WhatsApp
          </Button>
          <Button
            variant="outline"
            onClick={remove}
            disabled={deleteConsultation.isPending}
            className="flex items-center gap-2"
          >
            <Trash2 size={16} /> Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Customer */}
        <div className={card}>
          <h3 className={cardTitle}>
            <User size={16} /> Customer
          </h3>
          <p className="text-lg font-bold text-gray-900">{c.name}</p>
          <p className="mt-1 flex items-center gap-1 font-mono text-sm text-gray-600">
            <Phone size={13} /> {c.whatsapp}
          </p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-gray-400">Age range</dt>
              <dd className="font-medium text-gray-700">
                {c.ageRange ? AGE_RANGE_LABEL[c.ageRange].en : "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-400">Skin type</dt>
              <dd className="font-medium text-gray-700">
                {c.skinType ? SKIN_TYPE_LABEL[c.skinType].en : "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-400">Form language</dt>
              <dd className="font-medium text-gray-700">
                {c.language === "bn" ? "Bangla" : "English"}
              </dd>
            </div>
          </dl>
        </div>

        {/* Timeline */}
        <div className={card}>
          <h3 className={cardTitle}>
            <Clock size={16} /> Timeline
          </h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-gray-400">Received</dt>
              <dd className="text-gray-700">{formatDateTime(c.createdAt)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-400">Consent given</dt>
              <dd className="text-gray-700">{formatDateTime(c.consentAt)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-400">First contacted</dt>
              <dd className="text-gray-700">{formatDateTime(c.contactedAt)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-400">Closed</dt>
              <dd className="text-gray-700">{formatDateTime(c.closedAt)}</dd>
            </div>
          </dl>
          {c.status === "closed" && !c.photosPurgedAt && (
            <p className="mt-4 rounded-lg bg-amber-50 p-2 text-xs text-amber-700">
              Photos are deleted 90 days after closing.
            </p>
          )}
        </div>

        {/* Concern */}
        <div className={card}>
          <h3 className={cardTitle}>
            <Stethoscope size={16} /> Concern
          </h3>
          <p className="text-sm leading-relaxed whitespace-pre-line text-gray-700">
            {c.concern}
          </p>
        </div>
      </div>

      {/* Photos */}
      <div className={`${card} mt-6`}>
        <h3 className={cardTitle}>Photos</h3>
        {c.photosPurgedAt ? (
          <p className="flex items-center gap-2 text-sm text-gray-500">
            <ImageOff size={16} /> Deleted on {formatDateTime(c.photosPurgedAt)}, 90 days
            after the consultation was closed.
          </p>
        ) : c.photoError ? (
          <p className="text-sm text-red-500">
            Photos can&apos;t be shown: {c.photoError}
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {c.photos.map((photo) =>
                photo.url ? (
                  <a
                    key={photo.index}
                    href={photo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block aspect-square overflow-hidden rounded-xl border border-gray-100 bg-gray-50"
                  >
                    {/* Plain <img>: private photos must not go through the image optimizer's cache. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.url}
                      alt={`Photo ${photo.index + 1} from ${c.name}`}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </a>
                ) : (
                  <div
                    key={photo.index}
                    className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-gray-200 text-gray-400"
                  >
                    <ImageOff size={20} />
                  </div>
                ),
              )}
            </div>
            <p className="mt-3 text-xs text-gray-400">
              Links are private and expire after {Math.round(c.photoLinkSeconds / 60)} minutes;
              the page refreshes them while it stays open.
            </p>
          </>
        )}
      </div>

      {/* Notes */}
      <div className={`${card} mt-6`}>
        <h3 className={cardTitle}>
          <NotebookPen size={16} /> Internal notes
        </h3>
        {c.notes.length === 0 ? (
          <p className="mb-4 text-sm text-gray-400">No notes yet. Only admins see these.</p>
        ) : (
          <ol className="mb-4 space-y-3">
            {c.notes.map((n) => (
              <li key={n._id} className="rounded-lg bg-gray-50 p-3">
                <p className="text-sm whitespace-pre-line text-gray-800">{n.body}</p>
                <p className="mt-1 text-[11px] text-gray-400">
                  {[n.author?.firstName, n.author?.lastName].filter(Boolean).join(" ") ||
                    n.author?.email ||
                    "Admin"}{" "}
                  · {formatDateTime(n.createdAt)}
                </p>
              </li>
            ))}
          </ol>
        )}
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          maxLength={2000}
          placeholder="Add a note for the team (not visible to the customer)…"
          className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#6B2D5C]"
        />
        <div className="mt-2 flex justify-end">
          <Button
            variant="primary"
            onClick={saveNote}
            disabled={!note.trim() || addNote.isPending}
          >
            {addNote.isPending ? "Saving…" : "Add note"}
          </Button>
        </div>
      </div>
    </div>
  );
}
