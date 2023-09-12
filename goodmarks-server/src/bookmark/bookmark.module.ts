import { Module } from '@nestjs/common';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import Bookmark from './bookmark.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VecDbModule } from '../vec-db/vec-db.module';
import { UserModule } from '../user/user.module';
import User from '../user/user.entity';
import Tag from './tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bookmark, User, Tag]),
    VecDbModule,
    UserModule,
  ],
  controllers: [BookmarkController],
  providers: [BookmarkService],
  exports: [BookmarkService],
})
export class BookmarkModule {}
