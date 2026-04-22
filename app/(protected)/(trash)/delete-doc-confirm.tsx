import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { CANCEL, VERIFY } from "~/constants/auth-placeholders";
import { Input } from "~/components/ui/input";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useQueryClient } from "@tanstack/react-query";
import { useApiMutation } from "~/lib/http/use-api-mutation";
import { DeleteDocumentResponse } from "~/lib/http/response-type/document";
import { deleteDocument } from "~/lib/http/endpoints/document";
import { toast } from "sonner-native";
import { DeleteDocumentPayload } from "~/lib/http/request-type/document";
import { documentKeys } from "~/lib/http/keys/document";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  password: z.string().min(1, { message: "Password is required" }),
});
type FormFields = z.infer<typeof schema>;

export default function DeleteDocConfirm() {
  const { documentId } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    defaultValues: { password: "" },
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const deleteMutation = useApiMutation<
    DeleteDocumentResponse,
    DeleteDocumentPayload
  >({
    mutationKey: ["document", "delete"],
    mutationFn: deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.list() });
      router.replace("/trash");
      toast.success("Document deleted successfully.", {
        position: "bottom-center",
      });
    },
    onError: ({ status }) => {
      switch (status) {
        // Wrong password
        case 403:
          toast.error("Invalid password.");
          break;
        // Server error
        default:
          toast.error("Failed to delete document. Please try again later.");
      }
    },
  });

  const isDeletingDocument = deleteMutation.isPending;

  const onSubmit = ({ password }: FormFields) => {
    Keyboard.dismiss();
    deleteMutation.mutate({ id: documentId as string, password });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          className="flex-1 items-center px-8 justify-center"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={0}
        >
          {/* Header */}
          <FontAwesome5 name="user-shield" size={100} color="#438BF7" />
          <Text className="text-4xl font-bold py-4">Verification</Text>

          {/* Description */}
          <Text className="text-subtitle text-center text-lg">
            Enter your password to continue
          </Text>

          {/* OTP Input */}
          <View className="w-full my-8">
            <Controller
              name="password"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Enter your password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                  autoCorrect={false}
                  autoCapitalize="none"
                  className="w-full bg-white border-gray-200 text-black"
                />
              )}
            />
            {errors.password && (
              <Text className="text-redtext text-sm mt-2">
                {errors.password.message}
              </Text>
            )}
          </View>

          {/* Verify Button */}
          <View className="flex flex-col gap-4 w-full">
            <Button
              className="bg-button text-buttontext"
              onPress={handleSubmit(onSubmit)}
              disabled={isDeletingDocument}
            >
              {isDeletingDocument ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white font-bold">{VERIFY}</Text>
              )}
            </Button>

            {/* Cancel Button */}
            <Button
              className="border-button bg-white active:bg-slate-100"
              variant="outline"
              onPress={() => router.replace("/trash")}
            >
              <Text className="text-button font-bold">{CANCEL}</Text>
            </Button>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
