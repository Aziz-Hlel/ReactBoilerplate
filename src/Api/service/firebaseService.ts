import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { firebaseAuth } from "@/config/firebase";

export type FirebaseError = {
  success: false;
  error: Record<string, string>;
};

type FirebaseSuccess<T> = {
  success: true;
  data: T;
};

export type FirebaseResponse<T> = FirebaseSuccess<T> | FirebaseError;

const mapFirebaseAuthError = (code: string): FirebaseError => {
  switch (code) {
    // sign-up errors
    case "auth/email-already-in-use":
      return {
        success: false,
        error: { root: "This email is already registered." as const },
      };
    case "auth/weak-password":
      return {
        success: false,
        error: { password: "Password is too weak." as const },
      };

    // sign-in errors
    case "auth/invalid-email":
      return { success: false, error: { email: "Invalid email format." } };
    case "auth/user-not-found":
      return { success: false, error: { email: "No account found." } };
    case "auth/wrong-password":
      return { success: false, error: { password: "Incorrect password." } };
    case "auth/user-disabled":
      return { success: false, error: { email: "This account is disabled." } };
    case "auth/too-many-requests":
      return {
        success: false,
        error: { general: "Too many attempts. Try again later." },
      };
    default:
      return {
        success: false,
        error: { general: "Unexpected authentication error." },
      };
  }
};

const mapFirebaseOAuthError = (code: string): FirebaseError => {
  switch (code) {
    case "auth/popup-closed-by-user":
      return { success: false, error: { general: "Popup closed." } };

    case "auth/popup-blocked":
      return {
        success: false,
        error: { general: "Popup blocked by browser." },
      };

    case "auth/cancelled-popup-request":
      return { success: false, error: { general: "Login cancelled." } };

    case "auth/account-exists-with-different-credential":
      return {
        success: false,
        error: { general: "Email already used with another provider." },
      };

    default:
      return { success: false, error: { general: "Google login failed." } };
  }
};

const firebaseService = {
  createUserWithEmailAndPassword: async (
    email: string,
    password: string
  ): Promise<FirebaseResponse<string>> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      return { success: true, data: idToken };
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "code" in err) {
        // Firebase error code
        return mapFirebaseAuthError(err.code as string);
      }

      // if (err.response?.data?.message) {
      //   // Backend error
      //   return {
      //     success: false,
      //     error: { general: "err.response.data.message" }, //! baddl,
      //   };
      // }

      return {
        success: false,
        error: { general: "An unexpected error occurred." as const },
      };
    }
  },

  signInWithEmailAndPassword: async (
    email: string,
    password: string
  ): Promise<FirebaseResponse<string>> => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );

      const user = userCredential.user;
      const idToken = await user.getIdToken();

      return { success: true, data: idToken };
    } catch (err: unknown) {
      if (typeof err === "object" && err && "code" in err) {
        return mapFirebaseAuthError(err.code as string);
      }

      // if (typeof err === "object" && err && "response" in err
      // && typeof err.response === "object"  && err.response && "data" in err.response &&
      //  err.response?.data?.message) {
      //   // Backend error
      //   return {
      //     success: false,
      //     error: { general: (err as any).response.data.message },
      //   };
      // }

      return {
        success: false,
        error: { general: "Unexpected error occurred." },
      };
    }
  },

  loginWithGoogle: async (): Promise<FirebaseResponse<string>> => {
    try {

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      const result = await signInWithPopup(firebaseAuth, provider);
      const idToken = await result.user.getIdToken();

      return { success: true, data: idToken };
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "code" in err) {
        return mapFirebaseOAuthError(err.code as string);
      }

      return {
        success: false,
        error: {
          general: "An unexpected error occurred during Google Sign-In.",
        },
      };
    }
  },
};

export default firebaseService;
