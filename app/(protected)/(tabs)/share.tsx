import { View, Text, Image, Keyboard } from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { shareSchema } from "~/schema/share-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { AccessProgressDialog } from "~/components/pop-up/access-progress";
import { useShareUnlock } from "~/hooks/use-share-unlock";
import {
  downloadDocument,
  DownloadedBlob,
} from "~/lib/http/endpoints/document";
import { useApiMutation } from "~/lib/http/use-api-mutation";
import { DownloadDocumentPayload } from "~/lib/http/request-type/document";
import { toast } from "sonner-native";

type ShareFormFields = z.infer<typeof shareSchema>;

export default function ShareTab() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ShareFormFields>({
    resolver: zodResolver(shareSchema),
    defaultValues: {
      cidPin: "",
      passcode: "",
    },
  });

  const downloadMutation = useApiMutation<
    DownloadedBlob,
    DownloadDocumentPayload
  >({
    mutationKey: ["document", "download"],
    mutationFn: downloadDocument,
    onSuccess: ({ fileName, blob }) => {
      completeWithBlob(blob, fileName);
    },
    onError: ({ status }) => {
      switch (status) {
        case 400:
          toast.error("Invalid passcode.");
          break;
        case 404:
          toast.error("Document not found.");
          break;
        default:
          toast.error("Something went wrong. Please try again later.");
      }
      cancel();
    },
  });

  const {
    dialogOpen,
    dialogText,
    dialogStatus,
    onDialogDismiss,
    beginPending,
    completeWithBlob,
    cancel,
  } = useShareUnlock();

  // For temporary testing & demo
  const onSubmit = (_data: ShareFormFields) => {
    Keyboard.dismiss();

    beginPending();

    downloadMutation.mutate({
      cid: _data.cidPin,
      passcode: _data.passcode,
    });
  };

  useFocusEffect(
    useCallback(() => {
      // do nothing on focus
      return () => {
        reset(); // clears values + errors on unmount
      };
    }, [reset])
  );

  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Image
        source={require("~/assets/images/share_lock.png")}
        className="w-12 h-12"
      />
      <Text className="text-center py-4">
        This document is Passcode protected,{"\n"}Please input following
        information to access:
      </Text>

      {/* Input */}
      <View className="w-[70%] flex-col gap-4">
        {/* CID Pin */}
        <View className="flex-col gap-1">
          <View className="flex-row items-center">
            <Text className="w-[80px] text-center font-bold">CID</Text>
            <Controller
              name="cidPin"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  className="bg-gray-100 text-black flex-1 border-gray-200"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  lineBreakModeIOS="tail"
                />
              )}
            />
          </View>

          {errors.cidPin && (
            <Text className="text-red-500 ml-[80px]">
              {errors.cidPin.message}
            </Text>
          )}
        </View>

        {/* Passcode */}
        <View className="flex-col gap-1">
          <View className="flex-row items-center">
            <Text className="w-[80px] text-center font-bold">Passcode</Text>
            <Controller
              name="passcode"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  className="bg-gray-100 text-black flex-1 border-gray-200"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCorrect={false}
                  value={value}
                />
              )}
            />
          </View>

          {errors.passcode && (
            <Text className="text-red-500 ml-[80px]">
              {errors.passcode.message}
            </Text>
          )}
        </View>
      </View>

      {/* Button */}
      <Button
        className="bg-button w-[50%] mt-8"
        onPress={handleSubmit(onSubmit)}
      >
        <Text className="text-white font-bold">VERIFY</Text>
      </Button>

      <AccessProgressDialog
        visible={dialogOpen}
        text={dialogText}
        status={dialogStatus}
        onDismiss={onDialogDismiss}
      />
    </View>
  );
}
