import { CreateUserRequest } from "./user.request";

export interface LoginRequest {
  username: string;
  password: string;
}

export type SignupRequest = CreateUserRequest & {
  password: string
}


