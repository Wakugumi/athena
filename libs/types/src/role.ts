export type Role = {
  // standard fields
  version: number;


  // domain specific fields
  label: RoleLabelEnum;
}


export enum RoleLabelEnum {
  User = "USER",
  Admin = "ADMIN"
}

export const RoleUser: Role = {
  version: 1,
  label: RoleLabelEnum.User
}
