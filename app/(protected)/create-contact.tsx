import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { BackButton } from "~/components/back-button";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Card, CardHeader } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  Option,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Checkbox } from "~/components/ui/checkbox";
import { useState } from "react";
import { newContactSchema } from "~/schema/new-contact-schema";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import * as ImagePicker from "expo-image-picker";

type NewContactFormFields = z.infer<typeof newContactSchema>;

export default function CreateContact() {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isWhatsappChecked, setIsWhatsappChecked] = useState(false);
  const [isSMSChecked, setIsSMSChecked] = useState(false);
  const [selectedRelationship, setSelectedRelationship] = useState<Option>();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setProfilePic(result.assets[0].uri);
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      mobileNumber: "",
      email: "",
    },
    resolver: zodResolver(newContactSchema),
  });

  const onSubmit = (data: NewContactFormFields) => {
    console.log(data, selectedRelationship, isWhatsappChecked, isSMSChecked);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Curved blue topper */}
      <View className="h-[40%] bg-[#438BF7] rounded-br-[200px] absolute top-0 left-0 right-0" />

      <KeyboardAvoidingView
        className="flex-1 items-start px-4"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View className="flex-row gap-2 items-center my-8 justify-start w-full">
          <BackButton />
          <Text className="text-2xl font-semibold text-white">
            Create new contact
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            className="ml-auto bg-white py-2 px-4 rounded-lg"
          >
            <Text className="text-lg font-semibold text-button">Edit</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="bg-transparent w-full">
          {/* Profile pic */}
          <View className="h-[15%] flex items-center justify-center w-full gap-1 flex-col">
            {/* Profile pic box */}
            <View className="w-24 h-24 relative">
              <TouchableOpacity
                className="rounded-full"
                activeOpacity={0.8}
                onPress={pickImage}
              >
                <Image
                  source={
                    profilePic
                      ? { uri: profilePic }
                      : require("~/assets/images/anna.png")
                  }
                  className="w-24 h-24 rounded-full text-black"
                />
                <View className="bg-white rounded-full absolute p-1 bottom-0 right-[-2]">
                  <FontAwesome6 name="pen" size={12} color="black" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Form section */}
          <Card className="w-full bg-white p-4 rounded-xl mt-8 gap-4">
            <CardHeader className="py-2">
              <Text className="text-lg font-semibold text-center text-button">
                **All fields are required**
              </Text>
            </CardHeader>

            {/* Name */}
            <View className="flex-row gap-4 items-center justify-start">
              <AntDesign name="user" size={24} color="#438BF7" />
              <View className="flex-1 gap-4">
                <View className="flex-col gap-1">
                  {/* First Name input validation */}
                  <Controller
                    name="firstName"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        className="bg-white text-black"
                        placeholderClassName="text-placeholder"
                        placeholder="First name"
                      />
                    )}
                  />
                  {/* First Name validation error */}
                  {errors.firstName && (
                    <Text className="text-redtext text-sm">
                      {errors.firstName.message}
                    </Text>
                  )}
                </View>

                {/* Last Name input validation */}
                <View className="flex-col gap-1">
                  <Controller
                    name="lastName"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        className="bg-white text-black"
                        placeholderClassName="text-placeholder"
                        placeholder="Last name"
                      />
                    )}
                  />

                  {/* Last Name validation error */}
                  {errors.lastName && (
                    <Text className="text-redtext text-sm">
                      {errors.lastName.message}
                    </Text>
                  )}
                </View>
              </View>
            </View>

            {/* Mobile number */}
            <View className="flex-row gap-4 items-center justify-start">
              <AntDesign name="phone" size={24} color="#438BF7" />
              <View className="flex-col gap-1 flex-1">
                <Controller
                  name="mobileNumber"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      keyboardType="number-pad"
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      className="bg-white text-black"
                      placeholder="Mobile number"
                    />
                  )}
                />

                {/* Mobile number validation error */}
                {errors.mobileNumber && (
                  <Text className="text-redtext text-sm">
                    {errors.mobileNumber.message}
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
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder="Email"
                      className="bg-white text-black"
                    />
                  )}
                />

                {/* Email validation error */}
                {errors.email && (
                  <Text className="text-redtext text-sm">
                    {errors.email.message}
                  </Text>
                )}
              </View>
            </View>

            {/* Relationship */}
            <View className="flex-row gap-4 items-center justify-start">
              <AntDesign name="team" size={24} color="#438BF7" />
              <Select
                defaultValue={{ label: "Family", value: "family" }}
                value={selectedRelationship}
                onValueChange={setSelectedRelationship}
              >
                <SelectTrigger className="bg-white w-[160px]">
                  <SelectValue
                    className="text-black font-medium text-lg"
                    placeholder="Relationship"
                  />
                </SelectTrigger>
                <SelectContent className="w-[160px] bg-white">
                  <SelectGroup>
                    <SelectItem label="Family" value="family">
                      Family
                    </SelectItem>
                    <SelectItem label="Friend" value="friend">
                      Friend
                    </SelectItem>
                    <SelectItem label="Partner" value="partner">
                      Partner
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </View>

            {/* Distributon method */}
            <View className="flex-row gap-4 items-center justify-start">
              <AntDesign name="notification" size={24} color="#438BF7" />
              <View className="flex-col gap-2">
                <View className="flex-row gap-2 items-center justify-start">
                  <Checkbox
                    checked={true}
                    onCheckedChange={() => {}}
                    className="native:h-[16] native:w-[16] native:rounded-sm border-subtitle bg-subtitle"
                  />
                  <Text className="text-black font-semibold text-lg">
                    Email (Default)
                  </Text>
                </View>
                <View className="flex-row gap-2 items-center justify-start">
                  <Checkbox
                    checked={isWhatsappChecked}
                    onCheckedChange={setIsWhatsappChecked}
                    className={`native:h-[16] native:w-[16] native:rounded-sm border-subtitle ${
                      isWhatsappChecked
                        ? "bg-button border-button"
                        : "bg-white border-subtitle"
                    }`}
                  />
                  <Text className="text-black font-semibold text-lg">
                    Whatsapp
                  </Text>
                </View>
                <View className="flex-row gap-2 items-center justify-start">
                  <Checkbox
                    checked={isSMSChecked}
                    onCheckedChange={setIsSMSChecked}
                    className={`native:h-[16] native:w-[16] native:rounded-sm border-subtitle ${
                      isSMSChecked
                        ? "bg-button border-button"
                        : "bg-white border-subtitle"
                    }`}
                  />
                  <Text className="text-black font-semibold text-lg">SMS</Text>
                </View>
              </View>
            </View>
          </Card>

          {/* Create button */}
          <Button
            className="w-[80%] self-center my-8 bg-button text-white"
            onPress={handleSubmit(onSubmit)}
          >
            <Text className="font-bold text-white">SAVE</Text>
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
