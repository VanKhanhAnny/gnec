import { Injectable } from '@nestjs/common';
import { BaseService } from '../database/base.service';
import { User, Prisma } from '@prisma/client';
import { UserRepository } from './users.repository';

@Injectable()
export class UserService extends BaseService<
  User,
  UserRepository,
  Prisma.UserCreateInput,
  Prisma.UserUpdateInput
> {
  constructor(protected readonly userRepository: UserRepository) {
    super(userRepository);
  }

  async findByClerkId(clerkUserId: string): Promise<User | null> {
    return this.userRepository.findByClerkId(clerkUserId);
  }

  async updateByClerkId(
    clerkUserId: string, 
    updateData: Prisma.UserUpdateInput
  ): Promise<User> {
    return this.userRepository.updateByClerkId(clerkUserId, updateData);
  }
}
