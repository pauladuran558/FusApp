import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Inicio() {
  const router = useRouter();

  // Opciones que aparecerán como botones
  const options = [
    { id: 1, title: "Rutas", route: "/(tabs)/rutas" },     // tu mapa
    { id: 2, title: "Horarios", route: "/(tabs)/horario" }, // puedes renombrar el archivo si quieres
    { id: 3, title: "Noticias", route: "/(tabs)/noticias" },
    { id: 4, title: "Soporte", route: "/(tabs)/soporte" },
  ];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          color: "#333",
          marginBottom: 40,
        }}
      >
        Bienvenido a FusApp 🚍
      </Text>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {options.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => router.push(item.route)}
            style={{
              width: 140,
              height: 140,
              backgroundColor: "#f9f9f9",
              borderRadius: 20,
              margin: 10,
              alignItems: "center",
              justifyContent: "center",
              elevation: 3,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#333",
                textAlign: "center",
              }}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
