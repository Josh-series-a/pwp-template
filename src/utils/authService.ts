
class AuthService {
  private apiKey: string | null = null;

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
}

export const authService = new AuthService();
