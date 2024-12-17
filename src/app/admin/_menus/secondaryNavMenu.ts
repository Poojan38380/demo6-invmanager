import { ArrowLeftRight, LucideIcon, PackagePlus } from "lucide-react";

interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
}
export const SecondaryNavItems: NavItem[] = [
  {
    name: "All Transactions",
    url: "/admin/transactions",
    icon: ArrowLeftRight,
  },
  {
    name: "Create product",
    url: "/admin/products/new",
    icon: PackagePlus,
  },
];
