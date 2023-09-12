import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from './user.entity';
import Tag from 'src/bookmark/tag.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(username: string, password: string): Promise<User> {
    const exists = await this.userRepository.findOneBy({
      username,
    });

    if (exists) {
      throw new ConflictException('User with that username already exists');
    }
    const newUser = await this.userRepository.save({
      username,
      password,
    });

    return newUser;
  }

  async addTags(user: User, tags: string[]) {
    const userTags = user.tags.map((item) => item.name);
    const newTagStrings = arrayDifference(tags ?? [], userTags);

    user.tags.push(...newTagStrings.map((tag) => new Tag({ name: tag })));
    return await this.userRepository.save(user);
  }

  async getUser(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      relations: ['bookmarks', 'tags'],
      where: {
        username,
      },
    });

    return user;
  }

  async getUserByID(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      relations: ['bookmarks', 'tags'],
      where: {
        id,
      },
    });

    return user;
  }
}
function arrayDifference<T>(arr1: T[], arr2: T[]) {
  const set2 = new Set(arr2);

  const difference = [...arr1.filter((item) => !set2.has(item))];

  return Array.from(new Set(difference));
}
