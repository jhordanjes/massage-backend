import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class FakeUserEntity {
  private users: User[] = [];

  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }

  async create(createUserDto: CreateUserDto) {
    const userExists = this.findByUsername(createUserDto.username);

    if (userExists) {
      throw new ConflictException('User already exist');
    }

    const password = await this.hashPassword(createUserDto.password);
    const user = new User();
    Object.assign(user, { ...createUserDto, password });

    this.users.push(user);
    return user;
  }

  findAll() {
    return this.users;
  }

  findOne(id: string) {
    return this.users.find((user) => user._id.toString() === id);
  }

  findByUsername(username: string) {
    return this.users.find((user) => user.username === username);
  }

  remove(id: string) {
    return this.users.filter((user) => user._id.toString() !== id);
  }
}
