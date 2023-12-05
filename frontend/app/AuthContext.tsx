import React, { createContext, useState, useEffect, ReactNode } from "react";
import { Alert } from "react-native";
import { getValueFor } from "../helpers/auth";
import { set } from "react-hook-form";

// Define the type for your context state
type AuthContextType = {
  authToken: string | null;
  userId: number | null;
};

// Create the context with an initial undefined value
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = await getValueFor("authtoken");
        const myId = await getValueFor("userId");
        setAuthToken(token);
        setUserId(parseInt(myId));
      } catch (error) {
        Alert.alert("Error", "Couldn't get auth token...");
      }
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ authToken, userId }}>
      {children}
    </AuthContext.Provider>
  );
};
