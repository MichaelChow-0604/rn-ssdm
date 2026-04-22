import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { toast } from "sonner-native";
import { checkRelatedDocs } from "~/lib/http/endpoints/contact";

export function useContactDeleteCheck(id?: string) {
  const qc = useQueryClient();
  const { isFetching } = useQuery({
    queryKey: ["contact", "check-related-docs", String(id ?? "")],
    queryFn: () => checkRelatedDocs(String(id)),
    enabled: false,
  });

  async function onDelete() {
    if (!id) return;
    try {
      const res = await qc.fetchQuery({
        queryKey: ["contact", "check-related-docs", String(id)],
        queryFn: () => checkRelatedDocs(String(id)),
      });

      const accessedOnlyByContact = Array.isArray(res.accessedOnlyByContact)
        ? res.accessedOnlyByContact
        : [];
      const accessedByContact = Array.isArray(res.accessedByContact)
        ? res.accessedByContact
        : [];

      const hasBlocked = accessedOnlyByContact.length > 0;
      const hasRelated = accessedByContact.length > 0;

      router.push({
        pathname: "/delete-confirm",
        params: {
          id: String(id),
          canDelete: (!hasBlocked).toString(),
          blockedDocs: hasBlocked
            ? accessedOnlyByContact.map((d) => d.title)
            : [],
          relatedDocs:
            !hasBlocked && hasRelated
              ? accessedByContact.map((d) => d.title)
              : [],
        },
      });
    } catch {
      toast.error("Failed to delete contact. Please try again later.");
    }
  }

  return { isCheckingDelete: isFetching, onDelete };
}
