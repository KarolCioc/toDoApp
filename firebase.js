import { initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyCwg7GwUVMktJc9Do4FDyUkmI0tYb4COO8",
    authDomain: "whalenotes-8848a.firebaseapp.com",
    projectId: "whalenotes-8848a",
    storageBucket: "whalenotes-8848a.appspot.com",
    messagingSenderId: "643427365202",
    appId: "1:643427365202:web:e62406ff2b444cc209ca8b",
    measurementId: "G-8Y332RRLWB"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const db = initializeFirestore(app, {experimentalForceLongPolling: true});

const storage = getStorage(app);


export { db, app, auth, storage, getApp, getAuth};