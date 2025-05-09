import { JobSearch } from '@/components/JobSearch';

export default function JobsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Job Search</h1>
      <p className="text-gray-600 mb-8 text-center max-w-2xl mx-auto">
        Find your next opportunity by searching through available positions. Filter by job type, location, and more to find the perfect match.
      </p>
      <JobSearch />
    </div>
  );
}
