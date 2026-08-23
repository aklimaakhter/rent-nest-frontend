export type Role = "ADMIN" | "LANDLORD" | "TENANT"

export type LoginState = {
  success?: boolean;
  message?: string;
  role?: string;
};

// export type User = {
//   id: string,
//   name: string,
//   email: string,
//   role: Role
// }

export type TenantRequest = {
  id: string;
  status: string;
  tenant: {
    name: string;
    email: string;
  };


  property: {
    title: string;
    location: string;
  };
}

export type User={
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

export type ApiResponse={
  ok?: boolean;
  success?: boolean;
  data?: User[];
  users?: User[];
  message?: string;
}