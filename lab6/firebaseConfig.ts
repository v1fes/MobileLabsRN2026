import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Замініть на ваші дані з Firebase Console

const firebaseConfig = {
  apiKey: "AIzaSyDjtovnwDoWJNH4W4mXreJZLtVCOH9vc5w",
  authDomain: "test-3e923.firebaseapp.com",
  projectId: "test-3e923",
  storageBucket: "test-3e923.firebasestorage.app",
  messagingSenderId: "512422645742",
  appId: "1:512422645742:web:d2496ba613130594d848ff",
  measurementId: "G-YJC2KG7T3T"
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
});
