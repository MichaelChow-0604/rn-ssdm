import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IconData } from "~/lib/types";
import { profileSchema } from "~/schema/profile-schema";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const detailSchema = profileSchema.extend({
  profilePicUri: z.string().nullable().optional(),
});

export type EditProfileFormFields = z.infer<typeof detailSchema>;

export function useEditProfileForm() {
  const qc = useQueryClient();

  const [profilePic, setProfilePic] = useState<IconData | undefined>(undefined);

  const form = useForm<EditProfileFormFields>({
    defaultValues: {
      firstName: "",
      lastName: "",
      profilePicUri: null,
    },
    resolver: zodResolver(detailSchema),
  });
}
