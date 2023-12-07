import { ReactNode, createContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { getValueFor } from "../helpers/auth";

// Define the type for your context state
type AuthContextType = {
  authToken: string | null;
  userId: number | null;
  userName: string | null;
  setAuthToken: (token: string | null) => void;
  setUserId: (id: number | null) => void;
  setUserName: (name: string | null) => void;
};

// Create the context with an initial undefined value
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = await getValueFor("authtoken");
        const myId = await getValueFor("userId");
        const myName = await getValueFor("userName");
        setAuthToken(token);
        setUserId(parseInt(myId));
        console.log("myName: ", myName);
        setUserName(myName);
      } catch (error) {
        Alert.alert("Error", "Couldn't get auth token...");
      }
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authToken,
        userId,
        userName,
        setAuthToken,
        setUserId,
        setUserName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
