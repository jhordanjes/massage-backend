import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import {
  Appointment,
  AppointmentDocument,
} from './entities/appointment.entity';
import {
  addDays,
  addMinutes,
  endOfDay,
  getHours,
  getMinutes,
  isAfter,
  isBefore,
  nextMonday,
  nextWednesday,
  parseISO,
  setHours,
  setMinutes,
  startOfDay,
  startOfWeek,
} from 'date-fns';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    const appointmentDate = parseISO(createAppointmentDto.date);

    if (isBefore(appointmentDate, Date.now())) {
      throw new ConflictException(
        "You can't create an appointment on a past date",
      );
    }

    if (getHours(appointmentDate) < 13 || getHours(appointmentDate) > 16) {
      throw new ConflictException(
        'You can only create appointment between 1pm and 4pm',
      );
    }

    const appointmentWithSameUser = await this.appointmentModel.findOne({
      user: createAppointmentDto.user,
      date: {
        $gte: startOfDay(parseISO(createAppointmentDto.date)),
        $lte: endOfDay(parseISO(createAppointmentDto.date)),
      },
    });

    if (appointmentWithSameUser) {
      throw new ConflictException(
        'You already have an appointment for this day',
      );
    }

    const appointmentInSameDate = await this.appointmentModel.findOne({
      date: appointmentDate,
    });

    if (appointmentInSameDate) {
      throw new ConflictException('This appointment is alredy booked');
    }

    const appointment = new this.appointmentModel({
      date: appointmentDate,
      user: createAppointmentDto.user,
    });
    return appointment.save();
  }

  async findHoursOfDayAvailability() {
    let dateForScheduling: Date;
    const currentDate = new Date();

    const start = startOfWeek(currentDate, { weekStartsOn: 1 });

    if (isAfter(currentDate, addDays(start, 2))) {
      dateForScheduling = setMinutes(setHours(nextMonday(currentDate), 13), 0);
    } else {
      dateForScheduling = setMinutes(
        setHours(nextWednesday(currentDate), 13),
        0,
      );
    }

    const eachHourArray: string[] = [];

    for (let i = 0; i < 16; i++) {
      const hour = getHours(dateForScheduling);
      const minutes = getMinutes(dateForScheduling);
      eachHourArray.push(`${hour}:${minutes === 0 ? '00' : minutes}`);
      dateForScheduling = addMinutes(dateForScheduling, 12);
    }

    const appointments = await this.appointmentModel.find({
      date: {
        $gte: startOfDay(dateForScheduling),
        $lte: endOfDay(dateForScheduling),
      },
    });

    const availability = eachHourArray.map((hour) => {
      const hasAppointmentInHour = appointments.find((appointment) => {
        const hh = `${getHours(appointment.date)}:${
          getMinutes(appointment.date) === 0
            ? '00'
            : getMinutes(appointment.date)
        }`;

        return hh === hour;
      });

      return {
        hour,
        available: !hasAppointmentInHour,
      };
    });

    return {
      dateForScheduling: dateForScheduling,
      availableTimes: availability,
    };
  }

  async findAll(date?: string) {
    if (date) {
      return this.appointmentModel
        .find({
          date: {
            $gte: startOfDay(parseISO(date)),
            $lte: endOfDay(parseISO(date)),
          },
        })
        .sort({ date: 1 })
        .populate('user');
    }

    return this.appointmentModel.find().sort({ date: 1 }).populate('user');
  }

  findOne(id: number) {
    return `This action returns a #${id} appointment`;
  }

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return `This action updates a #${id} appointment`;
  }

  async remove(id: string) {
    const deletedItem = await this.appointmentModel
      .findByIdAndDelete(id)
      .exec();

    if (!deletedItem) {
      throw new NotFoundException(`Item with ID "${id}" not found`);
    }

    return deletedItem;
  }
}
