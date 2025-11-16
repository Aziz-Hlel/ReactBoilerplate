import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type SignInRequestDto,
  singInSchema,
} from "@/types/auth/SignInRequestDto";

const useSignInForm = () => {
  const form = useForm<SignInRequestDto>({
    resolver: zodResolver(singInSchema),
  });

  const onSubmit = (data: SignInRequestDto) => {
    console.log(data);
  };

  return {
    form,
    onSubmit,
  };
};

export default useSignInForm;
