import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSpotDto } from './dto/create-spot.dto';
import { UpdateSpotDto } from './dto/update-spot.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SpotStatus } from '@prisma/client';

@Injectable()
export class SpotsService {
  constructor(private prisma: PrismaService) {}

  async create(createSpotDto: CreateSpotDto & { eventId: string }) {
    const event = await this.prisma.event.findFirst({
      where: {
        id: createSpotDto.eventId,
      },
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return this.prisma.spot.create({
      data: {
        ...createSpotDto,
        status: SpotStatus.AVAILABLE,
      },
    });
  }

  findAll(eventId: string) {
    return this.prisma.spot.findMany({
      where: {
        eventId,
      },
    });
  }

  findOne(eventId: string, spotId: string) {
    return this.prisma.spot.findUnique({
      where: { id: spotId, eventId },
    });
  }

  update(eventId: string, spotId: string, updateSpotDto: UpdateSpotDto) {
    return this.prisma.spot.update({
      where: { id: spotId, eventId },
      data: {
        ...updateSpotDto,
      },
    });
  }

  remove(eventId: string, spotId: string) {
    return this.prisma.spot.delete({
      where: { id: spotId, eventId },
    });
  }
}
