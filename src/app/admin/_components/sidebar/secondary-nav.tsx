import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SecondaryNavItems } from "../../_menus/secondaryNavMenu";

export function SecondaryNav() {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden ">
      <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
      <SidebarMenu>
        {SecondaryNavItems.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <item.icon />
                <span className="font-semibold">{item.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
