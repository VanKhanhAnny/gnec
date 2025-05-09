'use client'
import axios from 'axios';

// Add back the /api prefix as the backend has app.setGlobalPrefix('api')
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface JobSearchParams {
  jobType?: string[];
  remote?: boolean;
  countries?: string[];
  datePosted?: number;
}

export interface JobSearchResult {

  id: string;
  title: string;
  company: string;
  location: string;
  url: string;
  description?: string;
  salary?: string;
  datePosted?: string;
  isRemote?: boolean;
  jobType?: string;
  // Add other fields as needed
}

export const searchJobs = async (
  params: JobSearchParams,
  token: string | null
): Promise<JobSearchResult[]> => {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Build query params
    const queryParams = new URLSearchParams();
    
    if (params.jobType?.length) {
      params.jobType.forEach(type => queryParams.append('jobType', type));
    }
    
    if (params.remote !== undefined) {
      queryParams.append('remote', params.remote.toString());
    }
    
    if (params.countries?.length) {
      params.countries.forEach(country => queryParams.append('countries', country));
    }
    
    if (params.datePosted !== undefined) {
      queryParams.append('datePosted', params.datePosted.toString());
    }
    
    const queryString = queryParams.toString();
    // Fix the URL to include the /api prefix
    const url = `${BASE_URL}/api/job-search${queryString ? `?${queryString}` : ''}`;
    
    console.log('Fetching jobs from:', url);
    const response = await axios.get(url, { headers });
    console.log('API response:', response.data);
    
    // Ensure the response is an array
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && typeof response.data === 'object') {
      // Check if the response has a data property that is an array
      if (Array.isArray(response.data.data)) {
        return response.data.data;
      }
      // If response is an object but not in expected format, log and return empty array
      console.warn('Unexpected response structure:', response.data);
      return [];
    }
    
    // Default return empty array if response is neither array nor object
    return [];
  } catch (error) {
    console.error('Error searching jobs:', error);
    return []; // Return empty array on error
  }
}; 