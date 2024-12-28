import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/sidebar/admin-sidebar";
import { BreadCrumbs } from "./_components/sidebar/breadcrumbs";
import { ThemeToggleButton } from "@/components/theme/ThemeSelectorButton";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-x-auto   ">
        <header className="flex  shadow-sm z-10 border-b h-14  items-center ">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className=" scale-125" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex justify-between w-full items-center">
              <BreadCrumbs />
              <ThemeToggleButton />
            </div>
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
