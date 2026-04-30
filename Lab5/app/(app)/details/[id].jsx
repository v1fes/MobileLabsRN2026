import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import PRODUCTS from "../../../data/products";

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return (
      <View style={styles.centered}>
        <Ionicons name="help-circle-outline" size={48} color="#ccc" />
        <Text style={styles.notFound}>Товар не знайдено</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero image */}
      <Image source={{ uri: product.image }} style={styles.image} />

      {/* Info card */}
      <View style={styles.card}>
        <Text style={styles.name}>{product.name}</Text>
        <View style={styles.priceRow}>
          <Ionicons name="pricetag" size={18} color="#6C63FF" />
          <Text style={styles.price}>
            {product.price.toLocaleString("uk-UA")} ₴
          </Text>
        </View>
      </View>

      {/* Description card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Опис</Text>
        <Text style={styles.description}>{product.description}</Text>
      </View>

      {/* Specs placeholder */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Характеристики</Text>
        <InfoRow icon="barcode-outline" label="Артикул" value={`#${product.id}00${product.id}`} />
        <InfoRow icon="cube-outline" label="Наявність" value="В наявності" accent="#43B89C" />
        <InfoRow icon="car-outline" label="Доставка" value="1-3 дні" />
        <InfoRow icon="shield-checkmark-outline" label="Гарантія" value="12 місяців" />
      </View>

      <Text style={styles.footer}>
        Фесенко Вікторія Володимирівна, ВТ-22-1
      </Text>
    </ScrollView>
  );
}

function InfoRow({ icon, label, value, accent }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoLeft}>
        <Ionicons name={icon} size={16} color={accent || "#888"} />
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={[styles.infoValue, accent && { color: accent }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f2f8" },
  content: { paddingBottom: 32 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  notFound: { fontSize: 14, color: "#bbb", marginTop: 8 },

  image: {
    width: "100%",
    height: 280,
    backgroundColor: "#e0e0e0",
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 18,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  name: { fontSize: 22, fontWeight: "900", color: "#1a1a2e" },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  price: { fontSize: 20, fontWeight: "800", color: "#6C63FF" },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6C63FF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    lineHeight: 23,
    color: "#444",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#f0f0f4",
  },
  infoLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  infoLabel: { fontSize: 14, color: "#666" },
  infoValue: { fontSize: 14, fontWeight: "600", color: "#1a1a2e" },

  footer: {
    textAlign: "center",
    fontSize: 11,
    color: "#bbb",
    marginTop: 20,
  },
});
