import axios, { type AxiosInstance } from "axios";

export function createApiClient(baseURL = "/api"): AxiosInstance {
  return axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export const apiClient = createApiClient();
