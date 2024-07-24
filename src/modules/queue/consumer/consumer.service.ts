import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TicketService } from '../../ticket/ticket.service';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { SendTicketToQueueRequest } from '../../ticket/dto/create-tickets.dto';

@Injectable()
export class ConsumerService implements OnModuleInit {
  private channelWrapper: ChannelWrapper;
  private readonly logger = new Logger(ConsumerService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly ticketService: TicketService
  ) {
    const connection = amqp.connect([
      this.configService.get<string>('AMQP_URL')
    ]);
    this.channelWrapper = connection.createChannel();
  }

  async onModuleInit() {
    try {
      await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        await channel.assertQueue('ticket', { durable: true });
        await channel.consume('ticket', async (message) => {
          if (message) {
            const content: SendTicketToQueueRequest = JSON.parse(
              message.content.toString()
            );

            await this.ticketService.create(content, content.userId);

            channel.ack(message);
          }
        });
      });
    } catch (err) {
      this.logger.error('Error starting RabbitMQ consumer:', err);
    }
  }
}
