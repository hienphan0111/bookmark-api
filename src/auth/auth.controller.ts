import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  signin() {
    return this.authService.signup();
  }

  @Post('signup')
  signup(@Body() dto: any) {
    console.log({ dto })
    return 'I am sign up';
  }

}
