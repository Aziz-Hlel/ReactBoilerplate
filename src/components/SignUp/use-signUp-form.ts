import firebaseService from "@/Api/service/firebaseService";
import { firebaseAuth } from "@/config/firebase";
import { useAuth } from "@/context/AuthContext";
import {
  singUpSchema,
  type SignUpRequestSchema,
} from "@/types/auth/SignUpRequestDto";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const useSignUpForm = () => {
  const form = useForm<SignUpRequestSchema>({
    resolver: zodResolver(singUpSchema),
  });
  const { signUp } = useAuth();

  const navigate = useNavigate();
  const onSubmit = async (data: SignUpRequestSchema) => {
    try {
      // const response = await register(data);
      const response = await firebaseService.createUserWithEmailAndPassword(
        data.email,
        data.password
      );

      if (response.success === false)
        throw new Error("Failed to create user with Firebase");

      const idToken = response.data;

      const signUpResponse = await signUp({
        tokenId: idToken,
      });

      if (signUpResponse.success === false)
        throw new Error("Failed to create user with backend");

      console.log("good");
      navigate("/");

      // if (response.success) {
      //   navigate("/");
      // }
    } catch (error) {
      console.log(error);
    }
  };
  return {
    form,
    onSubmit,
  };
};

export default useSignUpForm;
