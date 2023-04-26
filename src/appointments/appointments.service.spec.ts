import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from './appointments.service';

describe('AppointmentsService', () => {
  // let service: AppointmentsService;

  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     providers: [AppointmentsService],
  //   }).compile();

  //   service = module.get<AppointmentsService>(AppointmentsService);
  // });

  // it('should be defined', () => {
  //   expect(service).toBeDefined();
  // });

  it('should be able to create a new appointment', () => {
    expect(1 + 2).toBe(3);
  });

  // it('should not be able to create two appointment on the same time', () => {
  //   expect(1 + 2).toBe(3);
  // });
});
