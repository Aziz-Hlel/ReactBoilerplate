const RoleEnums = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

export type RoleEnum = (typeof RoleEnums)[keyof typeof RoleEnums];

export default RoleEnums;
