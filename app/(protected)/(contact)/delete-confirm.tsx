import { router, useLocalSearchParams } from "expo-router";
import { View, Text, Image } from "react-native";
import { Button } from "~/components/ui/button";
import { removeContact } from "~/lib/storage/contact";

export default function DeleteConfirm() {
  const { id } = useLocalSearchParams();

  async function handleDelete() {
    await removeContact(id as string);
    router.replace("/contact-list");
  }

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Image
        source={require("~/assets/images/delete_alert.png")}
        className="w-20 h-20 my-4"
      />
      <Text className="text-xl font-semibold text-center w-[80%]">
        Are you sure you want to delete this contact person?
      </Text>
      <View className="flex-col gap-4 pt-8 w-[60%]">
        <Button onPress={handleDelete} className="bg-button">
          <Text className="text-white font-bold">YES, DELETE</Text>
        </Button>
        <Button
          variant="outline"
          onPress={() => router.back()}
          className="bg-white border-button active:bg-gray-100"
        >
          <Text className="text-button font-bold">NO, CANCEL</Text>
        </Button>
      </View>
    </View>
  );
}
