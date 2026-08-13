"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  MapPin,
  Phone,
  User,
  CreditCard,
  ChevronRight,
  Loader2,
  Copy,
  AlertCircle,
  Truck,
  Banknote,
} from "lucide-react";
import { toast } from "sonner";

import {
  shippingAddressSchema,
  makePaymentDetailsSchema,
  makeCreateOrderSchema,
} from "@/lib/schemas";
import {
  useCartStore,
  useCartSubtotal,
  CART_SHIPPING_CHARGE,
} from "@/hooks/use-cart";
import {
  useStoreSettings,
  DEFAULT_STORE_SETTINGS,
} from "@/hooks/use-settings";
import { useCreateOrder } from "@/hooks/use-orders";
import { useAuth } from "@/hooks/use-auth";
import { getErrorMessage } from "@/lib/api-error";
import { allLocation } from "@/lib/constants/locations";
import { trackInitiateCheckout, trackPurchase } from "@/lib/track-event";
import { Form } from "@/components/ui/form";
import { GlowButton } from "@/components/forms/glow-button";

const BKASH_NUMBER = "01575808878";
const DELIVERY_CHARGE = CART_SHIPPING_CHARGE;

/**
 * The entered-fields schema depends on the store payment policy: in full
 * cash-on-delivery mode the bKash fields aren't rendered, so requiring them
 * would block the form with errors the customer can't see or fix.
 */
const makeCheckoutFormSchema = (
  advanceRequired: boolean,
  minAdvance: number,
) =>
  advanceRequired
    ? z.object({
        ...shippingAddressSchema.shape,
        ...makePaymentDetailsSchema(minAdvance).shape,
      })
    : shippingAddressSchema;

/**
 * Superset of both shapes — the bKash fields are optional here because they
 * only exist in advance mode. The active schema above is what actually
 * enforces them.
 */
type CheckoutFormValues = z.infer<typeof shippingAddressSchema> &
  Partial<z.infer<ReturnType<typeof makePaymentDetailsSchema>>>;

const labelStyle =
  "text-[14px] font-black text-[#8D6E63] mb-1.5 block uppercase tracking-wider";
const inputBaseStyle =
  "w-full px-4 py-3.5 bg-[#FAF9F6] border border-[#EFEBE9] rounded-xl text-base font-medium focus:border-[#A1887F] outline-none transition-colors";

/**
 * Validation message for a field. Without these the form fails silently —
 * `handleSubmit` just refuses to fire and nothing on screen explains why.
 * Same treatment the login/register forms use.
 */
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs font-bold text-rose-500 uppercase">
      <AlertCircle size={12} /> {message}
    </p>
  );
}

