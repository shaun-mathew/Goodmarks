import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { VecDbModule } from 'src/vec-db/vec-db.module';
import { BookmarkModule } from 'src/bookmark/bookmark.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [VecDbModule, BookmarkModule, UserModule],
  providers: [SearchService],
  exports: [SearchService],
  controllers: [SearchController],
})
export class SearchModule {}
