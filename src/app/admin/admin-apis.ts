import { handler as adminHandler } from "@/services/adminApiService";

export const fetchTenantsData = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}tenants/tenants-status/`;
  const response = await adminHandler.apiCall(url, "GET");
  return response?.data;
};

export const fetchTotalRevenue = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}tenants/revenue/total`;
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

export const fetchSubscriptionEnding = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}tenants/subscription/ending/`;
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
