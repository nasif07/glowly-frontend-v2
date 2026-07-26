export type Role = "admin" | "user";

export interface User {
  _id: string;
  /** Auth/registration use `name`; the profile screen uses `fullName`. */
  name?: string;
  fullName?: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  profileImage?: string;
  role: Role;
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}
