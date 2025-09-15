// lib/contacts/hooks.ts
import { useEffect, useMemo } from "react";
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { contactKeys } from "~/lib/http/keys/contact";
import { getContactById, getContacts } from "~/lib/http/endpoints/contact";
import {
  buildNameIndex,
  summariesToOptions,
  toRecipientDetails,
  RecipientDetail,
} from "./adapters";

export function useContactsOptions() {
  // This hits cache immediately due to prefetch in otp page
  const { data } = useQuery({
    queryKey: contactKeys.list(),
    queryFn: getContacts,
    staleTime: 5 * 60 * 1000,
  });
  const summaries = data?.contactSummaries ?? [];
  const options = useMemo(() => summariesToOptions(summaries), [summaries]);
  const nameIndex = useMemo(() => buildNameIndex(summaries), [summaries]);
  return { options, nameIndex };
}

export function useContactsDetails(ids: string[]) {
  // Fetch details only when needed (e.g., before submit)
  const results = useQueries({
    queries: ids.map((id) => ({
      queryKey: contactKeys.detail(id),
      queryFn: () => getContactById(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    })),
  });

  const isLoading = results.some((r) => r.isLoading);
  const contacts = results
    .map((r) => r.data?.contact)
    .filter(Boolean) as Awaited<ReturnType<typeof getContactById>>["contact"][];

  const recipientDetails: RecipientDetail[] = useMemo(
    () => toRecipientDetails(contacts),
    [contacts]
  );

  return { isLoading, recipientDetails };
}

export function usePrefetchContactDetails(ids: string[]) {
  const qc = useQueryClient();
  useEffect(() => {
    ids.forEach((id) => {
      qc.prefetchQuery({
        queryKey: contactKeys.detail(id),
        queryFn: () => getContactById(id),
        staleTime: 5 * 60 * 1000,
      });
    });
  }, [qc, ids]);
}
