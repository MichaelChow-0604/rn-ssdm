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
import { useCallback, useMemo, useState } from "react";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import {
  getContact,
  updateContact,
  StoredContact,
} from "~/lib/storage/contact";
import { newContactSchema } from "~/schema/new-contact-schema";

const detailSchema = newContactSchema.extend({
  profilePicUri: z.string().nullable().optional(),
  relationship: z.string().nullable().optional(),
  distributions: z.array(z.enum(["email", "whatsapp", "sms"])).min(1),
});

type FormValues = z.infer<typeof detailSchema>;

function fullName(c: Pick<StoredContact, "firstName" | "lastName">) {
  return `${c.firstName} ${c.lastName}`.trim() || "Contact";
}

export default function ContactDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [contact, setContact] = useState<StoredContact | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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
      mobileNumber: "",
      email: "",
      profilePicUri: null,
      relationship: null,
      distributions: ["email"],
    },
    resolver: zodResolver(detailSchema), // use the matching schema
  });

  // Load contact on focus
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        const c = await getContact(String(id));
        if (!cancelled && c) {
          setContact(c);
          reset({
            firstName: c.firstName,
            lastName: c.lastName,
            mobileNumber: c.mobileNumber,
            email: c.email,
            profilePicUri: c.profilePicUri ?? null,
            relationship: c.relationship ?? null,
            distributions: c.distributions?.length
              ? c.distributions
              : ["email"],
          });
          setIsEditing(false);
        }
      })();
      return () => {
        cancelled = true;
      };
    }, [id, reset])
  );

  const values = watch();
  const title = useMemo(
    () => (contact ? fullName(contact) : "Contact"),
    [contact]
  );

  async function pickImage() {
    if (!isEditing) return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });
    if (!res.canceled) setValue("profilePicUri", res.assets[0].uri);
  }

  const onSave = handleSubmit(async (data) => {
    if (!contact) return;
    // email is mandatory
    const unique = Array.from(
      new Set(["email", ...data.distributions])
    ) as FormValues["distributions"];
    await updateContact(contact.id, {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      mobileNumber: data.mobileNumber.trim(),
      email: data.email.trim(),
      profilePicUri: data.profilePicUri ?? null,
      relationship: data.relationship ?? null,
      distributions: unique,
    });
    setIsEditing(false);
    // reload to reflect stored normalization
    const fresh = await getContact(contact.id);
    if (fresh) {
      setContact(fresh);
      reset({
        firstName: fresh.firstName,
        lastName: fresh.lastName,
        mobileNumber: fresh.mobileNumber,
        email: fresh.email,
        profilePicUri: fresh.profilePicUri ?? null,
        relationship: fresh.relationship ?? null,
        distributions: fresh.distributions,
      });
    }
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

  const isChecked = (k: "email" | "whatsapp" | "sms") =>
    values.distributions.includes(k);
  const toggle = (k: "email" | "whatsapp" | "sms") => {
    if (!isEditing || k === "email") return;
    const next = isChecked(k)
      ? values.distributions.filter((d) => d !== k)
      : [...values.distributions, k];
    setValue(
      "distributions",
      Array.from(new Set(["email", ...next])) as FormValues["distributions"]
    );
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
                onPress={pickImage}
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
          <Card className="w-full bg-white p-4 rounded-xl mt-8 mb-6 gap-4 relative">
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
                        placeholder="First name"
                        className="bg-white text-black"
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
                        placeholder="Last name"
                        className="bg-white text-black"
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
                  name="mobileNumber"
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      keyboardType="number-pad"
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder="Mobile number"
                      className="bg-white text-black"
                      editable={isEditing}
                    />
                  )}
                />
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
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder="Email"
                      className="bg-white text-black"
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
            <View className="flex-row gap-4 items-center justify-start">
              <AntDesign name="team" size={24} color="#438BF7" />
              <Select
                value={
                  values.relationship
                    ? {
                        label:
                          values.relationship.charAt(0).toUpperCase() +
                          values.relationship.slice(1),
                        value: values.relationship,
                      }
                    : undefined
                }
                onValueChange={(opt?: Option) =>
                  setValue("relationship", opt?.value ?? null)
                }
              >
                <SelectTrigger
                  className="bg-white w-[160px]"
                  disabled={!isEditing}
                >
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

            {/* Distribution */}
            <View className="flex-row gap-4 items-center justify-start">
              <AntDesign name="notification" size={24} color="#438BF7" />
              <View className="flex-col gap-2">
                {(["email", "whatsapp", "sms"] as const).map((k) => (
                  <View key={k} className="flex-row gap-2 items-center">
                    {k === "email" ? (
                      <Checkbox
                        checked
                        onCheckedChange={() => {}}
                        className="native:h-[16] native:w-[16] native:rounded-sm border-subtitle bg-subtitle"
                      />
                    ) : (
                      <Checkbox
                        checked={isChecked(k)}
                        onCheckedChange={() => toggle(k)}
                        disabled={!isEditing}
                        className={`native:h-[16] native:w-[16] native:rounded-sm border-subtitle ${
                          isChecked(k)
                            ? "bg-button border-button"
                            : "bg-white border-subtitle"
                        }`}
                      />
                    )}
                    <Text className="text-black font-semibold text-lg">
                      {
                        (
                          {
                            email: "Email (necessary)",
                            whatsapp: "Whatsapp",
                            sms: "SMS",
                          } as const
                        )[k]
                      }
                    </Text>
                  </View>
                ))}
              </View>
            </View>

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
