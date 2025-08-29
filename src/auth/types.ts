export interface User {
  _id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  createdAt: number;
  updatedAt?: number;
}

export interface Workspace {
  _id: string;
  name: string;
  ownerUserId: string;
  status: "active" | "inactive" | "suspended";
  createdAt: number;
  updatedAt?: number;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
