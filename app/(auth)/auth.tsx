import { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import SignIn from "~/components/auth/sign-in";
import SignUp from "~/components/auth/sign-up";
import Animated, {
  FadeInLeft,
  FadeOutRight,
  LinearTransition,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        style={{ flexGrow: 1 }}
        behavior={Platform.select({ ios: "padding", android: "height" })}
      >
        <View className="bg-white items-center">
          {/* Form */}
          {isSignIn ? (
            // Sign in form
            <Animated.View
              key="signin"
              entering={FadeInLeft.duration(300)}
              exiting={FadeOutRight.duration(300)}
              layout={LinearTransition.springify()}
              className="w-full items-center"
            >
              <SignIn setIsSignIn={setIsSignIn} />
            </Animated.View>
          ) : (
            // Sign up form
            <Animated.View
              key="signup"
              entering={FadeInLeft.duration(300)}
              exiting={FadeOutRight.duration(300)}
              layout={LinearTransition.springify()}
              className="w-full items-center"
            >
              <SignUp setIsSignIn={setIsSignIn} />
            </Animated.View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
