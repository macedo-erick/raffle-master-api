import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInRequestDto } from './dto/sign-in-request.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public/public.decorator';

@Controller('auth')
@ApiTags('Auth Resources')
@Public()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  signIn(@Body() signInDto: SignInRequestDto) {
    return this.authService.signIn(signInDto);
  }
}
