"use client";

import { Task } from "@/types/task.type";
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
import { TaskActionsMenu } from "./task-actions-menu";

interface ManagerTasksTableProps {
  tasks: Task[];
  isLoading: boolean;
}

export function ManagerTasksTable({
  tasks,
  isLoading,
}: ManagerTasksTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-md border border-border/50 hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-[200px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[120px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-[80px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-[60px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[100px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-8 rounded-md" />
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
        <p>No tasks found based on your filters.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border/50 hidden md:block overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[300px]">Task Name</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id} className="hover:bg-muted/30">
              <TableCell className="font-medium">{task.title}</TableCell>
              <TableCell>{task.assignedTo?.name || "Unassigned"}</TableCell>
              <TableCell>
                <StatusBadge status={task.status} />
              </TableCell>
              <TableCell>
                <PriorityBadge priority={task.priority} />
              </TableCell>
              <TableCell>
                {task.dueDate
                  ? format(new Date(task.dueDate), "MMM dd, yyyy")
                  : "-"}
              </TableCell>
              <TableCell className="text-right">
                <TaskActionsMenu task={task} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "TODO":
      return <Badge variant="secondary">To Do</Badge>;
    case "IN_PROGRESS":
      return (
        <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
          In Progress
        </Badge>
      );
    case "DONE":
      return (
        <Badge
          variant="default"
          className="bg-emerald-500 hover:bg-emerald-600">
          Done
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
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
