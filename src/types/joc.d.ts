export type JOC = {
  joc_no: string | null;
  no_mbl: string | null;
  status: StatusCheck | null;
  vessel: string | null;
  no_container: string | null;
  general_purpose: string | null;
  loading: string | null;
  discharge: string | null;
  etd: string | null;
  eta: string | null;
  quo_no: string | null;
  jo_no: string | null;
  customer_code: string | null;
  createdBy: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
};

export type createJOCInput = {
  joc_no?: string | null;
  no_mbl?: string | null;
  status?: string | null;
  vessel?: string | null;
  no_container?: string | null;
  general_purpose?: string | null;
  etd: string | null;
  eta: string | null;
  quo_no?: string | null;
  jo_no?: string | null;
  customer_code?: string | null;
  loading: string | null;
  discharge: string | null;
  createdBy?: string | null;
};

export type updateJOCInput = Omit<createJOCInput>;
