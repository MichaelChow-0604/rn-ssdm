import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IconData } from "~/lib/types";
import { profileSchema } from "~/schema/profile-schema";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { GetProfileResponse } from "~/lib/http/response-type/profile";
import { useApiMutation } from "~/lib/http/use-api-mutation";
import { router } from "expo-router";
import { toast } from "sonner-native";
import { updateProfile } from "~/lib/http/endpoints/profile";
import { pickImage } from "~/lib/pick-image";

const detailSchema = profileSchema.extend({
  profilePicUri: z.string().nullable().optional(),
});
export type EditProfileFormFields = z.infer<typeof detailSchema>;

interface Params {
  profile?: GetProfileResponse | null;
}

export function useEditProfileForm({ profile }: Params) {
  const qc = useQueryClient();

  const [profilePic, setProfilePic] = useState<IconData | null>(null);

  const form = useForm<EditProfileFormFields>({
    defaultValues: {
      firstName: "",
      lastName: "",
      profilePicUri: null,
    },
    resolver: zodResolver(detailSchema),
  });

  useEffect(() => {
    if (!profile) return;

    const hasPicture = !!profile.profilePictureUrl;
    if (hasPicture) {
      setProfilePic({
        uri: profile.profilePictureUrl,
        name: "profilePicture",
        mimeType: "image/jpeg",
      });
    } else {
      setProfilePic(null);
    }

    form.reset({
      firstName: profile.firstName,
      lastName: profile.lastName,
      profilePicUri: hasPicture ? profile.profilePictureUrl : null,
    });
  }, [profile, form]);

  const isUpdatingProfile = useApiMutation({
    mutationKey: ["profile", "update"],
    mutationFn: updateProfile,
    onSuccess: () => {
      router.back();
      qc.invalidateQueries({ queryKey: ["profile", "get"] });
      toast.success("Profile updated successfully.");
    },
    onError: (err) => {
      toast.error("Failed to update profile. Please try again later.");
    },
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
    if (!profile) return;

    isUpdatingProfile.mutate({
      profilePicture: profilePic ?? null,
      profileInfoJson: {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
      },
    });
  });

  return {
    form,
    isUpdatingProfile: isUpdatingProfile.isPending,
    profilePic,
    setProfilePic,
    handlePickImage,
    onSave,
  };
}
