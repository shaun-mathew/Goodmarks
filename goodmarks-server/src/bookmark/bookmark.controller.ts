import {
  ClassSerializerInterceptor,
  Controller,
  ParseUUIDPipe,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';

import { Get, Post, Patch, Delete } from '@nestjs/common';
import { Body, Param } from '@nestjs/common';

import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { GetMetadataDto } from './dto/get-metadata.dto';

import { UUID } from 'crypto';
import { FindQuery } from './dto/find-bookmark.dto';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { UserService } from 'src/user/user.service';
import Bookmark from './bookmark.entity';

@UseGuards(AuthenticatedGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('api/bookmark/')
export class BookmarkController {
  constructor(
    private bookmarkService: BookmarkService,
    private userService: UserService,
  ) {}
  @Post()
  async createBookmark(
    @Body() createBookmarkDto: CreateBookmarkDto,
    @Req() req,
  ): Promise<Bookmark> {
    const user = await this.userService.getUserByID(req.user.id);

    const { url } = createBookmarkDto;
    const bookmark = await this.bookmarkService.findOneBookmarkBy(user, {
      column: 'url',
      value: url,
    });

    if (!bookmark) {
      const newBookmark = await this.bookmarkService.createBookmark(
        user,
        createBookmarkDto,
      );

      return new Bookmark(newBookmark);
    }

    return new Bookmark(bookmark);
  }

  @Get()
  async findBookmark(
    @Query(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    )
    query: FindQuery,
    @Req() req,
  ) {
    const user = await this.userService.getUserByID(req.user.id);

    const res = await this.bookmarkService.findOneBookmarkBy(user, {
      column: 'url',
      value: query.url,
    });

    return res ?? {};
  }

  @Patch()
  async updateBookmark(
    @Body() updateBookmarkDto: UpdateBookmarkDto,
    @Req() req,
  ) {
    const user = await this.userService.getUserByID(req.user.id);

    return this.bookmarkService.updateBookmark(user, updateBookmarkDto);
  }

  @Post('metadata')
  async getBookmarkMetadata(@Body() getMetadataDto: GetMetadataDto) {
    return await this.bookmarkService.getBookmarkMetadata(getMetadataDto);
  }

  @Get('all')
  async getAllBookmarks() {
    return await this.bookmarkService.getAllBookmarks();
  }

  @Get('allTags')
  async getAllTags() {
    return await this.bookmarkService.getAllTags();
  }

  @Get(':id')
  async getBookmark(@Param('id', ParseUUIDPipe) id: UUID, @Req() req) {
    const user = await this.userService.getUserByID(req.user.id);

    return await this.bookmarkService.getBookmark(user, id);
  }

  @Delete('purge')
  async purge() {
    this.bookmarkService.purge();
  }

  @Delete(':id')
  async deleteBookmark(@Param('id', ParseUUIDPipe) id: UUID, @Req() req) {
    const user = await this.userService.getUserByID(req.user.id);

    return await this.bookmarkService.deleteBookmark(user, id);
  }
}
