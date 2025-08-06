import { View, Text, ScrollView } from "react-native";

export default function Documents() {
  return (
    <ScrollView className="flex-1 bg-white">
      {Array.from({ length: 100 }).map((_, index) => (
        <View key={index} className="h-20">
          <Text>Document {index + 1}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
