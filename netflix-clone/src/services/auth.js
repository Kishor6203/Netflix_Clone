import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";

import { auth } from "../firebase/firebase";

/* =========================================================
   SIGN UP
========================================================= */

export async function signup(
  email,
  password,
  displayName = ""
) {
  const credentials =
    await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

  if (displayName.trim()) {
    await updateProfile(
      credentials.user,
      {
        displayName:
          displayName.trim(),
      }
    );
  }

  return credentials;
}

/* =========================================================
   LOGIN
========================================================= */

export function login(
  email,
  password
) {
  return signInWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );
}

/* =========================================================
   LOGOUT
========================================================= */

export function logout() {
  return signOut(auth);
}

/* =========================================================
   PASSWORD RESET
========================================================= */

export function resetPassword(email) {
  return sendPasswordResetEmail(
    auth,
    email.trim()
  );
}