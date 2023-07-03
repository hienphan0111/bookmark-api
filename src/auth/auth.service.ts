import { ConfigService } from '@nestjs/config';
import { Injectable, ForbiddenException } from "@nestjs/common";
import { Prisma } from '@prisma/client';
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { AuthDto } from "./dto";
import * as argon from 'argon2';

@Injectable()
export class AuthService {

  constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}

  async signup (dto: AuthDto) {
    //generate the password
    const hash = await argon.hash(dto.password);

    // save the new user
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        }
      })

      //return the saved user
      return this.signToken(user.id, user.email);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException(
            'Credentials taken',
          )
        }
        throw err;
      }
    }
  }

  async signin (dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      }
    })

    if (!user) {
      throw new ForbiddenException(
        'Credential incorrect',
      )
    }

    const pwMatches = await argon.verify(user.hash, dto.password);

    if (!pwMatches) {
      throw new ForbiddenException(
        'Credential incorrect',
      )
    }

    const token = await this.signToken(user.id, user.email);
    return {
      access_token: token,
    };
  }

  signToken(
    userId: number,
    email: string,
  ): Promise<string> {
    const payload = {
      sub: userId,
      email
    }

    const secret = this.config.get('JWT_SECRET');

    return this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    })
  }
}
