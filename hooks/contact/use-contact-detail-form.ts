import { useEffect, useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { newContactSchema } from "~/schema/new-contact-schema";
import {
  getCountryByPhoneNumber,
  ICountry,
  isValidPhoneNumber,
} from "react-native-international-phone-number";
import { useApiMutation } from "~/lib/http/use-api-mutation";
import { updateContact } from "~/lib/http/endpoints/contact";
import { contactKeys } from "~/lib/http/keys/contact";
import { GetContactResponse } from "~/lib/http/response-type/contact";
import { toast } from "sonner-native";
import { pickImage } from "~/lib/pick-image";
import { IconData } from "~/lib/types";
import { compressToJpeg } from "~/lib/utils";

const detailSchema = newContactSchema.extend({
  profilePicUri: z.string().nullable().optional(),
  relationship: z.string().nullable().optional(),
  distributions: z.array(z.enum(["EMAIL", "WHATSAPP", "SMS"])).min(1),
});
export interface ContactDetailFormValues extends z.infer<typeof detailSchema> {}

interface Params {
  apiContact?: GetContactResponse | null;
}

export function useContactDetailForm({ apiContact }: Params) {
  const qc = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState<IconData | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<ICountry | undefined>(
    undefined
  );

  const form = useForm<ContactDetailFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      profilePicUri: null,
      relationship: null,
      distributions: ["EMAIL"],
    },
    resolver: zodResolver(detailSchema),
  });

  // Populate when apiContact arrives
  useEffect(() => {
    if (!apiContact) return;

    const country = getCountryByPhoneNumber(apiContact.phone);
    setSelectedCountry(country);

    const national = country?.idd?.root
      ? apiContact.phone.replace(country.idd.root, "")
      : apiContact.phone;

    const hasPicture = !!apiContact.profilePictureUrl;
    if (hasPicture) {
      setProfilePic({
        uri: apiContact.profilePictureUrl ?? "",
        name: "profilePicture",
        mimeType: "image/png",
      });
    } else {
      setProfilePic(null);
    }

    form.reset({
      firstName: apiContact.firstName,
      lastName: apiContact.lastName,
      phone: national,
      email: apiContact.email,
      profilePicUri: hasPicture ? apiContact.profilePictureUrl ?? "" : null,
      relationship: apiContact.relationship ?? null,
      distributions: apiContact.contactOptions?.length
        ? (Array.from(
            new Set(apiContact.contactOptions.map((o) => o.toUpperCase()))
          ).filter((o) =>
            ["EMAIL", "WHATSAPP", "SMS"].includes(o as string)
          ) as ContactDetailFormValues["distributions"])
        : ["EMAIL"],
    });
    setIsEditing(false);
  }, [apiContact, form]);

  const isUpdatingContact = useApiMutation({
    mutationKey: ["contact", "update"],
    mutationFn: updateContact,
    onSuccess: () => {
      router.back();
      qc.invalidateQueries({ queryKey: contactKeys.list() });
      toast.success("Contact updated successfully.");
    },
    onError: () =>
      toast.error("Failed to update contact. Please try again later."),
  });

  async function handlePickImage() {
    const res = await pickImage();
    if (res)
      setProfilePic({
        uri: res.uri,
        name: res.fileName ?? "",
        mimeType: res.mimeType ?? "",
      });
  }

  const onSave = form.handleSubmit(async (data) => {
    if (!apiContact) return;

    const country = selectedCountry;
    const rawPhone = (data.phone ?? "").trim();

    // If not empty (Zod handles empty), validate by country
    if (rawPhone.length > 0 && country) {
      const normalized = rawPhone.replace(/[^\d+]/g, "");
      const valid = isValidPhoneNumber(normalized, country);

      if (!valid) {
        form.setError("phone", {
          type: "validate",
          message: "Invalid mobile number for selected country",
        });
        return;
      }
    }

    const phoneNumber = `${country?.idd?.root ?? ""} ${rawPhone}`.replace(
      / /g,
      ""
    );
    const unique = Array.from(
      new Set(["EMAIL", ...data.distributions])
    ) as ContactDetailFormValues["distributions"];

    const compressedProfilePic = profilePic
      ? await compressToJpeg(profilePic)
      : null;

    isUpdatingContact.mutate({
      id: String(apiContact.id),
      profilePicture: profilePic ?? null,
      contactInfo: {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        phone: phoneNumber,
        email: data.email.trim(),
        relationship: data.relationship ?? "",
        communicationOption: unique,
      },
    });
    setIsEditing(false);
  });

  return {
    form,
    isEditing,
    setIsEditing,
    isUpdatingContact: isUpdatingContact.isPending,
    profilePic,
    setProfilePic,
    selectedCountry,
    setSelectedCountry,
    handlePickImage,
    onSave,
  };
}
