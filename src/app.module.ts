import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { AvatarsModule } from './avatars/avatars.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      'mongodb+srv://jhordan:eMveJraoMlHfOGs5@cluster0.0b3jhva.mongodb.net/?retryWrites=true&w=majority',
    ),
    UsersModule,
    AuthModule,
    AppointmentsModule,
    AvatarsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
