import { User as UserExtend } from "src/core/user/user.entity";


declare global {
  namespace Express {
    interface User extends UserExtend { }
  }
}
