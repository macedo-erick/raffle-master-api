import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';
import { SendTicketToQueueRequest } from '../../ticket/dto/create-tickets.dto';

@Injectable()
export class ProducerService {
  private channelWrapper: ChannelWrapper;
  private readonly logger = new Logger(ProducerService.name);

  constructor(private readonly configService: ConfigService) {
    const connection = amqp.connect([
      this.configService.get<string>('AMQP_URL')
    ]);

    this.channelWrapper = connection.createChannel({
      json: true,
      setup: (channel: Channel) => {
        return channel.assertQueue('ticket', { durable: true });
      }
    });
  }

  async sendTicketToQueue(tickets: SendTicketToQueueRequest) {
    try {
      await this.channelWrapper.sendToQueue('ticket', tickets, {
        persistent: true
      });

      this.logger.log('Sent To Queue');
    } catch (error) {
      throw new HttpException(
        'Error adding tickets to queue',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
