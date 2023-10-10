export type Port = {
  port_code: string;
  port_name: string;
  caption: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
};

export type createPortInput = {
  port_name?: string | null;
  caption?: string | null;
};

export type updatePortInput = Omit<createPortInput>;
