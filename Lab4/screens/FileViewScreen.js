import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

export default function FileViewScreen({ navigation, route }) {
  const { uri, name } = route.params;

  const [content, setContent] = useState('');
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);

  // ── Read file ──
  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const text = await FileSystem.readAsStringAsync(uri);
          setContent(text);
          setDraft(text);
        } catch {
          Alert.alert('Помилка', 'Не вдалося прочитати файл');
        }
        setLoading(false);
      })();
    }, [uri]),
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({ title: name });
  }, [name, navigation]);

  // ── Save changes ──
  const handleSave = async () => {
    try {
      await FileSystem.writeAsStringAsync(uri, draft);
      setContent(draft);
      setEditing(false);
      Alert.alert('Збережено', 'Файл успішно збережено');
    } catch {
      Alert.alert('Помилка', 'Не вдалося зберегти файл');
    }
  };

  // ── Discard ──
  const handleDiscard = () => {
    Alert.alert('Скасувати зміни?', 'Всі незбережені зміни будуть втрачені.', [
      { text: 'Ні', style: 'cancel' },
      {
        text: 'Так',
        style: 'destructive',
        onPress: () => {
          setDraft(content);
          setEditing(false);
        },
      },
    ]);
  };

  const charCount = (editing ? draft : content).length;
  const lineCount = (editing ? draft : content).split('\n').length;

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadText}>Завантаження…</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* ── Stats bar ── */}
      <View style={styles.statsBar}>
        <View style={styles.statChip}>
          <Ionicons name="text-outline" size={13} color="#6C63FF" />
          <Text style={styles.statChipText}>{charCount} символів</Text>
        </View>
        <View style={styles.statChip}>
          <Ionicons name="list-outline" size={13} color="#43B89C" />
          <Text style={styles.statChipText}>{lineCount} рядків</Text>
        </View>
      </View>

      {/* ── Content ── */}
      {editing ? (
        <TextInput
          style={styles.editor}
          value={draft}
          onChangeText={setDraft}
          multiline
          textAlignVertical="top"
          autoFocus
        />
      ) : (
        <ScrollView style={styles.readArea} contentContainerStyle={styles.readContent}>
          <Text style={styles.readText}>{content || '(файл порожній)'}</Text>
        </ScrollView>
      )}

      {/* ── Bottom toolbar ── */}
      <View style={styles.toolbar}>
        {editing ? (
          <>
            <TouchableOpacity style={styles.tbBtnCancel} onPress={handleDiscard}>
              <Ionicons name="close" size={18} color="#e74c3c" />
              <Text style={styles.tbBtnCancelText}>Скасувати</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tbBtnSave} onPress={handleSave}>
              <Ionicons name="checkmark" size={18} color="#fff" />
              <Text style={styles.tbBtnSaveText}>Зберегти</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.tbBtnInfo}
              onPress={() => navigation.navigate('FileInfo', { uri, name })}
            >
              <Ionicons name="information-circle-outline" size={18} color="#6C63FF" />
              <Text style={styles.tbBtnInfoText}>Інформація</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tbBtnEdit}
              onPress={() => setEditing(true)}
            >
              <Ionicons name="create-outline" size={18} color="#fff" />
              <Text style={styles.tbBtnEditText}>Редагувати</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f8' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadText: { fontSize: 14, color: '#aaa' },

  statsBar: { flexDirection: 'row', gap: 8, padding: 12, paddingBottom: 4 },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  statChipText: { fontSize: 12, color: '#666', fontWeight: '500' },

  readArea: { flex: 1, marginHorizontal: 12, marginTop: 8 },
  readContent: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    minHeight: 200,
  },
  readText: { fontSize: 15, lineHeight: 22, color: '#222' },

  editor: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 14,
    padding: 16,
    fontSize: 15,
    lineHeight: 22,
    color: '#1a1a2e',
  },

  toolbar: {
    flexDirection: 'row',
    gap: 10,
    padding: 12,
    paddingBottom: 20,
  },
  tbBtnEdit: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#6C63FF',
    paddingVertical: 13,
    borderRadius: 14,
  },
  tbBtnEditText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  tbBtnInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#fff',
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e4e4f0',
  },
  tbBtnInfoText: { fontSize: 15, fontWeight: '600', color: '#6C63FF' },

  tbBtnSave: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#43B89C',
    paddingVertical: 13,
    borderRadius: 14,
  },
  tbBtnSaveText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  tbBtnCancel: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#fff',
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#fdd',
  },
  tbBtnCancelText: { fontSize: 15, fontWeight: '600', color: '#e74c3c' },
});
