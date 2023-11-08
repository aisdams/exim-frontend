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
  status: string;
  customer_code: string;
  valheader: string;
  valfooter: string;
  port_code: string | null;
  port_code: string | null;
  cost: string;
  createdAt: Date;
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
  valheader: string | null;
  valfooter: string | null;
  customer_code: string | null;
};

export type updateQuotationInput = {
  sales?: string | null;
  subject?: string | null;
  customer?: string | null;
  customer_code?: string | null;
  attn?: string | null;
  type?: string | null;
  delivery?: string | null;
  kurs?: string | null;
  loading?: string | null;
  discharge?: string | null;
  status?: string | null;
  valheader: string | null;
  valfooter: string | null;
  customer_code: string | null;
};

export type UpdateStatusInput = {
  status?: string | null;
};

export type QuotationWithItem = Quotation & {
  item: {
    item_name: string;
  };
};
