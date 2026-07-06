"use client";

import { Task, TaskStatus } from "@/types/task.type";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateMyTaskStatus } from "@/hooks/use-tasks";
import { Loader2, Eye } from "lucide-react";
import { useState } from "react";
import { ViewMyTaskDialog } from "./view-my-task-dialog";
import { Button } from "@/components/ui/button";

interface EmployeeTasksTableProps {
  tasks: Task[];
  isLoading: boolean;
}

export function EmployeeTasksTable({
  tasks,
  isLoading,
}: EmployeeTasksTableProps) {
  const updateStatus = useUpdateMyTaskStatus();
  const [viewTaskId, setViewTaskId] = useState<string | null>(null);

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await updateStatus.mutateAsync({ id: taskId, status: newStatus });
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-md border border-border/50 hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-[200px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-[60px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[100px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-[120px] rounded-md" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="hidden md:flex h-48 w-full flex-col items-center justify-center rounded-xl border border-dashed border-border text-muted-foreground bg-muted/20">
        <p>You have no assigned tasks based on your filters.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border/50 hidden md:block overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[400px]">Task Name</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="w-[180px]">Status</TableHead>
            <TableHead className="text-right w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => {
            const isUpdating =
              updateStatus.isPending && updateStatus.variables?.id === task.id;

            return (
              <TableRow key={task.id} className="hover:bg-muted/30">
                <TableCell className="font-medium">
                  <div className="flex flex-col gap-1">
                    <span>{task.title}</span>
                    {task.description && (
                      <span className="text-xs text-muted-foreground truncate max-w-[350px]">
                        {task.description}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <PriorityBadge priority={task.priority} />
                </TableCell>
                <TableCell>
                  {task.dueDate
                    ? format(new Date(task.dueDate), "MMM dd, yyyy")
                    : "-"}
                </TableCell>
                <TableCell>
                  <Select
                    disabled={isUpdating}
                    value={task.status}
                    onValueChange={(val) => {
                      if (val) handleStatusChange(task.id, val);
                    }}>
                    <SelectTrigger className="w-[140px] h-8 text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        {isUpdating && (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        )}
                        <SelectValue placeholder="Status" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TaskStatus.TODO}>To Do</SelectItem>
                      <SelectItem value={TaskStatus.IN_PROGRESS}>
                        In Progress
                      </SelectItem>
                      <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewTaskId(task.id)}
                    title="View details">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <ViewMyTaskDialog
        taskId={viewTaskId}
        isOpen={!!viewTaskId}
        onOpenChange={(open) => !open && setViewTaskId(null)}
      />
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  switch (priority) {
    case "LOW":
      return (
        <Badge variant="outline" className="text-muted-foreground">
          Low
        </Badge>
      );
    case "MEDIUM":
      return (
        <Badge variant="outline" className="text-amber-500 border-amber-500/30">
          Medium
        </Badge>
      );
    case "HIGH":
      return <Badge variant="destructive">High</Badge>;
    default:
      return <Badge variant="outline">{priority}</Badge>;
  }
}
