"use client";

import { useState } from "react";
import { useTasks } from "@/hooks/use-tasks";
import { TaskStatus, TaskPriority } from "@/types/task.type";
import { useDebounce } from "use-debounce";

import { TaskFilterToolbar } from "@/components/task/task-filter-toolbar";
import { ManagerTasksTable } from "@/components/task/manager-tasks-table";
import { ManagerTaskMobileCards } from "@/components/task/manager-task-mobile-cards";
import { PaginationControls } from "@/components/task/pagination-controls";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function ManagerTasksPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const [status, setStatus] = useState<string>("ALL");
  const [priority, setPriority] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Derive parameters to send to API
  const queryParams = {
    page,
    limit,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(status !== "ALL" ? { status: status as TaskStatus } : {}),
    ...(priority !== "ALL" ? { priority: priority as TaskPriority } : {}),
  };

  const { data, isLoading, isError } = useTasks(queryParams);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleStatusChange = (val: string) => {
    setStatus(val);
    setPage(1);
  };

  const handlePriorityChange = (val: string) => {
    setPriority(val);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatus("ALL");
    setPriority("ALL");
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
          Tasks Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage, track and filter all tasks across your team.
        </p>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-4 sm:p-6 space-y-6">
          <TaskFilterToolbar
            search={search}
            status={status}
            priority={priority}
            onSearchChange={handleSearchChange}
            onStatusChange={handleStatusChange}
            onPriorityChange={handlePriorityChange}
            onReset={handleResetFilters}
          />

          {isError ? (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p className="font-semibold">Failed to load tasks</p>
              <p className="text-sm opacity-80">Please try again later.</p>
            </div>
          ) : (
            <>
              {/* Desktop View */}
              <ManagerTasksTable
                tasks={data?.data || []}
                isLoading={isLoading}
              />

              {/* Mobile View */}
              <ManagerTaskMobileCards
                tasks={data?.data || []}
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
