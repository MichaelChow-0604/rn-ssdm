import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { getContacts, StoredContact } from "~/lib/storage/contact";

export function useContactList() {
  const [contacts, setContacts] = useState<StoredContact[]>([]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        const data = await getContacts();
        if (!cancelled) setContacts(data);
      })();
      return () => {
        cancelled = true;
      };
    }, [])
  );
  return contacts;
}
