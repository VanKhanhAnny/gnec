import { Injectable } from '@nestjs/common';
import { request } from 'undici';

@Injectable()
export class JobSearchService {
  private apiKey: string;

  constructor() {
    const apiKey = process.env.JOB_SEARCH_KEY;
    if (!apiKey) {
      throw new Error('JOB_SEARCH_KEY environment variable is not set');
    }
    this.apiKey = apiKey;
  }

  async getJobSearch(jobType: Array<string>, remote: boolean, countries: Array<string>, datePosted: number) {
    try{
      const { body } = await request('https://api.theirstack.com/v1/jobs/search', {
        method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        page: 0,
        limit: 25,
        job_country_code_or: countries,
        posted_at_max_age_days: datePosted,
        job_type: jobType,
        remote: remote
      })
    });
    // Parse the response body
    const result = await body.json();
    return result;
  } catch (error) {
      console.error('Error fetching job search:', error);
      throw error;
    }
  }
}
