export type Cost = {
  item_cost: string | null;
  item_name: string | null;
  qty: string | null;
  unit: string | null;
  mata_uang: string | null;
  note: string | null;
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
