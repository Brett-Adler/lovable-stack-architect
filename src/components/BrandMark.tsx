import { BRAND } from "@/lib/branding";
import { ARCH_BY_ID, type ArchId } from "@/data/architectures";
import { cn } from "@/lib/utils";
import type { IconType } from "react-icons";

type Size = "sm" | "md" | "lg";

const SIZE_CLASS: Record<Size, string> = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

interface Props {
  archId: ArchId;
  size?: Size;
  colored?: boolean;
  className?: string;
}

function SingleMark({
  brand,
  sizeCls,
  colored,
  className,
}: {
  brand: { Icon?: IconType; src?: string; color: string };
  sizeCls: string;
  colored: boolean;
  className?: string;
}) {
  if (brand.src) {
    return (
      <img
        src={brand.src}
        alt=""
        aria-hidden="true"
        className={cn(sizeCls, "shrink-0 rounded-sm object-contain", className)}
      />
    );
  }
  if (brand.Icon) {
    const Icon = brand.Icon;
    return (
      <Icon
        aria-hidden="true"
        className={cn(sizeCls, "shrink-0", className)}
        style={colored ? { color: brand.color } : undefined}
      />
    );
  }
  return null;
}

export function BrandMark({ archId, size = "sm", colored = true, className }: Props) {
  const arch = ARCH_BY_ID[archId];
  const sizeCls = SIZE_CLASS[size];

  // Hybrid stack: render backend + frontend marks side by side.
  if (arch?.composition) {
    const back = BRAND[arch.composition.backend];
    const front = BRAND[arch.composition.frontend];
    return (
      <span
        className={cn("inline-flex shrink-0 items-center -space-x-0.5", className)}
        aria-hidden="true"
      >
        {back && <SingleMark brand={back} sizeCls={sizeCls} colored={colored} />}
        {front && <SingleMark brand={front} sizeCls={sizeCls} colored={colored} />}
      </span>
    );
  }

  const brand = BRAND[archId];
  if (!brand) return null;
  return <SingleMark brand={brand} sizeCls={sizeCls} colored={colored} className={className} />;
}
