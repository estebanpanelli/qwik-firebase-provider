import {
  $,
  Slot,
  component$,
  createContextId,
  useContextProvider,
  useStore,
  useVisibleTask$,
} from "@builder.io/qwik";
import { UserStore } from "~/lib/user";
import { Auth, Firestore } from "~/stores/app-providers";
import { Unsubscribe, FirestoreError, onSnapshot, doc, setDoc } from "firebase/firestore";
import {
  User as FirebaseUser,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export const UserContext = createContextId<UserStore>("app.user-context");

export default component$(() => {
  const Store = useStore<UserStore>({
    user: null,
    uid: null,
    isUpToDate: false,
    authReady: false,
    setDisplayName: $(function (this: UserStore, name: string) {
      if (this && this.uid) {
        setDoc(doc(Firestore, "users", this.uid), { displayName: name }, { merge: true });
      }
    }),
  });

  useVisibleTask$(({ cleanup }) => {
    const unsuscribe = Auth.onAuthStateChanged((firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        console.log("user logged in", firebaseUser.email);
        initUser(Store, firebaseUser);
        Store.authReady = true;
      } else {
        console.log("no user logged in");
        Store.authReady = true;
      }
    });
    cleanup(() => unsuscribe());
  });

  useContextProvider(UserContext, Store);

  return <Slot />;
});

function initUser(store: UserStore, firebaseUser: FirebaseUser) {
  if (!firebaseUser) return;

  store.uid = firebaseUser.uid;
  store.user = {
    uid: firebaseUser.uid,
    displayName: "",
    email: firebaseUser.email!,
  };

  /**
   * Subscribe to user data changes on user document
   * path: /users/{uid}
   */
  const unsuscribe: Unsubscribe = onSnapshot(doc(Firestore, "users", firebaseUser.uid), {
    next: (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (store.user) {
          store.user = {
            ...store.user,
            ...data,
          };
        }
        store.isUpToDate = !snapshot.metadata.fromCache;
      } else {
        console.log("no user data");
      }
    },
    error: (error: FirestoreError) => {
      if (error.code === "permission-denied") {
        store.user = null;
        store.uid = null;
        unsuscribe();
      }
    },
  });
  console.log("user snapshot suscribed");
}

export async function signIn(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(Auth, email, password);
}

export async function singOut(): Promise<void> {
  await Auth.signOut();
}

export async function signUp(
  store: UserStore,
  email: string,
  password: string,
  displayName: string
): Promise<void> {
  try {
    const userCredential = await createUserWithEmailAndPassword(Auth, email, password);
    initUser(store, userCredential.user);
    await setDoc(doc(Firestore, "users", userCredential.user.uid), {
      displayName,
      email: userCredential.user.email,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
