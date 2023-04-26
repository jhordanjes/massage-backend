import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // it('should return an array of users', async () => {
  //   const result = [
  //     {
  //       _id: 'askcjasl',
  //       username: 'joe.done',
  //       name: 'Joe Done',
  //       email: 'joe.done@gmail.com',
  //     },
  //   ];
  //   jest.spyOn(usersService, 'findAll').mockImplementation(() => result);
  // });
});
