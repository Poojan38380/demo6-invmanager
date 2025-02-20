import { Download, LucideIcon, Store } from "lucide-react";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export const BottomNavItems: NavItem[] = [
  {
    title: "Export Data",
    url: "/admin/export",
    icon: Download,
  },
  {
    title: "View Store",
    url: "/",
    icon: Store,
  },
];
