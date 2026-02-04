import { handler as adminHandler } from "@/services/adminApiService";

export const fetchTenantsData = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}tenants/tenants-status/`;
  const response = await adminHandler.apiCall(url, "GET");
  return response?.data;
};

export const fetchTotalRevenue = async (range: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}tenants/revenue/total/?range=${range}`;
  const response = await adminHandler.apiCall(url, "GET");
  return response?.data;
};

export const fetchTenantsRevenue = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}tenants/revenue/tenant`;
  const response = await adminHandler.apiCall(url, "GET");
  if (response?.error) {
    return [];
  }
  return response?.data;
};

export const fetchSubscriptionPlans = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}tenants/subscription/plans/`;
  const response = await adminHandler.apiCall(url, "GET");
  return response?.data;
};

export const fetchSubscriptionEnding = async (range: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}tenants/subscription/ending/?range=${range}`;
  const response = await adminHandler.apiCall(url, "GET");
  return response?.data;
};

export const fetchAllTenants = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}tenants/info/`;
  const response = await adminHandler.apiCall(url, "GET");
  return response?.data?.tenants;
};

export const updateTenantStatus = async (action: string, tenantId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}tenants/client_status/`;
  const payload = {
    action: action,
    domain: tenantId,
  };
  const response = await adminHandler.apiCall(url, "POST", payload);
  return response?.data;
};

export const deleteTenant = async (tenantdomain: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}tenants/offboarding/`;
  const payload = {
    domain: tenantdomain,
  };
  const response = await adminHandler.apiCall(url, "DELETE", payload);
  return response?.data;
};

export const createSubscription = async (payload: any) => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}tenants/subscription/plans/`;
  const response = await adminHandler.apiCall(url, "POST", payload);
  return response?.data;
};

export const fetchApiQuotas = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}tenants/api/quotas`;
  const response = await adminHandler.apiCall(url, "GET");
  return response?.data;
};

export const updateApiQuotas = async (payload: any) => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}tenants/api/quotas`;
  const response = await adminHandler.apiCall(url, "PUT", payload);
  return response?.data;
};
export const notifications = async (method: string, payload: any) => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}tenants/approval/`;
  const response = await adminHandler.apiCall(url, method, payload);
  return response;
};
export const getRevenueHistory = async (year: number, month: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}tenants/revenue/history/?year=${year}&month=${month}`;
  const response = await adminHandler.apiCall(url);
  return response;
};
