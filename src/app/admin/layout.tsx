"use client";
import React from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar";

import { DashboardHeader } from "@/components/dashboard-header";
import { Logo } from "@/components/logo";
import { Skeleton } from "@/components/ui/skeleton";

import { LogOut } from "lucide-react";
import { SuperAdminSidebar } from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading, logout, user } = useAuth();
  const router = useRouter();
  const userEmail = user?.user?.email;
  const accessToken = global?.window?.localStorage.getItem("accessToken") || "";
  const role =
    JSON.parse(global?.window?.localStorage?.getItem("userData") || "{}")?.user
      ?.role || "";

  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/");
      return;
    }

    if (role) {
      if (role !== "admin") {
        router.push("/dashboard");
      }
    } else {
      router.push("/");
    }
  }, [loading, isAuthenticated, role, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen w-full">
        <div className="hidden md:block w-64 border-r p-4">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="space-y-2">
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
        <div className="flex-1 p-8">
          <Skeleton className="h-10 w-full mb-8" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SuperAdminSidebar />
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => logout(userEmail, accessToken)}>
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <DashboardHeader />
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
