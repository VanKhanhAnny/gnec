"use client"
import { useUser, useAuth } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { sendUserDataToBackend } from '@/lib/api';

export const UserProfile = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<{
    success?: boolean;
    message?: string;
  }>({});
  const [hasSynced, setHasSynced] = useState(false);

  // Function to send user data
  const syncUserData = async () => {
    if (!isSignedIn || !user || isSending) return;

    setIsSending(true);
    try {
      const token = await getToken();
      const userData = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.primaryEmailAddress?.emailAddress,
        imageUrl: user.imageUrl,
        createdAt: user.createdAt,
      };

      await sendUserDataToBackend(userData, token);
      setSendStatus({
        success: true,
        message: 'User data synced with backend',
      });
      setHasSynced(true);
    } catch (error) {
      console.error('Error sending user data:', error);
      setSendStatus({
        success: false,
        message: 'Failed to sync user data',
      });
    } finally {
      setIsSending(false);
    }
  };

  // Auto-sync when component loads and user is available
  useEffect(() => {
    if (isLoaded && isSignedIn && user && !hasSynced) {
      syncUserData();
    }
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded) {
    return <div>Loading user information...</div>;
  }

  if (!isSignedIn) {
    return <div>Please sign in to view your profile</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        <img
          src={user.imageUrl}
          alt={`${user.firstName} ${user.lastName}`}
          className="h-16 w-16 rounded-full"
        />
        <div>
          <h2 className="text-xl font-bold">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-gray-600">{user.primaryEmailAddress?.emailAddress}</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500">User ID</h3>
          <p className="mt-1 text-sm text-gray-900">{user.id}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Created At</h3>
          <p className="mt-1 text-sm text-gray-900">
            {user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}
          </p>
        </div>
      </div>

      {sendStatus.message && (
        <div
          className={`mt-4 p-2 text-sm rounded ${
            sendStatus.success
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {sendStatus.message}
        </div>
      )}
    </div>
  );
}; 