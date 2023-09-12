import {
  Controller,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { SearchService } from './search.service';
import { Get } from '@nestjs/common';
import { SearchQuery } from './dto/query-search.dto';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { UserService } from 'src/user/user.service';

@UseGuards(AuthenticatedGuard)
@Controller('api/search')
export class SearchController {
  constructor(
    private searchService: SearchService,
    private userService: UserService,
  ) {}

  @Get()
  async query(
    @Query(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    )
    query: SearchQuery,
    @Req() req,
  ) {
    //?q=whatever?site=url?after=date?before=date
    const user = await this.userService.getUserByID(req.user.id);

    return await this.searchService.query(user, query);
  }
}
