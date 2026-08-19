export type Role="ADMIN" | "LANDLORD" | "TENANT"

export type LoginState = {
  success?: boolean;
  message?: string;
  role?: string;
};

export type User={
  id:string,
  name:string,
  email:string,
  role:Role
}