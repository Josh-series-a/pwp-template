
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

class AuthService {
  private apiKey: string | null = null;
  private session: Session | null = null;

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

  // Sign up with email and password
  async signUp(email: string, password: string, name: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error("Sign up error:", error.message);
      return { success: false, error: error.message };
    }
  }

  // Sign in with email and password
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error("Sign in error:", error.message);
      return { success: false, error: error.message };
    }
  }

  // Sign out the user
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error("Sign out error:", error.message);
      return { success: false, error: error.message };
    }
  }

  // Check if the user is authenticated
  async isAuthenticated() {
    try {
      const { data } = await supabase.auth.getSession();
      return !!data.session;
    } catch (error) {
      console.error("Authentication check error:", error);
      return false;
    }
  }

  // Get the current user
  async getCurrentUser() {
    try {
      const { data } = await supabase.auth.getUser();
      return data.user;
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  }
  
  // Get the current session
  async getSession() {
    try {
      const { data } = await supabase.auth.getSession();
      return data.session;
    } catch (error) {
      console.error("Get session error:", error);
      return null;
    }
  }

  // Setup auth state change listener
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null);
    });
  }
}

export const authService = new AuthService();
