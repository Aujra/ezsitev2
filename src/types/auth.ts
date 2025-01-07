export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  username: string;
  email: string;
  roles: UserRole[];
  isAuthenticated: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
