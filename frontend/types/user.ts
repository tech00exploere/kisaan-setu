export type UserRole =
  | "farmer"
  | "buyer"
  | "company";

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isVerified: boolean;
}