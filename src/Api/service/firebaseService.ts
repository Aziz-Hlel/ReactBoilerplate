
import { createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "@/config/firebase";


 type FirebaseError = {
    success: false;
    error:Record<string, string>;
}

 type FirebaseSuccess<T> = {
    success: true;
    data: T;
}

export type FirebaseResponse<T> = FirebaseSuccess<T> | FirebaseError;


const firebaseService = {

    createUserWithEmailAndPassword: async (email: string, password: string): Promise<FirebaseResponse<string>> => {

        try{
          const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
                const user = userCredential.user;
                      const idToken = await user.getIdToken();


            return { success: true, data: idToken };
        }catch (err: any) {
  if (typeof err === "object" && err !== null && "code" in err) {
    // Firebase error code
    switch (err.code) {
      case "auth/email-already-in-use":
        return { success: false, error: { email: "This email is already registered." as const } };
        break;
      case "auth/weak-password":
        return { success: false, error: { password: "Password is too weak." as const } };
        break;
      default:
        return { success: false, error: { general:( "message" in err && typeof err.message === "string")? err.message : "An unknown error occurred." as const } };
    }
  } else if (err.response?.data?.message) {
    // Backend error
    return { success: false, error: { general: err.response.data.message } };
  } else {
    return { success: false, error: { general: "An unexpected error occurred." as const } };
  }
}

    }

}

export default firebaseService;