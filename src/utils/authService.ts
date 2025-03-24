
class AuthService {
  private apiKey: string | null = null;
  private user: User | null = null;
  private mockUsers: Record<string, User> = {};

  // Set the OpenAI API key
  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('openai_api_key', key);
    return true;
  }

  // Get the OpenAI API key
  getApiKey(): string | null {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem('openai_api_key');
    }
    return this.apiKey;
  }

  // Mock login functionality
  mockLogin(email: string, password: string): boolean {
    // Check if the user exists in our mock database and if the password matches
    const user = this.mockUsers[email];
    if (user && user.password === password) {
      this.user = user;
      localStorage.setItem('auth_user', JSON.stringify({ email: user.email, name: user.name }));
      return true;
    }
    return false;
  }

  // Mock signup functionality
  mockSignup(name: string, email: string, password: string): boolean {
    // Check if the user already exists
    if (this.mockUsers[email]) {
      return false;
    }

    // Create a new user
    const newUser: User = {
      name,
      email,
      password
    };

    // Store the user in our mock database
    this.mockUsers[email] = newUser;
    
    // Auto-login after signup (optional)
    this.user = newUser;
    localStorage.setItem('auth_user', JSON.stringify({ email: newUser.email, name: newUser.name }));
    
    return true;
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    if (!this.user) {
      const storedUser = localStorage.getItem('auth_user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        // If we have a stored user, we consider them authenticated
        // In a real app, you would validate the token here
        return true;
      }
      return false;
    }
    return true;
  }

  // Get the current user
  getCurrentUser(): { name: string; email: string } | null {
    if (this.user) {
      return { name: this.user.name, email: this.user.email };
    }
    
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    
    return null;
  }

  // Logout the user
  logout(): void {
    this.user = null;
    localStorage.removeItem('auth_user');
  }
}

// User interface
interface User {
  name: string;
  email: string;
  password: string;
}

export const authService = new AuthService();
