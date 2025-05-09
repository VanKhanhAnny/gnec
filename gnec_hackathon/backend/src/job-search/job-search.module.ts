import { Module } from '@nestjs/common';
import { JobSearchService } from './job-search.service';
import { JobSearchController } from './job-search.controller';

@Module({
  controllers: [JobSearchController],
  providers: [JobSearchService],
})
export class JobSearchModule {}
