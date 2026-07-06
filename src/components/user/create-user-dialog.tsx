"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { createEmployeeSchema } from "@/schemas/user.schema";
import { useCreateUser } from "@/hooks/use-users";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
  FieldContent,
} from "@/components/ui/field";

interface CreateUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateUserDialog({
  isOpen,
  onOpenChange,
}: CreateUserDialogProps) {
  const createUser = useCreateUser();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    setErrorMsg(null);
    try {
      await createUser.mutateAsync(data);
      reset();
      onOpenChange(false);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Failed to create user.");
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      setErrorMsg(null);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Employee</DialogTitle>
          <DialogDescription>
            Add a new employee to the system. They will be able to log in using the email and password you set.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          {errorMsg && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm font-medium">
              {errorMsg}
            </div>
          )}

          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel>Full Name</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="John Doe"
                  disabled={createUser.isPending}
                  {...register("name")}
                />
                <FieldError errors={[{ message: errors.name?.message as string }]} />
              </FieldContent>
            </Field>

            <Field data-invalid={!!errors.email}>
              <FieldLabel>Email Address</FieldLabel>
              <FieldContent>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  disabled={createUser.isPending}
                  {...register("email")}
                />
                <FieldError errors={[{ message: errors.email?.message as string }]} />
              </FieldContent>
            </Field>

            <Field data-invalid={!!errors.password}>
              <FieldLabel>Password</FieldLabel>
              <FieldContent>
                <Input
                  type="password"
                  placeholder="Minimum 6 characters"
                  disabled={createUser.isPending}
                  {...register("password")}
                />
                <FieldError errors={[{ message: errors.password?.message as string }]} />
              </FieldContent>
            </Field>
          </FieldGroup>

          <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={createUser.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createUser.isPending}>
              {createUser.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Employee
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
