import {
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "~/components/back-button";
import { Card, CardHeader } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Option } from "~/components/ui/select";
import * as z from "zod";
import { Controller } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { useLocalSearchParams } from "expo-router";
import { newContactSchema } from "~/schema/new-contact-schema";
import { RelationshipSelect } from "~/components/contact/relationship-select";
import { DistributionCheckbox } from "~/components/contact/distribution-checkbox";
import { RELATIONSHIP_OPTIONS } from "~/constants/select-data";
import PhoneInput from "react-native-international-phone-number";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { contactKeys } from "~/lib/http/keys/contact";
import { getContactById } from "~/lib/http/endpoints/contact";
import { GetContactResponse } from "~/lib/http/response-type/contact";
import { LoadingOverlay } from "~/components/loading-overlay";
import { useContactDeleteCheck } from "~/hooks/contact/use-contact-delete-check";
import { useContactDetailForm } from "~/hooks/contact/use-contact-detail-form";
import { ProfileAvatar } from "~/components/profile-avatar";

const detailSchema = newContactSchema.extend({
  profilePicUri: z.string().nullable().optional(),
  relationship: z.string().nullable().optional(),
  distributions: z.array(z.enum(["EMAIL", "WHATSAPP", "SMS"])).min(1),
});

type FormValues = z.infer<typeof detailSchema>;

