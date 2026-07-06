"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Separator } from "@/components/ui/separator";
import { Filter, Plus, Search, X } from "lucide-react";
import { CreateUserDialog } from "./create-user-dialog";

interface UserFilterToolbarProps {
  search: string;
  role: string;
  onSearchChange: (val: string) => void;
  onRoleChange: (val: string) => void;
  onReset: () => void;
}

export function UserFilterToolbar({
  search,
  role,
  onSearchChange,
  onRoleChange,
  onReset,
}: UserFilterToolbarProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const isFiltered = search !== "" || role !== "ALL";

  return (
    <>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between w-full">
        <div className="flex flex-1 items-center w-full md:max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8 w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Popover>
            <PopoverTrigger
              render={
                <Button
                  variant="outline"
                  className="gap-2 w-full md:w-auto justify-center flex-1 md:flex-initial">
                  <Filter className="h-4 w-4" />
                  Filter
                  {isFiltered && (
                    <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                      Active
                    </span>
                  )}
                </Button>
              }
            />

            <PopoverContent
              align="end"
              className="w-[calc(100vw-2rem)] sm:w-72 max-w-sm p-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-base">Filter users</h4>
                  <p className="text-sm text-muted-foreground">
                    Narrow users by role.
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <Select
                    value={role}
                    onValueChange={(val) => val && onRoleChange(val)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent alignItemWithTrigger={false}>
                      <SelectItem value="ALL">All Roles</SelectItem>
                      <SelectItem value="MANAGER">Manager</SelectItem>
                      <SelectItem value="EMPLOYEE">Employee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {isFiltered && (
                  <Button
                    variant="ghost"
                    className="w-full justify-center"
                    onClick={onReset}>
                    <X className="mr-2 h-4 w-4" />
                    Reset filters
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>

          <Button
            className="flex-1 md:flex-initial justify-center"
            onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Employee
          </Button>
        </div>
      </div>

      <CreateUserDialog isOpen={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </>
  );
}
