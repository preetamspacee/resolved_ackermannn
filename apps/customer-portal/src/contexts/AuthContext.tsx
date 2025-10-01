import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  accountType: 'Customer' | 'Admin';
  verified: boolean;
  authMethod?: 'google' | 'email';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication data
    if (typeof window !== 'undefined') {
      const checkAuthData = () => {
        // Check multiple possible localStorage keys for user data
        const possibleKeys = ['bsm_user', 'user', 'auth_user', 'current_user'];
        let storedUser = null;
        let storedToken = null;
        
        for (const key of possibleKeys) {
          const data = localStorage.getItem(key);
          if (data) {
            storedUser = data;
            console.log(`🔍 AuthContext: Found user data in key: ${key}`);
            break;
          }
        }
        
        // Also check for token
        const tokenKeys = ['token', 'auth_token', 'access_token'];
        for (const key of tokenKeys) {
          const token = localStorage.getItem(key);
          if (token) {
            storedToken = token;
            break;
          }
        }
        
        console.log('🔍 AuthContext: Raw localStorage data:', {
          storedUser,
          storedToken,
          allKeys: Object.keys(localStorage)
        });
        
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            console.log('🔍 AuthContext: Loaded user data from localStorage:', userData);
            
            // Check if the user ID is in the old invalid format
            if (userData.id && userData.id.startsWith('test_user_')) {
              console.log('🚨 AuthContext: Found invalid UUID format, clearing localStorage');
              localStorage.removeItem('bsm_user');
              localStorage.removeItem('token');
              setUser(null);
              return;
            }
            
            // Validate user data structure
            if (userData && userData.id && userData.email) {
              // Ensure the user data has all required fields
              const validatedUser = {
                id: userData.id,
                email: userData.email,
                name: userData.name || userData.displayName || userData.email.split('@')[0],
                picture: userData.picture || userData.avatarUrl,
                accountType: userData.accountType || 'Customer',
                verified: userData.verified || true,
                authMethod: userData.authMethod || 'email'
              };
              console.log('🔍 AuthContext: Validated user data:', validatedUser);
              setUser(validatedUser);
            } else {
              console.log('🔍 AuthContext: Invalid user data structure, clearing localStorage');
              localStorage.removeItem('bsm_user');
              localStorage.removeItem('token');
            }
          } catch (error) {
            console.error('Error parsing stored user data:', error);
            localStorage.removeItem('bsm_user');
            localStorage.removeItem('token');
          }
        } else {
          console.log('🔍 AuthContext: No user data found in localStorage');
        }
      };

      // Initial check
      checkAuthData();
      setIsLoading(false);

      // Listen for storage changes from other tabs/windows
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key && ['bsm_user', 'user', 'auth_user', 'current_user'].includes(e.key) && e.newValue) {
          console.log('🔍 AuthContext: Storage changed, updating user data');
          checkAuthData();
        }
      };

      window.addEventListener('storage', handleStorageChange);

      // Also check periodically in case storage events don't fire
      const interval = setInterval(() => {
        const currentUser = localStorage.getItem('bsm_user') || localStorage.getItem('user');
        if (currentUser && !user) {
          console.log('🔍 AuthContext: Periodic check found user data');
          checkAuthData();
        }
      }, 1000);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
        clearInterval(interval);
      };
    }
  }, []); // Remove user dependency to prevent infinite loop

  const login = (userData: User) => {
    console.log('🔍 AuthContext: Manual login called with:', userData);
    setUser(userData);
    localStorage.setItem('bsm_user', JSON.stringify(userData));
    localStorage.setItem('token', 'mock_token_' + Date.now());
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bsm_user');
    localStorage.removeItem('token');
    localStorage.removeItem('authMethod');
    // Redirect to local login page (no hardcoded host)
    window.location.href = '/login';
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('bsm_user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
