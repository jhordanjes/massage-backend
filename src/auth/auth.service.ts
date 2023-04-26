import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async comparePasswords(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new ConflictException('Incorrect username/password combination.');
    }

    const isSamePasswords = await this.comparePasswords(pass, user.password);

    if (!isSamePasswords) {
      throw new UnauthorizedException(
        'Incorrect username/password combination.',
      );
    }

    const payload = { username: user.username, email: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user,
    };
  }
}
