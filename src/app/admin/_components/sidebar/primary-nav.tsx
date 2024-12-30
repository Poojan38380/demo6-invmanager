"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // Assuming you have a cn utility for conditional classes
import { PrimaryNavItems } from "../../_menus/primaryNavMenu";

export function PrimaryNav() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarGroup className="space-y-2 p-2 ">
      <SidebarGroupLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-3">
        Platform
      </SidebarGroupLabel>
      <SidebarMenu className="space-y-1">
        {PrimaryNavItems.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={
              item.isActive ||
              item.items?.some((subItem) => pathname === subItem.url)
            }
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  tooltip={item.title}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent/50 transition-colors duration-200",
                    item.items?.some((subItem) => pathname === subItem.url)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {item.icon && (
                    <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
                  )}
                  <span className="font-medium flex-grow">{item.title}</span>
                  <ChevronRight
                    className={cn(
                      "w-4 h-4 transition-transform duration-200 text-muted-foreground",
                      "group-data-[state=open]/collapsible:rotate-90"
                    )}
                  />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-6 mt-1 border-l border-border">
                <ul>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem
                      key={subItem.title}
                      className="w-full"
                      onClick={() => setOpenMobile(false)}
                    >
                      <SidebarMenuSubButton asChild>
                        <Link
                          prefetch={false}
                          href={subItem.url}
                          className={cn(
                            "w-full block px-3 py-2 rounded-md transition-colors duration-200",
                            pathname === subItem.url
                              ? "bg-primary/10 text-primary font-semibold"
                              : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                          )}
                        >
                          <span className="font-normal">{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </ul>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
