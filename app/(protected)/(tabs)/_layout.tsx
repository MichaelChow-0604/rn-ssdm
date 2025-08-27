import { router, Tabs } from "expo-router";
import { Image, Platform, TouchableOpacity, Text } from "react-native";
import BlurBackground from "~/components/tabs/blur-background";
import MainButton from "~/components/tabs/main-button";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="document"
      screenOptions={{
        headerTitle: "SSDM",
        headerTitleAlign: "center",
        animation: "shift",
        headerShadowVisible: false,
        tabBarStyle:
          Platform.OS === "ios"
            ? {
                height: "10%",
                paddingTop: 10,
                position: "absolute",
              }
            : {
                height: "10%",
                paddingTop: 10,
              },
        tabBarBackground: () => {
          if (Platform.OS === "ios") {
            return <BlurBackground />;
          }
          return null;
        },
        // Trash icon at the left
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => router.push("/trash")}
            activeOpacity={0.6}
          >
            <MaterialIcons
              name="delete"
              size={32}
              color="#ef4444"
              className="ml-3"
            />
          </TouchableOpacity>
        ),
        // Bell icon at the right
        headerRight: () => (
          <TouchableOpacity
            onPress={() => router.push("/notification-rule")}
            activeOpacity={0.6}
          >
            <Image
              source={require("~/assets/images/bell.png")}
              className="w-8 h-8 mr-4"
            />
          </TouchableOpacity>
        ),
      }}
    >
      {/* Documents */}
      <Tabs.Screen
        name="document"
        options={{
          title: "Document",
          tabBarIcon: () => (
            <Image
              source={require("~/assets/tabs_icon/document.png")}
              className="w-8 h-8"
            />
          ),
        }}
      />

      {/* Share with me */}
      <Tabs.Screen
        name="share"
        options={{
          headerShown: false,
          tabBarLabel: ({ color }) => (
            <Text
              style={{
                color,
                fontSize: 10,
                textAlign: "center",
                fontWeight: 500,
              }}
            >
              Share with me
            </Text>
          ),
          tabBarIcon: () => (
            <Image
              source={require("~/assets/tabs_icon/share.png")}
              className="w-8 h-8"
            />
          ),
        }}
      />

      {/* Add document custom button */}
      <Tabs.Screen
        name="custom"
        options={{ tabBarButton: () => <MainButton /> }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
          },
        }}
      />

      {/* Contact List */}
      <Tabs.Screen
        name="contact-list"
        options={{
          title: "Contact List",
          headerShown: false,
          tabBarIcon: () => (
            <Image
              source={require("~/assets/tabs_icon/contact.png")}
              className="w-7 h-7"
            />
          ),
        }}
      />

      {/* My Profile */}
      <Tabs.Screen
        name="(profile)"
        options={{
          title: "My Profile",
          headerShown: false,
          tabBarIcon: () => (
            <Image
              source={require("~/assets/tabs_icon/profile.png")}
              className="w-8 h-8"
            />
          ),
        }}
      />
    </Tabs>
  );
}
