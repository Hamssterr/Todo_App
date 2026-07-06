"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { useInView } from "react-intersection-observer";
import { useInfiniteUsers } from "@/hooks/use-users";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserInfiniteSelectProps {
  value?: string;
  initialUserName?: string;
  onChange: (value: string) => void;
  error?: boolean;
}

export function UserInfiniteSelect({
  value,
  initialUserName,
  onChange,
  error,
}: UserInfiniteSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteUsers({
      search: debouncedSearch,
      role: "EMPLOYEE",
      limit: 20,
    });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const users = data?.pages.flatMap((page) => page.data) ?? [];

  const selectedUser = users.find((user) => user.id === value);

  const displayLabel = selectedUser
    ? selectedUser.name
    : value && initialUserName
      ? initialUserName
      : "Select an employee...";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between font-normal",
              !value && "text-muted-foreground",
              error && "border-destructive focus-visible:ring-destructive",
            )}>
            <span className="truncate">{displayLabel}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        }
      />

      <PopoverContent
        className="w-(--radix-popover-trigger-width) p-0"
        align="start">
        <Command
          shouldFilter={false}
          className="overflow-hidden rounded-xl border bg-background">
          <CommandInput
            placeholder="Search employees..."
            value={search}
            onValueChange={setSearch}
          />

          <CommandList className="max-h-[280px] overflow-y-auto p-2">
            {isLoading && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}

            {!isLoading && users.length === 0 && (
              <CommandEmpty>No employee found.</CommandEmpty>
            )}

            <CommandGroup className="p-0">
              <div className="space-y-2">
                {users.map((user) => (
                  <CommandItem
                    key={user.id}
                    value={user.id}
                    onSelect={() => {
                      onChange(user.id);
                      setOpen(false);
                    }}
                    className="
                      flex cursor-pointer items-center justify-between
                      rounded-xl bg-card px-4 py-3
                      hover:bg-muted
                      data-[selected=true]:bg-muted
                    ">
                    <div className="flex min-w-0 flex-col gap-1">
                      <span className="truncate font-medium leading-none">
                        {user.name}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>

                    {value === user.id && (
                      <Check className="ml-2 h-4 w-4 shrink-0 text-primary" />
                    )}
                  </CommandItem>
                ))}
              </div>
            </CommandGroup>

            {hasNextPage && (
              <div
                ref={ref}
                className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                {isFetchingNextPage ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Load more..."
                )}
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
