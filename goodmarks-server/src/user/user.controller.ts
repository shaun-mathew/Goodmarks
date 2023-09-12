import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Param,
  Req,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateTagDto } from './dto/create-tag.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { LocalAuthGuard } from 'src/auth/auth.guard';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Post('/signup')
  async createUser(@Body() createUserDto: CreateUserDto) {
    const { username, password } = createUserDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const { id } = await this.userService.createUser(username, hashedPassword);

    return {
      msg: 'User registered successfully',
      id,
      username,
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Request() req) {
    return {
      user: req.user,
      msg: 'User logged in',
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post('/tags')
  async addTags(@Request() req, @Body() createTagDto: CreateTagDto) {
    const user = await this.userService.getUserByID(req.user.id);

    return this.userService.addTags(user, createTagDto.tags);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/protected')
  protected(@Request() req) {
    return req.user;
  }

  @Get('/logout')
  logout(@Request() req) {
    req.session.destroy();
    return { msg: 'The user session has ended' };
  }

  @Get(':username')
  async getUser(@Param('username') username: string) {
    const user = await this.userService.getUser(username);

    return user;
  }
}
