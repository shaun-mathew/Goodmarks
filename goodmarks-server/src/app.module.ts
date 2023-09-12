import { Module } from '@nestjs/common';
import { BookmarkModule } from './bookmark/bookmark.module';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { VecDbModule } from './vec-db/vec-db.module';
import { SearchModule } from './search/search.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import validationSchema from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: validationSchema,
    }),
    DbModule,
    BookmarkModule,
    VecDbModule,
    SearchModule,
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
