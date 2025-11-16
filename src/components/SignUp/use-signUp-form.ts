import { useAuth } from "@/context/AuthContext";
import {
  singUpSchema,
  type SignUpRequestDto,
  type SignUpRequestSchema,
} from "@/types/auth/SignUpRequestDto";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const useSignUpForm = () => {
  const form = useForm<SignUpRequestSchema>({
    resolver: zodResolver(singUpSchema),
  });
  const { register } = useAuth();

  const navigate = useNavigate();
  const onSubmit = async (data: SignUpRequestSchema) => {
    try {
      const response = await register(data);

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

export default useSignUpForm;
