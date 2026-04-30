import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CATEGORY_COLORS = {
  Університет: '#6C63FF',
  Наука: '#2A9D8F',
  Спорт: '#E76F51',
  Культура: '#F4A261',
  Технології: '#457B9D',
};

// Simulated full article body paragraphs
const BODY_PARAGRAPHS = [
  'Це подія стала визначним моментом для всієї спільноти університету. Тисячі студентів, викладачів та адміністрації зібралися, щоб відсвяткувати цей важливий крок у розвитку закладу.',
  'Завдяки наполегливій праці та впровадженню сучасних підходів вдалося досягти вражаючих результатів. Досвід, здобутий у ході реалізації проєкту, стане цінним надбанням для майбутніх поколінь студентів.',
  'Керівництво університету висловило подяку всім учасникам та пообіцяло продовжувати курс на розвиток академічної та наукової діяльності в найближчі роки.',
];

export default function DetailsScreen({ route }) {
  const { title, description, category, date, image } = route.params;
  const accentColor = CATEGORY_COLORS[category] ?? '#6C63FF';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero image */}
      <Image source={{ uri: image }} style={styles.heroImage} />

      {/* Category badge */}
      <View style={styles.meta}>
        <View style={[styles.badge, { backgroundColor: accentColor + '22', borderColor: accentColor + '55' }]}>
          <Text style={[styles.badgeText, { color: accentColor }]}>{category}</Text>
        </View>
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={13} color="#9999bb" style={{ marginRight: 4 }} />
          <Text style={styles.dateText}>{date}</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Lead paragraph */}
      <Text style={styles.lead}>{description}</Text>

      {/* Divider */}
      <View style={[styles.divider, { borderColor: accentColor + '44' }]} />

      {/* Body */}
      {BODY_PARAGRAPHS.map((para, idx) => (
        <Text key={idx} style={styles.body}>{para}</Text>
      ))}

      {/* Bottom spacer */}
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEEF4',
  },
  content: {
    paddingBottom: 24,
  },
  heroImage: {
    width: '100%',
    height: 220,
    backgroundColor: '#dde',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#9999bb',
    fontWeight: '500',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a1a2e',
    paddingHorizontal: 16,
    lineHeight: 28,
    marginBottom: 12,
  },
  lead: {
    fontSize: 15,
    color: '#333355',
    paddingHorizontal: 16,
    lineHeight: 23,
    fontWeight: '500',
  },
  divider: {
    borderTopWidth: 2,
    marginHorizontal: 16,
    marginVertical: 20,
    borderStyle: 'dashed',
  },
  body: {
    fontSize: 14,
    color: '#555577',
    paddingHorizontal: 16,
    lineHeight: 22,
    marginBottom: 14,
  },
});
