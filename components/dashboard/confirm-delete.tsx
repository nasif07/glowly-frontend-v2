import { toast } from "sonner";

/**
 * Toast-based delete confirmation (replaces `window.confirm`), ported from
 * the original app's inline react-hot-toast confirm pattern.
 */
export function confirmDelete({
  title,
  description,
  onConfirm,
}: {
  title: string;
  description?: string;
  onConfirm: () => void;
}) {
  toast.custom(
    (id) => (
      <div className="flex flex-col gap-3 rounded-2xl border border-[#E0C9A6] bg-white p-4 shadow-lg">
        <p className="text-sm font-semibold text-[#4B2E2B]">{title}</p>
        {description && (
          <p className="-mt-2 text-xs text-gray-500">{description}</p>
        )}
        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(id)}
            className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(id);
              onConfirm();
            }}
            className="rounded-lg bg-red-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-red-700"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    ),
    { duration: 8000 },
  );
}
