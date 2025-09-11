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
import { Option } from "~/components/ui/select";
import { useEffect, useState } from "react";
import { newContactSchema } from "~/schema/new-contact-schema";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import { router } from "expo-router";
import { RelationshipSelect } from "~/components/contact/relationship-select";
import { DistributionCheckbox } from "~/components/contact/distribution-checkbox";
import { pickImage } from "~/lib/pick-image";
import PhoneInput, {
  ICountry,
  getCountryByCca2,
} from "react-native-international-phone-number";
import { useMutation } from "@tanstack/react-query";
import { createContact } from "~/lib/http/endpoints/contact";
import { toast } from "sonner-native";
import { beautifyResponse } from "~/lib/utils";

type NewContactFormFields = z.infer<typeof newContactSchema>;

export default function CreateContactPage() {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isWhatsappChecked, setIsWhatsappChecked] = useState(false);
  const [isSMSChecked, setIsSMSChecked] = useState(false);
  const [selectedRelationship, setSelectedRelationship] = useState<Option>({
    label: "Family",
    value: "FAMILY",
  });

  const createContactMutation = useMutation({
    mutationKey: ["contact", "create"],
    mutationFn: createContact,
    onSuccess: (data) => {
      router.back();
      console.log(beautifyResponse(data));
    },
    onError: () =>
      toast.error("Failed to create contact. Please try again later."),
  });

  const isCreatingContact =
    createContactMutation.isPending || createContactMutation.isSuccess;

  const onSubmit = (data: NewContactFormFields) => {
    // E.g. +852 1234 5678
    const country = selectedCountry ?? getCountryByCca2("HK");
    const phoneNumber = `${country?.idd?.root ?? ""} ${data.phone}`;

    const distributions: ("EMAIL" | "WHATSAPP" | "SMS")[] = ["EMAIL"];
    if (isWhatsappChecked) distributions.push("WHATSAPP");
    if (isSMSChecked) distributions.push("SMS");

    createContactMutation.mutate({
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      phone: phoneNumber.replace(/ /g, ""),
      email: data.email.trim(),
      relationship: selectedRelationship?.value ?? "",
      communication_option: distributions,
    });
  };

  const handlePickImage = async () => {
    const uri = await pickImage();
    if (uri) setProfilePic(uri);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
    },
    resolver: zodResolver(newContactSchema),
  });

  const [selectedCountry, setSelectedCountry] = useState<ICountry | undefined>(
    undefined
  );

  function handleSelectedCountry(country: ICountry) {
    setSelectedCountry(country);
  }

  useEffect(() => {
    if (!selectedCountry) setSelectedCountry(getCountryByCca2("HK"));
  }, [selectedCountry]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Curved blue topper */}
      <View className="h-[40%] bg-[#438BF7] rounded-br-[200px] absolute top-0 left-0 right-0" />

      <KeyboardAvoidingView
        className="flex-1 items-start px-4"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View className="flex-row gap-4 items-center my-8 justify-start w-full">
          <BackButton />
          <Text className="text-2xl font-semibold text-white">
            Create new contact
          </Text>
        </View>

        <ScrollView className="bg-transparent w-full">
          {/* Profile pic */}
          <View className="h-[15%] flex items-center justify-center w-full gap-1 flex-col">
            {/* Profile pic box */}
            <View className="w-24 h-24 relative">
              <TouchableOpacity
                className="rounded-full"
                activeOpacity={0.8}
                onPress={handlePickImage}
              >
                <Image
                  source={
                    profilePic
                      ? { uri: profilePic }
                      : require("~/assets/images/default_icon.png")
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
          <Card className="w-full bg-white p-4 rounded-xl mt-8 gap-4 border-gray-200">
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
                        onScroll={() => console.log("gg")}
                        scrollEnabled={false}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        autoCorrect={false}
                        className="bg-white text-black border-gray-200"
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
                        autoCorrect={false}
                        className="bg-white text-black border-gray-200"
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
                  name="phone"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <PhoneInput
                      phoneInputStyles={{
                        container: {
                          flex: 1,
                          borderColor: "#e5e7eb",
                        },
                        input: {
                          color: "black",
                        },
                      }}
                      defaultCountry="HK"
                      placeholder="Mobile no."
                      value={value}
                      onChangePhoneNumber={onChange}
                      selectedCountry={selectedCountry}
                      onChangeSelectedCountry={handleSelectedCountry}
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
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      autoCorrect={false}
                      placeholder="Email"
                      className="bg-white text-black border-gray-200"
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

            {/* Relationship select dropdown */}
            <RelationshipSelect
              selectedRelationship={selectedRelationship}
              setSelectedRelationship={setSelectedRelationship}
            />

            {/* Distributon method */}
            <DistributionCheckbox
              isWhatsappChecked={isWhatsappChecked}
              setIsWhatsappChecked={setIsWhatsappChecked}
              isSMSChecked={isSMSChecked}
              setIsSMSChecked={setIsSMSChecked}
            />
          </Card>

          {/* Create button */}
          <View className="mt-8 mb-20">
            <Button
              className="w-[80%] self-center bg-button text-white"
              onPress={handleSubmit(onSubmit)}
            >
              <Text className="font-bold text-white">SAVE</Text>
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
