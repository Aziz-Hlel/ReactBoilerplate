import { getAuth } from "firebase/auth";

class JwtTokenManager {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  private refreshTokenKeyName = "refreshToken"; // jwt refresh token keyName in localStorage

  private currentUser = getAuth().currentUser;

  constructor() {
    // Load refresh token from localStorage on app start
    this.refreshToken = localStorage.getItem(this.refreshTokenKeyName);
  }

  // Set tokens in memory and localStorage
  setTokens(access: string, refresh: string): void {
    this.accessToken = access;
    this.refreshToken = refresh;
    localStorage.setItem(this.refreshTokenKeyName, refresh);
  }

  // Get access token from memory
  getAccessToken(): string | null {
    return this.accessToken;
  }

  // Get refresh token from memory or localStorage
  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  // Load refresh token from localStorage on app start
  loadTokensFromStorage(): void {
    this.refreshToken = localStorage.getItem(this.refreshTokenKeyName);
  }

  // Clear all tokens
  clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem(this.refreshTokenKeyName);
  }

  // Check if user is authenticated
  refreshTokenExist(): boolean {
    return !!this.getRefreshToken();
  }

  async setNewAccessToken() {
    if (this.currentUser) {
      this.accessToken = await this.currentUser.getIdToken(true);
    }
  }
}

export const jwtTokenManager = new JwtTokenManager();
