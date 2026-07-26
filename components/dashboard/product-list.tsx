"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Pencil,
  Trash2,
  Package,
  Loader2,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Star,
} from "lucide-react";
import { toast } from "sonner";

import { useProducts, useDeleteProduct } from "@/hooks/use-products";
import { getErrorMessage } from "@/lib/api-error";
import { confirmDelete } from "@/components/dashboard/confirm-delete";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import Button from "@/components/common/button";
import type { Product } from "@/types";

const PLACEHOLDER_IMAGE = "https://placehold.co/400x400?text=No+Image";

const categoryName = (product: Product) =>
  typeof product.category === "object" ? product.category?.name : undefined;

export function ProductList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data, isLoading } = useProducts({ limit: 1000 });
  const deleteProduct = useDeleteProduct();
  const products = useMemo(() => data?.data ?? [], [data]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        product.title.toLowerCase().includes(search) ||
        product.productId?.toLowerCase().includes(search);
      const matchesCategory =
        selectedCategory === "All" || categoryName(product) === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const categories = useMemo(() => {
    const names = products.map(categoryName).filter(Boolean) as string[];
    return ["All", ...new Set(names)];
  }, [products]);

  const handleDelete = (id: string, name: string) => {
    confirmDelete({
      title: `Delete "${name}"?`,
      onConfirm: () => {
        deleteProduct.mutate(id, {
          onSuccess: () => toast.success("Product removed"),
          onError: (error) => toast.error(getErrorMessage(error, "Failed to delete product")),
        });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-[#6B4A3D]" />
        <p className="font-medium text-[#6B4A3D]">Loading inventory...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <DashboardHeader title="Inventory" Icon={Package} />
        <Link href="/dashboard/inventory/add-product" className="w-full md:w-auto">
          <Button
            variant="primary"
            className="flex w-full items-center justify-center gap-2 shadow-lg shadow-[#6B4A3D]/10 md:w-auto"
          >
            <Plus size={18} /> Add New Product
          </Button>
        </Link>
      </div>

      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full rounded-2xl border border-[#E8D8C3] bg-white py-3 pr-4 pl-10 text-sm placeholder:text-gray-300 focus:ring-2 focus:ring-[#6B4A3D] focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative min-w-[160px]">
          <Filter className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <select
            className="w-full appearance-none rounded-2xl border border-[#E8D8C3] bg-white py-3 pr-8 pl-10 text-sm font-medium text-[#4B2E2B] focus:ring-2 focus:ring-[#6B4A3D] focus:outline-none"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border-2 border-dashed border-[#E8D8C3] bg-white p-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FDF8F3]">
            <AlertCircle className="h-8 w-8 text-[#A67B5B]" />
          </div>
          <h3 className="text-xl font-bold text-[#4B2E2B]">No products found</h3>
          <p className="mt-2 max-w-xs text-sm text-gray-400">
            Try adjusting your filters or search terms to find what you&apos;re
            looking for.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-hidden rounded-3xl border border-[#E8D8C3] bg-white shadow-sm lg:block">
            <table className="w-full text-sm">
              <thead className="border-b border-[#E8D8C3] bg-[#FDF8F3] text-[#4B2E2B]">
                <tr>
                  <th className="px-6 py-5 text-left text-[11px] font-bold tracking-wider uppercase">
                    Product Details
                  </th>
                  <th className="px-6 py-5 text-left text-[11px] font-bold tracking-wider uppercase">
                    Category
                  </th>
                  <th className="px-6 py-5 text-left text-[11px] font-bold tracking-wider uppercase">
                    Pricing
                  </th>
                  <th className="px-6 py-5 text-left text-[11px] font-bold tracking-wider uppercase">
                    Stock Status
                  </th>
                  <th className="px-6 py-5 text-left text-[11px] font-bold tracking-wider uppercase">
                    Visibility
                  </th>
                  <th className="px-6 py-5 text-right text-[11px] font-bold tracking-wider uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FDF8F3]">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="group transition-colors hover:bg-[#FDF8F3]/40">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={product.images?.[0]?.url || PLACEHOLDER_IMAGE}
                            alt={product.title}
                            className="h-14 w-14 rounded-2xl border border-[#E8D8C3] object-cover"
                          />
                          {product.isFeatured && (
                            <div className="absolute -top-1.5 -right-1.5 rounded-full border-2 border-white bg-yellow-400 p-1 text-white shadow-md">
                              <Star size={10} fill="currentColor" />
                            </div>
                          )}
                        </div>
                        <div className="flex min-w-0 flex-col">
                          <span className="max-w-[200px] truncate font-bold text-[#4B2E2B] transition-colors group-hover:text-[#A67B5B]">
                            {product.title}
                          </span>
                          <span className="mt-0.5 font-mono text-[10px] text-gray-400">
                            {product.productId || "NO-ID"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-lg border border-[#E8D8C3] bg-[#FDF8F3] px-3 py-1 text-xs font-semibold text-[#6B4A3D] italic">
                        {categoryName(product) || "General"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-base font-bold text-[#4B2E2B]">
                        ৳{product.discountPrice > 0 ? product.discountPrice : product.price}
                      </div>
                      {product.discountPrice > 0 && (
                        <div className="text-[11px] text-red-400 line-through">
                          ৳{product.price}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div
                          className={`text-sm font-bold ${(product.totalStock ?? 0) <= 5 ? "text-red-500" : "text-gray-700"}`}
                        >
                          {product.totalStock ?? 0} units
                        </div>
                        <div
                          className={`text-[10px] font-bold tracking-tighter uppercase ${product.stockStatus === "In Stock" ? "text-emerald-500" : "text-red-400"}`}
                        >
                          {product.stockStatus}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold ${
                          product.isActive
                            ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                            : "border-gray-200 bg-gray-50 text-gray-500"
                        }`}
                      >
                        <div
                          className={`h-1.5 w-1.5 rounded-full ${product.isActive ? "bg-emerald-500" : "bg-gray-400"}`}
                        />
                        {product.isActive ? "Visible" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/dashboard/inventory/edit/${product._id}`}
                          className="rounded-xl p-2 text-[#6B4A3D] transition-colors hover:bg-[#FDF8F3]"
                        >
                          <Pencil size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id, product.title)}
                          disabled={deleteProduct.isPending}
                          className="rounded-xl p-2 text-red-400 transition-colors hover:bg-red-50 disabled:opacity-50"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="rounded-3xl border border-[#E8D8C3] bg-white p-5 shadow-sm"
              >
                <div className="mb-4 flex gap-4">
                  <div className="relative flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.images?.[0]?.url || PLACEHOLDER_IMAGE}
                      alt={product.title}
                      className="h-16 w-16 rounded-2xl border border-[#E8D8C3] object-cover"
                    />
                    {product.isFeatured && (
                      <div className="absolute -top-1 -right-1 rounded-full border-2 border-white bg-yellow-400 p-1 text-white">
                        <Star size={10} fill="currentColor" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-[10px] text-gray-400">
                        {product.productId || "NO-ID"}
                      </span>
                      <span
                        className={`rounded px-2 py-0.5 text-[9px] font-black uppercase ${product.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}
                      >
                        {product.isActive ? "Active" : "Hidden"}
                      </span>
                    </div>
                    <h3 className="mt-0.5 line-clamp-1 font-bold text-[#4B2E2B]">
                      {product.title}
                    </h3>
                    <p className="text-xs font-medium text-[#A67B5B] italic">
                      {categoryName(product) || "General"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-[#FDF8F3] pt-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Price</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#4B2E2B]">৳{product.price}</span>
                      {product.discountPrice > 0 && (
                        <span className="text-[10px] text-red-400 line-through">
                          ৳{product.discountPrice}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Stock</span>
                    <span
                      className={`font-bold ${(product.totalStock ?? 0) <= 5 ? "text-red-500" : "text-[#4B2E2B]"}`}
                    >
                      {product.totalStock ?? 0} <span className="text-[10px]">units</span>
                    </span>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <Link
                    href={`/dashboard/inventory/edit/${product._id}`}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#FDF8F3] py-2.5 text-xs font-bold text-[#6B4A3D] transition-colors hover:bg-[#EFE3D1]"
                  >
                    <Pencil size={14} /> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product._id, product.title)}
                    disabled={deleteProduct.isPending}
                    className="flex items-center justify-center gap-2 rounded-xl bg-red-50 py-2.5 text-xs font-bold text-red-500 transition-colors hover:bg-red-100 disabled:opacity-50"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
