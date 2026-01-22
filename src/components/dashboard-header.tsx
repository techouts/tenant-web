"use client";
import { useAuth } from "@/contexts/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "./theme-toggle";
import { LogOut, Settings, User as UserIcon } from "lucide-react";
import Link from "next/link";

export function DashboardHeader() {
  const { user, logout } = useAuth();
  const userEmail = user?.user?.email;
  const accessToken = global?.window?.localStorage.getItem("accessToken") || "";
  const userInitials = user?.user?.tenant?.[0]?.toUpperCase() || "S";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="flex-1" />
      <ThemeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.avatarUrl} alt={user?.name} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          {user?.user?.role !== "admin" && (
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.user?.tenant}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
          )}
          {user?.user?.role !== "admin" && <DropdownMenuSeparator />}
          {user?.user?.role !== "admin" && (
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">
                <UserIcon className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
          )}
          {user?.user?.role !== "admin" && (
            <DropdownMenuItem asChild>
              <Link href="/dashboard/billing">
                <Settings className="mr-2 h-4 w-4" />
                Billing
              </Link>
            </DropdownMenuItem>
          )}
          {user?.user?.role !== "admin" && <DropdownMenuSeparator />}
          <DropdownMenuItem onClick={() => logout(userEmail, accessToken)}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
