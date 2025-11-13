import React from "react";
import { FlatList, Text, View } from "react-native";

interface Noticia {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
}

const noticias: Noticia[] = [
  {
    id: "1",
    titulo: "Nuevo sistema de soporte en línea",
    descripcion:
      "Ahora puedes enviar mensajes directamente desde la app y recibir respuesta personalizada.",
    fecha: "30 de octubre de 2025",
  },
  {
    id: "2",
    titulo: "Mejoras en el diseño de interfaz",
    descripcion:
      "Actualizamos los colores y botones para una experiencia más cómoda y moderna.",
    fecha: "25 de octubre de 2025",
  },
  {
    id: "3",
    titulo: "Función de horarios disponible",
    descripcion:
      "Consulta fácilmente los horarios actualizados desde la pestaña de 'Horario'.",
    fecha: "15 de octubre de 2025",
  },
];

export default function Noticias() {
  return (
    <View style={{ flex: 1, backgroundColor: "#f4f4f9", padding: 20 }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 20,
          color: "#222",
        }}
      >
        📰 Últimas Noticias
      </Text>

      <FlatList
        data={noticias}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "#fff",
              padding: 15,
              borderRadius: 12,
              marginBottom: 15,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#1e40af",
                marginBottom: 6,
              }}
            >
              {item.titulo}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#333",
                marginBottom: 8,
              }}
            >
              {item.descripcion}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "#666",
                textAlign: "right",
                fontStyle: "italic",
              }}
            >
              📅 {item.fecha}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
