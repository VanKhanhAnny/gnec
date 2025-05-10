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

  async getJobSearch(jobType: string[], remote: boolean, countries: string[], datePosted: number, keywords?: string) {
    try {
      // Ensure we have valid arrays
      const validCountries = Array.isArray(countries) && countries.length > 0 ? countries : undefined;
      
      // Build request payload
      const payload: any = {
        page: 0,
        limit: 25,
        job_country_code_or: validCountries,
        posted_at_max_age_days: datePosted || 30,
        remote: remote
      };
      
      // Add keywords search if provided
      if (keywords && keywords.trim()) {
        payload.job_description_pattern_or = [keywords.trim()];
      }
      
      console.log('API Request payload:', payload);
      
      const { body } = await request('https://api.theirstack.com/v1/jobs/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(payload)
      });
      
      // Parse the response body
      const result = await body.json();
      console.log('API Response:', result);
      return result;
    } catch (error) {
      console.error('Error fetching job search:', error);
      throw error;
    }
  }
}
