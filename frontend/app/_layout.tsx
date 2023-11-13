import { Stack, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import HomeScreen from "../components/screens/HomeScreen";
import { Button } from "react-native";
import tamaguiConfig from "../tamagui.config";
import { TamaguiProvider, Theme } from "tamagui";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
    <TamaguiProvider config={tamaguiConfig}>
      <QueryClientProvider client={queryClient}>
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
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="[missing]" options={{ title: "404" }} />
          </Stack>
        </Theme>
      </QueryClientProvider>
    </TamaguiProvider>
  );
};

export default StackLayout;
