import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }

  async create(createUserDto: CreateUserDto) {
    const userExists = await this.findByUsername(createUserDto.username);

    if (userExists) {
      throw new ConflictException('User already exist');
    }

    const password = await this.hashPassword(createUserDto.password);

    const user = new this.userModel({ ...createUserDto, password });
    return user.save();
  }

  findAll() {
    return this.userModel.find();
  }

  findOne(id: string) {
    return this.userModel.findById(id);
  }

  findByUsername(username: string) {
    return this.userModel.findOne({ username });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findById(id);

    if (user.username !== updateUserDto.username) {
      const userExists = await this.findByUsername(updateUserDto.username);

      if (userExists) {
        throw new ConflictException('User already exist');
      }
    }

    // return this.userModel.findByIdAndUpdate(
    //   {
    //     _id: id,
    //   },
    //   { $set: updateUserDto },
    //   { new: true },
    // );

    return user.set(updateUserDto).save();
  }

  remove(id: string) {
    return this.userModel.deleteOne({ _id: id }).exec();
  }
}
