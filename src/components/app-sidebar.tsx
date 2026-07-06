"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardCheck,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  role: "MANAGER" | "EMPLOYEE";
};

const managerItems = [
  {
    title: "Dashboard",
    url: "/manager",
    icon: LayoutDashboard,
  },
  {
    title: "Tasks",
    url: "/manager/tasks",
    icon: ClipboardList,
  },
  {
    title: "Users",
    url: "/manager/users",
    icon: Users,
  },
];

const employeeItems = [
  {
    title: "Dashboard",
    url: "/employee",
    icon: LayoutDashboard,
  },
  {
    title: "My Tasks",
    url: "/employee/my-tasks",
    icon: ClipboardCheck,
  },
];

export function AppSidebar({ role, ...props }: AppSidebarProps) {
  const pathname = usePathname();
  const items = role === "MANAGER" ? managerItems : employeeItems;

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    window.location.href = "/login";
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={
                <Link
                  href={
                    role === "MANAGER"
                      ? "/manager/dashboard"
                      : "/employee/dashboard"
                  }
                />
              }>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                T
              </div>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Task Manager</span>
                <span className="truncate text-xs">
                  {role === "MANAGER" ? "Manager" : "Employee"}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={
                  pathname === item.url ||
                  (item.url !== "/manager" &&
                    item.url !== "/employee" &&
                    pathname.startsWith(item.url))
                }
                render={<Link href={item.url} />}>
                <item.icon />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
