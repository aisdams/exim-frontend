export type Customer = {
  customer_code: string | null;
  partner_name: string | null;
  unit: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
};

export type createCustomerInput = {
  partner_name?: string | null;
  unit?: string | null;
};

export type updateCustomerInput = Omit<createCustomerInput>;
