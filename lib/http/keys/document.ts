export const documentKeys = {
  all: ["documents"] as const,
  list: () => ["documents"] as const,
  detail: (id: string | number) => ["documents", id] as const,
};
