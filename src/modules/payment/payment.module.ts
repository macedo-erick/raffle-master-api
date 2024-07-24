import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import openPixConfig from '../../common/config/open-pix.config';

@Module({
  imports: [
    ConfigModule.forFeature(openPixConfig),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        timeout: 5000,
        maxRedirects: 5,
        baseURL: configService.get('openPix.url'),
        headers: {
          'content-type': 'application/json',
          Authorization: configService.get('openPix.appId')
        }
      })
    })
  ],
  controllers: [PaymentController],
  providers: [PaymentService]
})
export class PaymentModule {}
