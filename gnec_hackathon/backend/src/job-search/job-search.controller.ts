import { Controller, Get, Query } from '@nestjs/common';
import { JobSearchService } from './job-search.service';
import { Public } from '../decorators/public.decorator';

@Controller('job-search')
export class JobSearchController {
  constructor(private readonly jobSearchService: JobSearchService) {}

  @Public()
  @Get()
  getJobSearch(
    @Query('jobType') jobType: string | string[],
    @Query('remote') remote: string,
    @Query('countries') countries: string | string[],
    @Query('datePosted') datePosted: string,
    @Query('keywords') keywords: string
  ) {
    // Parse the remote flag
    const isRemote = remote === 'true';
    
    // Parse countries - ensure it's an array
    const countryArray = countries 
      ? Array.isArray(countries) 
        ? countries 
        : [countries] 
      : [];
    
    // Parse job types
    const jobTypeArray = jobType
      ? Array.isArray(jobType)
        ? jobType
        : [jobType]
      : [];
    
    // Parse date posted as a number
    const datePostedNum = datePosted ? parseInt(datePosted, 10) : 30;
    
    return this.jobSearchService.getJobSearch(jobTypeArray, isRemote, countryArray, datePostedNum, keywords);
  }
}