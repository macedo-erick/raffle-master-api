import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RaffleModule } from './modules/raffle/raffle.module';
import mysqlConfig from './common/config/mysql.config';
import { UserModule } from './modules/user/user.module';
import { EncryptModule } from './common/modules/encrypt/encrypt.module';
import { EntryModule } from './modules/entry/entry.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './common/config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [mysqlConfig, jwtConfig] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('mysql.DB_HOST'),
        port: configService.get('mysql.DB_PORT'),
        username: configService.get('mysql.DB_USERNAME'),
        password: configService.get('mysql.DB_PASSWORD'),
        database: configService.get('mysql.DB_NAME'),
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
    EntryModule,
    AuthModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
