import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect
} from 'react';
import { ProvidersContextType } from './Interfaces';

const ProvidersContext = createContext<ProvidersContextType | undefined>(undefined);

export const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {;
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (data: any) => {
    localStorage.setItem("currentUser", JSON.stringify(data));
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
  };

  return (
    <ProvidersContext.Provider value={{
      user,
      isLoading,
      login,
      logout,

      setUser
    }}>
      {children}
    </ProvidersContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(ProvidersContext);
  if (!context) {
    throw new Error("useAuth must be used within Providers");
  }
  return context;
};