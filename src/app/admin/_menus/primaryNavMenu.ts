import {
  LucideIcon,
  Settings2,
  SquareTerminal,
  Tag,
  UsersRound,
} from "lucide-react";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

export const PrimaryNavItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: SquareTerminal,
    isActive: true,
    items: [
      {
        title: "Overview",
        url: "/admin",
      },
      {
        title: "Transactions",
        url: "/admin/transactions",
      },
    ],
  },
  {
    title: "Products",
    url: "/admin/products",
    isActive: true,

    icon: Tag,
    items: [
      {
        title: "All Products",
        url: "/admin/products",
      },
      {
        title: "Create new",
        url: "/admin/products/new",
      },
      {
        title: "Categories",
        url: "/admin/products/categories",
      },
    ],
  },

  {
    title: "Users",
    url: "#",
    icon: UsersRound,

    items: [
      {
        title: "All Users",
        url: "/admin/users",
      },
      {
        title: "Create User",
        url: "/admin/users/new",
      },
    ],
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings2,

    items: [
      {
        title: "Customers",
        url: "/admin/settings/customers",
      },
      {
        title: "Suppliers",
        url: "/admin/settings/suppliers",
      },

      {
        title: "Units",
        url: "/admin/settings/units",
      },
      {
        title: "Preferences",
        url: "/admin/settings/preferences",
      },
    ],
  },
];
