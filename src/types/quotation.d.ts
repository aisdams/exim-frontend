export type Quotation = {
  quo_no: string | null;
  sales: string | null;
  subject: string | null;
  attn: string | null;
  type: string | null;
  delivery: string | null;
  kurs: string | null;
  status: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  customer_code: string | null;
  item_cost: string | null;
  port_code: string | null;
};

export type createQuotationInput = {
  sales: string | null;
  subject: string | null;
  attn: string | null;
  type: string | null;
  delivery: string | null;
  kurs: string | null;
  status: string | null;
};

export type updateQuotationInput = Omit<createQuotationInput>;
