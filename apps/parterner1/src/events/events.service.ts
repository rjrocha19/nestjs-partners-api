import { Injectable } from '@nestjs/common';
import { CreateEventRequest } from './request/create-event.request';
import { UpdateEventRequest } from './request/update-event.request';
import { PrismaService } from '@app/core/prisma/prisma.service';
import { ReserveSpotRequest } from './request/reserve-spot.request';
import { Prisma, SpotStatus, TicketStatus } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(private prismaService: PrismaService) {}

  create(createEventDto: CreateEventRequest) {
    return this.prismaService.event.create({
      data: {
        ...createEventDto,
        date: new Date(createEventDto.date),
      },
    });
  }

  findAll() {
    return this.prismaService.event.findMany();
  }

  findOne(id: string) {
    return this.prismaService.event.findUnique({
      where: { id },
    });
  }

  update(id: string, updateEventDto: UpdateEventRequest) {
    return this.prismaService.event.update({
      where: { id },
      data: {
        ...updateEventDto,
        date: new Date(updateEventDto.date),
      },
    });
  }

  remove(id: string) {
    return this.prismaService.event.delete({
      where: { id },
    });
  }

  async reserveSpot(reserveSpotDto: ReserveSpotRequest & { eventId: string }) {
    const spots = await this.prismaService.spot.findMany({
      where: {
        eventId: reserveSpotDto.eventId,
        name: {
          in: reserveSpotDto.spots,
        },
      },
    });

    if (spots.length !== reserveSpotDto.spots.length) {
      const foundSpotsName = spots.map((spot) => spot.name);
      const notFoundSpotsName = reserveSpotDto.spots.filter(
        (spotName) => !foundSpotsName.includes(spotName),
      );
      throw new Error(`Spots not found: ${notFoundSpotsName.join(', ')}`);
    }

    try {
      const tickets = await this.prismaService.$transaction(
        async (prisma) => {
          await prisma.reservationHistory.createMany({
            data: spots.map((spot) => ({
              spotId: spot.id,
              ticketKind: reserveSpotDto.ticket_kind,
              email: reserveSpotDto.email,
              ticketStatus: TicketStatus.reserved,
            })),
          });

          await prisma.spot.updateMany({
            where: {
              id: {
                in: spots.map((spot) => spot.id),
              },
            },
            data: {
              status: SpotStatus.reserved,
            },
          });

          const tickets = await Promise.all(
            spots.map((spot) =>
              prisma.ticket.create({
                data: {
                  spotId: spot.id,
                  ticketKind: reserveSpotDto.ticket_kind,
                  email: reserveSpotDto.email,
                },
              }),
            ),
          );
          return tickets;
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted },
      );
      return tickets;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        switch (e.code) {
          case 'P2002':
          case 'P2034':
            throw new Error('Some spots are already reserved');
        }
      }
      throw e;
    }
  }
}
