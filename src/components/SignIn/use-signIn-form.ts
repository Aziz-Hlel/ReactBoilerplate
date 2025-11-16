import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type SignInRequestDto,
  singInSchema,
} from "@/types/auth/SignInRequestDto";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const useSignInForm = () => {
  const form = useForm<SignInRequestDto>({
    resolver: zodResolver(singInSchema),
  });

  const { login } = useAuth();

  const navigate = useNavigate();

  const onSubmit = async (data: SignInRequestDto) => {
    try {
      const response = await login(data);

      if (response.success) {
        navigate("/");
      }
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
