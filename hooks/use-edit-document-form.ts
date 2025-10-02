import { useEffect, useState } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner-native";
import { router } from "expo-router";
import { documentKeys } from "~/lib/http/keys/document";
import { getDocumentById, updateDocument } from "~/lib/http/endpoints/document";
import { useApiMutation } from "~/lib/http/use-api-mutation";
import { UpdateDocumentResponse } from "~/lib/http/response-type/document";
import { UpdateDocumentPayload } from "~/lib/http/request-type/document";
import { editDocumentSchema } from "~/schema/edit-document-schema";
import { toDocumentVM } from "~/lib/documents/mappers";

export type EditDocumentFormFields = z.infer<typeof editDocumentSchema>;

interface Params {
  documentId: string;
}

export function useEditDocumentForm({ documentId }: Params) {
  const qc = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: documentKeys.detail(String(documentId)),
    queryFn: () => getDocumentById(String(documentId)),
    select: toDocumentVM,
  });

  useEffect(() => {
    if (isError) toast.error("Something went wrong. Please try again later.");
  }, [isError]);

  const form = useForm<EditDocumentFormFields>({
    defaultValues: {
      id: "",
      reference_number: "",
      description: "",
      remarks: "",
      recipients: [],
    },
    resolver: zodResolver(editDocumentSchema),
  });

  useEffect(() => {
    if (!data) return;
    form.reset({
      id: data.userDocId ?? "",
      reference_number: data.referenceNumber ?? "",
      description: data.description ?? "",
      remarks: data.remarks ?? "",
      recipients: (data.recipients ?? []).map(String),
    });
  }, [data, form]);

  const mutation = useApiMutation<
    UpdateDocumentResponse,
    UpdateDocumentPayload
  >({
    mutationKey: ["document", "update"],
    mutationFn: updateDocument,
    onSuccess: () => {
      toast.success("Document updated successfully.");
      qc.invalidateQueries({
        queryKey: documentKeys.detail(String(documentId)),
      });
      router.back();
    },
    onError: (err) =>
      toast.error("Failed to update document. Please try again later."),
  });

  function handleEdit() {
    setIsEditing(true);
    form.setValue("recipients", (data?.recipients ?? []).map(String), {
      shouldDirty: false,
    });
  }

  function handleSave() {
    mutation.mutate({
      id: String(documentId),
      userDocId: form.getValues("id"),
      referenceNo: form.getValues("reference_number") ?? "",
      recipients: form.getValues("recipients"),
      description: form.getValues("description") ?? "",
      // remarks intentionally not sent (API not supported yet)
    });
  }

  return {
    data,
    isLoading,
    isEditing,
    setIsEditing,
    handleEdit,
    handleSave,
    isUpdatingDocument: mutation.isPending || mutation.isSuccess,
    form, // exposes control, errors, watch, setValue, etc.
  };
}
