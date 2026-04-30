import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";

export default function RegisterScreen() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleRegister = () => {
    if (!name.trim() || !email.trim() || !password || !confirm) {
      Alert.alert("Помилка", "Заповніть всі поля");
      return;
    }
    if (password !== confirm) {
      Alert.alert("Помилка", "Паролі не збігаються");
      return;
    }
    const ok = register(email.trim(), password, name.trim());
    if (ok) router.replace("/(app)");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.hero}>
          <View style={styles.iconWrap}>
            <Ionicons name="person-add" size={36} color="#6C63FF" />
          </View>
          <Text style={styles.title}>Реєстрація</Text>
          <Text style={styles.subtitle}>Створіть новий акаунт</Text>
        </View>

        <View style={styles.card}>
          {/* Name */}
          <Text style={styles.label}>Імʼя</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="person-outline" size={18} color="#aaa" />
            <TextInput
              style={styles.input}
              placeholder="Ваше імʼя"
              placeholderTextColor="#bbb"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Email */}
          <Text style={[styles.label, { marginTop: 14 }]}>Email</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="mail-outline" size={18} color="#aaa" />
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              placeholderTextColor="#bbb"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password */}
          <Text style={[styles.label, { marginTop: 14 }]}>Пароль</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="lock-closed-outline" size={18} color="#aaa" />
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#bbb"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Ionicons
                name={showPass ? "eye-off-outline" : "eye-outline"}
                size={18}
                color="#aaa"
              />
            </TouchableOpacity>
          </View>

          {/* Confirm */}
          <Text style={[styles.label, { marginTop: 14 }]}>
            Підтвердження паролю
          </Text>
          <View style={styles.inputWrap}>
            <Ionicons name="shield-checkmark-outline" size={18} color="#aaa" />
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#bbb"
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry={!showPass}
            />
          </View>

          <TouchableOpacity style={styles.btn} onPress={handleRegister}>
            <Text style={styles.btnText}>Зареєструватися</Text>
          </TouchableOpacity>

          <View style={styles.linkRow}>
            <Text style={styles.linkHint}>Вже є акаунт? </Text>
            <Link href="/login" style={styles.link}>
              Увійти
            </Link>
          </View>
        </View>

        <Text style={styles.footer}>
          Фесенко Вікторія Володимирівна, ВТ-22-1
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f2f8" },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  hero: { alignItems: "center", marginBottom: 24 },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: "#6C63FF18",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  title: { fontSize: 26, fontWeight: "900", color: "#1a1a2e" },
  subtitle: { fontSize: 14, color: "#888", marginTop: 4 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  label: { fontSize: 12, fontWeight: "700", color: "#666", marginBottom: 6 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f8",
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#e8e8f0",
    gap: 8,
  },
  input: { flex: 1, paddingVertical: 12, fontSize: 15, color: "#1a1a2e" },

  btn: {
    backgroundColor: "#6C63FF",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 24,
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "800" },

  linkRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 18,
  },
  linkHint: { fontSize: 13, color: "#888" },
  link: { fontSize: 13, color: "#6C63FF", fontWeight: "700" },

  footer: {
    textAlign: "center",
    fontSize: 11,
    color: "#bbb",
    marginTop: 28,
  },
});
