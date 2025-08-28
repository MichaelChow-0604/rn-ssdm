import { useEffect, useMemo, useState } from "react";
import {
  getDocuments,
  StoredDocument,
  updateDocument,
} from "~/lib/storage/document";
import {
  getTrash,
  TrashedDocument,
  updateTrashedDocument,
} from "~/lib/storage/trash";
import { removeContact } from "~/lib/storage/contact";

// This hook is used to check if a contact can be deleted
export function useDeleteContact(contactId: string | undefined) {
  // Docs at home screen
  const [affectedActiveDocs, setAffectedActiveDocs] = useState<
    StoredDocument[]
  >([]);
  // Docs in trash
  const [affectedTrashedDocs, setAffectedTrashedDocs] = useState<
    TrashedDocument[]
  >([]);

  // Docs' name that cannot be deleted due to only one recipient
  const [blockedDocNames, setBlockedDocNames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function reload() {
    if (!contactId) return;
    setIsLoading(true);
    const [docs, trash] = await Promise.all([getDocuments(), getTrash()]);
    const affectedActive = docs.filter((d) =>
      d.recipients?.includes(contactId)
    );
    const affectedTrash = trash.filter((t) =>
      t.recipients?.includes(contactId)
    );
    const blockedActive = affectedActive.filter(
      (d) => (d.recipients?.filter(Boolean).length ?? 0) === 1
    );
    const blockedTrash = affectedTrash.filter(
      (t) => (t.recipients?.filter(Boolean).length ?? 0) === 1
    );
    setAffectedActiveDocs(affectedActive);
    setAffectedTrashedDocs(affectedTrash);
    setBlockedDocNames([
      ...blockedActive.map((d) => d.documentName),
      ...blockedTrash.map((t) => t.documentName),
    ]);
    setIsLoading(false);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!contactId) return;
      setIsLoading(true);
      const [docs, trash] = await Promise.all([getDocuments(), getTrash()]);
      if (cancelled) return;
      const affectedActive = docs.filter((d) =>
        d.recipients?.includes(contactId)
      );
      const affectedTrash = trash.filter((t) =>
        t.recipients?.includes(contactId)
      );
      const blockedActive = affectedActive.filter(
        (d) => (d.recipients?.filter(Boolean).length ?? 0) === 1
      );
      const blockedTrash = affectedTrash.filter(
        (t) => (t.recipients?.filter(Boolean).length ?? 0) === 1
      );
      setAffectedActiveDocs(affectedActive);
      setAffectedTrashedDocs(affectedTrash);
      setBlockedDocNames([
        ...blockedActive.map((d) => d.documentName),
        ...blockedTrash.map((t) => t.documentName),
      ]);
      setIsLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [contactId]);

  const canDelete = useMemo(
    () => blockedDocNames.length === 0,
    [blockedDocNames]
  );

  // Docs' name that are affected by the deletion in both home and trash
  const affectedNames = useMemo(
    () => [
      ...affectedActiveDocs.map((d) => d.documentName),
      ...affectedTrashedDocs.map((t) => t.documentName),
    ],
    [affectedActiveDocs, affectedTrashedDocs]
  );

  // Delete contact and cleanup affected docs
  async function deleteContactAndCleanup(): Promise<void> {
    if (!contactId || !canDelete) return;
    await removeContact(contactId);

    if (affectedActiveDocs.length) {
      await Promise.all(
        affectedActiveDocs.map((d) =>
          updateDocument(d.id, {
            recipients: (d.recipients ?? []).filter((r) => r !== contactId),
          })
        )
      );
    }

    if (affectedTrashedDocs.length) {
      await Promise.all(
        affectedTrashedDocs.map((t) =>
          updateTrashedDocument(t.id, {
            recipients: (t.recipients ?? []).filter((r) => r !== contactId),
          })
        )
      );
    }
  }

  return {
    isLoading,
    affectedActiveDocs,
    affectedTrashedDocs,
    blockedDocNames,
    affectedNames,
    canDelete,
    reload,
    deleteContactAndCleanup,
  };
}
