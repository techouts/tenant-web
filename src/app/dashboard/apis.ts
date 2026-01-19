import { handler } from "@/services/apiService";

const accessToken =
  JSON.parse(global?.window?.localStorage.getItem("userData") || "{}")
    ?.accessToken || "";
const client =
  JSON.parse(global?.window?.localStorage.getItem("userData") || "{}")?.user
    ?.tenant || "";

const secretKey =
  JSON.parse(global?.window?.localStorage.getItem("secret-key") || "{}") || "";

export const fetchApiUsageData = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}tenants/api-usage/`;
  const response = await handler.apiCall(
    url,
    "GET",
    {},
    {
      Authorization: `Bearer ${accessToken}`,
    },
  );
  if (response) {
    return response?.data?.api_usage;
  }
};

export const TenantSubscriptionPlan = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}tenants/tenant/subscription-detail/`;
  const response = await handler.apiCall(
    url,
    "GET",
    {},
    { Authorization: `Bearer ${accessToken}` },
  );
  return response?.data;
};

export const DashboardPlans = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}tenants/subscription/plans/`;
  const response = await handler.apiCall(url, "GET", {});
  if (response) {
    return response?.data;
  }
};

export const PurchasePlan = async (planId: number, tenantId: number) => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}tenants/subscription/purchase/`;
  const payload = {
    plan_id: planId,
    tenant_id: tenantId,
  };
  const response = await handler.apiCall(url, "POST", payload, {
    Authorization: `Bearer ${accessToken}`,
  });
  return response?.data;
};

export const getTenantDetails = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}tenants/tenant-credentials/`;
  const response = await handler.apiCall(
    url,
    "GET",
    {},
    {
      Authorization: `Bearer ${accessToken}`,
    },
  );
  return response?.data;
};

export const getMembers = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}tenants/user-status/`;

  const response = await handler.apiCall(
    url,
    "GET",
    {},
    {
      Authorization: `Bearer ${accessToken}`,
    },
  );
  return response?.data;
};

export const removeUser = async (email: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}tenants/client-user/`;

  const response = await handler.apiCall(
    url,
    "DELETE",
    {
      email: email,
    },
    {
      Authorization: `Bearer ${accessToken}`,
    },
  );
  return response?.data;
};

export const updateUser = async (data: any) => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}tenants/client-user/`;

  const response = await handler.apiCall(
    url,
    "PUT",
    {
      ...data,
    },
    {
      Authorization: `Bearer ${accessToken}`,
    },
  );
  return response?.data;
};

export const activateOrDeactivateMembers = async (
  status: boolean,
  emailId: string,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}tenants/user-status/`;

  const response = await handler.apiCall(
    url,
    "POST",
    {
      is_active: status,
      email: emailId,
    },
    {
      Authorization: `Bearer ${accessToken}`,
    },
  );
  return response?.data;
};

export const getsubscriptionHistory = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}tenants/subscription/history/`;
  const response = await handler.apiCall(
    url,
    "GET",
    {},
    {
      Authorization: `Bearer ${accessToken}`,
    },
  );
  return response?.data;
};

export const uploadCatalog = async (file: any) => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}tenants/catalog/upload/`;
  const formData = new FormData();
  formData.append("file", file);
  const response = await handler.apiCall(url, "POST", formData, {
    Authorization: `Bearer ${accessToken}`,
    client: client,
  });
  return response?.data;
};

export const search = async (query: any) => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}api/feature/search?q=${query}&source=ginger`;
  const response = await handler.apiCall(
    url,
    "GET",
    {},
    {
      "X-SECRET-KEY": secretKey,
      client: client,
    },
  );
  return response?.data;
};
