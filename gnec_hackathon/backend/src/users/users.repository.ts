import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseRepository } from '../database/base.repository';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UserRepository extends BaseRepository<User, Prisma.UserDelegate> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma.user);
  }

  async findByClerkId(clerkUserId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { clerkUserId },
    });
  }

  async updateByClerkId(
    clerkUserId: string,
    data: Prisma.UserUpdateInput
  ): Promise<User> {
    return this.prisma.user.update({
      where: { clerkUserId },
      data,
    });
  }
}