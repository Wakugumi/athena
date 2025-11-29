import { Controller, Sse, UseGuards } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { map } from "rxjs";
import { JwtAuthGuard } from "../auth/guards/auth-jwt.guard";
import { ApiBearerAuth } from "@nestjs/swagger";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { User } from "src/core/user/user.entity";

@Controller('notifications')
export class NotificationController {
  constructor(private svc: NotificationService) { }

  @Sse('stream')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  stream(@CurrentUser() user: User) {
    return this.svc.getStream(user.id)!.pipe(map(n => ({ data: n })));
  }
}
