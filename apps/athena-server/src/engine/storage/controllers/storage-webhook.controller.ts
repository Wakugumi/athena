
import { Controller, Post, Body, Query, Logger, HttpCode, UseInterceptors } from '@nestjs/common';
import { AzureEventGridEvent } from '../types/azure-event-grid.types';
import { AzureWebhookAdapter } from '../webhook-adapters/azure-webhook.adapter';
import { NoTransformInterceptor } from 'src/common/interceptors/no.interceptor';

@Controller('storage/webhook')
export class StorageWebhookController {
  constructor(
    private readonly adapter: AzureWebhookAdapter
  ) { }


  @Post('webhook')
  @HttpCode(200) // Always return 200 to Event Grid
  @UseInterceptors(NoTransformInterceptor)
  async handleWebhook(@Body() events: AzureEventGridEvent[]) {
    if (!Array.isArray(events) || events.length === 0) return;

    for (const event of events) {
      if (event.eventType === 'Microsoft.EventGrid.SubscriptionValidationEvent') {
        return {
          validationResponse: event.data.validationCode,
        };
      }

      // Normal events
      this.adapter.handleEvent(event)
    }

    return { status: 'ok' };
  }
}
