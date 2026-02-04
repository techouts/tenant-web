"use client";

import React, { useState, useEffect } from "react";
import { DashboardHeader, DashboardShell } from "@/components/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  CartesianGrid,
} from "recharts";
import { AlertTriangle, BarChart2, Zap } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import type { UsageData } from "@/lib/types";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { format } from "date-fns";
import { fetchApiUsageData } from "../apis";

function UsageMetrics() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({ dailyLimit: 0, usageToday: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      const data = await api?.user?.getMetrics();
      setMetrics({
        dailyLimit: data?.dailyLimit,
        usageToday: data?.usageToday,
      });
      setLoading(false);
    };
    fetchMetrics();
  }, []);

  const usagePercentage =
    metrics?.dailyLimit > 0
      ? (metrics?.usageToday / metrics?.dailyLimit) * 100
      : 0;
  const isNearLimit = usagePercentage > 80;

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="h-36 animate-pulse bg-muted"></Card>
        <Card className="h-36 animate-pulse bg-muted"></Card>
      </div>
    );
  }

  return (
    <div>
      {isNearLimit && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Usage Warning</AlertTitle>
          <AlertDescription>
            You have used over 80% of your daily API request limit.
          </AlertDescription>
        </Alert>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Daily API Requests
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.usageToday?.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              of {metrics?.dailyLimit?.toLocaleString()} used (
              {usagePercentage?.toFixed(1)}%)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Plan Request Limit
            </CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user?.plan?.limits?.apiRequests?.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              requests per day on the {user?.plan?.name} plan
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function UsageChart() {
  const [data, setData] = useState<UsageData[]>([]);
  const [timeframe, setTimeframe] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const apiUsageData = await fetchApiUsageData();
      setData(apiUsageData);
      setLoading(false);
    };
    fetchHistory();
  }, []);

  // const chartData = data.slice(-timeframe);

  const chartConfig = {
    requests: {
      label: "Requests",
      color: "hsl(var(--accent))",
    },
  };

  if (loading) {
    return <Card className="h-96 animate-pulse bg-muted"></Card>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Usage History</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-72 w-full">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-requests)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-requests)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => format(new Date(value), "MMM d")}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${Number(value) / 1000}k`}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Area
              dataKey="requests"
              type="monotone"
              fill="url(#colorRequests)"
              fillOpacity={0.4}
              stroke="var(--color-requests)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default function UsagePage() {
  return (
    <DashboardShell>
      <DashboardHeader
        title="Usage & Metrics"
        description="Monitor your API usage and performance."
      />
      <div className="space-y-8">
        <UsageMetrics />
        <UsageChart />
      </div>
    </DashboardShell>
  );
}
