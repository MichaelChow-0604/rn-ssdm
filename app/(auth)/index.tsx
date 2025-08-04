import { useState } from "react";
import { ScrollView } from "react-native";
import SignIn from "~/components/auth/sign-in";
import SignUp from "~/components/auth/sign-up";
import Animated, {
  FadeInLeft,
  FadeOutRight,
  LinearTransition,
} from "react-native-reanimated";

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <ScrollView className="bg-white" contentContainerClassName="items-center">
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
    </ScrollView>
  );
}
