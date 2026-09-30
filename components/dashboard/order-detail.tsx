"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Printer,
  User,
  CreditCard,
  MapPin,
  Phone,
  CheckCircle2,
  Truck,
  Pencil,
} from "lucide-react";

import {
  useOrder,
  useSendOrderToSteadfast,
  useUpdateOrderPricing,
} from "@/hooks/use-orders";
import { OrderStatusControl } from "@/components/forms/order-status-control";
import { OrderInvoice } from "@/components/dashboard/order-invoice";
import { getErrorMessage } from "@/lib/api-error";
import Button from "@/components/common/button";
import { ShadeTag } from "@/components/common/shade-swatch";
import { variantName } from "@/lib/bundle";
import type { Order, OrderStatus } from "@/types";

function confirmSendToCourier(onConfirm: () => void) {
  toast.custom(
    (id) => (
      <div className="flex flex-col gap-3 rounded-2xl border border-[#EAD9E2] bg-white p-4 shadow-lg">
        <p className="text-sm font-semibold text-[#300332]">
          Send this order to Steadfast?
        </p>
        <p className="-mt-2 text-xs text-gray-500">
          This creates a real courier consignment using the order&apos;s
          shipping address and due amount. It can&apos;t be undone from here.
        </p>
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
            className="rounded-lg bg-[#300332] px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-[#4a054d]"
          >
            Send Order
          </button>
        </div>
      </div>
    ),
    { duration: 8000 },
  );
}

