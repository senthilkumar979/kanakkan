export interface UserPayload {
  userId: string;
  email: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult {
  user: {
    id: string;
    email: string;
    name?: string;
    createdAt: Date;
    updatedAt: Date;
  };
  tokens: TokenPair;
}

