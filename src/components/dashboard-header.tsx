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
import { Bell, LogOut, Settings, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";
import SignupApprovalCard from "./SignUpApprovalCard";
import { useState } from "react";

export function DashboardHeader({
  handleGetNodifications,
  isLoading,
  notificationsData,
}: {
  handleGetNodifications?: any;
  isLoading?: boolean;
  notificationsData?: any[];
} = {}) {
  const { user, logout } = useAuth();
  const userEmail = user?.user?.email;
  const accessToken = global?.window?.localStorage.getItem("accessToken") || "";
  const userInitials = user?.user?.tenant?.[0]?.toUpperCase() || "S";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="flex-1" />
      {user?.user?.role === "admin" && (
        <DropdownMenu
          onOpenChange={(open: boolean) => {
            if (open && handleGetNodifications) {
              handleGetNodifications("GET");
            }
          }}
        >
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Bell className="w-[1.2rem] h-[1.2rem]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[500px]" align="end" forceMount>
            <p className="p-2">Notifications</p>
            <DropdownMenuSeparator />
            <div className=" h-[300px] overflow-y-scroll">
              {isLoading && (
                <>
                  {notificationsData?.map((_, index: number) => (
                    <Skeleton
                      key={index}
                      className="rounded-lg border border-border bg-card p-4 shadow-sm flex items-center justify-between gap-4"
                    />
                  ))}
                </>
              )}
              {!isLoading && notificationsData?.length !== 0 && (
                <div className="mt-2 flex flex-col gap-4 p-2">
                  {notificationsData?.map((notification: any) => (
                    <SignupApprovalCard
                      key={notification.id}
                      data={notification}
                      handleGetNodifications={handleGetNodifications}
                      // setIsNotificationsOpen={() =>
                      //   setIsNotificationsOpen(false)
                      // }
                    />
                  ))}
                </div>
              )}
              {notificationsData?.length === 0 && !isLoading && (
                <p className="p-2 mx-auto w-fit mt-[25%] h-fit">
                  No New Notifications Available
                </p>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
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
