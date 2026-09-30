import { ShadeTag } from "@/components/common/shade-swatch";
import { variantName } from "@/lib/bundle";
import { CONTACT, SITE_URL } from "@/lib/site";
import glowlyLogo from "@/public/glowly-colored.png";
import type { Order } from "@/types";

const PLUM = "#300332";
const GOLD = "#C4891E";

const taka = (n: number | undefined) => `৳${(n || 0).toLocaleString()}`;

/**
 * The branded A4 invoice. Hidden on screen and shown only when printing — the
 * order detail page hides its own layout under print: and this takes its place.
 *
 * `print-color-adjust: exact` keeps the brand fills; browsers drop background
 * colours from printouts by default.
 */
export function OrderInvoice({ order }: { order: Order }) {
  const discount = order.discount || 0;
  const advance = order.advanceAmount || 0;
  const due = order.dueAmount ?? order.totalAmount - advance;
  const invoiceNo = order.orderId || order._id?.slice(-6).toUpperCase();
  const date = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <div className="relative hidden bg-white text-[#2D1B14] [print-color-adjust:exact] [-webkit-print-color-adjust:exact] print:block">
      {/* Brand band */}
      <div
        className="h-2 w-full rounded-full"
        style={{
          background: `linear-gradient(90deg, ${PLUM}, #8E1454, ${GOLD})`,
        }}
      />

      {/* Header */}
      <div className="mt-6 flex items-start justify-between">
        <div>
          {/* Plain <img>: next/image lazy-loads, and a lazy image inside a
              display:none block may never load before the print dialog. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={glowlyLogo.src} alt="Glowly" className="h-14 w-auto" />
          <p className="font-montserrat mt-2 text-[9px] font-semibold tracking-[0.25em] text-[#8D6E63] uppercase">
            100% Authentic Skincare
          </p>
        </div>

        <div className="text-right">
          <h1
            className="text-4xl leading-none font-bold tracking-wide"
            style={{ color: PLUM }}
          >
            Invoice
          </h1>
          <p className="font-montserrat mt-2 text-[11px] text-[#8D6E63]">
            No.{" "}
            <span className="font-bold" style={{ color: PLUM }}>
              {invoiceNo}
            </span>
          </p>
          <p className="font-montserrat text-[11px] text-[#8D6E63]">
            Date <span className="font-bold text-[#2D1B14]">{date}</span>
          </p>
          <span
            className="font-montserrat mt-2 inline-block rounded-full px-3 py-0.5 text-[9px] font-bold tracking-widest text-white uppercase"
            style={{ background: GOLD }}
          >
            {order.orderStatus}
          </span>
        </div>
      </div>

      {/* Parties */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <InfoBlock title="Billed To">
          <p className="text-base font-bold">
            {order.shippingAddress?.name || "Guest"}
          </p>
          <p className="font-montserrat text-[11px]">
            {order.shippingAddress?.phone}
          </p>
        </InfoBlock>
        <InfoBlock title="Deliver To">
          <p className="text-sm leading-snug">
            {order.shippingAddress?.address}
            <br />
            {[order.shippingAddress?.thana, order.shippingAddress?.city]
              .filter(Boolean)
              .join(", ")}
          </p>
        </InfoBlock>
        <InfoBlock title="Payment">
          <p className="font-montserrat text-[11px] font-bold uppercase">
            {order.paymentMethod?.replace("_", " ")}
          </p>
          {order.paymentDetails?.transactionId && (
            <p className="font-montserrat mt-0.5 text-[10px] break-all text-[#8D6E63]">
              TrxID: {order.paymentDetails.transactionId}
            </p>
          )}
          {order.courier?.trackingCode && (
            <p className="font-montserrat mt-0.5 text-[10px] text-[#8D6E63]">
              Tracking: {order.courier.trackingCode}
            </p>
          )}
        </InfoBlock>
      </div>

      {/* Items */}
      <table className="mt-6 w-full border-collapse text-left">
        <thead>
          <tr
            className="font-montserrat text-[9px] tracking-widest text-white uppercase"
            style={{ background: PLUM }}
          >
            <th className="rounded-l-lg py-2 pl-3 font-bold">#</th>
            <th className="py-2 font-bold">Item</th>
            <th className="py-2 text-right font-bold">Price</th>
            <th className="py-2 text-center font-bold">Qty</th>
            <th className="rounded-r-lg py-2 pr-3 text-right font-bold">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {order.items?.map((item, index) => (
            <tr
              key={index}
              className="break-inside-avoid border-b border-[#F5E9EF] align-top"
              style={index % 2 ? { background: "#FCF8F3" } : undefined}
            >
              <td className="font-montserrat py-2 pl-3 text-[10px] text-[#8D6E63]">
                {String(index + 1).padStart(2, "0")}
              </td>
              <td className="py-2 pr-2">
                <p className="text-sm font-bold">{item.title}</p>
                {item.variant?.isShade ? (
                  <ShadeTag
                    name={item.variant.color}
                    hex={item.variant.hex}
                    sku={item.variant.sku}
                    className="flex text-[10px] text-[#8D6E63]"
                  />
                ) : (
                  variantName(item.variant) && (
                    <p className="text-[10px] text-[#8D6E63]">
                      {variantName(item.variant)}
                      {item.variant?.sku && (
                        <span className="font-montserrat ml-1">
                          [{item.variant.sku}]
                        </span>
                      )}
                    </p>
                  )
                )}
                {item.isBundle && item.bundleItems?.length ? (
                  <ul
                    className="mt-1 border-l-2 pl-2 text-[10px] text-[#8D6E63]"
                    style={{ borderColor: GOLD }}
                  >
                    {item.bundleItems.map((entry, i) => (
                      <li key={i}>
                        {entry.title}
                        {variantName(entry.variant) &&
                          ` (${variantName(entry.variant)})`}{" "}
                        ×{entry.quantity * item.quantity}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </td>
              <td className="font-montserrat py-2 text-right text-[11px]">
                {taka(item.price)}
              </td>
              <td className="font-montserrat py-2 text-center text-[11px]">
                {item.quantity}
              </td>
              <td className="font-montserrat py-2 pr-3 text-right text-[11px] font-bold">
                {taka(item.price * item.quantity)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Note + totals */}
      <div className="mt-5 flex break-inside-avoid items-start justify-between gap-6">
        <div className="max-w-[55%] pt-2">
          <p className="text-lg italic" style={{ color: PLUM }}>
            ✦ Thank you for glowing with us!
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[#8D6E63]">
            Every product is sourced for authenticity. Please check your parcel
            in front of the delivery rider. For any help with your order, reach
            us at {CONTACT.phone}.
          </p>
        </div>

        <div className="w-64 overflow-hidden rounded-xl border border-[#EFDFE7]">
          <div className="font-montserrat space-y-1.5 p-3 text-[11px]">
            <Row label="Subtotal" value={taka(order.subtotal)} />
            <Row
              label="Delivery"
              value={order.shippingCharge ? taka(order.shippingCharge) : "Free"}
            />
            {discount > 0 && (
              <Row label="Discount" value={`− ${taka(discount)}`} accent />
            )}
            <div className="flex justify-between border-t border-[#F5E9EF] pt-1.5 font-bold">
              <span>Total</span>
              <span>{taka(order.totalAmount)}</span>
            </div>
            {advance > 0 && (
              <Row label="Advance Paid" value={`− ${taka(advance)}`} accent />
            )}
          </div>
          <div
            className="flex items-center justify-between px-3 py-2.5 text-white"
            style={{ background: PLUM }}
          >
            <span className="font-montserrat text-[9px] font-bold tracking-widest uppercase">
              {due > 0 ? "Cash on Delivery" : "Fully Paid"}
            </span>
            <span className="font-montserrat text-lg font-black">
              {taka(due)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 break-inside-avoid">
        <div
          className="h-px w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
          }}
        />
        <div className="font-montserrat mt-3 flex justify-center gap-5 text-[9px] tracking-wider text-[#8D6E63]">
          <span>{CONTACT.phone}</span>
          <span style={{ color: GOLD }}>✦</span>
          <span>{CONTACT.email}</span>
          <span style={{ color: GOLD }}>✦</span>
          <span>{SITE_URL.replace("https://", "")}</span>
          <span style={{ color: GOLD }}>✦</span>
          <span>{CONTACT.city}</span>
        </div>
      </div>
    </div>
  );
}

function InfoBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[#EFDFE7] bg-[#FCF8F3] p-3">
      <p
        className="font-montserrat mb-1 text-[8px] font-bold tracking-[0.2em] uppercase"
        style={{ color: GOLD }}
      >
        {title}
      </p>
      {children}
    </div>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`flex justify-between ${accent ? "text-emerald-700" : "text-[#5D4037]"}`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
