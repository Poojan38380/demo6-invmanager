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
import { ChevronRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { PrimaryNavItems } from "../../_menus/primaryNavMenu";

export function PrimaryNav() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarGroup className="space-y-4 p-3">
      <SidebarGroupLabel className="text-sm font-bold text-primary/80 uppercase tracking-wider px-3 pb-2  ">
        INV MANAGER
      </SidebarGroupLabel>

      <SidebarMenu className="space-y-2">
        {PrimaryNavItems.map((item) => {
          const isActiveGroup = item.items?.some(
            (subItem) => pathname === subItem.url
          );

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isActiveGroup}
              className={cn(
                "group/collapsible rounded-lg transition-all duration-200",
                isActiveGroup && "bg-accent/30"
              )}
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    aria-expanded={isActiveGroup}
                    aria-controls={`${item.title}-submenu`}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-md px-4 py-3",
                      "transition-all duration-200",
                      "hover:bg-accent/50 active:bg-accent/70",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      isActiveGroup
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-sidebar-foreground"
                    )}
                  >
                    {item.icon && (
                      <item.icon
                        className={cn(
                          "w-5 h-5 transition-colors duration-200",
                          isActiveGroup
                            ? "text-primary"
                            : "text-muted-foreground group-hover/collapsible:text-foreground"
                        )}
                      />
                    )}
                    <span className="font-medium flex-grow">{item.title}</span>
                    <ChevronRight
                      className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        "text-muted-foreground group-hover/collapsible:text-foreground",
                        "group-data-[state=open]/collapsible:rotate-90"
                      )}
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent
                  id={`${item.title}-submenu`}
                  className={cn(
                    "pl-8 mt-1 mb-3 border-l border-border",
                    "animate-in slide-in-from-left-2 duration-300"
                  )}
                >
                  <ul className="space-y-1">
                    {item.items?.map((subItem) => {
                      const isActive = pathname === subItem.url;
                      const isExternal = subItem.url.startsWith("http");

                      return (
                        <SidebarMenuSubItem
                          key={subItem.title}
                          className="w-full"
                          onClick={() => setOpenMobile(false)}
                        >
                          <SidebarMenuSubButton asChild>
                            <Link
                              prefetch={false}
                              href={subItem.url}
                              target={isExternal ? "_blank" : undefined}
                              rel={
                                isExternal ? "noopener noreferrer" : undefined
                              }
                              className={cn(
                                "w-full flex items-center gap-2 px-4 py-2 rounded-md",
                                "transition-all duration-200",
                                "hover:bg-accent/50 active:bg-accent/70",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                                isActive
                                  ? "bg-primary/10 text-primary font-medium"
                                  : "text-muted-foreground font-medium hover:text-foreground"
                              )}
                            >
                              <span className="flex-grow">{subItem.title}</span>
                              {isExternal && (
                                <ExternalLink className="w-4 h-4 opacity-60" />
                              )}
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </ul>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
