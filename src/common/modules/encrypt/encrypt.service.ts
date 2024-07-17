import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncryptService {
  constructor(private configService: ConfigService) {}

  encrypt(str: string): string {
    return bcrypt.hashSync(str, Number(this.configService.get('SALT_ROUNDS')));
  }

  compare(str: string, hash: string): boolean {
    return bcrypt.compareSync(str, hash);
  }
}
