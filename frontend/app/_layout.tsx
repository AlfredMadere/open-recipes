import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { Button } from "react-native";
import { TamaguiProvider, Theme } from "tamagui";
import tamaguiConfig from "../tamagui.config";
import { AuthProvider } from "./AuthContext";

const queryClient = new QueryClient();

const StackLayout = () => {
  const router = useRouter();
  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  useEffect(() => {
    if (loaded) {
      // can hide splash screen here
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    // auth provider
    <TamaguiProvider config={tamaguiConfig}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Theme name="light">
            <Stack>
              <Stack.Screen name="index" options={{ title: "Home" }} />
              <Stack.Screen
                name="register/index"
                options={{
                  title: "Register",
                  headerRight: () => (
                    <Button
                      title="Login"
                      onPress={() => {
                        router.push("/login");
                      }}
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="login"
                options={{ title: "Login Modal", presentation: "modal" }}
              />
              <Stack.Screen
                name="recipes/[id]"
                options={{ title: "Recipe", presentation: "modal" }}
              />
              <Stack.Screen
                name="update-inventory"
                options={{ title: "Update Inventory", presentation: "modal" }}
              />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="[missing]" options={{ title: "404" }} />
            </Stack>
          </Theme>
        </AuthProvider>
      </QueryClientProvider>
    </TamaguiProvider>
  );
};

export default StackLayout;
