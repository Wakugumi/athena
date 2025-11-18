import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "src/core/user/user.entity";

export const CurrentUser = createParamDecorator(
  (_, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user as Omit<User, "passwordHash">;
  }
);
