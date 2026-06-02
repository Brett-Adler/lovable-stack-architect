import type { IconType } from "react-icons";
import { SiSupabase, SiVercel, SiNetlify, SiGooglecloud, SiHeroku, SiRender, SiFlydotio, SiCloudflare } from "react-icons/si";
import { FaAws } from "react-icons/fa";
import { VscAzure } from "react-icons/vsc";
import type { ArchId } from "@/data/architectures";

export const BRAND: Record<ArchId, { Icon?: IconType; src?: string; color: string }> = {
  "lovable-cloud":      { src: "/lovable-brand.svg",  color: "#E94BD2" },
  "lovable-supabase":   { Icon: SiSupabase,       color: "#3ECF8E" },
  "lovable-vercel":     { Icon: SiVercel,         color: "#000000" },
  "lovable-netlify":    { Icon: SiNetlify,        color: "#00C7B7" },
  "lovable-cloudflare": { Icon: SiCloudflare,     color: "#F38020" },
  "lovable-aws":        { Icon: FaAws,            color: "#FF9900" },
  "lovable-gcp":        { Icon: SiGooglecloud,    color: "#4285F4" },
  "lovable-azure":      { Icon: VscAzure,         color: "#0078D4" },
  "lovable-heroku":     { Icon: SiHeroku,         color: "#430098" },
  "lovable-render":     { Icon: SiRender,         color: "#000000" },
  "lovable-fly":        { Icon: SiFlydotio,       color: "#7B3FE4" },
};
