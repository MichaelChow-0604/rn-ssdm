import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "~/components/back-button";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApiMutation } from "~/lib/http/use-api-mutation";
import { DeleteUserPayload } from "~/lib/http/request-type/profile";
import { DeleteUserResponse } from "~/lib/http/response-type/profile";
import { deleteUser } from "~/lib/http/endpoints/profile";
import { router } from "expo-router";
import { toast } from "sonner-native";
import { useTokenStore } from "~/store/use-token-store";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "~/context/auth-context";

const schema = z.object({
  password: z.string().min(1, { message: "Password is required" }),
});
type FormFields = z.infer<typeof schema>;

export default function DeleteConfirm() {
  const { tokens, clearTokens } = useTokenStore();
  const { setIsAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const methods = useForm<FormFields>({
    defaultValues: {
      password: "",
    },
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const deleteMutation = useApiMutation<DeleteUserResponse, DeleteUserPayload>({
    mutationKey: ["profile", "delete"],
    mutationFn: deleteUser,
    onSuccess: () => {
      router.replace("/account-deleted");
      queryClient.clear();
      clearTokens();
      setIsAuthenticated(false);
    },
    onError: ({ status }) => {
      if (status === 400) {
        toast.error("Invalid password. Please try again.");
        return;
      }
      toast.error("Failed to delete account. Please try again later.");
    },
  });

  const isDeleting = deleteMutation.isPending;

  const onSubmit = (data: FormFields) => {
    Keyboard.dismiss();
    deleteMutation.mutate({ email: tokens.email, password: data.password });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center gap-2 px-4 pt-4 pb-8">
        <BackButton />
        <Text className="text-2xl font-bold">Delete Confirmation</Text>
      </View>

      {/* Content */}
      <KeyboardAvoidingView
        className="flex-1 justify-center gap-8 mb-12"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        <View className="flex-col items-center gap-6 w-[85%] mx-auto">
          {/* Icon */}
          <View className="h-20 w-20 bg-red-200 rounded-full flex items-center justify-center">
            <MaterialCommunityIcons
              name="delete-forever"
              size={40}
              color="red"
            />
          </View>

          {/* WARNING */}
          <View className="flex-col items-center gap-4">
            <View className="flex-col items-center">
              <Text className="text-red-500 font-bold text-2xl">WARNING</Text>
              <Text className="text-center text-lg font-semibold">
                This is permanent and cannot be undone!
              </Text>
            </View>

            <Text className="text-center">
              All of your information will be immediately deleted. All document
              you uploaded or received will also be deleted.
            </Text>
          </View>
        </View>

        {/* Password Input */}
        <View className="flex-col items-center gap-2 mt-4">
          <Text className="font-bold text-lg">
            Enter Password to verify your identity
          </Text>

          <Controller
            name="password"
            control={methods.control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                className="w-[80%] bg-gray-100 border-gray-300 text-black"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                secureTextEntry
              />
            )}
          />
          {errors.password && (
            <Text className="text-redtext text-sm mt-2">
              {errors.password.message}
            </Text>
          )}
        </View>

        {/* Delete Button */}
        <Button
          className="bg-red-500 w-[80%] mx-auto"
          onPress={handleSubmit(onSubmit)}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white font-bold">CONFIRM</Text>
          )}
        </Button>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
