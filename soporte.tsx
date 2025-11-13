import emailjs from "@emailjs/browser";
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";

export default function SoporteScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sendEmail = () => {
    if (!name || !email || !message) {
      Alert.alert("Campos incompletos", "Por favor llena todos los campos antes de enviar.");
      return;
    }

    setLoading(true);

    const templateParams = {
      user_name: name,
      user_email: email,
      message: message,
    };

    emailjs
      .send(
        "service_algui7d",   // ✅ Tu Service ID
        "template_m6w2zng",  // ✅ Tu Template ID
        templateParams,
        "7R10_zq49pGrXxPe6"  // ✅ Tu Public Key
      )
      .then(
        (response) => {
          console.log("Correo enviado con éxito!", response.status, response.text);
          Alert.alert("¡Enviado!", "Tu mensaje fue enviado correctamente 😄");
          setName("");
          setEmail("");
          setMessage("");
        },
        (err) => {
          console.error("Error al enviar el correo:", err);
          Alert.alert("Error", "Hubo un problema al enviar el mensaje 😢");
        }
      )
      .finally(() => setLoading(false));
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Centro de Soporte</Text>
        <Text style={styles.subtitle}>
          Si tienes algún problema o sugerencia, escríbenos:
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Tu nombre"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Tu correo electrónico"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={[styles.input, styles.messageInput]}
          placeholder="Escribe tu mensaje aquí..."
          multiline
          numberOfLines={5}
          value={message}
          onChangeText={setMessage}
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={sendEmail}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Enviando..." : "Enviar mensaje"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F3F4F6",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 20,
    color: "#374151",
  },
  input: {
    width: "100%",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderColor: "#D1D5DB",
    borderWidth: 1,
  },
  messageInput: {
    height: 120,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
