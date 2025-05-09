'use client'
import axios from 'axios';

// Determine base URL based on environment
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const sendUserDataToBackend = async (userData: any, token: string | null) => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await axios.post(`${BASE_URL}/user/clerk-sync`, userData, { headers });
  return response.data;
}; 