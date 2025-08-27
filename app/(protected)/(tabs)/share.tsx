import { View, Text, Image } from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { shareSchema } from "~/schema/share-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";
import {
  ensureLocalFromAsset,
  openFile,
  resolveFileMeta,
} from "~/lib/open-file";
import { AccessProgressDialog } from "~/components/pop-up/access-progress";

type ShareFormFields = z.infer<typeof shareSchema>;

export default function SharePage() {
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

  const [dialogText, setDialogText] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogStatus, setDialogStatus] = useState<"pending" | "success">(
    "pending"
  );

  const timers = useRef<number[]>([]);

  // For temporary testing & demo
  const onSubmit = async (data: ShareFormFields) => {
    console.log(data);

    // pick any bundled asset
    const fileName = "ssdm.pdf";
    const localUri = await ensureLocalFromAsset(
      require(`~/assets/docs/${fileName}`),
      fileName
    );

    const { mimeType, iosUTI } = resolveFileMeta(fileName);

    const REQUEST_MS = 5000;
    const OPEN_DELAY_MS = 2000;

    setDialogOpen(true);
    setDialogStatus("pending");
    setDialogText("Requesting for access");

    timers.current.push(
      setTimeout(() => {
        setDialogText("Unlock successful!");
        setDialogStatus("success");
      }, REQUEST_MS)
    );

    timers.current.push(
      setTimeout(async () => {
        setDialogOpen(false);
        await openFile({ localUri, mimeType, iosUTI });
      }, REQUEST_MS + OPEN_DELAY_MS)
    );
  };

  useFocusEffect(
    useCallback(() => {
      // do nothing on focus
      return () => {
        reset(); // clears values + errors on unmount
      };
    }, [reset])
  );

  useEffect(() => {
    return () => {
      timers.current.forEach((timer) => clearTimeout(timer));
      timers.current = [];
    };
  }, []);

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
            <Text className="w-[80px] text-center font-bold">CID Pin</Text>
            <Controller
              name="cidPin"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  className="bg-gray-100 text-black flex-1 border-gray-200"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
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
      />
    </View>
  );
}
