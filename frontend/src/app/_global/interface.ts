export interface UserDetail {
  id: string;
  name: string;
  email: string;
  role: "user";
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
