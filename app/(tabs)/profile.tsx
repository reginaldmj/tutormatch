import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useBookings } from "../../src/context/BookingContext";
import { supabase } from "../../src/lib/supabase";

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any>(null);
  const { bookings } = useBookings();

  const uniqueTutors = bookings.filter(
    (booking, index, self) =>
      index === self.findIndex((item) => item.tutorId === booking.tutorId),
  );

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    console.log("PROFILE DATA:", data);
    console.log("PROFILE ERROR:", error);

    if (data) {
      setProfile(data);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/auth/login" as any);
  }

  if (!profile) {
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: "700", marginBottom: 16 }}>
        Profile
      </Text>

      <View
        style={{
          padding: 20,
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 16,
          backgroundColor: "#fafafa",
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: "700" }}>
          {profile.full_name}
        </Text>

        <Text style={{ marginTop: 6, color: "#666" }}>
          {profile.role === "student" ? "Student" : "Tutor"}
        </Text>

        <View
          style={{
            height: 1,
            backgroundColor: "#eee",
            marginVertical: 16,
          }}
        />

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text style={{ fontSize: 18, fontWeight: "600" }}>
              {bookings.length}
            </Text>
            <Text style={{ color: "#666" }}>Bookings</Text>
          </View>

          <View>
            <Text style={{ fontSize: 18, fontWeight: "600" }}>
              {uniqueTutors.length}
            </Text>
            <Text style={{ color: "#666" }}>Chats</Text>
          </View>
        </View>
      </View>

      <Pressable
        onPress={handleLogout}
        style={{
          marginTop: 24,
          backgroundColor: "black",
          padding: 14,
          borderRadius: 12,
        }}
      >
        <Pressable
          onPress={() => router.push("/profile/edit" as any)}
          style={{
            marginTop: 24,
            backgroundColor: "#eee",
            padding: 14,
            borderRadius: 12,
          }}
        >
          <Text style={{ textAlign: "center", fontWeight: "600" }}>
            Edit Profile
          </Text>
        </Pressable>

        <Text
          style={{ color: "white", textAlign: "center", fontWeight: "600" }}
        >
          Log Out
        </Text>
      </Pressable>
    </View>
  );
}
