import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Alert, Text, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { signOut, deleteUser } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ name: '', age: '', city: '' });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setProfile(docSnap.data() as any);
          }
        } catch (error: any) {
          Alert.alert('Помилка Firestore', error.message);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleUpdate = async () => {
    if (!user) return;
    setUpdating(true);
    try {
      await setDoc(doc(db, 'users', user.uid), profile);
      Alert.alert('Успіх', 'Профіль успішно оновлено!');
    } catch (error: any) {
      Alert.alert('Помилка збереження', error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      Alert.alert('Помилка виходу', error.message);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Видалити акаунт',
      'Ви впевнені, що хочете видалити акаунт? Цю дію неможливо скасувати.',
      [
        { text: 'Скасувати', style: 'cancel' },
        {
          text: 'Видалити назавжди',
          style: 'destructive',
          onPress: async () => {
            if (user) {
              setLoading(true);
              try {
                await deleteDoc(doc(db, 'users', user.uid));
                await deleteUser(user);
              } catch (error: any) {
                if (error.code === 'auth/requires-recent-login') {
                  Alert.alert('Увага', 'З метою безпеки потрібно вийти з акаунту та увійти знову перед видаленням.');
                } else {
                  Alert.alert('Помилка видалення', error.message);
                }
              } finally {
                setLoading(false);
              }
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text style={styles.loadingText}>Завантаження даних профілю...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View style={styles.avatarCircle}>
             <Text style={styles.avatarText}>{profile.name ? profile.name.charAt(0).toUpperCase() : '?'}</Text>
          </View>
          <Text style={styles.emailText}>{user?.email}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Персональні дані</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ім'я</Text>
            <TextInput
              style={styles.input}
              placeholder="Введіть ім'я"
              value={profile.name}
              onChangeText={(text) => setProfile({ ...profile, name: text })}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Вік</Text>
            <TextInput
              style={styles.input}
              placeholder="Наприклад: 23"
              value={profile.age}
              onChangeText={(text) => setProfile({ ...profile, age: text })}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Місто</Text>
            <TextInput
              style={styles.input}
              placeholder="Київ, Житомир..."
              value={profile.city}
              onChangeText={(text) => setProfile({ ...profile, city: text })}
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={handleUpdate} disabled={updating}>
            {updating ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Зберегти зміни</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleLogout}>
            <Text style={styles.secondaryButtonText}>Вийти</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.dangerButton} onPress={handleDeleteAccount}>
            <Text style={styles.dangerButtonText}>Видалити акаунт</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f9' },
  scroll: { padding: 20, paddingBottom: 40 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f4f9' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  header: { alignItems: 'center', marginBottom: 25 },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#4a90e2', justifyContent: 'center', alignItems: 'center', marginBottom: 10, elevation: 4, shadowColor: '#4a90e2', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 3 }, shadowRadius: 5 },
  avatarText: { fontSize: 36, color: '#fff', fontWeight: 'bold' },
  emailText: { fontSize: 16, color: '#555', fontWeight: '500' },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3, marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', paddingBottom: 10 },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 14, color: '#666', marginBottom: 6, fontWeight: '600' },
  input: { backgroundColor: '#fafafa', borderWidth: 1, borderColor: '#e4e4e4', borderRadius: 8, padding: 12, fontSize: 16, color: '#333' },
  primaryButton: { backgroundColor: '#4a90e2', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  actionsContainer: { gap: 15 },
  secondaryButton: { backgroundColor: '#fff', padding: 15, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#ddd' },
  secondaryButtonText: { color: '#555', fontWeight: '700', fontSize: 16 },
  dangerButton: { backgroundColor: '#ffebe9', padding: 15, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#ffc1be' },
  dangerButtonText: { color: '#e53935', fontWeight: '700', fontSize: 16 }
});