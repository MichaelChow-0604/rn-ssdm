import {
  Image,
  SectionList,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from "react-native";
import SearchBar from "~/components/search-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { getContacts, StoredContact } from "~/lib/storage/contact";
import { Contact } from "~/lib/types";

// derive display name
function fullName(c: StoredContact) {
  return `${c.firstName} ${c.lastName}`.trim();
}

// helpers
function normalizeName(name: string) {
  return name
    .trim()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function groupKeyFromName(name: string) {
  const n = normalizeName(name);
  const first = n[0]?.toUpperCase() ?? "#";
  return /[A-Z]/.test(first) ? first : "#"; // non-letters go to '#'
}

function buildSections(contacts: Contact[]) {
  const map = new Map<string, Contact[]>();

  for (const c of contacts) {
    const key = groupKeyFromName(c.name);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(c);
  }

  // only non-empty, sorted section keys
  const keys = Array.from(map.keys()).sort();

  return keys.map((title) => ({
    title,
    data: map
      .get(title)!
      .sort((a, b) =>
        normalizeName(a.name).localeCompare(normalizeName(b.name))
      ),
  }));
}

export default function ContactListPage() {
  const [contacts, setContacts] = useState<StoredContact[]>([]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        const data = await getContacts();
        if (!cancelled) setContacts(data);
      })();
      return () => {
        cancelled = true;
      };
    }, [])
  );

  const sections = useMemo(() => {
    const formatted = contacts.map((c) => ({
      id: c.id,
      name: fullName(c),
      avatarUri: c.profilePicUri ?? undefined,
    }));
    return buildSections(formatted);
  }, [contacts]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 gap-4 py-6">
        <SearchBar className="flex-1" placeholder="Search contacts" />

        <TouchableOpacity
          activeOpacity={0.8}
          className="rounded-full p-2"
          onPress={() => router.push("/create-contact")}
        >
          <Ionicons name="person-add" size={24} color="#438BF7" />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View className="pl-6 py-4 border-t-4 border-b-4 border-gray-200">
        <Text className="text-2xl font-semibold text-black">My Contacts</Text>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled
        renderSectionHeader={({ section }) => (
          <View className="bg-gray-100 px-6 py-2">
            <Text className="font-semibold">{section.title}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row items-center gap-3 px-6 py-3 border-b border-gray-200"
            onPress={() =>
              router.push({ pathname: "/[id]", params: { id: item.id } })
            }
          >
            {item.avatarUri ? (
              <Image
                source={{ uri: item.avatarUri }}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <Image
                source={require("~/assets/images/default_icon.png")}
                className="w-10 h-10 rounded-full"
              />
            )}
            <Text className="text-black font-semibold">{item.name}</Text>
          </TouchableOpacity>
        )}
        initialNumToRender={20}
        windowSize={10}
      />
    </SafeAreaView>
  );
}
