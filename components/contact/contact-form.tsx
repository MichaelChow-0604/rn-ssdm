import { View, Text, Image, TouchableOpacity } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import * as z from "zod";

import { Card, CardHeader } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Checkbox } from "~/components/ui/checkbox";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  type Option,
} from "~/components/ui/select";

// Schema aligned with form fields
export const contactFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  mobileNumber: z.string().min(1, "Mobile number is required"),
  email: z.string().email("Invalid email address"),
  profilePicUri: z.string().nullable().optional(),
  relationship: z.string().nullable().optional(),
  distributions: z.array(z.enum(["email", "whatsapp", "sms"])).min(1),
});

export interface ContactFormValues extends z.infer<typeof contactFormSchema> {}

interface ContactFormProps {
  mode: "create" | "edit" | "view";
  initialValues: ContactFormValues;
  onSubmit?: (vals: ContactFormValues) => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
}

export function ContactForm({
  mode,
  initialValues,
  onSubmit,
  onDelete,
}: ContactFormProps) {
  const editable = mode !== "view";

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ContactFormValues>({
    defaultValues: initialValues,
    resolver: zodResolver(contactFormSchema),
  });

  const values = watch();

  async function pickImage() {
    if (!editable) return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });
    if (!res.canceled) setValue("profilePicUri", res.assets[0].uri);
  }

  const isChecked = (k: "email" | "whatsapp" | "sms") =>
    values.distributions.includes(k);
  const toggle = (k: "email" | "whatsapp" | "sms") => {
    if (!editable || k === "email") return;
    const next = isChecked(k)
      ? values.distributions.filter((d) => d !== k)
      : [...values.distributions, k];
    setValue(
      "distributions",
      Array.from(
        new Set(["email", ...next])
      ) as ContactFormValues["distributions"]
    );
  };

  return (
    <View className="w-full">
      {/* Avatar */}
      <View className="h-[15%] flex items-center justify-center w-full gap-1 flex-col">
        <View className="w-24 h-24 relative">
          <TouchableOpacity
            className="rounded-full"
            activeOpacity={editable ? 0.8 : 1}
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
            {editable && (
              <View className="bg-white rounded-full absolute p-1 bottom-0 right-[-2]">
                <FontAwesome6 name="pen" size={12} color="black" />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Form section */}
      <Card className="w-full bg-white p-4 rounded-xl mt-8 gap-4 relative">
        <CardHeader className="py-2">
          {mode === "create" ? (
            <Text className="text-lg font-semibold text-center text-button">
              All fields are required
            </Text>
          ) : null}
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
                    editable={editable}
                    placeholder="First name"
                    className="bg-white text-black"
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
                    editable={editable}
                    placeholder="Last name"
                    className="bg-white text-black"
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
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  editable={editable}
                  keyboardType="number-pad"
                  placeholder="Mobile number"
                  className="bg-white text-black"
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
                  editable={editable}
                  placeholder="Email"
                  className="bg-white text-black"
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
                    value: values.relationship,
                    label:
                      values.relationship.charAt(0).toUpperCase() +
                      values.relationship.slice(1),
                  }
                : undefined
            }
            onValueChange={(opt?: Option) =>
              setValue("relationship", opt?.value ?? null)
            }
          >
            <SelectTrigger className="bg-white w-[160px]" disabled={!editable}>
              <SelectValue
                className="text-black font-medium text-lg"
                placeholder="Relationship"
              />
            </SelectTrigger>
            <SelectContent className="w-[160px] bg-white">
              <SelectGroup>
                <SelectItem value="family" label="Family">
                  Family
                </SelectItem>
                <SelectItem value="friend" label="Friend">
                  Friend
                </SelectItem>
                <SelectItem value="partner" label="Partner">
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
                    disabled={!editable}
                    className={`native:h-[16] native:w-[16] native:rounded-sm border-subtitle ${
                      isChecked(k)
                        ? "bg-button border-button"
                        : "bg-white border-subtitle"
                    }`}
                  />
                )}
                <Text className="text-black font-semibold text-lg">
                  {k === "email" ? "Email (Default)" : k.toUpperCase()}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Dim overlay in view mode */}
        {!editable && (
          <View
            pointerEvents="none"
            className="absolute inset-0 bg-white/40 rounded-xl"
          />
        )}
      </Card>

      {/* Primary action */}
      {mode === "view" ? (
        <Button
          className="w-[80%] self-center my-8 bg-red-500"
          onPress={() => onDelete?.()}
        >
          <Text className="font-bold text-white">DELETE</Text>
        </Button>
      ) : (
        <Button
          className="w-[80%] self-center my-8 bg-button"
          onPress={handleSubmit((vals) => {
            // ensure email is always included
            const uniq = Array.from(
              new Set(["email", ...vals.distributions])
            ) as ContactFormValues["distributions"];
            onSubmit?.({ ...vals, distributions: uniq });
          })}
        >
          <Text className="font-bold text-white">
            {mode === "edit" ? "SAVE" : "CREATE"}
          </Text>
        </Button>
      )}
    </View>
  );
}
