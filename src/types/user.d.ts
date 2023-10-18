export type User = {
  user_code: string;
  employee_code: string | null;
  name: string;
  email: string | null;
  photo: string;
  verified: boolean | null;
  password: string;
  role_code: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};
