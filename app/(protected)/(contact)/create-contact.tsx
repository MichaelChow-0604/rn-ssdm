import {
  Text,
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
import { Controller } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { RelationshipSelect } from "~/components/contact/relationship-select";
import { DistributionCheckbox } from "~/components/contact/distribution-checkbox";
import PhoneInput from "react-native-international-phone-number";
import { useCreateContactForm } from "~/hooks/contact/use-create-contact-form";
import { ProfileAvatar } from "~/components/profile-avatar";

export default function CreateContactPage() {
  const {
    control,
    errors,
    profilePic,
    setProfilePic,
    handlePickImage,
    isWhatsappChecked,
    setIsWhatsappChecked,
    isSMSChecked,
    setIsSMSChecked,
    selectedRelationship,
    setSelectedRelationship,
    selectedCountry,
    handleSelectedCountry,
    handleSubmit,
    onSubmit,
    isCreatingContact,
  } = useCreateContactForm();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Curved blue topper */}
      <View className="h-[40%] bg-[#438BF7] rounded-br-[200px] absolute top-0 left-0 right-0" />

      <KeyboardAvoidingView
        className="flex-1 items-start px-4"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
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
            <ProfileAvatar
              source={profilePic}
              isEditable={true}
              onSelectImage={handlePickImage}
              onRemoveImage={() => setProfilePic(null)}
            />
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
                      autoCapitalize="none"
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
              disabled={isCreatingContact}
            >
              {isCreatingContact ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="font-bold text-white">SAVE</Text>
              )}
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
