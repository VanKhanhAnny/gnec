import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ClerkClientProvider } from './providers/clerk-client.provider';
import { ClerkAuthGuard } from './auth/clerk-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/users.module';
import { JobSearchModule } from './job-search/job-search.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UserModule,
    JobSearchModule,
  ],
  controllers: [AppController],
  providers: [AppService, ClerkClientProvider,
    {
      provide: APP_GUARD,
      useValue: ClerkAuthGuard,
    },
  ],
})
export class AppModule { }