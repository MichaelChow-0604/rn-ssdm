import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useState } from "react";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { BackButton } from "~/components/back-button";
import { useProfile } from "~/context/profile-context";
import { router } from "expo-router";
import { profileSchema } from "~/schema/profile-schema";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

type ProfileFormFields = z.infer<typeof profileSchema>;

export default function EditProfile() {
  const { profile, updateProfile } = useProfile();
  const [localPic, setLocalPic] = useState<string | null>(profile.profilePic);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ProfileFormFields>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: profile.firstName,
      lastName: profile.lastName,
    },
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setLocalPic(result.assets[0].uri);
    }
  };

  const handleSave = handleSubmit((data) => {
    updateProfile({
      profilePic: localPic ?? null,
      firstName: data.firstName,
      lastName: data.lastName,
    });
    router.back();
  });

  return (
    <SafeAreaView className="flex-1 bg-blue-100">
      {/* Curved blue topper */}
      <View className="h-[40%] bg-[#438BF7] rounded-b-[20px] absolute top-0 left-0 right-0" />

      <KeyboardAvoidingView
        className="flex-1 items-start px-4"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <BackButton className="absolute top-4 left-4 z-50" />

        <ScrollView className="w-full" showsVerticalScrollIndicator={false}>
          {/* Profile pic */}
          <View className="flex items-center justify-center w-full gap-1 flex-col pt-20 pb-10">
            <View className="w-24 h-24 relative">
              <TouchableOpacity
                className="rounded-full"
                activeOpacity={0.8}
                onPress={pickImage}
              >
                <Image
                  source={
                    localPic
                      ? { uri: localPic }
                      : require("~/assets/images/default_icon.png")
                  }
                  className="w-24 h-24 rounded-full text-black"
                />
                <View className="bg-white rounded-full absolute p-1 bottom-0 right-[-2]">
                  <FontAwesome6 name="pen" size={12} color="black" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Preview current name while editing */}
            <Text className="text-xl font-bold text-white">
              {`${watch("firstName") || ""} ${watch("lastName") || ""}`.trim()}
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

            <View className="flex-col gap-3">
              <View className="flex-col gap-1">
                <View className="flex-row gap-0.5">
                  <Label className="text-gray-500">First Name</Label>
                  <Text className="text-red-500 font-semibold ">*</Text>
                </View>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      className="bg-white text-black border-gray-200"
                      placeholder="First name"
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                    />
                  )}
                />
                {errors.firstName && (
                  <Text className="text-red-500">
                    {errors.firstName.message}
                  </Text>
                )}
              </View>

              <View className="flex-col gap-1">
                <View className="flex-row gap-0.5">
                  <Label className="text-gray-500">Last Name</Label>
                  <Text className="text-red-500 font-semibold">*</Text>
                </View>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      className="bg-white text-black border-gray-200"
                      placeholder="Last name"
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                    />
                  )}
                />
                {errors.lastName && (
                  <Text className="text-red-500">
                    {errors.lastName.message}
                  </Text>
                )}
              </View>
            </View>

            <Button
              className="bg-button w-[40%] mx-auto my-4"
              onPress={handleSave}
            >
              <Text className="text-white font-bold">SAVE</Text>
            </Button>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
