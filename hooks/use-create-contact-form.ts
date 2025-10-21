import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { toast } from "sonner-native";
import { newContactSchema } from "~/schema/new-contact-schema";
import * as z from "zod";
import { useApiMutation } from "~/lib/http/use-api-mutation";
import { createContact } from "~/lib/http/endpoints/contact";
import { pickImage } from "~/lib/pick-image";
import {
  CreateContactPayload,
  ContactInfo,
} from "~/lib/http/request-type/contact";
import { CreateContactResponse } from "~/lib/http/response-type/contact";
import { contactKeys } from "~/lib/http/keys/contact";
import { IconData } from "~/lib/types";
import { Option } from "~/components/ui/select";
import {
  ICountry,
  getCountryByCca2,
  isValidPhoneNumber,
} from "react-native-international-phone-number";

type NewContactFormFields = z.infer<typeof newContactSchema>;

export function useCreateContactForm() {
  const queryClient = useQueryClient();

  // States for UI-specific data
  const [profilePic, setProfilePic] = useState<IconData | null>(null);
  const [isWhatsappChecked, setIsWhatsappChecked] = useState(false);
  const [isSMSChecked, setIsSMSChecked] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<ICountry | undefined>(
    undefined
  );
  const [selectedRelationship, setSelectedRelationship] = useState<Option>({
    label: "Family",
    value: "FAMILY",
  });

  // Form setup
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<NewContactFormFields>({
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
    },
    resolver: zodResolver(newContactSchema),
  });

  const createContactMutation = useApiMutation<
    CreateContactResponse,
    CreateContactPayload
  >({
    mutationKey: ["contact", "create"],
    mutationFn: createContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.list() });
      router.back();
      toast.success("Contact created successfully.");
    },
    onError: () =>
      toast.error("Failed to create contact. Please try again later."),
  });

  // Effect to set default country
  useEffect(() => {
    if (!selectedCountry) setSelectedCountry(getCountryByCca2("HK"));
  }, [selectedCountry]);

  // Handler for picking image
  const handlePickImage = async () => {
    const res = await pickImage();
    if (res) {
      setProfilePic({
        uri: res.uri,
        name: res.fileName ?? "",
        mimeType: res.mimeType ?? "",
      });
    }
  };

  // Handler for country selection
  const handleSelectedCountry = (country: ICountry) => {
    setSelectedCountry(country);
  };

  // Form submission handler
  const onSubmit = (data: NewContactFormFields) => {
    const country = selectedCountry ?? getCountryByCca2("HK");
    const rawPhone = (data.phone ?? "").trim();

    // If not empty (Zod handles empty), validate by country
    if (rawPhone.length > 0 && country) {
      const normalized = rawPhone.replace(/[^\d+]/g, "");
      const valid = isValidPhoneNumber(normalized, country);

      if (!valid) {
        setError("phone", {
          type: "validate",
          message: "Invalid mobile number for selected country",
        });
        return;
      }
    }

    // E.g. +852 1234 5678
    const phoneNumber = `${country?.idd?.root ?? ""} ${rawPhone}`;

    const distributions: ("EMAIL" | "WHATSAPP" | "SMS")[] = ["EMAIL"];
    if (isWhatsappChecked) distributions.push("WHATSAPP");
    if (isSMSChecked) distributions.push("SMS");

    const contactInfo: ContactInfo = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      phone: phoneNumber.replace(/ /g, ""),
      email: data.email.trim(),
      relationship: selectedRelationship?.value ?? "",
      communicationOption: distributions,
    };

    createContactMutation.mutate({
      profilePicture: profilePic ?? null,
      contactInfo,
    });
  };

  return {
    // Form
    control,
    errors,
    handleSubmit,
    onSubmit,
    // States
    profilePic,
    setProfilePic,
    isWhatsappChecked,
    setIsWhatsappChecked,
    isSMSChecked,
    setIsSMSChecked,
    selectedRelationship,
    setSelectedRelationship,
    selectedCountry,
    handleSelectedCountry,
    // Handlers
    handlePickImage,
    // Mutation status
    isCreatingContact:
      createContactMutation.isPending || createContactMutation.isSuccess,
  };
}
