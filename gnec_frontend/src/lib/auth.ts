import { currentUser, auth } from '@clerk/nextjs/server';

export const getAuthToken = async () => {
  const { getToken } = await auth();
  const token = await getToken();
  return token;
};

export const getCurrentUser = async () => {
  const user = await currentUser();
  return user;
}; 