import { Link, Redirect } from "expo-router";
import { TamaguiProvider, Theme, Button } from "tamagui";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useFonts } from "expo-font";
import { useEffect } from "react";

import tamaguiConfig from "../tamagui.config";
import "expo-router/entry";

const StartPage = () => {
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
    // <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
    //   {/* <StatusBar style="dark"/> */}
    //   <Text>Home Page</Text>
    //   <Link href="/register/" asChild>
    //     <Button title="Open Register Page" />
    //   </Link>
    //   <Link href="/one/" asChild>
    //     <Button title="One" />
    //   </Link>
    //   <Link href="/two/" asChild>
    //     <Button title="Two" />
    //   </Link>
    // </View>
    <View>
      <Redirect href={"/login"} />
    </View>
  );
};

export default StartPage;
