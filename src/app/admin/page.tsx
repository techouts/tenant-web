"use client";
import { StatCard } from "@/components/statCard";
import { SubscriptionPlansTable } from "@/components/subscriptionPlansTable";
import { TenantRevenueTable } from "@/components/tenantRevenueTable";
import { useEffect, useState } from "react";
import {
  fetchSubscriptionEnding,
  fetchTenantsData,
  fetchTenantsRevenue,
  fetchTotalRevenue,
} from "./admin-apis";

const AdminDashboardPage = () => {
  const [tenants, setTenants] = useState<{
    total_tenants: number;
    active_tenants: number;
    deactivated_tenants: number;
  }>({
    total_tenants: 0,
    active_tenants: 0,
    deactivated_tenants: 0,
  });
  const [totalRevenue, setTotalRevenue] = useState<{
    month: string;
    total_revenue: number;
    currency: string;
  }>({
    month: "",
    total_revenue: 0,
    currency: "",
  });
  const [tenantsRevenue, setTenantsRevenue] = useState<
    Array<{
      tenant_id: number;
      tenant_name: string;
      revenue: number;
    }>
  >([
    {
      tenant_id: 0,
      tenant_name: "",
      revenue: 0,
    },
  ]);

  const [subscriptionEnding, setSubscriptionEnding] = useState<{
    month: string;
    count: number;
    subscriptions: Array<{
      tenant_id: number;
      tenant_name: string;
      plan: string;
      end_date: string;
      is_trial: boolean;
      days_left: number;
    }>;
  }>();

  const fetchData = async () => {
    const tenantsData = await fetchTenantsData();
    const totalRevenueData = await fetchTotalRevenue();
    const tenantsRevenueData = await fetchTenantsRevenue();
    const subscriptionEndingData = await fetchSubscriptionEnding();
    if (tenantsData) {
      setTenants(tenantsData);
    }
    if (totalRevenueData) {
      setTotalRevenue(totalRevenueData);
    }
    if (tenantsRevenueData) {
      setTenantsRevenue(tenantsRevenueData);
    }
    if (subscriptionEndingData) {
      setSubscriptionEnding(subscriptionEndingData);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Tenants" value={tenants?.total_tenants} />
        <StatCard label="Active Tenants" value={tenants?.active_tenants} />
        <StatCard
          label="Deactivated Tenants"
          value={tenants?.deactivated_tenants}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-3xl font-semibold">
            ₹{totalRevenue?.total_revenue?.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {totalRevenue?.month}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <TenantRevenueTable data={tenantsRevenue || []} />
        <SubscriptionPlansTable
          data={subscriptionEnding?.subscriptions || []}
          title={`Subscription Ending This Month (${subscriptionEnding?.month})`}
          type="subscriptionEnding"
        />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
