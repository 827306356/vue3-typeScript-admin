import { hyRequest } from '@/service';
interface resultResponseType {
  data: object;
  code: number;
  message: string;
}
export function accountLogin(account: object): Promise<resultResponseType> {
  return hyRequest.post({
    url: '/api/auth/login',
    data: account
  })
}
export function getUserInfoById(id: number) {
  return hyRequest.get({
    url: `/api/users/${id}`
  })
}

export function getUserMenusByRoleId(id: number) {
  return hyRequest.get({
    url: `/api/role/${id}/menu`
  })
}
