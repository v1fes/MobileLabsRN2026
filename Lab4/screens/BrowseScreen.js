import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const ROOT = FileSystem.documentDirectory;

// ── Helpers ──────────────────────────────────────────────────────────────────

function getExtension(name) {
  const i = name.lastIndexOf('.');
  return i > 0 ? name.slice(i + 1).toLowerCase() : '';
}

function getIcon(name, isDir) {
  if (isDir) return { name: 'folder', color: '#FF9800' };
  const ext = getExtension(name);
  if (ext === 'txt') return { name: 'document-text', color: '#6C63FF' };
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext))
    return { name: 'image', color: '#00BCD4' };
  if (['json', 'js', 'ts'].includes(ext))
    return { name: 'code-slash', color: '#43B89C' };
  return { name: 'document', color: '#90A4AE' };
}

function getBreadcrumb(path) {
  const rel = path.replace(ROOT, '');
  if (!rel) return '/';
  return '/ ' + rel.replace(/\/$/, '').split('/').join(' / ');
}

function sanitizeName(name) {
  // Block path traversal
  return name.replace(/[\/\\:*?"<>|]/g, '').trim();
}

// ── Sort: folders first, then alpha ──
function sortItems(items) {
  return items.sort((a, b) => {
    if (a.isDirectory !== b.isDirectory) return a.isDirectory ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

// ── Screen ───────────────────────────────────────────────────────────────────

export default function BrowseScreen({ navigation, route }) {
  const currentPath = route.params?.path ?? ROOT;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create-modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('folder'); // 'folder' | 'file'
  const [newName, setNewName] = useState('');
  const [newContent, setNewContent] = useState('');

  // ── Load directory contents ──
  const loadDir = useCallback(async () => {
    setLoading(true);
    try {
      const names = await FileSystem.readDirectoryAsync(currentPath);
      const detailed = await Promise.all(
        names.map(async (name) => {
          const info = await FileSystem.getInfoAsync(currentPath + name);
          return { name, ...info };
        }),
      );
      setItems(sortItems(detailed));
    } catch (e) {
      Alert.alert('Помилка', 'Не вдалося прочитати директорію');
    }
    setLoading(false);
  }, [currentPath]);

  useFocusEffect(
    useCallback(() => {
      loadDir();
    }, [loadDir]),
  );

  // ── Set dynamic header title ──
  React.useLayoutEffect(() => {
    navigation.setOptions({ title: getBreadcrumb(currentPath) });
  }, [currentPath, navigation]);

  // ── Create folder ──
  const handleCreateFolder = async () => {
    const safe = sanitizeName(newName);
    if (!safe) return Alert.alert('Помилка', 'Введіть назву папки');
    try {
      await FileSystem.makeDirectoryAsync(currentPath + safe + '/', {
        intermediates: true,
      });
      closeModal();
      loadDir();
    } catch {
      Alert.alert('Помилка', 'Не вдалося створити папку');
    }
  };

  // ── Create file ──
  const handleCreateFile = async () => {
    let safe = sanitizeName(newName);
    if (!safe) return Alert.alert('Помилка', 'Введіть назву файлу');
    if (!safe.endsWith('.txt')) safe += '.txt';
    try {
      await FileSystem.writeAsStringAsync(currentPath + safe, newContent);
      closeModal();
      loadDir();
    } catch {
      Alert.alert('Помилка', 'Не вдалося створити файл');
    }
  };

  // ── Delete ──
  const handleDelete = (item) => {
    Alert.alert(
      'Видалити?',
      `Ви впевнені, що хочете видалити «${item.name}»?`,
      [
        { text: 'Скасувати', style: 'cancel' },
        {
          text: 'Видалити',
          style: 'destructive',
          onPress: async () => {
            try {
              await FileSystem.deleteAsync(item.uri, { idempotent: true });
              loadDir();
            } catch {
              Alert.alert('Помилка', 'Не вдалося видалити');
            }
          },
        },
      ],
    );
  };

  // ── Item press ──
  const handlePress = (item) => {
    if (item.isDirectory) {
      navigation.push('Browse', { path: item.uri + '/' });
    } else if (getExtension(item.name) === 'txt') {
      navigation.navigate('FileView', { uri: item.uri, name: item.name });
    } else {
      navigation.navigate('FileInfo', { uri: item.uri, name: item.name });
    }
  };

  // ── Modal helpers ──
  const openModal = (type) => {
    setModalType(type);
    setNewName('');
    setNewContent('');
    setModalVisible(true);
  };
  const closeModal = () => setModalVisible(false);

  // ── Render ──

  const renderItem = ({ item }) => {
    const icon = getIcon(item.name, item.isDirectory);
    return (
      <TouchableOpacity
        style={styles.row}
        onPress={() => handlePress(item)}
        onLongPress={() => handleDelete(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.rowIcon, { backgroundColor: icon.color + '18' }]}>
          <Ionicons name={icon.name} size={20} color={icon.color} />
        </View>
        <View style={styles.rowBody}>
          <Text style={styles.rowName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.rowSub}>
            {item.isDirectory ? 'Папка' : getExtension(item.name).toUpperCase() || 'Файл'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.rowInfo}
          onPress={() =>
            navigation.navigate('FileInfo', { uri: item.uri, name: item.name })
          }
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="information-circle-outline" size={20} color="#aaa" />
        </TouchableOpacity>
        <Ionicons
          name={item.isDirectory ? 'chevron-forward' : ''}
          size={18}
          color="#ccc"
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* ── Action bar ── */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => openModal('folder')}
        >
          <Ionicons name="folder-outline" size={18} color="#FF9800" />
          <Text style={styles.actionBtnText}>Нова папка</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => openModal('file')}
        >
          <Ionicons name="document-text-outline" size={18} color="#6C63FF" />
          <Text style={styles.actionBtnText}>Новий файл</Text>
        </TouchableOpacity>
      </View>

      {/* ── List ── */}
      {loading ? (
        <ActivityIndicator size="large" color="#6C63FF" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.uri}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="file-tray-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>Директорія порожня</Text>
            </View>
          }
        />
      )}

      {/* ── Create modal ── */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {modalType === 'folder' ? 'Нова папка' : 'Новий файл (.txt)'}
            </Text>

            <Text style={styles.inputLabel}>Назва</Text>
            <TextInput
              style={styles.input}
              placeholder={
                modalType === 'folder' ? 'Назва папки' : 'Назва файлу'
              }
              placeholderTextColor="#aaa"
              value={newName}
              onChangeText={setNewName}
              autoFocus
            />

            {modalType === 'file' && (
              <>
                <Text style={styles.inputLabel}>Вміст</Text>
                <TextInput
                  style={[styles.input, styles.inputMultiline]}
                  placeholder="Початковий текст файлу…"
                  placeholderTextColor="#aaa"
                  value={newContent}
                  onChangeText={setNewContent}
                  multiline
                  textAlignVertical="top"
                />
              </>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={closeModal}
              >
                <Text style={styles.modalBtnCancelText}>Скасувати</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnConfirm]}
                onPress={
                  modalType === 'folder' ? handleCreateFolder : handleCreateFile
                }
              >
                <Text style={styles.modalBtnConfirmText}>Створити</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f8' },

  actionBar: {
    flexDirection: 'row',
    gap: 10,
    padding: 12,
    paddingBottom: 6,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  actionBtnText: { fontSize: 13, fontWeight: '600', color: '#1a1a2e' },

  list: { paddingHorizontal: 12, paddingTop: 6, paddingBottom: 24 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 6,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowBody: { flex: 1 },
  rowName: { fontSize: 14, fontWeight: '600', color: '#1a1a2e' },
  rowSub: { fontSize: 11, color: '#888', marginTop: 1 },
  rowInfo: { paddingHorizontal: 6 },

  empty: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 14, color: '#bbb', marginTop: 8 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#1a1a2e', marginBottom: 16 },
  inputLabel: { fontSize: 12, fontWeight: '600', color: '#888', marginBottom: 4, marginTop: 8 },
  input: {
    backgroundColor: '#f4f4f8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1a1a2e',
    borderWidth: 1,
    borderColor: '#e8e8f0',
  },
  inputMultiline: { height: 100, paddingTop: 10 },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 20 },
  modalBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalBtnCancel: { backgroundColor: '#f0f0f4' },
  modalBtnCancelText: { fontSize: 15, fontWeight: '600', color: '#888' },
  modalBtnConfirm: { backgroundColor: '#6C63FF' },
  modalBtnConfirmText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
