import React, { useState } from 'react';
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

export default function ProfileScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');

  const handleRegister = () => {
    if (!email || !password || !confirmPassword || !lastName || !firstName) {
      Alert.alert('Помилка', 'Будь ласка, заповніть усі поля');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Помилка', 'Паролі не співпадають');
      return;
    }
    Alert.alert('Успіх', 'Реєстрацію виконано успішно!');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Реєстрація</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Електронна пошта</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor="#bbb"
            placeholder="example@email.com"
          />

          <View style={styles.divider} />

          <Text style={styles.label}>Пароль</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#bbb"
            placeholder="••••••••"
          />

          <View style={styles.divider} />

          <Text style={styles.label}>Пароль (ще раз)</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholderTextColor="#bbb"
            placeholder="••••••••"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Прізвище</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholderTextColor="#bbb"
            placeholder="Іванов"
          />

          <View style={styles.divider} />

          <Text style={styles.label}>Ім'я</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholderTextColor="#bbb"
            placeholder="Іван"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Зареєструватися</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Фесенко Вікторія Володимирівна, ВТ-22-1
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEEF4',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'left',
    paddingVertical: 14,
    color: '#1a1a2e',
    letterSpacing: 0.3,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e8e8f0',
    marginVertical: 2,
  },
  label: {
    fontSize: 12,
    color: '#6C63FF',
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    fontSize: 15,
    color: '#1a1a2e',
    paddingVertical: Platform.OS === 'ios' ? 8 : 6,
    paddingHorizontal: 0,
  },
  button: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
    elevation: 4,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
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

