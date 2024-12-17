import { LucideIcon, Store } from "lucide-react";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export const BottomNavItems: NavItem[] = [
  {
    title: "View Store",
    url: "/",
    icon: Store,
  },
];
