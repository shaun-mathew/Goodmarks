import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import Bookmark from './bookmark.entity';
import { VecDbService } from '../vec-db/vec-db.service';
import {
  CreateBookmarkInterface,
  FindBookmarkInterface,
} from './interface/bookmark.interface';
import { convert } from 'html-to-text';
import { CannotCreateEntityIdMapError } from 'typeorm/error/CannotCreateEntityIdMapError';
import { GetMetadataDto } from './dto/get-metadata.dto';
import _metascraper from 'metascraper';
import User from 'src/user/user.entity';
import Tag from './tag.entity';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(Bookmark)
    private bookmarkRepository: Repository<Bookmark>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
    private vecDb: VecDbService,
  ) {}
  async createBookmark(user: User, bookmark: CreateBookmarkDto) {
    const { markup, tags, ...newBookmark } = bookmark;
    let vecDbObject: CreateBookmarkInterface;
    let bookmarkResult: Bookmark;
    let tagObjects: Tag[];

    try {
      if (tags) {
        tagObjects = await this.tagsRepository.findBy({
          user,
          name: In(tags),
        });
      }

      bookmarkResult = await this.bookmarkRepository.save({
        ...newBookmark,
        user,
        tags: tagObjects ?? [],
      });

      const { id, ...res } = bookmarkResult;

      const content = convert(markup);
      vecDbObject = {
        ...res,
        userID: user.id,
        content,
        tags,
        bookmarkID: id,
      };

      await this.vecDb.addBookmark(vecDbObject);
    } catch (error) {
      if (error instanceof CannotCreateEntityIdMapError) {
        throw new InternalServerErrorException(
          'Server Error: Failed to save bookmark',
        );
      } else {
        try {
          this.bookmarkRepository.delete(bookmarkResult.id);
        } catch (error2) {
          throw new InternalServerErrorException(
            'Server Error: Failed to delete bookmark',
          );
        }
        throw new InternalServerErrorException(
          'Server Error: An unknown error occurred',
        );
      }
    }

    return bookmarkResult;
  }

  async updateBookmark(
    user: User,
    bookmark: UpdateBookmarkDto,
  ): Promise<Bookmark> {
    const { id, tags, ...bookmarkUpdate } = bookmark;
    let tagObjects: Tag[];
    const allNull = Object.values(bookmarkUpdate).every(
      (value) => value === null,
    );

    if (allNull) {
      throw new BadRequestException('Invalid bookmark update');
    }

    let foundBookmark = await this.getBookmark(user, id);

    if (!foundBookmark) {
      throw new NotFoundException('Unable to find bookmark');
    }

    if (tags) {
      tagObjects = await this.tagsRepository.findBy({
        user,
        name: In(tags),
      });
    }

    const updatedBookmark = {
      ...foundBookmark,
      ...bookmarkUpdate,
      user,
      tags: tagObjects,
    };

    try {
      this.bookmarkRepository.save(updatedBookmark);
    } catch (error) {
      if (error instanceof CannotCreateEntityIdMapError) {
        throw new InternalServerErrorException(
          'Server Error: Failed to save bookmark',
        );
      } else {
        throw new InternalServerErrorException(
          'Server Error: An unknown error occurred',
        );
      }
    }

    if ('markup' in bookmark && bookmark['markup'] !== null) {
      const content = convert(bookmark['markup']);
      const { markup, id: bookmarkID, ...rest } = bookmark;

      this.vecDb.updateBookmark({
        ...rest,
        bookmarkID,
        content,
      });
    }

    this.vecDb.updateBookmark({
      ...bookmarkUpdate,
      bookmarkID: bookmark.id,
    });

    return updatedBookmark as Bookmark;
  }

  async findOneBookmarkBy(
    user: User,
    filter: FindBookmarkInterface,
  ): Promise<Bookmark> {
    const foundBookmark = await this.userRepository.findOne({
      relations: ['bookmarks', 'tags'],
      where: {
        id: user.id,
        bookmarks: {
          [filter.column]: filter.value,
        },
      },
    });
    return foundBookmark?.bookmarks[0];
  }

  async getBookmarkMetadata(bookmark: GetMetadataDto) {
    const { url, html } = bookmark;
    const urlObject = new URL(url);
    const hostname = urlObject.hostname;

    const metascraper = _metascraper([
      require('metascraper-description')(1000),
      require('metascraper-clearbit')({ size: 128 }),
    ]);

    const metadata = await metascraper({ url: hostname, html: html });

    return metadata;
  }

  async getBookmark(user: User, id: string): Promise<Bookmark> {
    const foundBookmark = await this.findOneBookmarkBy(user, {
      column: 'id',
      value: id,
    });

    if (!foundBookmark) {
      throw new NotFoundException('Unable to find bookmark');
    }

    return foundBookmark;
  }

  async deleteBookmark(user: User, id: string) {
    const foundBookmark = await this.findOneBookmarkBy(user, {
      column: 'id',
      value: id,
    });

    if (!foundBookmark) {
      throw new NotFoundException('Unable to find bookmark');
    }
    try {
      this.bookmarkRepository.remove(foundBookmark);
      this.vecDb.deleteBookmark({ bookmarkID: id });
    } catch (error) {
      throw new InternalServerErrorException(
        'Server Error: Failed to delete bookmark',
      );
    }

    return foundBookmark;
  }

  async purge() {
    this.vecDb.purge();
  }

  async getAllBookmarks() {
    return this.bookmarkRepository.find({ relations: ['tags'] });
  }

  async getAllTags() {
    return this.tagsRepository.find({ relations: ['user'] });
  }
}
