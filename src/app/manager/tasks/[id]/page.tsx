"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ArrowLeft } from "lucide-react";

import { taskApi } from "@/services/apis/task";
import { TaskForm, TaskFormMode } from "@/components/task/task-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ManagerTaskFormPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = params.id as string;
  const isCreate = id === "create";

  // mode search param: ?mode=edit
  const modeQuery = searchParams.get("mode");

  // Determine actual mode
  const mode: TaskFormMode = isCreate
    ? "ADD"
    : modeQuery === "edit"
      ? "EDIT"
      : "VIEW";

  // Fetch Task Details if not create
  const {
    data: task,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["task", id],
    queryFn: () => taskApi.getTaskById(id),
    enabled: !isCreate, // Only fetch if it's not the create page
  });

  const getPageTitle = () => {
    switch (mode) {
      case "ADD":
        return "Create New Task";
      case "EDIT":
        return "Edit Task";
      case "VIEW":
        return "Task Details";
    }
  };

  const getPageDescription = () => {
    switch (mode) {
      case "ADD":
        return "Assign a new task to an employee.";
      case "EDIT":
        return "Update task information and requirements.";
      case "VIEW":
        return "View all details and current status of this task.";
    }
  };

  const handleSuccess = () => {
    router.push("/manager/tasks");
  };

  if (!isCreate && isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isCreate && isError) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="text-center space-y-4">
          <p className="text-destructive font-medium text-lg">
            Failed to load task details.
          </p>
          <Button onClick={() => router.push("/manager/tasks")}>
            Return to Tasks
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/manager/tasks")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground/90">
            {getPageTitle()}
          </h1>
          <p className="text-muted-foreground mt-1">{getPageDescription()}</p>
        </div>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <TaskForm mode={mode} initialData={task} onSuccess={handleSuccess} />
        </CardContent>
      </Card>
    </div>
  );
}
