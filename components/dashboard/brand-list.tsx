"use client";

import Link from "next/link";
import {
  Plus,
  Award,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { useBrands, useDeleteBrand } from "@/hooks/use-brands";
import { getErrorMessage } from "@/lib/api-error";
import { confirmDelete } from "@/components/dashboard/confirm-delete";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import Button from "@/components/common/button";

export function BrandList() {
  const { data: brands = [], isLoading } = useBrands();
  const deleteBrand = useDeleteBrand();

  const handleDelete = (id: string) => {
    confirmDelete({
      title: "Delete this brand?",
      description: "This will remove the brand from all associated products.",
      onConfirm: () => {
        deleteBrand.mutate(id, {
          onSuccess: () => toast.success("Brand removed successfully"),
          onError: (error) => toast.error(getErrorMessage(error, "Failed to delete brand")),
        });
      },
    });
  };

  return (
    <div className="mx-auto min-h-screen md:p-4">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <DashboardHeader title="Brand Directory" Icon={Award} />
        <Link href="/dashboard/brands/add">
          <Button variant="primary" className="flex items-center justify-center gap-2">
            <Plus className="h-4 w-4" /> New Brand
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-16 w-full animate-pulse rounded-2xl border border-[#E0C9A6] bg-white" />
          ))}
        </div>
      ) : brands.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-[#E0C9A6] bg-white p-12 text-center">
          <Award className="mx-auto mb-4 h-12 w-12 text-[#E0C9A6]" />
          <h3 className="text-lg font-bold text-[#4B2E2B]">No brands found</h3>
          <p className="mb-6 text-[#8C6A5E]">
            Start by adding brands to associate with your products.
          </p>
          <Link
            href="/dashboard/brands/add"
            className="font-bold text-[#4B2E2B] underline underline-offset-4"
          >
            Create Brand
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-[#E0C9A6] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-left">
              <thead className="bg-[#FDFBF7]">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black tracking-widest text-[#A67B5B] uppercase">
                    Logo
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black tracking-widest text-[#A67B5B] uppercase">
                    Brand Details
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black tracking-widest text-[#A67B5B] uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black tracking-widest text-[#A67B5B] uppercase">
                    Visibility
                  </th>
                  <th className="px-6 py-4 text-right text-[10px] font-black tracking-widest text-[#A67B5B] uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FBF6EF]">
                {brands.map((brand) => (
                  <tr key={brand._id} className="group transition-colors hover:bg-[#FDFBF7]">
                    <td className="px-6 py-4">
                      {brand.logo ? (
                        <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-[#E0C9A6] bg-white p-1">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={brand.logo}
                            alt={brand.name}
                            className="h-full w-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50">
                          <ImageIcon className="h-4 w-4 text-gray-300" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#4B2E2B]">{brand.name}</p>
                      <p className="font-mono text-[10px] tracking-wider text-[#8C6A5E] uppercase">
                        {brand.slug}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {brand.isActive ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[9px] font-bold text-emerald-700 uppercase">
                          <CheckCircle2 className="h-3 w-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-100 bg-gray-50 px-3 py-1 text-[9px] font-bold text-gray-500 uppercase">
                          <XCircle className="h-3 w-3" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {brand.showOnLanding ? (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-tight text-[#A67B5B] uppercase">
                          <Eye className="h-3.5 w-3.5" /> Featured
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-tight text-gray-400 uppercase">
                          <EyeOff className="h-3.5 w-3.5" /> Hidden
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <Link
                          href={`/dashboard/brands/edit/${brand._id}`}
                          className="inline-flex items-center gap-1 text-[#6B4A3D] hover:text-[#4B2E2B]"
                        >
                          <Pencil className="h-4 w-4" /> Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(brand._id)}
                          disabled={deleteBrand.isPending}
                          className="inline-flex items-center gap-1 text-red-700 hover:text-red-800 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
