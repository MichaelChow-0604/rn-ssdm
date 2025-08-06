import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function FilterOptions() {
  return (
    <View className="flex-row items-center justify-between gap-2">
      <TouchableOpacity activeOpacity={0.7}>
        <Image
          source={require("~/assets/images/filter_icon.png")}
          style={{ width: 24, height: 24 }}
        />
      </TouchableOpacity>

      <TouchableOpacity
        className="border flex-1 py-2 flex items-center justify-center rounded-lg border-gray-300"
        activeOpacity={0.7}
      >
        <Text style={styles.label}>Document Type</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="border flex-1 py-2 flex items-center justify-center rounded-lg border-gray-300"
        activeOpacity={0.7}
      >
        <Text style={styles.label}>Category</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="border flex-1 py-2 flex items-center justify-center rounded-lg border-gray-300"
        activeOpacity={0.7}
      >
        <Text style={styles.label}>Upload Date</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: "#6f6f6f",
  },
});
