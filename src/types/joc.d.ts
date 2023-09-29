export type JOC = {
  joc_no: string | null;
  no_mbl: string | null;
  status: string | null;
  vessel: string | null;
  no_container: string | null;
  general_purpose: string | null;
  quo_no: string | null;
  jo_no: string | null;
  customer_code: string | null;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type createJOCInput = {
  joc_no?: string | null;
  no_mbl?: string | null;
  status?: string | null;
  vessel?: string | null;
  no_container?: string | null;
  general_purpose?: string | null;
  quo_no?: string | null;
  jo_no?: string | null;
  customer_code?: string | null;
  createdBy?: string | null;
};

export type updateJOCInput = Omit<createJOCInput>;
