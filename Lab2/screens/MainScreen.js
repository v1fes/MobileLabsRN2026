import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { generateNewsItems } from "../data";

const BATCH_SIZE = 10;

const CATEGORY_COLORS = {
  Університет: "#6C63FF",
  Наука: "#2A9D8F",
  Спорт: "#E76F51",
  Культура: "#F4A261",
  Технології: "#457B9D",
};

// Sub-components
function CategoryBadge({ category }) {
  const color = CATEGORY_COLORS[category] ?? "#6C63FF";
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: color + "22", borderColor: color + "55" },
      ]}
    >
      <Text style={[styles.badgeText, { color }]}>{category}</Text>
    </View>
  );
}

function NewsCard({ item, onPress }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(item)}
      activeOpacity={0.82}
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardBody}>
        <CategoryBadge category={item.category} />
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.cardDate}>{item.date}</Text>
        <Text style={styles.cardDesc} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function ListHeader() {
  return (
    <View style={styles.listHeader}>
      <Text style={styles.listHeaderTitle}>Останні публікації</Text>
      <Text style={styles.listHeaderSub}>Потягніть вниз для оновлення</Text>
    </View>
  );
}

function ListFooter({ loading }) {
  return (
    <View style={styles.listFooter}>
      {loading ? (
        <>
          <ActivityIndicator size="small" color="#6C63FF" />
          <Text style={styles.listFooterText}>Завантаження нових новин…</Text>
        </>
      ) : (
        <Text style={styles.listFooterEnd}>· · ·</Text>
      )}
    </View>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

// Screen
export default function MainScreen({ navigation }) {
  const [data, setData] = useState(() => generateNewsItems(1, BATCH_SIZE));
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextId, setNextId] = useState(BATCH_SIZE + 1);

  // Pull-to-Refresh: simulate network request with setTimeout
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setData(generateNewsItems(1, BATCH_SIZE));
      setNextId(BATCH_SIZE + 1);
      setRefreshing(false);
    }, 1500);
  }, []);

  // Infinite Scroll: append next batch on end reached
  const onEndReached = useCallback(() => {
    if (loadingMore) return;

    setLoadingMore(true);

    setTimeout(() => {
      setData((prev) => {
        const startId = prev.length + 1;
        const newItems = generateNewsItems(startId, BATCH_SIZE);
        return [...prev, ...newItems];
      });

      setLoadingMore(false);
    }, 1000);
  }, [loadingMore]);

  const handleCardPress = useCallback(
    (item) => {
      navigation.navigate("DetailsScreen", {
        id: item.id,
        title: item.title,
        description: item.description,
        category: item.category,
        date: item.date,
        image: item.image,
      });
    },
    [navigation],
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NewsCard item={item} onPress={handleCardPress} />
        )}
        // Pull-to-Refresh
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#6C63FF"]}
            tintColor="#6C63FF"
            progressBackgroundColor="#1a1a2e"
          />
        }
        // Infinite Scroll
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        // Visual components
        ListHeaderComponent={<ListHeader />}
        ListFooterComponent={<ListFooter loading={loadingMore} />}
        ItemSeparatorComponent={Separator}
        // Optimisation params
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={10}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEEEF4",
  },

  // List structural
  listContent: {
    paddingBottom: 16,
  },
  listHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  listHeaderTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1a1a2e",
    letterSpacing: 0.3,
  },
  listHeaderSub: {
    fontSize: 12,
    color: "#9999bb",
    marginTop: 2,
  },
  listFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    gap: 8,
  },
  listFooterText: {
    fontSize: 13,
    color: "#6C63FF",
    fontWeight: "500",
  },
  listFooterEnd: {
    fontSize: 18,
    color: "#bbb",
    letterSpacing: 4,
  },
  separator: {
    height: 10,
  },

  // Card
  card: {
    marginHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#1a1a2e",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardImage: {
    width: "100%",
    height: 160,
    backgroundColor: "#dde",
  },
  cardBody: {
    padding: 14,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a2e",
    lineHeight: 21,
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 11,
    color: "#9999bb",
    marginBottom: 6,
    fontWeight: "500",
  },
  cardDesc: {
    fontSize: 13,
    color: "#555577",
    lineHeight: 19,
  },
});
