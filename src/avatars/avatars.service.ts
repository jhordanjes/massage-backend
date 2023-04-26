import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { CreateAvatarDto } from './dto/create-avatar.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';

@Injectable()
export class AvatarsService {
  async create(fileName: string, imageBuffer: Buffer) {
    const s3 = new S3({
      accessKeyId: 'AKIA53CDMS3PXMAJLAGA',
      secretAccessKey: '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',
      endpoint: 's3.eu-west-2.amazonaws.com',
      signatureVersion: 'v4',
      region: 'eu-west-2',
    });
    const upload = await s3
      .upload({
        Bucket: 'sidi-massagee-rzpoddy3fpgcjtgy4m3wjhaie6wgeuse2a-s3alias',
        ACL: 'public-read',
        Body: imageBuffer,
        Key: `${uuid()}-${fileName}`,
      })
      .promise();
    return upload;
    return 'This action adds a new avatar';
  }

  findAll() {
    return `This action returns all avatars`;
  }

  findOne(id: number) {
    return `This action returns a #${id} avatar`;
  }

  update(id: number, updateAvatarDto: UpdateAvatarDto) {
    return `This action updates a #${id} avatar`;
  }

  remove(id: number) {
    return `This action removes a #${id} avatar`;
  }
}
