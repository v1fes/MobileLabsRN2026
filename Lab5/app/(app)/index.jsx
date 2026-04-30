import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import PRODUCTS from "../../data/products";

function ProductCard({ item }) {
  return (
    <Link href={`/(app)/details/${item.id}`} asChild>
      <TouchableOpacity style={styles.card} activeOpacity={0.8}>
        <Image source={{ uri: item.image }} style={styles.cardImg} />
        <View style={styles.cardBody}>
          <Text style={styles.cardName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.cardPrice}>
            {item.price.toLocaleString("uk-UA")} ₴
          </Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={18}
          color="#ccc"
          style={{ marginRight: 4 }}
        />
      </TouchableOpacity>
    </Link>
  );
}

export default function CatalogScreen() {
  const { logout, user } = useAuth();

  return (
    <View style={styles.container}>
      {/* Header bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>
            Привіт, {user?.name || "Користувач"} 👋
          </Text>
          <Text style={styles.topSub}>
            {PRODUCTS.length} товарів у каталозі
          </Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={18} color="#e74c3c" />
          <Text style={styles.logoutText}>Вийти</Text>
        </TouchableOpacity>
      </View>

      {/* Product list */}
      <FlatList
        data={PRODUCTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard item={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <Text style={styles.footer}>
        Фесенко Вікторія Володимирівна, ВТ-22-1
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f2f8" },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  greeting: { fontSize: 18, fontWeight: "800", color: "#1a1a2e" },
  topSub: { fontSize: 12, color: "#888", marginTop: 2 },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#fef2f2",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  logoutText: { fontSize: 13, fontWeight: "600", color: "#e74c3c" },

  list: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 8 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  cardImg: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: "#eee",
  },
  cardBody: { flex: 1, marginLeft: 12 },
  cardName: { fontSize: 15, fontWeight: "700", color: "#1a1a2e" },
  cardPrice: {
    fontSize: 14,
    fontWeight: "800",
    color: "#6C63FF",
    marginTop: 4,
  },

  footer: {
    textAlign: "center",
    fontSize: 11,
    color: "#bbb",
    paddingBottom: 12,
  },
});