export function CheckoutForm() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const storedSubtotal = useCartSubtotal();
  const createOrder = useCreateOrder();
  const { user } = useAuth();

  // The cart store reads localStorage at module scope, so the server renders an
  // empty summary while the client's very first render already has the items.
  // Gate the rendered figures on mount — the same guard CartView uses.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const cartItems = mounted ? items : [];
  const subtotal = mounted ? storedSubtotal : 0;

  const locations = useMemo(() => allLocation(), []);

  // Store-wide payment policy set by the admin (Dashboard → Settings). Falls
  // back to the advance panel while loading so the form never flashes the
  // wrong payment step.
  const { data: settings } = useStoreSettings();
  const advanceRequired =
    settings?.advanceRequired ?? DEFAULT_STORE_SETTINGS.advanceRequired;
  const minAdvance =
    settings?.advanceAmount ?? DEFAULT_STORE_SETTINGS.advanceAmount;

  const checkoutFormSchema = useMemo(
    () => makeCheckoutFormSchema(advanceRequired, minAdvance),
    [advanceRequired, minAdvance],
  );

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(
      checkoutFormSchema,
    ) as unknown as Resolver<CheckoutFormValues>,
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      city: "",
      thana: "",
      senderNumber: "",
      transactionId: "",
      advanceAmount: minAdvance,
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const city = watch("city");
  const enteredAdvance = watch("advanceAmount");

  // In COD mode nothing is collected up front, whatever the field last held.
  const advanceAmount = advanceRequired ? Number(enteredAdvance) || 0 : 0;

  // The settings arrive after first render; seed the amount once they do, but
  // never clobber a figure the customer has already typed over.
  useEffect(() => {
    if (!form.getFieldState("advanceAmount").isDirty) {
      setValue("advanceAmount", minAdvance);
    }
  }, [minAdvance, form, setValue]);

  const availableThanas = useMemo(() => {
    const district = locations.find((loc) => loc.district === city);
    return district ? district.thana.filter((t) => t.trim() !== "") : [];
  }, [city, locations]);

  // Set the moment an order succeeds, before the cart is cleared. Without it,
  // clearing the cart re-runs the guard below, which then races the redirect to
  // /order-success and lands the customer on /shop with an "empty cart" error
  // immediately after they paid.
  const orderPlaced = useRef(false);

  // Redirect out of an empty cart, matching the original guard.
  useEffect(() => {
    if (!mounted || orderPlaced.current) return;
    if (items.length === 0) {
      toast.error("Your cart is empty");
      router.push("/shop");
    } else {
      trackInitiateCheckout(items, subtotal + DELIVERY_CHARGE, user);
    }
    // Fire once per checkout session — items/subtotal don't change on this page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, items.length, router]);

  const totalWithShipping = subtotal + DELIVERY_CHARGE;
  const dueAmount = totalWithShipping - advanceAmount;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(BKASH_NUMBER);
    toast.success("Number copied!");
  };

  const onSubmit = (values: CheckoutFormValues) => {
    const parsed = makeCreateOrderSchema(advanceRequired, minAdvance).safeParse({
      products: items.map((item) => ({
        title: item.title,
        productId: item._id,
        variant: item.variant ?? {},
        quantity: Number(item.quantity),
        price: Number(item.price),
        image: item.image,
      })),
      subtotal,
      shippingCharge: DELIVERY_CHARGE,
      advanceAmount,
      dueAmount,
      totalAmount: totalWithShipping,
      shippingAddress: {
        name: values.name,
        phone: values.phone,
        address: values.address,
        city: values.city,
        thana: values.thana,
      },
      paymentMethod: advanceRequired ? "BKASH_MANUAL" : "COD",
      paymentDetails: advanceRequired
        ? {
            senderNumber: values.senderNumber,
            transactionId: values.transactionId,
            advanceAmount,
          }
        : undefined,
    });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please review your order.");
      return;
    }

    createOrder.mutate(parsed.data, {
      onSuccess: (order) => {
        orderPlaced.current = true;
        trackPurchase(order, user);
        toast.success("Order placed successfully!");
        clearCart();
        router.push("/order-success");
      },
      onError: (error) => toast.error(getErrorMessage(error, "Order failed.")),
    });
  };

  /** Zod rejected the form — say so, since the errors can be below the fold. */
  const onInvalid = () =>
    toast.error("Please complete the highlighted fields.");

  return (
    <div className="px-4 py-6 text-[#2D1B14] sm:px-6 sm:py-10">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-base font-bold text-[#8D6E63]">
          <Link href="/cart" className="cursor-pointer hover:text-black">
            Cart
          </Link>
          <ChevronRight size={16} />
          <span className="font-extrabold text-black">Checkout</span>
        </div>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit, onInvalid)}
            noValidate
            className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12"
          >
            <div className="space-y-6 lg:col-span-7">
              {/* Shipping */}
              <div className="rounded-2xl border border-[#EFEBE9] bg-white p-4 md:p-6">
                <h2 className="mb-6 flex items-center gap-3 text-xl font-black tracking-tight uppercase">
                  <MapPin className="text-[#A1887F]" size={22} /> Shipping Details
                </h2>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {/* Full Name */}
                  <div className="md:col-span-2">
                    <label className={labelStyle} htmlFor="checkout-name">Full Name</label>
                    <div className="relative">
                      <User
                        className="absolute top-1/2 left-4 -translate-y-1/2 text-[#A1887F]"
                        size={20}
                      />
                      <input
                        id="checkout-name"
                        {...register("name")}
                        placeholder="Enter your full name"
                        className={`${inputBaseStyle} pl-11`}
                      />
                    </div>
                    <FieldError message={errors.name?.message} />
                  </div>

                  {/* Phone */}
                  <div className="md:col-span-2">
                    <label className={labelStyle} htmlFor="checkout-phone">Phone Number</label>
                    <div className="font-montserrat relative">
                      <Phone
                        className="absolute top-1/2 left-4 -translate-y-1/2 text-[#A1887F]"
                        size={20}
                      />
                      <input
                        id="checkout-phone"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        {...register("phone")}
                        placeholder="01XXX-XXXXXX"
                        className={`${inputBaseStyle} pl-11`}
                      />
                    </div>
                    <FieldError message={errors.phone?.message} />
                  </div>

                  {/* District */}
                  <div>
                    <label className={labelStyle} htmlFor="checkout-city">District</label>
                    <div className="relative">
                      <select
                        id="checkout-city"
                        {...register("city")}
                        onChange={(e) => {
                          setValue("city", e.target.value);
                          setValue("thana", "");
                        }}
                        className={`${inputBaseStyle} cursor-pointer appearance-none`}
                      >
                        <option value="">Select District</option>
                        {locations.map((loc) => (
                          <option key={loc.name} value={loc.district}>
                            {loc.district}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2">
                        <ChevronRight size={16} className="rotate-90 text-[#A1887F]" />
                      </div>
                    </div>
                    <FieldError message={errors.city?.message} />
                  </div>

                  {/* Thana */}
                  <div>
                    <label className={labelStyle} htmlFor="checkout-thana">Thana / Upazila</label>
                    <div className="relative">
                      <select
                        id="checkout-thana"
                        {...register("thana")}
                        disabled={!city}
                        className={`${inputBaseStyle} cursor-pointer appearance-none disabled:bg-gray-100 disabled:opacity-50`}
                      >
                        <option value="">
                          {city ? "Select Thana" : "Select District first"}
                        </option>
                        {availableThanas.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2">
                        <ChevronRight size={16} className="rotate-90 text-[#A1887F]" />
                      </div>
                    </div>
                    <FieldError message={errors.thana?.message} />
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className={labelStyle} htmlFor="checkout-address">Full Delivery Address</label>
                    <textarea
                      id="checkout-address"
                      {...register("address")}
                      placeholder="House #, Road #, Area details..."
                      rows={2}
                      className={inputBaseStyle}
                    />
                    <FieldError message={errors.address?.message} />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="rounded-2xl border border-[#EFEBE9] bg-white p-4 md:p-6">
                <h2 className="mb-5 flex items-center gap-3 text-xl font-black tracking-tight uppercase">
                  <CreditCard className="text-[#A1887F]" size={22} /> Payment Method
                </h2>

                {advanceRequired ? (
                  <>
                    <div className="mb-5 flex gap-3 rounded-r-xl border-l-4 border-red-500 bg-red-50 p-4">
                      <AlertCircle className="shrink-0 text-red-500" size={20} />
                      <p className="font-montserrat text-sm leading-snug font-bold text-amber-900">
                        Advance Required: Please send ৳{minAdvance} via bKash.
                        Rest is Cash on Delivery.
                      </p>
                    </div>

                    <div className="mb-6 flex flex-col items-center justify-between gap-4 rounded-2xl bg-[#461149] p-6 sm:flex-row">
                      <div>
                        <p className="mb-1 text-[11px] font-black tracking-widest text-white/60 uppercase">
                          bKash Personal Number
                        </p>
                        <p className="font-mono text-2xl font-black text-white">
                          {BKASH_NUMBER}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={copyToClipboard}
                        className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-black text-white transition-all hover:bg-white/20"
                      >
                        <Copy size={16} /> COPY
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div>
                        <label className={labelStyle} htmlFor="checkout-advance">Advance Paid (৳)</label>
                        <input
                          id="checkout-advance"
                          type="number"
                          min={minAdvance}
                          {...register("advanceAmount")}
                          className="font-montserrat w-full rounded-xl border border-[#EFEBE9] bg-[#FAF9F6] px-4 py-3 text-base font-medium outline-none focus:border-[#A1887F]"
                        />
                        <FieldError message={errors.advanceAmount?.message} />
                      </div>
                      <div>
                        <label className={labelStyle} htmlFor="checkout-sender">Your bKash Number</label>
                        <input
                          id="checkout-sender"
                          type="tel"
                          inputMode="numeric"
                          {...register("senderNumber")}
                          placeholder="018XXXXXXXX"
                          className="font-montserrat w-full rounded-xl border border-[#EFEBE9] bg-[#FAF9F6] px-4 py-3 text-base font-medium outline-none focus:border-[#A1887F]"
                        />
                        <FieldError message={errors.senderNumber?.message} />
                      </div>
                      <div>
                        <label className={labelStyle} htmlFor="checkout-trx">Transaction ID</label>
                        <input
                          id="checkout-trx"
                          {...register("transactionId")}
                          placeholder="TRX123456"
                          className="font-montserrat w-full rounded-xl border border-[#EFEBE9] bg-[#FAF9F6] px-4 py-3 text-base font-medium uppercase outline-none focus:border-[#A1887F]"
                        />
                        <FieldError message={errors.transactionId?.message} />
                      </div>
                    </div>
                  </>
                ) : (
                  /* Full cash on delivery — nothing to collect up front. */
                  <div className="flex items-center gap-4 rounded-2xl border border-[#EFEBE9] bg-[#FAF9F6] p-5">
                    <div className="rounded-xl bg-[#461149] p-3">
                      <Banknote className="text-white" size={22} />
                    </div>
                    <div>
                      <p className="text-sm font-black tracking-tight text-[#2D1B14] uppercase">
                        Cash on Delivery
                      </p>
                      <p className="font-montserrat mt-1 text-sm text-[#8D6E63]">
                        No advance needed. Pay ৳{totalWithShipping} in cash when
                        your order arrives.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-5">
              <div className="sticky top-6 rounded-3xl border border-[#EFEBE9] bg-white p-5 shadow-sm md:p-7">
                <h2 className="mb-6 border-b pb-4 text-xl font-black">
                  Order Summary
                </h2>

                <div className="custom-scrollbar mb-6 max-h-[300px] space-y-4 overflow-y-auto pr-2">
                  {cartItems.map((item) => (
                    <div key={item.cartId} className="flex items-center gap-4">
                      <div className="relative shrink-0">
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.image}
                            className="h-16 w-16 rounded-xl border border-[#EFEBE9] object-cover"
                            alt={item.title}
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-xl border border-[#EFEBE9] bg-[#FAF9F6]" />
                        )}
                        <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#2D1B14] text-[10px] font-black text-white">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-black text-[#2D1B14]">
                          {item.title}
                        </p>
                        <p className="font-montserrat text-lg font-bold text-[#A1887F]">
                          ৳{item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3.5 border-t border-[#EFEBE9] pt-4">
                  <div className="flex justify-between text-base font-bold text-[#8D6E63]">
                    <span>Subtotal</span>
                    <span className="font-montserrat">৳{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[#8D6E63]">
                    <span className="flex items-center gap-2">
                      <Truck size={18} /> Delivery
                    </span>
                    <span className="font-montserrat">৳{DELIVERY_CHARGE}</span>
                  </div>
                  {advanceRequired && (
                    <div className="flex justify-between rounded-xl border border-amber-100 bg-amber-50 p-3 text-base font-black text-amber-700">
                      <span>Advance Paid</span>
                      <span className="font-montserrat">- ৳{advanceAmount}</span>
                    </div>
                  )}
                  <div className="border-t-2 border-dashed pt-4">
                    <p className="mb-1 text-[11px] font-black tracking-widest text-[#8D6E63] uppercase">
                      Cash on Delivery Due
                    </p>
                    <span className="font-montserrat text-2xl font-bold text-[#2D1B14]">
                      ৳{dueAmount}
                    </span>
                  </div>
                </div>

                <GlowButton
                  type="submit"
                  disabled={createOrder.isPending}
                  fullWidth
                  className="mt-8 py-4 text-lg"
                >
                  {createOrder.isPending ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    "Confirm Order"
                  )}
                </GlowButton>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
