"use client";

import { Fragment } from "react";
import Link from "next/link";
import {
  Plus,
  Boxes,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  CornerDownRight,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { useCategories, useDeleteCategory } from "@/hooks/use-categories";
import { getErrorMessage } from "@/lib/api-error";
import { confirmDelete } from "@/components/dashboard/confirm-delete";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import Button from "@/components/common/button";
import type { Category } from "@/types";

export function CategoryList() {
  const { data: categories = [], isLoading } = useCategories();
  const deleteCategory = useDeleteCategory();

  const handleDelete = (id: string) => {
    confirmDelete({
      title: "Delete this category?",
      description: "This action cannot be undone. Subcategories may be affected.",
      onConfirm: () => {
        deleteCategory.mutate(id, {
          onSuccess: () => toast.success("Category deleted"),
          onError: (error) => toast.error(getErrorMessage(error, "Failed to delete")),
        });
      },
    });
  };

  const renderRows = (items: Category[], level = 0): React.ReactNode =>
    items.map((cat) => (
      <Fragment key={cat._id}>
        <tr className="group transition-colors hover:bg-[#FDFBF7]">
          <td className="px-6 py-4">
            <div
              className="flex items-center gap-2"
              style={{ marginLeft: `${level * 32}px` }}
            >
              {level > 0 && (
                <CornerDownRight className="h-4 w-4 shrink-0 text-[#A67B5B]" />
              )}
              <div>
                <p
                  className={`font-bold ${level > 0 ? "text-sm text-[#6B4A3D]" : "text-[#4B2E2B]"}`}
                >
                  {cat.name}
                </p>
                <p className="text-[10px] font-medium tracking-wider text-[#8C6A5E] uppercase">
                  {cat.slug}
                </p>
              </div>
            </div>
          </td>
          <td className="px-6 py-4">
            {cat.image ? (
              <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-[#E0C9A6]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cat.image} alt="" className="h-full w-full object-cover" />
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50">
                <ImageIcon className="h-4 w-4 text-gray-300" />
              </div>
            )}
          </td>
          <td className="px-6 py-4">
            {cat.showOnLanding ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[9px] font-bold text-emerald-700 uppercase">
                <CheckCircle2 className="h-3 w-3" /> Featured
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-100 bg-gray-50 px-3 py-1 text-[9px] font-bold text-gray-500 uppercase">
                <XCircle className="h-3 w-3" /> Standard
              </span>
            )}
          </td>
          <td className="px-6 py-4 text-right">
            <div className="flex justify-end gap-3">
              <Link
                href={`/dashboard/categories/edit/${cat._id}`}
                className="inline-flex items-center gap-1 text-[#6B4A3D] hover:text-[#4B2E2B]"
              >
                <Pencil className="h-4 w-4" /> Edit
              </Link>
              <button
                onClick={() => handleDelete(cat._id)}
                disabled={deleteCategory.isPending}
                className="inline-flex items-center gap-1 text-red-700 hover:text-red-800 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          </td>
        </tr>
        {cat.children && cat.children.length > 0 && renderRows(cat.children, level + 1)}
      </Fragment>
    ));

  return (
    <div className="mx-auto min-h-screen md:p-4">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <DashboardHeader title="Category Gallery" Icon={Boxes} />
        <Link href="/dashboard/categories/add">
          <Button variant="primary" className="flex items-center justify-center gap-2">
            <Plus className="h-4 w-4" /> New Category
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-16 w-full animate-pulse rounded-2xl border border-[#E0C9A6] bg-white" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-[#E0C9A6] bg-white p-12 text-center">
          <Boxes className="mx-auto mb-4 h-12 w-12 text-[#E0C9A6]" />
          <h3 className="text-lg font-bold text-[#4B2E2B]">No categories yet</h3>
          <p className="mb-6 text-[#8C6A5E]">Start by adding your first product category.</p>
          <Link
            href="/dashboard/categories/add"
            className="font-bold text-[#4B2E2B] underline underline-offset-4"
          >
            Create Category
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-[#E0C9A6] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-left">
              <thead className="bg-[#FDFBF7]">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black tracking-widest text-[#A67B5B] uppercase">
                    Name & Slug
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black tracking-widest text-[#A67B5B] uppercase">
                    Thumbnail
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black tracking-widest text-[#A67B5B] uppercase">
                    Home Display
                  </th>
                  <th className="px-6 py-4 text-right text-[10px] font-black tracking-widest text-[#A67B5B] uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FBF6EF]">{renderRows(categories)}</tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
