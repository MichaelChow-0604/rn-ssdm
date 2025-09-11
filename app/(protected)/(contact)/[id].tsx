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
import { useEffect, useMemo, useState } from "react";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import { router, useLocalSearchParams } from "expo-router";
import { updateContact } from "~/lib/storage/contact";
import { newContactSchema } from "~/schema/new-contact-schema";
import { pickImage } from "~/lib/pick-image";
import { useContactDetail } from "~/hooks/use-contact-detail";
import { fullName } from "~/lib/contacts/utils";
import { RelationshipSelect } from "~/components/contact/relationship-select";
import { DistributionCheckbox } from "~/components/contact/distribution-checkbox";
import { RELATIONSHIP_OPTIONS } from "~/constants/select-data";
import PhoneInput, {
  ICountry,
  getCountryByCca2,
  getCountryByPhoneNumber,
} from "react-native-international-phone-number";

const detailSchema = newContactSchema.extend({
  profilePicUri: z.string().nullable().optional(),
  relationship: z.string().nullable().optional(),
  distributions: z.array(z.enum(["EMAIL", "WHATSAPP", "SMS"])).min(1),
});

type FormValues = z.infer<typeof detailSchema>;

export default function ContactDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<ICountry | undefined>(
    undefined
  );

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      profilePicUri: null,
      relationship: null,
      distributions: ["EMAIL"],
    },
    resolver: zodResolver(detailSchema), // use the matching schema
  });

  // Load contact on focus
  const { contact, reload } = useContactDetail(String(id));

  useEffect(() => {
    if (!contact) return;

    const country = getCountryByPhoneNumber(contact.phone);
    setSelectedCountry(country);

    const national = country?.idd?.root
      ? contact.phone.replace(country.idd.root, "")
      : contact.phone;

    reset({
      firstName: contact.firstName,
      lastName: contact.lastName,
      phone: national,
      email: contact.email,
      profilePicUri: contact.profilePicUri ?? null,
      relationship: contact.relationship ?? null,
      distributions: contact.distributions?.length
        ? contact.distributions
        : ["EMAIL"],
    });
    setIsEditing(false);
  }, [contact, reset]);

  const values = watch();
  const title = useMemo(
    () => (contact ? fullName(contact) : "Contact"),
    [contact]
  );

  const relationshipLabel = useMemo(() => {
    if (!values.relationship) return undefined;
    return RELATIONSHIP_OPTIONS.find((o) => o.value === values.relationship)
      ?.label;
  }, [values.relationship]);

  const handlePickImage = async () => {
    const uri = await pickImage();
    if (uri) setValue("profilePicUri", uri);
  };

  const onSave = handleSubmit(async (data) => {
    if (!contact) return;

    const phoneNumber = `${selectedCountry?.idd?.root ?? ""} ${
      data.phone
    }`.replace(/ /g, "");

    const unique = Array.from(
      new Set(["email", ...data.distributions])
    ) as FormValues["distributions"];

    await updateContact(contact.id, {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      phone: phoneNumber,
      email: data.email.trim(),
      profilePicUri: data.profilePicUri ?? null,
      relationship: data.relationship ?? null,
      distributions: unique,
    });
    setIsEditing(false);

    await reload();
  });

  async function onDelete() {
    if (!contact) return;
    router.push({
      pathname: "/delete-confirm",
      params: {
        id: contact.id,
      },
    });
  }

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
          <Text className="text-2xl font-semibold text-white">{title}</Text>

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
            <View className="w-24 h-24 relative">
              <TouchableOpacity
                className="rounded-full"
                activeOpacity={isEditing ? 0.8 : 1}
                onPress={handlePickImage}
              >
                <Image
                  source={
                    values.profilePicUri
                      ? { uri: values.profilePicUri }
                      : require("~/assets/images/default_icon.png")
                  }
                  className="w-24 h-24 rounded-full text-black"
                />
                {isEditing && (
                  <View className="bg-white rounded-full absolute p-1 bottom-0 right-[-2]">
                    <FontAwesome6 name="pen" size={12} color="black" />
                  </View>
                )}
              </TouchableOpacity>
            </View>
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
                      placeholder="Mobile number"
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
                    new Set(["email", ...next])
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
            disabled={!isEditing}
          >
            <Text className="font-bold text-white">DELETE</Text>
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
