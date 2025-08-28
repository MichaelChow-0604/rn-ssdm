import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";

export const accountItems = [
  {
    icon: <AntDesign name="user" size={24} color="#4b5563" />,
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
    icon: <AntDesign name="questioncircleo" size={24} color="#4b5563" />,
    label: "Help & Support",
    to: "/help-support",
  },
  {
    icon: <AntDesign name="exclamationcircleo" size={24} color="#4b5563" />,
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
    icon: <AntDesign name="deleteuser" size={24} color="#E42D2D" />,
    label: "Delete Account",
    to: "/delete-account",
    labelClassName: "text-red-500",
  },
];
