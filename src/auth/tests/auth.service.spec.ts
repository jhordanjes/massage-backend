import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { getModelToken } from '@nestjs/mongoose';
import { FakeUserEntity } from './fakes/FakeUserEntity';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        AuthService,
        FakeUserEntity,
        // {
        //   provide: getModelToken(),
        //   useValue: jest.fn().mockReturnThis(),
        // },
        {
          provide: JwtService,
          useValue: jest.fn(() => 'signedToken'),
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  // it('should be defined', () => {
  //   expect(service).toBeDefined();
  // });

  it('should be able to authenticate', async () => {
    const user = {
      _id: '643c504212892bb2700b2df9',
      name: 'Thais Maquine',
      username: 't.maquine',
      email: 't.maquine@gmail.com',
      password: '$2b$10$DvhBrTgFFybQJFmLpWfWauIRfBwXKpt56MQrYxYnvWg3CJWdMpdN6',
      createdAt: '2023-04-16T19:45:06.450Z',
      updatedAt: '2023-04-16T19:45:06.450Z',
      __v: 0,
    };

    const response = await authService.signIn('t.maquine', '123456');

    expect(response.user).toEqual(user);
  });
});
