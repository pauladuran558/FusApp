import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Horarios() {
  const horarios = [
    { ruta: "Universidad - Centro", salida: "6:00 AM", regreso: "6:30 PM" },
    { ruta: "Barrio El Tejar - Terminal", salida: "6:15 AM", regreso: "6:45 PM" },
    { ruta: "Fusacatán - Universidad", salida: "6:30 AM", regreso: "7:00 PM" },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🕒 Horarios de Rutas</Text>

      {horarios.map((item, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.ruta}>{item.ruta}</Text>
          <Text style={styles.text}>Salida: {item.salida}</Text>
          <Text style={styles.text}>Regreso: {item.regreso}</Text>
        </View>
      ))}

      <Text style={styles.footer}>* Los horarios pueden variar según el tráfico.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#e53935",
  },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 2,
  },
  ruta: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  text: {
    fontSize: 16,
    color: "#555",
  },
  footer: {
    fontSize: 12,
    textAlign: "center",
    color: "#777",
    marginTop: 10,
  },
});
