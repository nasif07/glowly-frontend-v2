interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function SectionTitle({
  title,
  subtitle,
  className,
}: SectionTitleProps) {
  return (
    <div className={`flex justify-between items-end ${className || ""}`}>
      <div>
        <p className="text-[#A1887F] text-xs uppercase tracking-[0.3em] font-bold mb-1 md:mb-3">
          {subtitle}
        </p>
        <h2 className="text-[#2D1B14] text-3xl md:text-4xl font-bold mb-2">
          {title}
        </h2>
        <div className="h-1 w-20 bg-[#300332]"></div>
      </div>
    </div>
  );
}
