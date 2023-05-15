import { Slot, component$ } from "@builder.io/qwik";

import { FirebaseApp, FirebaseAppSettings, FirebaseOptions, initializeApp } from "firebase/app";
import {
  CACHE_SIZE_UNLIMITED,
  FirestoreSettings,
  initializeFirestore,
  persistentLocalCache,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig: FirebaseOptions = {
  // Add your Firebase configuration here.
};
const firebaseSettings: FirebaseAppSettings = {};

const firebaseApp: FirebaseApp = initializeApp(firebaseConfig, firebaseSettings);

const fsSettings: FirestoreSettings = {
  localCache: persistentLocalCache({ cacheSizeBytes: CACHE_SIZE_UNLIMITED }),
  ignoreUndefinedProperties: true,
};

export const Firestore = initializeFirestore(firebaseApp, fsSettings);

export const Auth = getAuth(firebaseApp);

import UserProvider from "~/stores/user-store";

export default component$(() => {
  return (
    <UserProvider>
      <Slot />
    </UserProvider>
  );
});
