export type Cost = {
  item_cost: string;
  item_name: string;
  qty: string;
  unit: string;
  mata_uang: string;
  note: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
};

export type createCostInput = {
  item_name?: string | null;
  qty?: string | null;
  unit?: string | null;
  note?: string | null;
};

export type updateCostInput = Omit<createCostInput>;
