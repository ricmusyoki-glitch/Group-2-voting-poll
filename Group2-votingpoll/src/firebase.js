import { initializeApp } from "firebase/app";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  TwitterAuthProvider,
  getAuth,
} from "firebase/auth";

const getEnvValue = (key) => {
  const value = import.meta.env[key];

  if (typeof value !== "string") {
    return value;
  }

  return value
    .trim()
    .replace(/,+$/, "")
    .trim()
    .replace(/^["']|["']$/g, "")
    .trim();
};

const firebaseConfig = {
  apiKey: getEnvValue("VITE_FIREBASE_API_KEY"),
  authDomain: getEnvValue("VITE_FIREBASE_AUTH_DOMAIN"),
  projectId: getEnvValue("VITE_FIREBASE_PROJECT_ID"),
  storageBucket: getEnvValue("VITE_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: getEnvValue("VITE_FIREBASE_MESSAGING_SENDER_ID"),
  appId: getEnvValue("VITE_FIREBASE_APP_ID"),
};

export const hasFirebaseConfig = Object.values(firebaseConfig).every(Boolean);

const app = hasFirebaseConfig ? initializeApp(firebaseConfig) : null;

export const auth = app ? getAuth(app) : null;

const LOCAL_USERS_KEY = "localAuthUsers";
const LOCAL_SESSION_KEY = "localAuthSession";
export const LOCAL_AUTH_EVENT = "local-auth-change";

const notifyLocalAuthChange = () => {
  window.dispatchEvent(new Event(LOCAL_AUTH_EVENT));
};

const readLocalUsers = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const getLocalSessionUser = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(LOCAL_SESSION_KEY));
    return parsed && parsed.uid ? parsed : null;
  } catch {
    return null;
  }
};

export const registerLocalUser = (email, password) => {
  const normalizedEmail = email.trim().toLowerCase();
  const users = readLocalUsers();
  const exists = users.some((user) => user.email === normalizedEmail);

  if (exists) {
    const error = new Error("Email already exists");
    error.code = "auth/email-already-in-use";
    throw error;
  }

  if (password.trim().length < 6) {
    const error = new Error("Weak password");
    error.code = "auth/weak-password";
    throw error;
  }

  const user = {
    uid: `local-${Date.now()}`,
    email: normalizedEmail,
    displayName: normalizedEmail.split("@")[0],
    password,
  };

  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify([...users, user]));
  localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(user));
  notifyLocalAuthChange();

  return user;
};

export const signInLocalUser = (email, password) => {
  const normalizedEmail = email.trim().toLowerCase();
  const users = readLocalUsers();
  const user = users.find((entry) => entry.email === normalizedEmail);

  if (!user || user.password !== password) {
    const error = new Error("Invalid credentials");
    error.code = "auth/invalid-credential";
    throw error;
  }

  localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(user));
  notifyLocalAuthChange();
  return user;
};

export const signOutLocalUser = () => {
  localStorage.removeItem(LOCAL_SESSION_KEY);
  notifyLocalAuthChange();
};

export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
export const twitterProvider = new TwitterAuthProvider();
