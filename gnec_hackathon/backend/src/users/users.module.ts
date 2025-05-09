import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { UserRepository } from './users.repository';

@Module({
  providers: [UserService, UserRepository],
  controllers: [UserController],
})
export class UserModule { }
