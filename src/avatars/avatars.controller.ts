import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { AvatarsService } from './avatars.service';
import { CreateAvatarDto } from './dto/create-avatar.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';

@Controller('avatars')
export class AvatarsController {
  constructor(private readonly avatarsService: AvatarsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return this.avatarsService.create(file.originalname, file.buffer);
  }

  @Get()
  findAll() {
    return this.avatarsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.avatarsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAvatarDto: UpdateAvatarDto) {
    return this.avatarsService.update(+id, updateAvatarDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.avatarsService.remove(+id);
  }
}
