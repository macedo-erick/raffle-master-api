import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RaffleModule } from './modules/raffle/raffle.module';
import mysqlConfig from './common/config/mysql.config';
import { UserModule } from './modules/user/user.module';
import { EncryptModule } from './common/modules/encrypt/encrypt.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './common/config/jwt.config';
import { TicketModule } from './modules/ticket/ticket.module';
import { RaffleImageModule } from './modules/raffle-image/raffle-image.module';
import { PaymentModule } from './modules/payment/payment.module';
import { QueueModule } from './modules/queue/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mysqlConfig, jwtConfig]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('mysql.dbHost'),
        port: configService.get('mysql.dbPort'),
        username: configService.get('mysql.dbUsername'),
        password: configService.get('mysql.dbPassword'),
        database: configService.get('mysql.dbName'),
        synchronize: true,
        autoLoadEntities: true
      })
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: {
          expiresIn: parseInt(configService.get('jwt.expires'))
        }
      }),
      inject: [ConfigService]
    }),
    RaffleModule,
    UserModule,
    EncryptModule,
    TicketModule,
    AuthModule,
    RaffleImageModule,
    PaymentModule,
    QueueModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
