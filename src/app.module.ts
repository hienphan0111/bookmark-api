import { Module } from '@nestjs/common';
import { Auth } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [Auth, UserModule, BookmarkModule, PrismaModule],
})
export class AppModule {}
