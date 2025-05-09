import { UserProfile } from '@/components/UserProfile';

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8 text-center">Your Profile</h1>
      <UserProfile />
    </div>
  );
} 