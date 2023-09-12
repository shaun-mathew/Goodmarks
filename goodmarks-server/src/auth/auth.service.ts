import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}
  async validateUser(username: string, password: string) {
    const user = await this.userService.getUser(username);
    if (!user) {
      throw new NotFoundException('User with that username not found');
    }

    const passwordCheck = await bcrypt.compare(password, user.password);

    if (passwordCheck) {
      return {
        id: user.id,
        username: user.username,
      };
    }

    return null;
  }
}
