import React from "react";
import { Text, View, Button } from "react-native";
import { useAuthStore } from "../../store/authStore";
import { useRouteStore } from "../../store/routeStore";


export default function HomeScreen() {
  const { user } = useAuthStore();
  const { pushRoute } = useRouteStore();
  return (
    <View>
      <Text>Home Screen</Text>
      {user?.grupos?.includes("admin") && (
        <View>
          <Text>Bienvenido admin</Text>
        </View>
      )}
      <Button title="Cámara" onPress={() => pushRoute("Scanner")} />
    </View>
  );
}
