import { Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Add your authentication check logic here
      // For example:
      // const token = await AsyncStorage.getItem('userToken');
      // const authenticated = !!token;

      // For now, let's assume user is not authenticated
      const authenticated = true;

      setIsAuthenticated(authenticated);
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#438BF7" />
      </View>
    );
  }

  // Use Redirect component for proper navigation
  if (isAuthenticated) {
    return <Redirect href="/(tabs)/(home)/documents" />;
  } else {
    return <Redirect href="/(auth)/auth" />;
  }
}
