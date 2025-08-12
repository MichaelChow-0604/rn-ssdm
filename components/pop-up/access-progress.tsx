import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Card, CardContent } from "~/components/ui/card";

interface AccessProgressDialogProps {
  visible: boolean;
  text: string;
}

export function AccessProgressDialog({
  visible,
  text,
}: AccessProgressDialogProps) {
  if (!visible) return null;
  return (
    <View
      style={StyleSheet.absoluteFill}
      className="bg-black/60 items-center justify-center z-50"
      pointerEvents="auto"
    >
      <Card className="bg-white w-[80%]">
        <CardContent className="py-8 items-center gap-3">
          <ActivityIndicator size="large" color="#438BF7" />
          <Text className="text-black font-semibold text-lg text-center">
            {text}
          </Text>
        </CardContent>
      </Card>
    </View>
  );
}
