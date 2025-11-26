import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type SignInRequestDto,
  singInSchema,
} from "@/types/auth/SignInRequestDto";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import firebaseService from "@/Api/service/firebaseService";

const useSignInForm = () => {
  const form = useForm<SignInRequestDto>({
    resolver: zodResolver(singInSchema),
  });

  const { signIn } = useAuth();

  const navigate = useNavigate();

  const onSubmit = async (data: SignInRequestDto) => {
    try {
      const firebaseResponse = await firebaseService.signInWithEmailAndPassword(
        data.email,
        data.password
      );

      if (firebaseResponse.success === false) {
        Object.keys(firebaseResponse.error).map((key) => {
          form.setError(key as keyof SignInRequestDto, {
            type: "manual",
            message: firebaseResponse.error[key],
          });
        });
        throw new Error("Failed to sign in with firebase");
      }

      const idToken = firebaseResponse.data;

      const response = await signIn({
        idToken: idToken,
      });

      if (response.success === false) {
        throw new Error("Failed to sign in with backend");
      }

      navigate("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  return {
    form,
    onSubmit,
  };
};

export default useSignInForm;