const statuses: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export function OrderDetail({ id }: { id: string }) {
  const router = useRouter();
  const { data: order, isLoading } = useOrder(id);
  const sendToSteadfast = useSendOrderToSteadfast(id);

  const handleSendToSteadfast = () => {
    confirmSendToCourier(() => {
      sendToSteadfast.mutate(undefined, {
        onSuccess: () => toast.success("Order sent to Steadfast"),
        onError: (error) =>
          toast.error(
            getErrorMessage(error, "Failed to send order to Steadfast"),
          ),
      });
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#300332]" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-10 text-center font-bold text-red-500">
        Order not found
      </div>
    );
  }

  const currentStep = statuses.indexOf(order.orderStatus);

  // Printing swaps this screen layout for the branded <OrderInvoice />.
  return (
    <>
      <OrderInvoice order={order} />
      <div className="mx-auto min-h-screen md:p-8 print:hidden">
        {/* Header */}
        <div className="mb-8 items-center justify-between md:flex print:mb-4 print:flex">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="rounded-full border border-gray-200 bg-white p-2 transition-all hover:bg-gray-50 print:hidden"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 uppercase print:text-xl">
                Invoice #{order._id?.slice(-6)}
              </h1>
              <p className="text-xs font-medium text-gray-500">
                Order Date:{" "}
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString()
                  : "—"}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 md:mt-0 print:hidden">
            {order.courier?.consignmentId ? (
              <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 uppercase">
                <Truck size={16} />
                Sent · {order.courier.trackingCode}
              </div>
            ) : (
              <Button
                variant="primary"
                onClick={handleSendToSteadfast}
                disabled={sendToSteadfast.isPending}
                className="flex items-center gap-2"
              >
                <Truck size={18} />
                <span className="font-semibold">
                  {sendToSteadfast.isPending
                    ? "Sending..."
                    : "Send to Steadfast"}
                </span>
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => window.print()}
              className="flex items-center gap-2"
            >
              <Printer size={18} />{" "}
              <span className="font-semibold">Print Invoice</span>
            </Button>
          </div>
        </div>

        {/* Status Section */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 print:hidden">
          <div className="relative mb-8 flex justify-between">
            {statuses.map((step, idx) => (
              <div
                key={step}
                className="z-10 flex flex-1 flex-col items-center"
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                    idx <= currentStep
                      ? "scale-110 bg-black text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {idx + 1}
                </div>
                <span
                  className={`mt-3 text-[11px] font-bold tracking-tighter uppercase ${idx <= currentStep ? "text-black" : "text-gray-400"}`}
                >
                  {step}
                </span>
              </div>
            ))}
            <div className="absolute top-4.5 right-0 left-0 -z-0 mx-10 h-[2px] bg-gray-100" />
          </div>

          <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Update Status:
            </label>
            <OrderStatusControl
              id={order._id}
              currentStatus={order.orderStatus}
            />
          </div>
        </div>

        {/* Details Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-3 print:mb-4 print:grid-cols-3 print:gap-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5 print:border-gray-300 print:p-3">
            <h3 className="mb-3 flex items-center gap-2 text-[11px] font-black tracking-widest text-gray-400 uppercase print:mb-1.5">
              <User size={16} /> Customer
            </h3>
            <p className="font-bold text-gray-900">
              {order.shippingAddress?.name || "Guest User"}
            </p>
            <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
              <Phone size={12} /> {order.shippingAddress?.phone}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 print:border-gray-300 print:p-3">
            <h3 className="mb-3 flex items-center gap-2 text-[11px] font-black tracking-widest text-gray-400 uppercase print:mb-1.5">
              <MapPin size={16} /> Shipping Address
            </h3>
            <p className="text-sm leading-relaxed text-gray-600">
              {order.shippingAddress?.address}
              <br />
              {order.shippingAddress?.city}
              <br />
              {order.shippingAddress?.thana}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 print:border-gray-300 print:p-3">
            <h3 className="mb-3 flex items-center gap-2 text-[11px] font-black tracking-widest text-gray-400 uppercase print:mb-1.5">
              <CreditCard size={16} /> Payment Details
            </h3>
            <p className="text-xs font-bold tracking-wide text-gray-500 uppercase">
              {order.paymentMethod?.replace("_", " ")}
            </p>
            <div className="mt-2 space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase">
                Transaction ID
              </p>
              <p className="font-mono text-xs font-bold break-all text-gray-800">
                {order.paymentDetails?.transactionId || "N/A"}
              </p>
            </div>
            <div className="mt-3 flex items-center gap-2 text-green-600 print:mt-2">
              <CheckCircle2 size={14} />
              <span className="text-[10px] font-black tracking-wider uppercase">
                Advance ৳{order.advanceAmount || 0} Received
              </span>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 print:overflow-visible print:border-gray-300 md:overflow-x-hidden">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-[11px] tracking-widest text-gray-500 uppercase print:bg-transparent">
                <th className="px-6 py-4 font-bold print:px-3 print:py-2">
                  Product
                </th>
                <th className="px-6 py-4 text-right font-bold print:px-3 print:py-2">
                  Unit Price
                </th>
                <th className="px-6 py-4 text-center font-bold print:px-3 print:py-2">
                  Quantity
                </th>
                <th className="px-6 py-4 text-right font-bold print:px-3 print:py-2">
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white print:divide-gray-300">
              {order.items?.map((item, index) => (
                <tr
                  key={index}
                  className="break-inside-avoid hover:bg-gray-50/50"
                >
                  <td className="px-6 py-4 print:px-3 print:py-2">
                    <div className="flex items-center gap-4">
                      {item.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt=""
                          className="h-10 w-10 rounded border border-gray-100 object-cover print:hidden"
                        />
                      )}
                      <div className="min-w-0">
                        <span className="text-sm font-bold text-gray-800">
                          {item.title}
                        </span>
                        {/* Orders placed before shades have no isShade and
                          render exactly as before. */}
                        {item.variant?.isShade ? (
                          <ShadeTag
                            name={item.variant.color}
                            hex={item.variant.hex}
                            sku={item.variant.sku}
                            className="mt-0.5 flex text-xs font-medium text-gray-500"
                          />
                        ) : (
                          // Which size / option was bought — the packer needs it.
                          variantName(item.variant) && (
                            <p className="mt-0.5 text-xs font-medium text-gray-500">
                              {variantName(item.variant)}
                              {item.variant?.sku && (
                                <span className="ml-1 font-mono">
                                  [{item.variant.sku}]
                                </span>
                              )}
                            </p>
                          )
                        )}
                        {item.isBundle && item.bundleItems?.length ? (
                          <ul className="mt-1.5 space-y-0.5 border-l-2 border-gray-200 pl-2 text-xs text-gray-500">
                            {item.bundleItems.map((entry, i) => (
                              <li key={i}>
                                {entry.title}
                                {variantName(entry.variant) &&
                                  ` (${variantName(entry.variant)})`}
                                {entry.variant?.sku && (
                                  <span className="ml-1 font-mono">
                                    [{entry.variant.sku}]
                                  </span>
                                )}{" "}
                                <span className="font-bold text-gray-700">
                                  ×{entry.quantity * item.quantity}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-sm text-gray-600 print:px-3 print:py-2">
                    ৳{item.price?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-medium text-gray-600 print:px-3 print:py-2">
                    x{item.quantity}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-sm font-bold text-gray-900 print:px-3 print:py-2">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mt-8 flex justify-end">
          <div className="w-full rounded-xl border border-gray-200 bg-white p-6 md:w-80">
            <PricingEditor order={order} />
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-medium text-gray-500">
                <span>Subtotal</span>
                <span className="font-mono text-gray-900">
                  ৳{(order.subtotal || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm font-medium text-gray-500">
                <span>Delivery Fee</span>
                <span className="font-mono text-gray-900">
                  {order.shippingCharge
                    ? `৳${order.shippingCharge.toLocaleString()}`
                    : "Free"}
                </span>
              </div>
              {(order.discount || 0) > 0 && (
                <div className="flex justify-between text-sm font-medium text-emerald-700">
                  <span>Discount</span>
                  <span className="font-mono">
                    - ৳{(order.discount || 0).toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-100 pt-2 text-sm font-bold text-gray-900">
                <span>Total Amount</span>
                <span className="font-mono">
                  ৳{order.totalAmount?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between rounded-lg bg-green-50 p-2 text-sm font-bold text-green-700">
                <span>Advance Paid</span>
                <span className="font-mono">
                  - ৳{(order.advanceAmount || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between border-t-2 border-dashed border-gray-200 pt-4">
                <div className="flex flex-col">
                  <span className="text-xs font-black tracking-wider text-gray-400 uppercase">
                    Cash on Delivery
                  </span>
                  <span className="text-base font-bold text-gray-900">
                    Due Balance
                  </span>
                </div>
                <span className="font-mono text-2xl font-black text-black">
                  ৳
                  {(
                    order.dueAmount ??
                    order.totalAmount - (order.advanceAmount || 0)
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Edit the order's flat discount and delivery fee. The API recomputes the
 * total and due amount; the advance already collected is left as it is.
 * Locked once the order is with the courier, whose COD amount is already set.
 */
function PricingEditor({ order }: { order: Order }) {
  const updatePricing = useUpdateOrderPricing(order._id);
  const [editing, setEditing] = useState(false);
  const [discount, setDiscount] = useState("");
  const [shipping, setShipping] = useState("");

  const locked = Boolean(order.courier?.consignmentId);
  const maxDiscount = (order.subtotal || 0) + (Number(shipping) || 0);

  const open = () => {
    setDiscount(String(order.discount || 0));
    setShipping(String(order.shippingCharge || 0));
    setEditing(true);
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const nextDiscount = Number(discount) || 0;
    const nextShipping = Number(shipping) || 0;
    if (nextDiscount < 0 || nextShipping < 0) {
      toast.error("Amounts can't be negative");
      return;
    }
    if (nextDiscount > maxDiscount) {
      toast.error(`Discount can't be more than ৳${maxDiscount}`);
      return;
    }
    updatePricing.mutate(
      { discount: nextDiscount, shippingCharge: nextShipping },
      {
        onSuccess: () => {
          toast.success("Order amount updated");
          setEditing(false);
        },
        onError: (error) =>
          toast.error(getErrorMessage(error, "Failed to update amount")),
      },
    );
  };

  if (!editing) {
    return (
      <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
        <span className="text-[11px] font-black tracking-widest text-gray-400 uppercase">
          Summary
        </span>
        {locked ? (
          <span className="text-[10px] font-medium text-gray-400">
            Locked · sent to courier
          </span>
        ) : (
          <button
            type="button"
            onClick={open}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Pencil size={12} /> Edit Discount / Delivery
          </button>
        )}
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-sm outline-none focus:border-gray-400";

  return (
    <form
      onSubmit={save}
      className="mb-4 space-y-3 rounded-lg border border-gray-200 bg-gray-50/60 p-3"
    >
      <div>
        <label className="mb-1 block text-[11px] font-bold text-gray-500 uppercase">
          Flat Discount (৳)
        </label>
        <input
          type="number"
          min={0}
          max={maxDiscount}
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="text-[11px] font-bold text-gray-500 uppercase">
            Delivery Fee (৳)
          </label>
          <button
            type="button"
            onClick={() => setShipping("0")}
            className="text-[11px] font-semibold text-emerald-700 hover:underline"
          >
            Make free
          </button>
        </div>
        <input
          type="number"
          min={0}
          value={shipping}
          onChange={(e) => setShipping(e.target.value)}
          className={inputClass}
        />
      </div>
      <p className="text-[11px] text-gray-500">
        New total: ৳
        {Math.max(0, maxDiscount - (Number(discount) || 0)).toLocaleString()}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="flex-1 rounded-lg border border-gray-200 bg-white py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={updatePricing.isPending}
          className="flex-1 rounded-lg bg-[#300332] py-2 text-xs font-semibold text-white transition-colors hover:bg-[#4a054d] disabled:opacity-60"
        >
          {updatePricing.isPending ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
