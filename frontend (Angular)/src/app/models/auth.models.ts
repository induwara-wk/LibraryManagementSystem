export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  role?: string[];
}

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  roles: string[];
  accessToken: string;
  tokenType: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
} 