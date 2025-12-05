import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { firebaseAuth } from '@/config/firebase';

export type FirebaseError = {
  success: false;
  error: ['email' | 'password' | 'root', { message: string }];
};

type FirebaseSuccess<T> = {
  success: true;
  data: T;
};

export type FirebaseResponse<T> = FirebaseSuccess<T> | FirebaseError;

const mapFirebaseAuthError = (code: string): FirebaseError => {
  console.log('dirrab l code l t5l l error t3 firebase : ', code);
  switch (code) {
    // sign-up errors
    case 'auth/email-already-in-use':
      return {
        success: false,
        error: ['email', { message: 'Email is already in use.' as const }],
      };
    case 'auth/weak-password':
      return {
        success: false,
        error: ['password', { message: 'Password is too weak.' as const }],
      };

    // sign-in errors
    case 'auth/invalid-credential':
      return {
        success: false,
        error: ['root', { message: 'Invalid credential.' }],
      };
    case 'auth/user-disabled':
      return {
        success: false,
        error: ['root', { message: 'User account is disabled.' }],
      };
    case 'auth/too-many-requests':
      return {
        success: false,
        error: ['root', { message: 'Too many requests. Try again later.' }],
      };
    default:
      return {
        success: false,
        error: ['root', { message: 'Authentication failed.' as const }],
      };
  }
};

const mapFirebaseOAuthError = (code: string): FirebaseError => {
  switch (code) {
    case 'auth/popup-closed-by-user':
      return {
        success: false,
        error: ['root', { message: 'Popup closed by user.' }],
      };

    case 'auth/popup-blocked':
      return {
        success: false,
        error: ['root', { message: 'Popup blocked by browser.' }],
      };

    case 'auth/cancelled-popup-request':
      return {
        success: false,
        error: ['root', { message: 'Popup request cancelled.' }],
      };

    case 'auth/account-exists-with-different-credential':
      return {
        success: false,
        error: ['root', { message: 'Account exists with different credential.' }],
      };

    default:
      return { success: false, error: ['root', { message: 'OAuth failed.' }] };
  }
};

const firebaseService = {
  createUserWithEmailAndPassword: async (email: string, password: string): Promise<FirebaseResponse<string>> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      return { success: true, data: idToken };
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'code' in err) {
        // Firebase error code
        return mapFirebaseAuthError(err.code as string);
      }

      // if (err.response?.data?.message) {
      //   // Backend error
      //   return {
      //     success: false,
      //     error: { root: "err.response.data.message" }, //! baddl,
      //   };
      // }

      return {
        success: false,
        error: ['root', { message: 'Unexpected error occurred.' }],
      };
    }
  },

  signInWithEmailAndPassword: async (email: string, password: string): Promise<FirebaseResponse<string>> => {
    try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);

      const user = userCredential.user;
      const idToken = await user.getIdToken();

      return { success: true, data: idToken };
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null) {
        if ('code' in err && typeof err.code === 'string') return mapFirebaseAuthError(err.code);
      }

      return {
        success: false,
        error: ['root', { message: 'Unexpected error occurred.' }],
      };
    }
  },

  loginWithGoogle: async (): Promise<FirebaseResponse<string>> => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      const result = await signInWithPopup(firebaseAuth, provider);
      const idToken = await result.user.getIdToken();

      return { success: true, data: idToken };
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'code' in err) {
        return mapFirebaseOAuthError(err.code as string);
      }

      return {
        success: false,
        error: ['root', { message: 'Unexpected error occurred during OAuth.' }],
      };
    }
  },
};

export default firebaseService;
