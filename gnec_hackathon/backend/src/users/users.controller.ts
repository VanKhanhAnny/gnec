import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { UserService } from './users.service';
import { User, Prisma } from '@prisma/client';
import { CurrentUser } from '../decorators/current-user.decorator';

interface ClerkUserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string;
  createdAt: string;
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('me')
  async getProfile(@CurrentUser() user: User) {
    return user;
  }

  @Post('clerk-sync')
  async syncClerkUser(@Body() clerkUserDto: ClerkUserDto) {
    // Convert clerk user data to our user model
    const userData: Prisma.UserCreateInput = {
      clerkUserId: clerkUserDto.id,
      email: clerkUserDto.email,
      firstName: clerkUserDto.firstName,
      lastName: clerkUserDto.lastName,
    };

    const existingUser = await this.userService.findByClerkId(clerkUserDto.id);

    if (existingUser) {
      return this.userService.updateByClerkId(clerkUserDto.id, {
        firstName: clerkUserDto.firstName,
        lastName: clerkUserDto.lastName,
        email: clerkUserDto.email,
      });
    } else {

      return this.userService.create(userData);
    }
  }

  @Post()
  async create(@Body() createUserDto: Prisma.UserCreateInput) {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return this.userService.findMany();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOneById(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: Prisma.UserUpdateInput
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}
