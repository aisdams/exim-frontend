export type JobOrder = {
  jo_no: string;
  jo_date: string;
  shipper: string;
  consignee: string;
  qty: string;
  hbl: string;
  mbl: string;
  etd: string;
  eta: string;
  vessel: string;
  gross_weight: string;
  volume: string;
  name_of_goods: string;
  createdBy: string;
  quo_no: string;
  customer_code: string;
  port_code: string;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
};

export type createJobOrderInput = {
  jo_date?: string | null;
  shipper?: string | null;
  consignee?: string | null;
  qty?: string | null;
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

export type createJOforJOCInput = {
  shipper?: string | null;
  consignee?: string | null;
  qty?: string | null;
  vessel?: string | null;
  gross_weight?: string | null;
  volume?: string | null;
  quo_no?: string | null;
  customer_code?: string | null;
};

export type updateJobOrderInput = Omit<
  createJobOrderInput,
  'jo_date',
  'customer_code',
  'port_code'
>;
