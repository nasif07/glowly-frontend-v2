import { ArrowLeft, type LucideIcon } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  Icon?: LucideIcon;
  onBack?: () => void;
}

/** Ported from glowly-frontend's dashboard common header. */
export function DashboardHeader({ title, Icon, onBack }: DashboardHeaderProps) {
  return (
    <div className="mb-8 flex items-center gap-4">
      {onBack && (
        <button
          onClick={onBack}
          className="group -ml-2 rounded-full p-2 transition-all duration-300 hover:bg-[#300332]/5"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5 text-[#300332] transition-transform group-hover:-translate-x-1" />
        </button>
      )}

      <div className="flex min-w-0 flex-1 items-center gap-4">
        {Icon && (
          <div className="relative overflow-hidden rounded-xl border border-[#300332]/10 bg-white p-2.5 shadow-sm">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#D9C5B2]/20 to-transparent" />
            <Icon className="relative z-10 h-5 w-5 text-[#300332]" />
          </div>
        )}

        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tight text-[#300332] md:text-2xl">
            {title}
          </h1>
          <div className="mt-1 h-[2px] w-8 rounded-full bg-[#D9C5B2]" />
        </div>
      </div>
    </div>
  );
}
