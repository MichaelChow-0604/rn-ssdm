import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { uploadDocumentSchema } from "~/schema/upload-document-schema";
import * as z from "zod";
import * as DocumentPicker from "expo-document-picker";
import { Option } from "~/components/ui/select";
import { FileData } from "~/lib/http/request-type/document";
import { useContactsOptions } from "~/lib/contacts/hooks";

type UploadDocumentFormFields = z.infer<typeof uploadDocumentSchema>;

export function useUploadDocumentForm() {
  // States for selections
  const [selectedCategory, setSelectedCategory] = useState<Option>({
    label: "Legal",
    value: "LEGAL",
  });
  const [selectedType, setSelectedType] = useState<Option>({
    label: "Will",
    value: "WILL",
  });
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const [fileReachedMaxSize, setFileReachedMaxSize] = useState(false);

  // Fetch contact options (assuming this is used for RecipientsMultiSelect)
  const { options: contactOptions } = useContactsOptions();

  // Form setup
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm<UploadDocumentFormFields>({
    defaultValues: {
      title: "",
      description: "",
      id: "",
      reference_number: "",
      remarks: "",
      recipients: [],
    },
    resolver: zodResolver(uploadDocumentSchema),
  });

  useEffect(() => {
    setValue("recipients", selectedContacts);
    // Clear recipients error if contacts are selected
    if (selectedContacts.length > 0) {
      clearErrors("recipients");
    }
  }, [selectedContacts, setValue, clearErrors]);

  // Handler for choosing a file
  const handleChooseFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/heic",
      ],
    });

    if (!result.canceled) {
      const file = result.assets[0];
      setSelectedFile({
        uri: file.uri,
        name: file.name,
        mimeType: file.mimeType ?? "",
        size: file.size ?? 0,
      });

      if (file.size && file.size > 25 * 1024 * 1024) {
        setFileReachedMaxSize(true);
      } else {
        setFileReachedMaxSize(false);
      }
    }
  };

  // Submission handler with integrated file check
  const onSubmit = handleSubmit((data: UploadDocumentFormFields) => {
    if (!selectedFile) {
      // No setError for file—handled by button disable
      return;
    }

    const previewData = {
      title: data.title,
      description: data.description,
      category: selectedCategory?.value,
      type: selectedType?.value,
      recipients: JSON.stringify(selectedContacts),
      userDocId: data.id,
      reference_number: data.reference_number,
      remarks: data.remarks,
      file: selectedFile,
    };

    router.push({
      pathname: "/preview-document",
      params: {
        previewData: JSON.stringify(previewData),
      },
    });
  });

  return {
    // Form
    control,
    errors,
    onSubmit,
    // States
    selectedCategory,
    setSelectedCategory,
    selectedType,
    setSelectedType,
    selectedContacts,
    setSelectedContacts,
    selectedFile,
    setSelectedFile,
    fileReachedMaxSize,
    setFileReachedMaxSize,
    contactOptions,
    // Handlers
    handleChooseFile,
  };
}