export default function ContactDetailPage() {
  const { id, previewProfilePictureUrl } = useLocalSearchParams<{
    id: string;
    previewProfilePictureUrl: string | string[];
  }>();

  const previewUrl = Array.isArray(previewProfilePictureUrl)
    ? previewProfilePictureUrl[0]
    : previewProfilePictureUrl;

  const queryClient = useQueryClient();
  const { data: apiContact, status } = useQuery<GetContactResponse, Error, any>(
    {
      queryKey: contactKeys.detail(String(id) ?? ""),
      queryFn: () => getContactById(String(id)),
      staleTime: 5 * 60 * 1000,
      initialData: () =>
        queryClient.getQueryData(contactKeys.detail(String(id))),
    }
  );

  const { isCheckingDelete, onDelete } = useContactDeleteCheck(
    String(apiContact?.id ?? id)
  );

  const {
    form,
    isEditing,
    setIsEditing,
    isUpdatingContact,
    profilePic,
    setProfilePic,
    selectedCountry,
    setSelectedCountry,
    handlePickImage,
    onSave,
  } = useContactDetailForm({
    apiContact,
    initialProfilePictureUrl: previewUrl,
  });

  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;
  const values = watch();

  const relationshipLabel = values.relationship
    ? RELATIONSHIP_OPTIONS.find((o) => o.value === values.relationship)?.label
    : undefined;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Curved blue topper */}
      <View className="h-[40%] bg-[#438BF7] rounded-br-[200px] absolute top-0 left-0 right-0" />

      {status === "pending" ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="small" color="#438BF7" />
        </View>
      ) : (
        <KeyboardAvoidingView
          className="flex-1 px-4"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <LoadingOverlay
            visible={isUpdatingContact}
            label="Updating contact..."
            onDismiss={() => {}}
          />

          {/* Header */}
          <View className="flex-row gap-2 items-center my-8 justify-start w-full">
            <BackButton />
            <Text className="text-2xl font-semibold text-white">
              {apiContact?.firstName} {apiContact?.lastName}
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              className="ml-auto bg-white py-2 px-4 rounded-lg"
              onPress={isEditing ? onSave : () => setIsEditing(true)}
            >
              <Text className="text-lg font-semibold text-button">
                {isEditing ? "Save" : "Edit"}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView className="bg-transparent w-full">
            {/* Profile pic */}
            <View className="h-[15%] flex items-center justify-center w-full gap-1 flex-col">
              <ProfileAvatar
                source={profilePic}
                isEditable={isEditing}
                onSelectImage={handlePickImage}
                onRemoveImage={() => setProfilePic(null)}
              />
            </View>

            {/* Form section */}
            <Card className="w-full bg-white p-4 rounded-xl mt-8 mb-6 gap-4 relative border-gray-200">
              <CardHeader className="py-2">
                {/* No 'All fields are required' in detail page */}
              </CardHeader>

              {/* Name */}
              <View className="flex-row gap-4 items-center justify-start">
                <AntDesign name="user" size={24} color="#438BF7" />
                <View className="flex-1 gap-4">
                  <View className="flex-col gap-1">
                    <Controller
                      name="firstName"
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                          onChangeText={onChange}
                          onBlur={onBlur}
                          value={value}
                          autoCorrect={false}
                          placeholder="First name"
                          className="bg-white text-black border-gray-200"
                          editable={isEditing}
                        />
                      )}
                    />
                    {errors.firstName && (
                      <Text className="text-redtext text-sm">
                        {errors.firstName.message}
                      </Text>
                    )}
                  </View>

                  <View className="flex-col gap-1">
                    <Controller
                      name="lastName"
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                          onChangeText={onChange}
                          onBlur={onBlur}
                          value={value}
                          autoCorrect={false}
                          placeholder="Last name"
                          className="bg-white text-black border-gray-200"
                          editable={isEditing}
                        />
                      )}
                    />
                    {errors.lastName && (
                      <Text className="text-redtext text-sm">
                        {errors.lastName.message}
                      </Text>
                    )}
                  </View>
                </View>
              </View>

              {/* Mobile */}
              <View className="flex-row gap-4 items-center justify-start">
                <AntDesign name="phone" size={24} color="#438BF7" />
                <View className="flex-col gap-1 flex-1">
                  <Controller
                    name="phone"
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({ field: { onChange, value } }) => (
                      <PhoneInput
                        phoneInputStyles={{
                          container: { flex: 1, borderColor: "#e5e7eb" },
                          input: { color: "black" },
                        }}
                        defaultCountry="HK"
                        value={value}
                        onChangePhoneNumber={onChange}
                        selectedCountry={selectedCountry}
                        onChangeSelectedCountry={setSelectedCountry}
                        placeholder="Mobile no."
                        disabled={!isEditing}
                      />
                    )}
                  />
                  {errors.phone && (
                    <Text className="text-redtext text-sm">
                      {errors.phone.message}
                    </Text>
                  )}
                </View>
              </View>

              {/* Email */}
              <View className="flex-row gap-4 items-center justify-start">
                <AntDesign name="mail" size={24} color="#438BF7" />
                <View className="flex-col gap-1 flex-1">
                  <Controller
                    name="email"
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        autoCorrect={false}
                        placeholder="Email"
                        className="bg-white text-black border-gray-200"
                        editable={isEditing}
                      />
                    )}
                  />
                  {errors.email && (
                    <Text className="text-redtext text-sm">
                      {errors.email.message}
                    </Text>
                  )}
                </View>
              </View>

              {/* Relationship */}
              {isEditing ? (
                <RelationshipSelect
                  selectedRelationship={
                    values.relationship
                      ? RELATIONSHIP_OPTIONS.find(
                          (o) => o.value === values.relationship
                        )
                      : undefined
                  }
                  setSelectedRelationship={(opt?: Option) =>
                    setValue("relationship", opt?.value ?? null)
                  }
                  disabled={!isEditing}
                />
              ) : (
                <View className="flex-row gap-4 items-center justify-start">
                  <AntDesign name="team" size={24} color="#438BF7" />
                  <Input
                    value={relationshipLabel ?? "Relationship"}
                    className="bg-white text-black font-bold border-gray-200 w-[160px]"
                    editable={false}
                  />
                </View>
              )}

              {/* Distribution */}
              <DistributionCheckbox
                isWhatsappChecked={values.distributions.includes("WHATSAPP")}
                setIsWhatsappChecked={(checked) => {
                  if (!isEditing) return;
                  const next = checked
                    ? [...values.distributions, "WHATSAPP"]
                    : values.distributions.filter((d) => d !== "WHATSAPP");
                  setValue(
                    "distributions",
                    Array.from(
                      new Set(["EMAIL", ...next])
                    ) as FormValues["distributions"]
                  );
                }}
                isSMSChecked={values.distributions.includes("SMS")}
                setIsSMSChecked={(checked) => {
                  if (!isEditing) return;
                  const next = checked
                    ? [...values.distributions, "SMS"]
                    : values.distributions.filter((d) => d !== "SMS");
                  setValue(
                    "distributions",
                    Array.from(
                      new Set(["EMAIL", ...next])
                    ) as FormValues["distributions"]
                  );
                }}
                disabled={!isEditing}
              />

              {/* Dim overlay in view mode */}
              {!isEditing && (
                <View
                  pointerEvents="none"
                  className="absolute inset-0 bg-white/40 rounded-xl"
                />
              )}
            </Card>

            {/* Footer button */}
            <Button
              className="w-[80%] self-center bg-red-500"
              onPress={onDelete}
              disabled={!isEditing || isCheckingDelete}
            >
              {isCheckingDelete ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="font-bold text-white">DELETE</Text>
              )}
            </Button>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}
