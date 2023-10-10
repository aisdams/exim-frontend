export type Quotation = {
  quo_no: string;
  sales: string;
  subject: string;
  attn: string;
  type: string;
  delivery: string;
  customer: string;
  kurs: string;
  loading: string;
  no_count: string;
  discharge: string;
  status: string | null;
  customer_code: string | null;
  item_cost: string;
  port_code: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
};

export type createQuotationInput = {
  sales?: string | null;
  subject?: string | null;
  customer?: string | null;
  attn?: string | null;
  type?: string | null;
  delivery?: string | null;
  kurs?: string | null;
  loading?: string | null;
  discharge?: string | null;
  status?: string | null;
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
