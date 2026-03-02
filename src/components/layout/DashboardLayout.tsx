import { Outlet } from "react-router";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { AppFooter } from "./AppFooter";
import { AppHeader } from "./AppHeader";
import { AppSidebar } from "./AppSidebar";

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8">
          <Outlet />
        </main>
        <AppFooter />
      </SidebarInset>
    </SidebarProvider>
  );
}
