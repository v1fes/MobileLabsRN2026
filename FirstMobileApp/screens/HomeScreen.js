import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';

const ACCENT_COLORS = ['#6C63FF', '#FF6584', '#43B89C', '#F4A261', '#457B9D', '#E76F51', '#2A9D8F', '#E9C46A'];

// picsum.photos — безкоштовні реальні фото, seed фіксує зображення
const NEWS_DATA = Array.from({ length: 8 }, (_, i) => ({
  id: String(i + 1),
  title: 'Заголовок новини',
  date: '03 квітня 2026',
  text: 'Короткий текст новини для демонстрації картки.',
  accent: ACCENT_COLORS[i % ACCENT_COLORS.length],
  image: `https://picsum.photos/seed/news${i + 10}/120/120`,
}));

function NewsItem({ item }) {
  return (
    <View style={styles.card}>
      <View style={[styles.cardAccent, { backgroundColor: item.accent }]} />
      <Image source={{ uri: item.image }} style={styles.newsImage} />
      <View style={styles.newsContent}>
        <Text style={styles.newsTitle}>{item.title}</Text>
        <Text style={styles.newsDate}>{item.date}</Text>
        <Text style={styles.newsText}>{item.text}</Text>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={NEWS_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NewsItem item={item} />}
        ListHeaderComponent={
          <Text style={styles.screenTitle}>Новини</Text>
        }
        contentContainerStyle={styles.listContent}
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
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'left',
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: '#1a1a2e',
    letterSpacing: 0.3,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'stretch',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  cardAccent: {
    width: 5,
  },
  newsImage: {
    width: 68,
    height: 68,
    backgroundColor: '#D8D8E8',
    margin: 12,
    borderRadius: 8,
    alignSelf: 'center',
  },
  newsContent: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 12,
    paddingVertical: 10,
  },
  newsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 3,
  },
  newsDate: {
    fontSize: 11,
    color: '#6C63FF',
    fontWeight: '600',
    marginBottom: 3,
  },
  newsText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 17,
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
