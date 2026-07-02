import axiosInstance from "@/lib/axios";
import {
  LoginPayload,
  RegisterPayload,
} from "@/types/auth";

export const authService = {
  login: async (
    data: LoginPayload
  ) => {
    const response =
      await axiosInstance.post(
        "/api/auth/login",
        data
      );

    return response.data;
  },

  register: async (
    data: RegisterPayload
  ) => {
    const response =
      await axiosInstance.post(
        "/api/auth/register",
        data
      );

    return response.data;
  },
};