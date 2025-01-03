import { ChevronsLeftRightEllipsis, LucideIcon } from "lucide-react";

interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
}
export const SecondaryNavItems: NavItem[] = [
  {
    name: "All Transactions",
    url: "/admin/transactions",
    icon: ChevronsLeftRightEllipsis,
  },
];
