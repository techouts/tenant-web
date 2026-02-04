import { axios } from "./axios-instance";
import { ApiHandler, Response } from "./types";

const accessToken = global?.window?.localStorage.getItem("accessToken") || "";

export const handler: ApiHandler = {
  createRequest: (url: string, method: string, payload: any, headers: any) => {
    return {
      url,
      data: payload,
      method: method,
      ...(payload?.params && { params: payload?.params }),
      headers: {
        ...headers,
      },
    };
  },

  mapResponse: (response: any, codes: number[] = []) => {
    const { data, status, headers }: Response = response || {};
    if ([200, ...codes]?.includes(status)) {
      return {
        error: false,
        data,
        headers,
      };
    } else {
      return { error: true, data: data };
    }
  },

  apiCall: async (
    url: string,
    method: string,
    payload: any = "",
    headers: any = {},
    codes?: number[],
  ) => {
    try {
      const apiConfig = handler.createRequest(url, method, payload, {
        Authorization: `Bearer ${accessToken}`,
        ...headers,
      });
      const response = await axios(apiConfig);
      return handler.mapResponse(response, codes);
    } catch (error: any) {
      return handler.mapResponse(error?.response || {}, codes);
    }
  },
};
