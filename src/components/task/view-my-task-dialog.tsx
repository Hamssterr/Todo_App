"use client";

import { useMyTask } from "@/hooks/use-tasks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { TaskStatus } from "@/types/task.type";

interface ViewMyTaskDialogProps {
  taskId: string | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewMyTaskDialog({
  taskId,
  isOpen,
  onOpenChange,
}: ViewMyTaskDialogProps) {
  const { data: task, isLoading } = useMyTask(taskId || "");

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : !task ? (
          <div className="flex h-40 items-center justify-center text-muted-foreground">
            Task not found.
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div>
              <h3 className="text-2xl font-bold tracking-tight">
                {task.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Assigned by:{" "}
                <span className="font-medium text-foreground">
                  {task.createdBy?.name || "System"}
                </span>{" "}
                • Created on: {format(new Date(task.createdAt), "MMM dd, yyyy")}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-lg bg-muted/50 p-4 border border-border/50">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Status</span>
                <div>
                  <StatusBadge status={task.status} />
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Priority</span>
                <div>
                  <PriorityBadge priority={task.priority} />
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Due Date</span>
                <div className="text-sm font-medium">
                  {task.dueDate
                    ? format(new Date(task.dueDate), "MMM dd, yyyy")
                    : "-"}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Updated</span>
                <div className="text-sm font-medium">
                  {format(new Date(task.updatedAt), "MMM dd")}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Description</h4>
              {task.description ? (
                <div className="rounded-md border border-border/50 bg-background p-4 text-sm whitespace-pre-wrap">
                  {task.description}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground italic">
                  No description provided.
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case TaskStatus.TODO:
      return <Badge variant="secondary">To Do</Badge>;
    case TaskStatus.IN_PROGRESS:
      return (
        <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
          In Progress
        </Badge>
      );
    case TaskStatus.DONE:
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
