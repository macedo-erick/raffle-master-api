import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { SignInRequestDto } from './dto/sign-in-request.dto';
import { UserService } from '../user/user.service';
import { EncryptService } from '../../common/modules/encrypt/encrypt.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly encryptService: EncryptService,
    private readonly jwtService: JwtService
  ) {}

  async signIn(signInDto: SignInRequestDto) {
    const user = await this.userService.findByEmail(signInDto.email);

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User not exists',
          timestamp: new Date().getTime()
        },
        HttpStatus.NOT_FOUND
      );
    }

    const validPassword = this.encryptService.compare(
      signInDto.password,
      user.password
    );

    if (!validPassword) {
      throw new UnauthorizedException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Password mismatch',
        timestamp: new Date().getTime()
      });
    }

    const { id, email, firstName } = user;

    return {
      id,
      email,
      firstName,
      accessToken: this.jwtService.sign({
        id,
        email
      })
    };
  }
}
