import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Package, TrendingUp, Users, Truck } from "lucide-react";
import Link from "next/link";
import ShareButton from "@/components/share-button";

const QuickActions = () => {
  const actions = [
    {
      title: "View Products",
      href: "/admin/products",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Transactions",
      href: "/admin/transactions",
      icon: TrendingUp,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
    {
      title: "New Product",
      href: "/admin/products/new",
      icon: Plus,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Add Category",
      href: "/admin/products/categories/new",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "New Customer",
      href: "/admin/settings/customers/new",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "New Supplier",
      href: "/admin/settings/suppliers/new",
      icon: Truck,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <Card className="border-none shadow-none bg-background">
      <CardHeader className="flex flex-row items-center gap-2 justify-between">
        <CardTitle>Quick Actions</CardTitle>
        <ShareButton />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link href={action.href} key={action.title} prefetch={false}>
                <Button
                  variant="outline"
                  className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform"
                >
                  <div className={`p-2 rounded-lg ${action.bgColor}`}>
                    <Icon className={`w-6 h-6 ${action.color}`} />
                  </div>
                  <span className="text-sm font-medium">{action.title}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
