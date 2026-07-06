"use client";

import { useQuery } from "@tanstack/react-query";
import http from "@/services/http";
import { useTasks } from "@/hooks/use-tasks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, CheckSquare, Clock, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function ManagerDashboard() {
  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users", "overview"],
    queryFn: async () => {
      const res = await http.get("/users?role=EMPLOYEE&limit=1");
      return res.data;
    },
  });

  const { data: tasksData, isLoading: isLoadingTasks } = useTasks({ limit: 5 });

  return (
    <div className="flex flex-1 flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground/90">
          Welcome back, Manager
        </h1>
        <p className="text-muted-foreground">
          Here is an overview of your team's progress today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Employees Card */}
        <Card className="relative overflow-hidden group border-border/50 bg-linear-to-b from-background to-secondary/20 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition-all duration-500 group-hover:bg-primary/20 group-hover:scale-150" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Employees
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoadingUsers ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-bold">
                {usersData?.meta?.total || 0}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Active team members
            </p>
          </CardContent>
        </Card>

        {/* Total Tasks Card */}
        <Card className="relative overflow-hidden group border-border/50 bg-linear-to-bfrom-background to-secondary/20 shadow-sm transition-all hover:shadow-md hover:border-chart-2/20">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-chart-2/10 blur-2xl transition-all duration-500 group-hover:bg-chart-2/20 group-hover:scale-150" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Tasks
            </CardTitle>
            <CheckSquare className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            {isLoadingTasks ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-bold">
                {tasksData?.meta?.total || 0}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Assigned across the team
            </p>
          </CardContent>
        </Card>

        {/* System Health / Pending Card */}
        <Card className="relative overflow-hidden group border-border/50 bg-linear-to-b from-background to-secondary/20 shadow-sm transition-all hover:shadow-md hover:border-chart-4/20">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-chart-4/10 blur-2xl transition-all duration-500 group-hover:bg-chart-4/20 group-hover:scale-150" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              System Status
            </CardTitle>
            <Clock className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-500">Online</div>
            <p className="text-xs text-muted-foreground mt-1">
              All services running smoothly
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tasks List */}
      <Card className="col-span-3 border-border/50 shadow-sm transition-all hover:shadow-md">
        <CardHeader>
          <CardTitle>Recent Tasks</CardTitle>
          <CardDescription>
            Latest tasks assigned to your employees.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingTasks ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </div>
          ) : tasksData?.data?.length > 0 ? (
            <div className="space-y-4">
              {tasksData.data.map((task: any) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-xl border border-border/50 p-4 transition-all hover:bg-muted/50 hover:border-border">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                      <CheckSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{task.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Assigned to:{" "}
                        <span className="font-medium text-foreground">
                          {task.assignedTo?.name || "Unknown"}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">
                      {task.status}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-border text-muted-foreground bg-muted/20">
              No tasks found. Create a new task to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
