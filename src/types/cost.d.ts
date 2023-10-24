export type Cost = {
  item_cost: string;
  item_name: string;
  qty: string;
  unit: string;
  mata_uang: string;
  price: string;
  note: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
};

export type createCostInput = {
  qty?: string | null;
  unit?: string | null;
  note?: string | null;
};

export type updateCostInput = Omit<createCostInput>;
