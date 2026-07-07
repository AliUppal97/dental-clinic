import {
  Activity,
  Clock,
  Cog,
  Cpu,
  CreditCard,
  Grid,
  Heart,
  Layers,
  Package,
  ScanLine,
  Settings,
  Shield,
  Smile,
  Sparkles,
  Stethoscope,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const SERVICE_ICON_MAP: Record<string, LucideIcon> = {
  Stethoscope,
  Sparkles,
  Smile,
  Activity,
  Shield,
  Heart,
  Cog,
  Grid,
  Layers,
  Settings,
  Wrench,
  ScanLine,
  Cpu,
  CreditCard,
  Clock,
  Package,
};

export function getServiceIcon(iconName: string): LucideIcon {
  return SERVICE_ICON_MAP[iconName] ?? Stethoscope;
}
