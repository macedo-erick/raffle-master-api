import { Global, Module } from '@nestjs/common';
import { ConsumerService } from './consumer/consumer.service';
import { ProducerService } from './producer/producer.service';

@Global()
@Module({
  providers: [ConsumerService, ProducerService],
  exports: [ProducerService]
})
export class QueueModule {}
