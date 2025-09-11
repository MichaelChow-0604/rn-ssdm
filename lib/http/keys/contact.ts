export const contactKeys = {
  all: ["contacts"] as const,
  list: () => ["contacts"] as const,
  detail: (id: string | number) => ["contacts", id] as const,
};
