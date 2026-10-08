export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "farmer" | "buyer" | "company";
}//jid

export interface LoginInput {
  email: string;   
  password: string;
}
