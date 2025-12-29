import {
  Blocks,
  LineChart,
  Wallet,
  Sparkle,
  TabletSmartphone,
  BadgeCheck,
  Goal,
  PictureInPicture,
  MousePointerClick,
  Newspaper,
  Crown,
  Vegan,
  Ghost,
  Puzzle,
  Squirrel,
  Cookie,
  Drama,
  ScanFace,
  Package,
  Activity,
  Calendar,
  Users,
  Shield,
  Box,
  Radio,
  Bookmark,
  UserCheck,
  Building2,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Blocks,
  LineChart,
  Wallet,
  Sparkle,
  TabletSmartphone,
  BadgeCheck,
  Goal,
  PictureInPicture,
  MousePointerClick,
  Newspaper,
  Crown,
  Vegan,
  Ghost,
  Puzzle,
  Squirrel,
  Cookie,
  Drama,
  ScanFace,
  Package,
  Activity,
  Calendar,
  Users,
  Shield,
  Box,
  Radio,
  Bookmark,
  UserCheck,
  Building2,
};

export const Icon = ({
  name,
  color,
  size,
  className,
}: {
  name: string;
  color?: string;
  size?: number;
  className?: string;
}) => {
  const LucideIcon = iconMap[name];

  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found. Available icons: ${Object.keys(iconMap).join(", ")}`);
    return null;
  }

  return <LucideIcon color={color} size={size} className={className} />;
};
