"use client";

import { User } from "@/types/user.type";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { UserActionsMenu } from "./user-actions-menu";

interface ManagerUserMobileCardsProps {
  users: User[];
  isLoading: boolean;
}

export function ManagerUserMobileCards({
  users,
  isLoading,
}: ManagerUserMobileCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="overflow-hidden border-border/50">
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-5 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex md:hidden h-32 w-full flex-col items-center justify-center rounded-xl border border-dashed border-border text-muted-foreground bg-muted/20">
        <p>No users found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:hidden">
      {users.map((user) => (
        <Card
          key={user.id}
          className="overflow-hidden border-border/50 shadow-sm transition-all hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold text-lg line-clamp-1 pr-2">
                  {user.name}
                </h4>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <UserActionsMenu user={user} />
            </div>

            <div className="flex items-center justify-between mt-4">
              <RoleBadge role={user.role} />
              <p className="text-xs text-muted-foreground">
                Joined:{" "}
                {user.createdAt
                  ? format(new Date(user.createdAt), "MMM dd, yyyy")
                  : "-"}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
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
