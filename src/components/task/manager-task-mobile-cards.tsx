"use client";

import { Task } from "@/types/task.type";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { TaskActionsMenu } from "./task-actions-menu";

interface ManagerTaskMobileCardsProps {
  tasks: Task[];
  isLoading: boolean;
}

export function ManagerTaskMobileCards({
  tasks,
  isLoading,
}: ManagerTaskMobileCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="overflow-hidden border-border/50">
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex md:hidden h-32 w-full flex-col items-center justify-center rounded-xl border border-dashed border-border text-muted-foreground bg-muted/20">
        <p>No tasks found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:hidden">
      {tasks.map((task) => (
        <Card
          key={task.id}
          className="overflow-hidden border-border/50 shadow-sm transition-all hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-lg line-clamp-2 pr-2">
                {task.title}
              </h4>
              <TaskActionsMenu task={task} />
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
            </div>

            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                <span className="font-medium text-foreground">Assignee:</span>{" "}
                {task.assignedTo?.name || "Unassigned"}
              </p>
              <p>
                <span className="font-medium text-foreground">Due Date:</span>{" "}
                {task.dueDate
                  ? format(new Date(task.dueDate), "MMM dd, yyyy")
                  : "-"}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Reuse same badge functions
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
