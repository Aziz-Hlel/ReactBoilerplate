import type { RoleEnum } from "@/Api/enums/RoleEnums";

export type User = {
  id: string;
  username: string;
  email: string;
  role: RoleEnum;
};
