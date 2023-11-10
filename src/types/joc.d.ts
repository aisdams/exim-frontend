export type JOC = {
  joc_no: string;
  no_mbl: string;
  status: string;
  agent: string;
  vessel: string;
  no_container: string;
  loading: string;
  discharge: string;
  etd: string;
  eta: string;
  type?: string;
  quo_no: string | null;
  jo_no: string;
  joborder: string;
  customer_code: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
};

export type createJOCInput = {
  no_mbl?: string | null;
  type?: string | null;
  status?: string | null;
  vessel?: string | null;
  no_container?: string | null;
  etd: string | null;
  eta: string | null;
  loading: string | null;
  discharge: string | null;
};

export type UpdateStatusInput = {
  status?: string | null;
};

export type updateJOCInput = {
  type?: string | null;
  vessel?: string | null;
  no_container?: string | null;
  loading: string | null;
  discharge: string | null;
};
