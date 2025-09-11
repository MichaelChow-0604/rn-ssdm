import {
  SectionList,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from "react-native";
import SearchBar from "~/components/search-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Contact } from "~/lib/types";
import { useContactList } from "~/hooks/use-contact-list";
import { buildSections } from "~/lib/contacts/utils";
import { ContactRow } from "~/components/contact/contact-row";
import { useQuery } from "@tanstack/react-query";
import { contactKeys } from "~/lib/http/keys/contact";
import { getContacts } from "~/lib/http/endpoints/contact";
import { beautifyResponse } from "~/lib/utils";
import { useEffect } from "react";

export default function ContactListTab() {
  const { data, isLoading, isError } = useQuery({
    queryKey: contactKeys.list(),
    queryFn: getContacts,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const items: Contact[] = (data?.contactSummaries ?? []).map((s) => ({
    id: String(s.id),
    name: `${s.firstName} ${s.lastName}`.trim(),
  }));

  useEffect(() => {
    if (data) {
      console.log(data);
    }
  }, [data]);

  const sections = buildSections(items);

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

      {/* Contact list */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled
        contentContainerStyle={{
          flexGrow: 1,
        }}
        ListEmptyComponent={<EmptyState />}
        renderSectionHeader={({ section }) => (
          <SectionHeader title={section.title} />
        )}
        renderItem={({ item }) => (
          <ContactRow
            id={item.id}
            name={item.name}
            avatarUri={item.avatarUri}
            onPress={(id) => router.push({ pathname: "/[id]", params: { id } })}
          />
        )}
        initialNumToRender={20}
        windowSize={10}
      />
    </SafeAreaView>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <View className="bg-gray-100 px-6 py-2">
      <Text className="font-semibold">{title}</Text>
    </View>
  );
}

function EmptyState({ text = "No contact yet" }: { text?: string }) {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-center text-gray-400 text-2xl font-bold">
        {text}
      </Text>
    </View>
  );
}
