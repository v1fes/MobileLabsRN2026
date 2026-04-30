import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { Ionicons } from '@expo/vector-icons';

// ── Helpers ──────────────────────────────────────────────────────────────────

function getExtension(name) {
  const i = name.lastIndexOf('.');
  return i > 0 ? name.slice(i + 1).toLowerCase() : '';
}

function humanSize(bytes) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(i ? 1 : 0) + ' ' + units[i];
}

function formatDate(ts) {
  if (!ts) return '—';
  const d = new Date(ts * 1000);
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}  ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function getFileType(name, isDir) {
  if (isDir) return 'Директорія';
  const ext = getExtension(name);
  const map = {
    txt: 'Текстовий документ',
    json: 'JSON',
    js: 'JavaScript',
    ts: 'TypeScript',
    jpg: 'Зображення JPEG',
    jpeg: 'Зображення JPEG',
    png: 'Зображення PNG',
    gif: 'Зображення GIF',
    webp: 'Зображення WebP',
    mp4: 'Відео MP4',
    mp3: 'Аудіо MP3',
    pdf: 'PDF документ',
  };
  return map[ext] || (ext ? `Файл .${ext.toUpperCase()}` : 'Невідомий файл');
}

function getTypeIcon(name, isDir) {
  if (isDir) return { name: 'folder', color: '#FF9800' };
  const ext = getExtension(name);
  if (ext === 'txt') return { name: 'document-text', color: '#6C63FF' };
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext))
    return { name: 'image', color: '#00BCD4' };
  if (['json', 'js', 'ts'].includes(ext))
    return { name: 'code-slash', color: '#43B89C' };
  return { name: 'document', color: '#90A4AE' };
}

// ── Row ──────────────────────────────────────────────────────────────────────

function InfoRow({ icon, label, value, accent }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={16} color={accent ?? '#888'} />
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

// ── Screen ───────────────────────────────────────────────────────────────────

export default function FileInfoScreen({ navigation, route }) {
  const { uri, name } = route.params;
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await FileSystem.getInfoAsync(uri, { size: true, md5: false });
        setInfo(res);
      } catch {
        Alert.alert('Помилка', 'Не вдалося отримати інформацію');
      }
      setLoading(false);
    })();
  }, [uri]);

  React.useLayoutEffect(() => {
    navigation.setOptions({ title: 'Інформація' });
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  if (!info || !info.exists) {
    return (
      <View style={styles.centered}>
        <Ionicons name="help-circle-outline" size={48} color="#ccc" />
        <Text style={styles.notFound}>Файл не знайдено</Text>
      </View>
    );
  }

  const icon = getTypeIcon(name, info.isDirectory);
  const ext = getExtension(name);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* ── Hero ── */}
      <View style={styles.hero}>
        <View style={[styles.heroIcon, { backgroundColor: icon.color + '18' }]}>
          <Ionicons name={icon.name} size={36} color={icon.color} />
        </View>
        <Text style={styles.heroName} numberOfLines={2}>
          {name}
        </Text>
        <Text style={styles.heroType}>{getFileType(name, info.isDirectory)}</Text>
      </View>

      {/* ── Details card ── */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Деталі</Text>

        <InfoRow
          icon="document-outline"
          label="Назва"
          value={name}
          accent="#6C63FF"
        />
        <InfoRow
          icon="pricetag-outline"
          label="Розширення"
          value={ext ? `.${ext}` : '—'}
          accent="#FF9800"
        />
        <InfoRow
          icon="layers-outline"
          label="Тип"
          value={info.isDirectory ? 'Директорія' : 'Файл'}
          accent="#00BCD4"
        />
        {!info.isDirectory && (
          <InfoRow
            icon="resize-outline"
            label="Розмір"
            value={humanSize(info.size ?? 0)}
            accent="#43B89C"
          />
        )}
        <InfoRow
          icon="time-outline"
          label="Змінено"
          value={formatDate(info.modificationTime)}
          accent="#9C27B0"
        />
      </View>

      {/* ── Path card ── */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Шлях</Text>
        <Text style={styles.pathText}>{uri}</Text>
      </View>

      {/* ── Footer ── */}
      <Text style={styles.footer}>
        Фесенко Вікторія Володимирівна, ВТ-22-1
      </Text>
    </ScrollView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f8' },
  content: { paddingBottom: 32 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFound: { fontSize: 14, color: '#bbb', marginTop: 8 },

  hero: { alignItems: 'center', paddingTop: 32, paddingBottom: 20 },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  heroName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1a2e',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  heroType: { fontSize: 13, color: '#888', marginTop: 4 },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6C63FF',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 12,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f4',
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowLabel: { fontSize: 14, color: '#666' },
  rowValue: { fontSize: 14, fontWeight: '600', color: '#1a1a2e', maxWidth: '55%', textAlign: 'right' },

  pathText: {
    fontSize: 12,
    color: '#666',
    fontFamily: Platform?.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 18,
  },

  footer: {
    textAlign: 'center',
    fontSize: 11,
    color: '#bbb',
    marginTop: 16,
    marginBottom: 20,
  },
});
