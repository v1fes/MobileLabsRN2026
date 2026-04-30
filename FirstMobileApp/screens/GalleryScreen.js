import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const COLUMN_COUNT = 3;
const ITEM_MARGIN = 6;
const ITEM_SIZE =
  (SCREEN_WIDTH - ITEM_MARGIN * (COLUMN_COUNT + 1)) / COLUMN_COUNT;

const TILE_COLORS = [
  '#e8e4ff', '#ffe4ec', '#e4f7f1',
  '#fff4e4', '#e4eeff', '#fde8e8',
  '#e8f5e9', '#fff8e1', '#f3e5f5',
  '#e0f7fa',
];

const GALLERY_DATA = Array.from({ length: 10 }, (_, i) => ({
  id: String(i + 1),
  color: TILE_COLORS[i % TILE_COLORS.length],
  image: `https://picsum.photos/seed/gallery${i + 1}/300/300`,
}));

function GalleryItem({ item }) {
  return (
    <Image
      source={{ uri: item.image }}
      style={[
        styles.galleryItem,
        { width: ITEM_SIZE, height: ITEM_SIZE, backgroundColor: item.color },
      ]}
    />
  );
}

export default function GalleryScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={GALLERY_DATA}
        keyExtractor={(item) => item.id}
        numColumns={COLUMN_COUNT}
        renderItem={({ item }) => <GalleryItem item={item} />}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
      />
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Фесенко Вікторія Володимирівна, ВТ-22-1
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEEF4',
  },
  listContent: {
    padding: ITEM_MARGIN,
    paddingBottom: 4,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
    gap: ITEM_MARGIN,
    marginBottom: ITEM_MARGIN,
  },
  galleryItem: {
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  footer: {
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  footerText: {
    fontSize: 11,
    color: '#aaa',
    fontStyle: 'italic',
  },
});

