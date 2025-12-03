import { getAuth, onAuthStateChanged, signOut, type User } from 'firebase/auth';

class JwtTokenManager {
  private accessToken: string | null = null;

  private userReadyPromise: Promise<User> | null = null;
  private authenticatedUser: User | null = getAuth().currentUser;
  private auth = getAuth();

  constructor() {
    // Initialize listener once
    this.userReadyPromise = new Promise((resolve, reject) => {
      onAuthStateChanged(this.auth, async (user) => {
        if (user) {
          this.authenticatedUser = user;
          this.accessToken = await user.getIdToken(false);
          resolve(user);
        } else {
          reject('No authenticated user');
        }
      });
    });
  }
  // Set tokens in memory and localStorage
  setAccessTokens(access: string): void {
    this.accessToken = access;
  }

  // Get access token from memory
  getAccessToken(): string | null {
    console.log('access =', this.accessToken);
    return this.accessToken;
  }

  async getInitialAccessToken(): Promise<string | null> {
    if (this.accessToken || this.authenticatedUser) return this.accessToken;

    if (this.userReadyPromise) {
      const user = await this.userReadyPromise;
      this.accessToken = await user.getIdToken(false);
      return this.accessToken;
    }

    throw new Error('User not authenticated');
  }

  async refreshAccessToken() {
    const newIdToken = await this.authenticatedUser?.getIdToken(true);
    this.accessToken = newIdToken || null;
    return this.accessToken;
  }

  // Clear all tokens
  clearTokens(): void {
    this.accessToken = null;
    signOut(this.auth);
  }

  async setNewAccessToken() {
    if (this.authenticatedUser) {
      this.accessToken = await this.authenticatedUser.getIdToken(true);
    }
  }
}

export const jwtTokenManager = new JwtTokenManager();
