import React from "react";
import { Text, View } from "react-native";
import { useAuthStore } from "../../store/authStore";


export default function HomeScreen() {
  const { user } = useAuthStore();
  return (
    <View>
      <Text>Home Screen</Text>
      {user?.grupos?.includes("admin") && (
        <View>
          <Text>Bienvenido admin</Text>
        </View>
      )}
    </View>
  );
}
