import type { UsersLiteResponse, UserLite } from './types';

export async function fetchUsersLite(): Promise<UsersLiteResponse> {
  const res = await fetch(`/api/users?limit=0&select=username,image`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function fetchUserDetail(id: number): Promise<UserLite> {
  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}
