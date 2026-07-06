"use client";

import { User } from "@/types/user.type";
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
import { UserActionsMenu } from "./user-actions-menu";

interface ManagerUsersTableProps {
  users: User[];
  isLoading: boolean;
}

export function ManagerUsersTable({
  users,
  isLoading,
}: ManagerUsersTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-md border border-border/50 hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined At</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-[150px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[200px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-[80px]" />
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

  if (users.length === 0) {
    return (
      <div className="hidden md:flex h-48 w-full flex-col items-center justify-center rounded-xl border border-dashed border-border text-muted-foreground bg-muted/20">
        <p>No users found based on your filters.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border/50 hidden md:block overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="hover:bg-muted/30">
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {user.email}
              </TableCell>
              <TableCell>
                <RoleBadge role={user.role} />
              </TableCell>
              <TableCell>
                {user.createdAt
                  ? format(new Date(user.createdAt), "MMM dd, yyyy")
                  : "-"}
              </TableCell>
              <TableCell className="text-right">
                <UserActionsMenu user={user} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  switch (role) {
    case "MANAGER":
      return (
        <Badge variant="default" className="bg-primary hover:bg-primary/90">
          Manager
        </Badge>
      );
    case "EMPLOYEE":
      return <Badge variant="secondary">Employee</Badge>;
    default:
      return <Badge variant="outline">{role}</Badge>;
  }
}
