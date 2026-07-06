"use client";

import { useState } from "react";
import { useDebounce } from "use-debounce";
import { useMyTasks } from "@/hooks/use-tasks";
import { EmployeeTasksTable } from "@/components/task/employee-tasks-table";
import { TaskFilterToolbar } from "@/components/task/task-filter-toolbar";
import { PaginationControls } from "@/components/task/pagination-controls";
import { TaskPriority, TaskStatus } from "@/types/task.type";

export default function EmployeeMyTasksPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TaskStatus | "ALL">("ALL");
  const [priority, setPriority] = useState<TaskPriority | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading } = useMyTasks({
    search: debouncedSearch,
    status: status === "ALL" ? undefined : status,
    priority: priority === "ALL" ? undefined : priority,
    page,
    limit,
  });

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleStatusChange = (val: string) => {
    setStatus(val as TaskStatus | "ALL");
    setPage(1);
  };

  const handlePriorityChange = (val: string) => {
    setPriority(val as TaskPriority | "ALL");
    setPage(1);
  };

  const handleReset = () => {
    setSearch("");
    setStatus("ALL");
    setPriority("ALL");
    setPage(1);
  };

  const meta = data?.meta;
  const tasks = data?.data || [];

  return (
    <div className="flex flex-1 flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground/90">
          My Tasks
        </h1>
        <p className="text-muted-foreground">
          View and manage the status of your assigned tasks.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <TaskFilterToolbar
          search={search}
          status={status}
          priority={priority}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          onPriorityChange={handlePriorityChange}
          onReset={handleReset}
          hideCreateButton={true}
        />

        <EmployeeTasksTable tasks={tasks} isLoading={isLoading} />

        {/* We can add mobile cards here later if needed */}
        <div className="md:hidden flex h-48 w-full flex-col items-center justify-center rounded-xl border border-dashed border-border text-muted-foreground bg-muted/20">
          <p>Please use desktop view to see tasks.</p>
        </div>

        {meta && meta.totalPages > 1 && (
          <PaginationControls
            meta={meta}
            onPageChange={setPage}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
          />
        )}
      </div>
    </div>
  );
}
