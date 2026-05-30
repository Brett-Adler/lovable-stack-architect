import { BRAND } from "@/lib/branding";
import type { ArchId } from "@/data/architectures";
import { cn } from "@/lib/utils";

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

export function BrandMark({ archId, size = "sm", colored = true, className }: Props) {
  const brand = BRAND[archId];
  if (!brand) return null;
  const sizeCls = SIZE_CLASS[size];
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
