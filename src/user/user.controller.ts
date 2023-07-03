import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/decorator';
import { JwtGaurd } from 'src/gaurd';
import { User } from '@prisma/client';

@UseGuards(JwtGaurd)
@Controller('users')
export class UserController {
  @Get('me')
  getMe(@GetUser() user: User) {

    return user;
  }
}
