import { http } from '../../shared/lib/http';
import type { UserBasic, UserDetail } from './types';

export function getUsersBasic() {
  return http<{ users: UserBasic[] }>(`/api/users?limit=0&select=username,image`);
}

export function getUserDetail(id: number) {
  return http<UserDetail>(`/api/users/${id}`);
}
