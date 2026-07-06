"use client";

import { useState } from "react";
import { useUsers } from "@/hooks/use-users";
import { useDebounce } from "use-debounce";

import { UserFilterToolbar } from "@/components/user/user-filter-toolbar";
import { ManagerUsersTable } from "@/components/user/manager-users-table";
import { ManagerUserMobileCards } from "@/components/user/manager-user-mobile-cards";
import { PaginationControls } from "@/components/task/pagination-controls";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function ManagerUsersPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const [role, setRole] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Derive parameters to send to API
  const queryParams = {
    page,
    limit,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(role !== "ALL" ? { role } : {}),
  };

  const { data, isLoading, isError } = useUsers(queryParams);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1); // Reset page on filter change
  };

  const handleRoleChange = (val: string) => {
    setRole(val);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setRole("ALL");
    setPage(1);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset page when limit changes to avoid out of bounds
  };

  return (
    <div className="flex flex-1 flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground/90">
          Users Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage, track and filter users across your organization.
        </p>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-4 sm:p-6 space-y-6">
          <UserFilterToolbar
            search={search}
            role={role}
            onSearchChange={handleSearchChange}
            onRoleChange={handleRoleChange}
            onReset={handleResetFilters}
          />

          {isError ? (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p className="font-semibold">Failed to load users</p>
              <p className="text-sm opacity-80">Please try again later.</p>
            </div>
          ) : (
            <>
              {/* Desktop View */}
              <ManagerUsersTable
                users={data?.data || []}
                isLoading={isLoading}
              />

              {/* Mobile View */}
              <ManagerUserMobileCards
                users={data?.data || []}
                isLoading={isLoading}
              />

              {/* Pagination */}
              <PaginationControls
                meta={data?.meta}
                onPageChange={setPage}
                onLimitChange={handleLimitChange}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
