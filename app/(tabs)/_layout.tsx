import { router, Tabs } from "expo-router";
import { Image, Platform, TouchableOpacity } from "react-native";
import BlurBackground from "~/components/tabs/blur-background";
import MainButton from "~/components/tabs/main-button";

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="(home)"
      screenOptions={{
        headerTitle: "SSDM",
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
        tabBarBackground: () => <BlurBackground />,
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
        name="(home)"
        options={{
          title: "Documents",
          tabBarIcon: () => (
            <Image
              source={require("~/assets/images/documents_icon.png")}
              className="w-8 h-8"
            />
          ),
        }}
      />

      {/* Share with me */}
      <Tabs.Screen
        name="(share)"
        options={{
          title: "Share with me",
          tabBarIcon: () => (
            <Image
              source={require("~/assets/images/share_icon.png")}
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
        name="(contact)"
        options={{
          title: "Contact List",
          tabBarIcon: () => (
            <Image
              source={require("~/assets/images/contact_icon.png")}
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
          tabBarIcon: () => (
            <Image
              source={require("~/assets/images/profile_icon.png")}
              className="w-8 h-8"
            />
          ),
        }}
      />
    </Tabs>
  );
}
