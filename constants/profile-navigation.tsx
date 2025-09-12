import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export const accountItems = [
  {
    icon: <Feather name="user" size={24} color="#4b5563" />,
    label: "Profile",
    to: "/edit-profile",
  },
  {
    icon: <Ionicons name="notifications-outline" size={24} color="#4b5563" />,
    label: "Notification Message",
    to: "/notification-message",
  },
  {
    icon: <MaterialIcons name="password" size={24} color="#4b5563" />,
    label: "Change Password",
    to: "/change-password",
  },
];

export const supportItems = [
  {
    icon: <FontAwesome name="question-circle-o" size={24} color="#4b5563" />,
    label: "Help & Support",
    to: "/help-support",
  },
  {
    icon: <FontAwesome name="exclamation-circle" size={24} color="#4b5563" />,
    label: "Terms and Disclaimer",
    to: "/terms-disclaimer",
  },
  {
    icon: <AntDesign name="lock" size={24} color="#4b5563" />,
    label: "Privacy Policy",
    to: "/privacy",
  },
];

export const moreItems = [
  {
    icon: <Feather name="globe" size={24} color="#4b5563" />,
    label: "Language",
    to: "/language",
  },
  {
    icon: (
      <MaterialCommunityIcons name="delete-circle" size={24} color="#E42D2D" />
    ),
    label: "Delete Account",
    to: "/delete-account",
    labelClassName: "text-red-500",
  },
];
