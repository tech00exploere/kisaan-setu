export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "farmer" | "buyer" | "company";
}

export interface LoginInput {
  email: string;
  password: string;
}