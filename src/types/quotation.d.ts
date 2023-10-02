export type Quotation = {
  quo_no: string;
  sales: string | null;
  subject: string | null;
  attn: string | null;
  type: string;
  delivery: string | null;
  kurs: string | null;
  loading: string | null;
  discharge: string | null;
  status: string | null;
  customer_code: string | null;
  item_cost: string | null;
  port_code: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
};

export type createQuotationInput = {
  sales?: string | null;
  subject?: string | null;
  attn?: string | null;
  type?: string;
  delivery?: string | null;
  kurs?: string | null;
  loading?: string | null;
  discharge?: string | null;
  status?: string | null;
  customer_code?: string | null;
  item_cost?: string | null;
  port_code?: string | null;
  createdAt: Date | null;
};

export type updateQuotationInput = Omit<
  createQuotationInput,
  'customer_code',
  'item_cost',
  'port_code'
>;

export type QuotationWithItem = Quotation & {
  item: {
    item_name: string;
  };
};
