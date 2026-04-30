import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name="alert-circle-outline" size={56} color="#6C63FF" />
      </View>
      <Text style={styles.code}>404</Text>
      <Text style={styles.title}>Екран не знайдено</Text>
      <Text style={styles.subtitle}>
        Сторінка, яку ви шукаєте, не існує або була переміщена.
      </Text>

      <Link href="/" asChild>
        <TouchableOpacity style={styles.btn}>
          <Ionicons name="home-outline" size={18} color="#fff" />
          <Text style={styles.btnText}>На головну</Text>
        </TouchableOpacity>
      </Link>

      <Text style={styles.footer}>
        Фесенко Вікторія Володимирівна, ВТ-22-1
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f8",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: "#6C63FF12",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  code: { fontSize: 48, fontWeight: "900", color: "#1a1a2e" },
  title: { fontSize: 20, fontWeight: "800", color: "#1a1a2e", marginTop: 4 },
  subtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#6C63FF",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 28,
  },
  btnText: { fontSize: 15, fontWeight: "700", color: "#fff" },
  footer: {
    position: "absolute",
    bottom: 24,
    fontSize: 11,
    color: "#bbb",
  },
});
