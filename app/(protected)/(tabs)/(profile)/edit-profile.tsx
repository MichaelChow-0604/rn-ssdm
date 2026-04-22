import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { BackButton } from "~/components/back-button";
import { Controller } from "react-hook-form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useEditProfileForm } from "~/hooks/use-edit-profile-form";
import { GetProfileResponse } from "~/lib/http/response-type/profile";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "~/lib/http/endpoints/profile";
import { LoadingOverlay } from "~/components/loading-overlay";
import { ProfileAvatar } from "~/components/profile-avatar";

export default function EditProfile() {
  const { data: profile } = useQuery<GetProfileResponse>({
    queryKey: ["profile", "get"],
    queryFn: getProfile,
  });

  const {
    form,
    profilePic,
    handlePickImage,
    onSave,
    isUpdatingProfile,
    setProfilePic,
  } = useEditProfileForm({
    profile,
  });

  return (
    <SafeAreaView className="flex-1 bg-blue-100">
      {/* Curved blue topper */}
      <View className="h-[40%] bg-[#438BF7] rounded-b-[20px] absolute top-0 left-0 right-0" />

      <KeyboardAvoidingView
        className="flex-1 items-start px-4"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        <BackButton className="absolute top-4 left-4 z-50" />

        <ScrollView className="w-full" showsVerticalScrollIndicator={false}>
          <LoadingOverlay
            visible={isUpdatingProfile}
            label="Updating profile..."
            onDismiss={() => {}}
          />

          {/* Profile pic */}
          <View className="flex items-center justify-center w-full gap-1 flex-col pt-20 pb-10">
            <ProfileAvatar
              source={profilePic}
              isEditable={true}
              onSelectImage={handlePickImage}
              onRemoveImage={() => setProfilePic(null)}
            />

            {/* Preview current name while editing */}
            <Text className="text-xl font-bold text-white">
              {`${form.watch("firstName") || ""} ${
                form.watch("lastName") || ""
              }`.trim()}
            </Text>
          </View>

          {/* Form section */}
          <Card className="w-full bg-white p-4 rounded-xl gap-4 mb-16 px-6 border-gray-200">
            {/* Title */}
            <View className="py-2">
              <Text className="text-xl font-bold text-gray-600">
                Edit Profile
              </Text>
            </View>

            {/* First Name */}
            <View className="flex-col gap-3">
              <View className="flex-col gap-1">
                <View className="flex-row gap-0.5">
                  <Label className="text-gray-500">First Name</Label>
                  <Text className="text-red-500 font-semibold ">*</Text>
                </View>
                <Controller
                  name="firstName"
                  control={form.control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      className="bg-white text-black border-gray-200"
                      placeholder="First name"
                      onChangeText={onChange}
                      autoCorrect={false}
                      onBlur={onBlur}
                      value={value}
                    />
                  )}
                />
                {form.formState.errors.firstName && (
                  <Text className="text-red-500">
                    {form.formState.errors.firstName.message}
                  </Text>
                )}
              </View>

              {/* Last Name */}
              <View className="flex-col gap-1">
                <View className="flex-row gap-0.5">
                  <Label className="text-gray-500">Last Name</Label>
                  <Text className="text-red-500 font-semibold">*</Text>
                </View>
                <Controller
                  name="lastName"
                  control={form.control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      className="bg-white text-black border-gray-200"
                      placeholder="Last name"
                      onChangeText={onChange}
                      autoCorrect={false}
                      onBlur={onBlur}
                      value={value}
                    />
                  )}
                />
                {form.formState.errors.lastName && (
                  <Text className="text-red-500">
                    {form.formState.errors.lastName.message}
                  </Text>
                )}
              </View>
            </View>

            <Button className="bg-button w-[40%] mx-auto my-4" onPress={onSave}>
              <Text className="text-white font-bold">SAVE</Text>
            </Button>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
