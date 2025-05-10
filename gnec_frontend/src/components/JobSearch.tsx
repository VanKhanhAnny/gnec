"use client"
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { searchJobs, JobSearchParams, JobSearchResult } from '@/lib/jobSearchApi';

export const JobSearch = () => {
  const { getToken } = useAuth();
  const [jobType, setJobType] = useState<string[]>(['Full-time']); // Default to Full-time
  const [remote, setRemote] = useState<boolean>(false);
  const [countries, setCountries] = useState<string[]>(['US']); // Default to US
  const [datePosted, setDatePosted] = useState<number>(30); // Default to last 30 days
  const [keywords, setKeywords] = useState<string>(''); // New state for keywords
  
  const [jobs, setJobs] = useState<JobSearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Job type options
  const jobTypeOptions = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary'];
  
  // Country options (add more as needed)
  const countryOptions = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
  ];
  
  // Date posted options
  const datePostedOptions = [
    { value: 1, label: 'Last 24 hours' },
    { value: 7, label: 'Last week' },
    { value: 30, label: 'Last month' },
    { value: 90, label: 'Last 3 months' },
  ];
  
  // Search on component mount
  useEffect(() => {
    handleSearch();
  }, []);
  
  const handleJobTypeChange = (type: string) => {
    setJobType(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };
  
  const handleCountryChange = (code: string) => {
    setCountries(prev => 
      prev.includes(code) 
        ? prev.filter(c => c !== code) 
        : [...prev, code]
    );
  };
  
  // Handle Enter key press in the keywords input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Ensure we have at least one job type and country selected
      const searchJobType = jobType.length > 0 ? jobType : ['Full-time'];
      const searchCountries = countries.length > 0 ? countries : ['US'];
      
      const token = await getToken();
      const params: JobSearchParams = {
        jobType: searchJobType,
        remote,
        countries: searchCountries,
        datePosted,
        keywords: keywords.trim() || undefined, // Add keywords parameter
      };
      
      console.log('Searching with params:', params);
      
      const results = await searchJobs(params, token);
      
      // Ensure results is an array
      if (Array.isArray(results)) {
        setJobs(results);
        console.log('Search results:', results);
      } else {
        console.error('Unexpected response format:', results);
        setJobs([]);
        setError('Received unexpected data format from server');
      }
    } catch (err: any) {
      console.error('Error searching for jobs:', err);
      
      // Check if the error might be related to missing API key
      if (err?.message?.includes('404') || err?.response?.status === 404) {
        setError('Job search API may not be configured properly. Make sure JOB_SEARCH_KEY is set on the backend server.');
      } else {
        setError('Failed to search for jobs. Please try again later.');
      }
      
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Find Jobs</h2>
      
      {/* Keyword Search */}
      <div className="mb-6">
        <label htmlFor="keywords" className="block text-lg font-semibold mb-2">
          Search Keywords
        </label>
        <div className="relative">
          <input
            id="keywords"
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter job title, skills or keywords"
            className="w-full p-3 border rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <button 
            onClick={handleSearch}
            className="absolute right-3 top-3 text-indigo-600 hover:text-indigo-800"
            disabled={loading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Search for specific skills, job titles, or any keywords in job descriptions
        </p>
      </div>
      
      {/* Search filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Job Type filter */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Job Type</h3>
          <div className="space-y-2">
            {jobTypeOptions.map(type => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  checked={jobType.includes(type)}
                  onChange={() => handleJobTypeChange(type)}
                  className="mr-2"
                />
                {type}
              </label>
            ))}
          </div>
        </div>
        
        {/* Remote filter */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Remote Options</h3>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={remote}
              onChange={() => setRemote(!remote)}
              className="mr-2"
            />
            Remote jobs only
          </label>
        </div>
        
        {/* Country filter */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Countries</h3>
          <div className="grid grid-cols-2 gap-2">
            {countryOptions.map(country => (
              <label key={country.code} className="flex items-center">
                <input
                  type="checkbox"
                  checked={countries.includes(country.code)}
                  onChange={() => handleCountryChange(country.code)}
                  className="mr-2"
                />
                {country.name}
              </label>
            ))}
          </div>
        </div>
        
        {/* Date Posted filter */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Date Posted</h3>
          <select
            value={datePosted}
            onChange={(e) => setDatePosted(Number(e.target.value))}
            className="w-full p-2 border rounded"
          >
            {datePostedOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Search button */}
      <button
        onClick={handleSearch}
        disabled={loading}
        className="w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 mb-6"
      >
        {loading ? 'Searching...' : 'Search Jobs'}
      </button>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {/* Results */}
      <div className="space-y-6">
        {jobs.length === 0 && !loading && !error ? (
          <div className="text-center text-gray-500">
            <p className="mb-2">No jobs found. Try adjusting your search filters.</p>
            <p className="text-sm text-gray-400">Note: Make sure the backend server has JOB_SEARCH_KEY configured.</p>
          </div>
        ) : (
          Array.isArray(jobs) && jobs.map(job => (
            <div key={job.id} className="border rounded p-4 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold">{job.title}</h3>
              <p className="text-gray-700">{job.company}</p>
              <p className="text-gray-600">{job.location} {job.isRemote && '(Remote)'}</p>
              
              {job.description && (
                <p className="mt-2 text-sm text-gray-600">
                  {job.description.length > 150 
                    ? `${job.description.substring(0, 150)}...` 
                    : job.description}
                </p>
              )}
              
              <div className="mt-4 flex justify-between items-center">
                {job.datePosted && (
                  <span className="text-xs text-gray-500">
                    Posted: {new Date(job.datePosted).toLocaleDateString()}
                  </span>
                )}
                <a 
                  href={job.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  View Job
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}; 