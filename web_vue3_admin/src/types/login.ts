export interface UserInfo {
  role: {
    id: number;
  };
  [key: string]: unknown;
}

export interface loginData {
  username: string;
  password: string;
}
