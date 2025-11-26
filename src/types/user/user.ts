import RoleEnum from "@/Api/enums/RoleEnums";
import z from "zod";

export const userSchema = z.object({
  id: z.string(),
  username: z.string().max(255).optional(),
  email: z.email().max(255),
  role: z.enum(Object.values(RoleEnum)),
});

export type User = z.infer<typeof userSchema>;
