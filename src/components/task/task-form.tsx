"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useCreateTask, useUpdateTask } from "@/hooks/use-tasks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";

import { createTaskSchema, updateTaskSchema } from "@/schemas/task.schema";
import { Task, TaskPriority, TaskStatus } from "@/types/task.type";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldContent,
} from "@/components/ui/field";
import { UserInfiniteSelect } from "@/components/user/user-infinite-select";
import { cn } from "@/lib/utils";

export type TaskFormMode = "ADD" | "EDIT" | "VIEW";

interface TaskFormProps {
  mode: TaskFormMode;
  initialData?: Task;
  onSuccess?: () => void;
}

export function TaskForm({ mode, initialData, onSuccess }: TaskFormProps) {
  const router = useRouter();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask(initialData?.id);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isSubmitting = createTask.isPending || updateTask.isPending;

  const isView = mode === "VIEW";
  const isEdit = mode === "EDIT";
  const isAdd = mode === "ADD";

  const schema = isAdd ? createTaskSchema : updateTaskSchema;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      priority: initialData?.priority || TaskPriority.MEDIUM,
      status: initialData?.status || TaskStatus.TODO,
      dueDate: initialData?.dueDate
        ? new Date(initialData.dueDate).toISOString()
        : "",
      assignedToId: initialData?.assignedToId || "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description || "",
        priority: initialData.priority,
        status: initialData.status,
        dueDate: initialData.dueDate
          ? new Date(initialData.dueDate).toISOString()
          : "",
        assignedToId: initialData.assignedToId,
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: any) => {
    if (isView) return;
    setErrorMsg(null);

    try {
      if (isAdd) {
        await createTask.mutateAsync(data);
      } else if (isEdit && initialData) {
        await updateTask.mutateAsync(data);
      }
      onSuccess?.();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
      {errorMsg && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm font-medium">
          {errorMsg}
        </div>
      )}

      <FieldGroup>
        {/* Title */}
        <Field data-invalid={!!errors.title}>
          <FieldLabel>Title *</FieldLabel>
          <FieldContent>
            <Input
              placeholder="Enter task title"
              disabled={isView || isSubmitting}
              {...register("title")}
            />
            <FieldError
              errors={[{ message: errors.title?.message as string }]}
            />
          </FieldContent>
        </Field>

        {/* Assigned To */}
        <Field data-invalid={!!errors.assignedToId}>
          <FieldLabel>Assigned Employee *</FieldLabel>
          <FieldContent>
            <Controller
              name="assignedToId"
              control={control}
              render={({ field }) => {
                if (isView) {
                  return (
                    <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 text-sm opacity-70">
                      {initialData?.assignedTo?.name || field.value}
                    </div>
                  );
                }
                return (
                  <UserInfiniteSelect
                    value={field.value}
                    initialUserName={initialData?.assignedTo?.name}
                    onChange={field.onChange}
                    error={!!errors.assignedToId}
                  />
                );
              }}
            />
            <FieldError
              errors={[{ message: errors.assignedToId?.message as string }]}
            />
          </FieldContent>
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Due Date */}
          <Field data-invalid={!!errors.dueDate}>
            <FieldLabel>Due Date</FieldLabel>
            <FieldContent>
              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger
                      render={
                        <Button
                          variant={"outline"}
                          disabled={isView || isSubmitting}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                            !!errors.dueDate &&
                              "border-destructive focus-visible:ring-destructive",
                          )}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      }
                    />
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) =>
                          field.onChange(date ? date.toISOString() : null)
                        }
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              <FieldError
                errors={[{ message: errors.dueDate?.message as string }]}
              />
            </FieldContent>
          </Field>

          {/* Priority */}
          <Field data-invalid={!!errors.priority}>
            <FieldLabel>Priority</FieldLabel>
            <FieldContent>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select
                    disabled={isView || isSubmitting}
                    value={field.value}
                    onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent alignItemWithTrigger={false}>
                      <SelectItem value={TaskPriority.LOW}>Low</SelectItem>
                      <SelectItem value={TaskPriority.MEDIUM}>
                        Medium
                      </SelectItem>
                      <SelectItem value={TaskPriority.HIGH}>High</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError
                errors={[{ message: errors.priority?.message as string }]}
              />
            </FieldContent>
          </Field>

          {/* Status (Only on Edit/View) */}
          {!isAdd && (
            <Field data-invalid={!!errors.status}>
              <FieldLabel>Status</FieldLabel>
              <FieldContent>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      disabled={isView || isSubmitting}
                      value={field.value}
                      onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent alignItemWithTrigger={false}>
                        <SelectItem value={TaskStatus.TODO}>To Do</SelectItem>
                        <SelectItem value={TaskStatus.IN_PROGRESS}>
                          In Progress
                        </SelectItem>
                        <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError
                  errors={[{ message: errors.status?.message as string }]}
                />
              </FieldContent>
            </Field>
          )}
        </div>

        {/* Description */}
        <Field data-invalid={!!errors.description}>
          <FieldLabel>Description</FieldLabel>
          <FieldContent>
            <Textarea
              placeholder="Provide detailed description..."
              className="min-h-[150px] resize-y"
              disabled={isView || isSubmitting}
              {...register("description")}
            />
            <FieldError
              errors={[{ message: errors.description?.message as string }]}
            />
            <FieldDescription>
              Optional detailed instructions for this task.
            </FieldDescription>
          </FieldContent>
        </Field>
      </FieldGroup>

      <div className="flex justify-end gap-4 pt-4 border-t border-border/50">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}>
          {isView ? "Back" : "Cancel"}
        </Button>

        {isView ? (
          <Button
            type="button"
            onClick={() =>
              router.push(`/manager/tasks/${initialData?.id}?mode=edit`)
            }>
            Edit Task
          </Button>
        ) : (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isAdd ? "Create Task" : "Save Changes"}
          </Button>
        )}
      </div>
    </form>
  );
}
