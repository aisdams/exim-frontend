export type Customer = {
  customer_code: string;
  partner_name: string;
  address: string;
  unit: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
};

export type createCustomerInput = {
  partner_name?: string | null;
  unit?: string | null;
};

export type updateCustomerInput = Omit<createCustomerInput>;
