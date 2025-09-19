import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { getContact, StoredContact } from "~/lib/storage/contact";

export function useContactDetail(id?: string) {
  const [contact, setContact] = useState<StoredContact | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const reload = useCallback(async () => {
    if (!id) {
      setContact(null);
      return null;
    }
    setIsLoading(true);
    const c = await getContact(String(id));
    setContact(c);
    setIsLoading(false);
    return c;
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        const c = await getContact(String(id));
        if (!cancelled) setContact(c);
      })();
      return () => {
        cancelled = true;
      };
    }, [id])
  );

  return { contact, isLoading, reload };
}
