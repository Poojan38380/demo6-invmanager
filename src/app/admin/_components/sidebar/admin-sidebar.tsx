import * as React from "react";
import { Command } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { BottomNav } from "./bottom-nav";
import { PrimaryNav } from "./primary-nav";
import { SecondaryNav } from "./secondary-nav";
import { NavUser } from "./nav-user";

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="pt-3">
        <a href="/admin" className="grow flex gap-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Command className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Inv Manager</span>
            <span className="truncate text-xs">Enterprise</span>
          </div>
        </a>
      </SidebarHeader>
      <SidebarContent>
        <PrimaryNav />
        <SecondaryNav />
        <BottomNav className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
