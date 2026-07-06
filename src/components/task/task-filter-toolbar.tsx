"use client";

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
import Link from "next/link";

interface TaskFilterToolbarProps {
  search: string;
  status: string;
  priority: string;
  onSearchChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onPriorityChange: (val: string) => void;
  onReset: () => void;
  hideCreateButton?: boolean;
}

export function TaskFilterToolbar({
  search,
  status,
  priority,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onReset,
  hideCreateButton = false,
}: TaskFilterToolbarProps) {
  const isFiltered = search !== "" || status !== "ALL" || priority !== "ALL";

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between w-full">
      {/* Search Input - Chiếm trọn chiều rộng trên Mobile, tự co giãn trên Desktop */}
      <div className="flex flex-1 items-center w-full md:max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
      </div>

      {/* Action Buttons Group */}
      {/* w-full (Mobile): Dàn đều 2 nút | md:w-auto (Desktop): Thu gọn lại gọn gàng */}
      <div className="flex items-center gap-2 w-full md:w-auto">
        <Popover>
          {/* PopoverTrigger cần flex-1 trên Mobile để nút Filter kéo giãn tương đương nút Create Task */}
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

          {/* w-[calc(100vw-2rem)] (Mobile): Bảng bộ lọc rộng vừa khít khung viền màn hình điện thoại tránh tràn viền */}
          <PopoverContent
            align="end"
            className="w-[calc(100vw-2rem)] sm:w-72 max-w-sm p-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-base">Filter tasks</h4>
                <p className="text-sm text-muted-foreground">
                  Narrow tasks by status and priority.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={status}
                  onValueChange={(val) => onStatusChange(val ?? "ALL")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent alignItemWithTrigger={false}>
                    <SelectItem value="ALL">All Status</SelectItem>
                    <SelectItem value="TODO">To Do</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="DONE">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select
                  value={priority}
                  onValueChange={(val) => onPriorityChange(val ?? "ALL")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent alignItemWithTrigger={false}>
                    <SelectItem value="ALL">All Priority</SelectItem>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
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

        {/* Nút Create Task - flex-1 kéo giãn trên Mobile, md:w-auto thu gọn trên Desktop */}
        {!hideCreateButton && (
          <Link href="/manager/tasks/create" className="flex-1 md:flex-initial">
            <Button className="w-full justify-center">
              <Plus className="mr-2 h-4 w-4" />
              Create Task
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
