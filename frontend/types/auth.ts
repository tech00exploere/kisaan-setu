import { User } from "./user";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "farmer" | "buyer" | "company";
}

export interface AuthResponse {
  user: User;
  token: string;
}