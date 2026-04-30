import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const ROOT_DIR = FileSystem.documentDirectory;

function formatBytes(bytes) {
  if (bytes == null || isNaN(bytes)) return '—';
  if (bytes === 0) return '0 Б';
  const units = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + units[i];
}

function StatBar({ used, total }) {
  const pct = total > 0 ? Math.min((used / total) * 100, 100) : 0;
  return (
    <View style={styles.barOuter}>
      <View style={[styles.barInner, { width: `${pct}%` }]} />
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const [storage, setStorage] = useState({ total: 0, free: 0 });
  const [fileCount, setFileCount] = useState(0);
  const [folderCount, setFolderCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const info = await FileSystem.getFreeDiskStorageAsync();
          const total = await FileSystem.getTotalDiskCapacityAsync();
          setStorage({ total, free: info });
        } catch {
          // simulator fallback
          setStorage({ total: 0, free: 0 });
        }
        try {
          const items = await FileSystem.readDirectoryAsync(ROOT_DIR);
          let files = 0;
          let folders = 0;
          for (const name of items) {
            const info = await FileSystem.getInfoAsync(ROOT_DIR + name);
            if (info.isDirectory) folders++;
            else files++;
          }
          setFileCount(files);
          setFolderCount(folders);
        } catch {
          setFileCount(0);
          setFolderCount(0);
        }
      })();
    }, []),
  );

  const used = storage.total - storage.free;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* ── Storage card ── */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconWrap, { backgroundColor: '#6C63FF22' }]}>
            <Ionicons name="hardware-chip-outline" size={20} color="#6C63FF" />
          </View>
          <Text style={styles.cardTitle}>Пам'ять пристрою</Text>
        </View>
        <StatBar used={used} total={storage.total} />
        <View style={styles.statsRow}>
          <StatItem label="Загалом" value={formatBytes(storage.total)} color="#6C63FF" />
          <StatItem label="Зайнято" value={formatBytes(used)} color="#FF6584" />
          <StatItem label="Вільно" value={formatBytes(storage.free)} color="#43B89C" />
        </View>
      </View>

      {/* ── Quick stats ── */}
      <View style={styles.quickRow}>
        <View style={[styles.quickCard, { borderLeftColor: '#6C63FF' }]}>
          <Ionicons name="document-text-outline" size={24} color="#6C63FF" />
          <Text style={styles.quickNumber}>{fileCount}</Text>
          <Text style={styles.quickLabel}>Файлів</Text>
        </View>
        <View style={[styles.quickCard, { borderLeftColor: '#FF6584' }]}>
          <Ionicons name="folder-outline" size={24} color="#FF6584" />
          <Text style={styles.quickNumber}>{folderCount}</Text>
          <Text style={styles.quickLabel}>Папок</Text>
        </View>
      </View>

      {/* ── Browse button ── */}
      <TouchableOpacity
        style={styles.browseBtn}
        onPress={() => navigation.navigate('Browse', { path: ROOT_DIR })}
        activeOpacity={0.8}
      >
        <Ionicons name="folder-open-outline" size={22} color="#fff" />
        <Text style={styles.browseBtnText}>Відкрити файли</Text>
        <Ionicons name="chevron-forward" size={18} color="#fff" />
      </TouchableOpacity>

      {/* ── Footer ── */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Фесенко Вікторія Володимирівна, ВТ-22-1
        </Text>
        <Text style={styles.footerSub}>Лабораторна робота №4</Text>
      </View>
    </ScrollView>
  );
}

function StatItem({ label, value, color }) {
  return (
    <View style={styles.statItem}>
      <View style={[styles.statDot, { backgroundColor: color }]} />
      <View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f8' },
  content: { padding: 16, paddingBottom: 32 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a2e' },

  barOuter: {
    height: 10,
    backgroundColor: '#e8e8f0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 14,
  },
  barInner: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: '#6C63FF',
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: { flexDirection: 'row', alignItems: 'center' },
  statDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statValue: { fontSize: 13, fontWeight: '700', color: '#1a1a2e' },
  statLabel: { fontSize: 10, color: '#888' },

  quickRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  quickCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  quickNumber: { fontSize: 28, fontWeight: '800', color: '#1a1a2e', marginTop: 4 },
  quickLabel: { fontSize: 12, color: '#888', fontWeight: '500' },

  browseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6C63FF',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 10,
    elevation: 4,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  browseBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  footer: { alignItems: 'center', marginTop: 32 },
  footerText: { fontSize: 12, color: '#999', fontStyle: 'italic' },
  footerSub: { fontSize: 11, color: '#bbb', marginTop: 2 },
});
