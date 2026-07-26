import Link from "next/link";

// The original NotFound rendered only "Life No Found....404....". Kept faithful,
// with a home link added for usability (flagged for review).
export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-[#300332]">
      <p>Life No Found....404....</p>
      <Link
        href="/"
        className="text-sm font-bold uppercase tracking-widest border-b border-[#300332] pb-1"
      >
        Back to Home
      </Link>
    </div>
  );
}
