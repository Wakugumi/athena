
import { Controller, Sse, Query, MessageEvent, Get, Post, Body } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { NotificationService } from './notification.service';
import { NotificationEventPayload } from './types/notification.types';
import { ApiBody } from '@nestjs/swagger';
import { NotificationRequestDto } from './notification.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationsService: NotificationService) { }

  @Sse('stream')
  streamNotifications(@Query('userId') userId?: string): Observable<MessageEvent> {
    return this.notificationsService.getNotifications(userId).pipe(
      map((notification) => ({
        data: notification,
        id: notification.id,
      })),
    );
  }

  // Test endpoint to send notification
  @Post('send')
  @ApiBody({ type: NotificationRequestDto })
  async sendTestNotification(@Body() body: NotificationRequestDto) {
    console.log()
    const notification = await this.notificationsService.queueNotification({
      message: body.message || 'Test notification',
      userId: body.userId,
      category: body.category,

    });
    return { success: true, notification };
  }

  @Get('health')
  health() {
    return { status: 'ok', service: 'notifications' };
  }
}
