export interface User {
  displayName: string;
  email: string;
  [key: string]: any;
}

export interface UserStore {
  user: User | null;
  uid: string | null;
  isUpToDate: boolean;
  authReady: boolean;
  setDisplayName: (name: string) => void;
}
