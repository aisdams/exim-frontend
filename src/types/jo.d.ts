export type JobOrder = {
  jo_no: string;
  jo_date: string | null;
  hbl: string | null;
  mbl: string | null;
  etd: string | null;
  eta: string | null;
  vessel: string | null;
  gross_weight: string | null;
  volume: string | null;
  name_of_goods: string | null;
  createdBy: string | null;
  quo_no: string | null;
  customer_code: string | null;
  port_code: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
};

export type createJobOrderInput = {
  jo_date?: string | null;
  hbl?: string | null;
  mbl?: string | null;
  etd?: string | null;
  eta?: string | null;
  vessel?: string | null;
  gross_weight?: string | null;
  volume?: string | null;
  name_of_goods?: string | null;
  createdBy?: string | null;
  quo_no?: string | null;
  customer_code?: string | null;
  port_code?: string | null;
};

export type updateJobOrderInput = Omit<
  createJobOrderInput,
  'quo_no',
  'customer_code',
  'port_code'
>;
